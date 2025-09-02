import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PlaylistClient from "./PlaylistClient";

// Types
type SpotifyImage = { url: string; height: number | null; width: number | null };
type SpotifyUser = { display_name?: string };
type SimplifiedTrack = {
  id: string | null;
  name: string;
  artists: string[];
  albumName?: string;
  albumImage?: string | null;
  duration_ms: number;
  added_at?: string | null;
};

type PlaylistDetails = {
  id: string;
  name: string;
  description?: string | null;
  images: SpotifyImage[];
  owner: SpotifyUser;
  tracksTotal: number;
};

// Data fetching with error tracking
async function getPlaylistHeader(id: string, accessToken: string): Promise<{ data: PlaylistDetails | null; hasError: boolean }> {
  try {
    const res: Response = await fetch(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(id)}?fields=id,name,description,images,owner(display_name),tracks(total)`,
      { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }
    );
    if (!res.ok) return { data: null, hasError: true };
    const data: any = await res.json();
    return {
      data: {
        id: data.id,
        name: data.name,
        description: data.description ?? null,
        images: data.images ?? [],
        owner: data.owner ?? {},
        tracksTotal: data?.tracks?.total ?? 0,
      } as PlaylistDetails,
      hasError: false,
    };
  } catch {
    return { data: null, hasError: true };
  }
}

async function getAllPlaylistTracks(id: string, accessToken: string): Promise<{ data: SimplifiedTrack[]; hasError: boolean }> {
  let url: string | null = `https://api.spotify.com/v1/playlists/${encodeURIComponent(id)}/tracks?limit=100&fields=items(added_at,track(id,name,duration_ms,album(name,images),artists(name))),next`;
  const items: SimplifiedTrack[] = [];
  let hasError = false;

  try {
    while (url) {
      const res: Response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
      if (!res.ok) {
        hasError = true;
        break;
      }
      const data: any = await res.json();
      const pageItems: SimplifiedTrack[] = (data.items || [])
        .map((it: any) => {
          const t = it?.track;
          if (!t) return null;
          return {
            id: t.id ?? null,
            name: t.name ?? "Unknown",
            artists: Array.isArray(t.artists) ? t.artists.map((a: any) => a?.name).filter(Boolean) : [],
            albumName: t.album?.name ?? undefined,
            albumImage: t.album?.images?.[0]?.url ?? null,
            duration_ms: t.duration_ms ?? 0,
            added_at: it?.added_at ?? null,
          } as SimplifiedTrack;
        })
        .filter(Boolean);
      items.push(...pageItems);
      url = data.next ?? null;
    }
  } catch {
    hasError = true;
  }
  return { data: items, hasError };
}

export default async function PlaylistDetailPage(props: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const accessToken = (session as any).accessToken as string | undefined;
  if (!accessToken) redirect("/");

  const awaitedParams = await props.params;
  const id = awaitedParams.id;
  const { data: header, hasError: hasHeaderError } = await getPlaylistHeader(id, accessToken);
  
  // If header fetch completely fails, redirect back to playlists
  if (!header && hasHeaderError) redirect("/dashboard/playlists");

  const { data: tracks, hasError: hasTracksError } = await getAllPlaylistTracks(id, accessToken);

  return (
    <PlaylistClient
      header={header}
      tracks={tracks}
      hasHeaderError={hasHeaderError}
      hasTracksError={hasTracksError}
    />
  );
}