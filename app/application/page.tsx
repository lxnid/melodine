"use client";
import React, { useEffect, useState } from "react";
import TrackPreview from "./components/TrackPreview";
import getSearchData, { getArtists } from "./api";

export default function App() {
	interface Artist {
		name: string;
		id: string;
	}
	interface Track {
		id: string;
		name: string;
		artists: Artist[];
		duration_ms: number;
		album: {
			images: Array<{ url: string }>;
		};
	}

	interface TrackData {
		tracks: Track[];
	}
	const [track, setTrack] = useState<TrackData | null>(null);
	const [artists, setArtists] = useState(null);

	useEffect(() => {
		async function init() {
			const temp = await getSearchData();
			console.log(temp);
			setTrack(temp);
			const temp_artists = await getArtists(temp);
			setArtists(temp_artists);
		}
		init();
	}, []);
	console.log(artists)

	function formatDuration(durationMs: number) {
		const seconds = Math.floor((durationMs / 1000) % 60);
		const minutes = Math.floor(durationMs / 1000 / 60);

		return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
	}

	interface Data {
		artists: Artist[];
	}
	function formatArtists(data: Data) {
		let constructor = "";
		const subArtists = data.artists;
		for (let i = 0; i < subArtists.length; i++) {
			if (i === subArtists.length - 1) {
				constructor += data.artists[i].name;
			} else constructor += data.artists[i].name + ", ";
		}

		return constructor;
	}

	return (
		<div className="w-full flex items-center p-10 gap-5">
			<section className="w-auto">
				<h1 className="font-bold text-xl">Recommended for you</h1>
				<div className="flex flex-col gap-1 mt-4">
					{track
						? track.tracks.map((track, index: number) => (
								<TrackPreview
									key={track.id}
									title={track.name}
									artistName={formatArtists(track)}
									duration={formatDuration(track.duration_ms)}
									albumArtUrl={track.album.images[2].url}
									index={index}
								/>
						  ))
						: null}
				</div>
			</section>
			{/* <section className="w-auto">
				<h1 className="font-bold text-xl">Your favourite Artists</h1>
				<div className="flex flex-col gap-1 mt-4">
					{track
						? track.tracks.map((track, index) => (
								<TrackPreview
									key={track.id}
									title={track.name}
									artistName={formatArtists(track)}
									duration={formatDuration(track.duration_ms)}
									albumArtUrl={track.album.images[2].url}
									index={index}
								/>
						  ))
						: null}
				</div>
			</section> */}
		</div>
	);
}
