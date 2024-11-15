"use client";
import React, { useEffect, useState } from "react";
import TrackPreview from "./components/TrackPreview";
import { getArtists, getRecommended } from "./api";
import ArtistPreview from "./components/ArtistPreview";
import Link from "next/link";

export default function App() {
	interface Artist {
		name: string;
		id: string;
		images: Array<{ url: string }>;
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
	const [artists, setArtists] = useState<Artist[] | null>(null);

	useEffect(() => {
		async function init() {
			const temp = await getRecommended();
			// console.log(temp);
			setTrack(temp);
			const temp_artists = await getArtists(temp);
			setArtists(temp_artists.artists);
		}
		init();
	}, []);
	// console.log(artists)

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
		<div className="w-full flex xl:flex-row flex-col justify-center p-10 gap-20">
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
			<section className="w-auto">
				<h1 className="font-bold text-xl">Your favourite Artists</h1>
				<div className="flex flex-wrap gap-5 mt-4">
					{artists ? artists.map((artist) => (
						<Link key={artist.id} href={""}><ArtistPreview artistName={artist.name} coverArtUrl={artist.images[1].url}/></Link>
					)):null}
				</div>
			</section>
		</div>
	);
}
