'use client'
import { useEffect, useState } from "react";
import CardTrack from "./components/track-card";

export default function Home() {
  // State to hold the fetched data
  const [tracks, setTracks] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Function to fetch data
    const fetchTracks = async () => {
      const url =
        "https://spotify23.p.rapidapi.com/recommendations/?limit=20&seed_tracks=0c6xIDDpzE81m2q797ordA&seed_artists=4NHQUGzhtTLFvgF5SZesLK&seed_genres=pop";
      const options = {
        method: "GET",
        headers: {
          "x-rapidapi-key": "a0f2da73a8mshb46b931f56ef813p117184jsn439f5925c3f8",
          "x-rapidapi-host": "spotify23.p.rapidapi.com",
        },
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setTracks(result.tracks); // Assuming 'tracks' is the array of fetched track data
      } catch (error) {
        setError("Failed to fetch tracks.");
        console.error(error);
      }
    };

    // Call the fetch function
    fetchTracks();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  if (error) return <div>{error}</div>;

  return (
    <main className="px-5 py-3 m-0 h-full top-[160px] relative lg:ml-[320px]">
      {tracks.length === 0 ? (
        <div>Loading...</div>
      ) : (
        tracks.map((track) => (
          <CardTrack
            key={track.id}
            imageUrl={track.album.images[0].url}
            trackName={track.name}
            trackDuration={(track.duration_ms / 60000).toFixed(2)} // Convert duration from ms to minutes
            artist={track.artists.map((artist: { name: any; }) => artist.name).join(", ")} // Example of passing artist names
          />
        ))
      )}
    </main>
  );
}
