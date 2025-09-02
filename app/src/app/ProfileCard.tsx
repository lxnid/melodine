type SpotifyProfile = {
  display_name?: string;
  country?: string;
  followers?: { total?: number };
  images?: { url: string }[];
  email?: string;
  product?: string;
  id?: string;
};

export default function ProfileCard({ profile }: { profile: SpotifyProfile }) {
  const avatar = profile.images?.[0]?.url;
  return (
    <div className="rounded-xl p-6 flex items-center gap-4 hover:bg-white/5 transition-colors">
      {avatar ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatar} alt="avatar" className="h-14 w-14 rounded-full object-cover" />
      ) : (
        <div
          aria-hidden
          className="h-14 w-14 rounded-full"
          style={{
            background:
              "conic-gradient(from 90deg at 50% 50%, rgba(139,92,246,.6), rgba(168,85,247,.4), rgba(139,92,246,.6))",
          }}
        />
      )}
      <div className="min-w-0">
        <div className="text-white/90 font-medium truncate">
          {profile.display_name || "Spotify User"}
        </div>
        <div className="mt-1 text-xs text-white/60 flex items-center gap-3">
          {profile.country ? <span>Country: {profile.country}</span> : null}
          {typeof profile.followers?.total === "number" ? (
            <span>Followers: {profile.followers.total}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
}