"use client";
import { useState } from "react";
import { getTracks } from "./api";
import TrackPreview from "./components/TrackPreview";
import { IoMdCloseCircle } from "react-icons/io";

export default function AppLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
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

	interface SearchData {
		tracks: {
			items: Track[];
		};
	}

	const [trackName, setTrackName] = useState("");
	const [searchData, setSearchData] = useState<SearchData | null>(null);
	const [searchState, setSearchState] = useState(false);

	const handleInput = (e: {
		target: { value: React.SetStateAction<string> };
	}) => {
		setTrackName(e.target.value);
	};

	const handleSubmit = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		const temp = await getTracks(trackName);
		// console.log(temp);
		setSearchData(temp);
	};

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
		<div>
			<nav className="w-full h-14"></nav>
			<form
				onSubmit={handleSubmit}
				className="w-full h-20 flex justify-center items-center relative z-10 backdrop-blur gap-8"
			>
				<input
					type="text"
					placeholder="Search"
					value={trackName}
					onChange={handleInput}
					onFocus={() => {
						setSearchState(true);
					}}
					className="w-[50%] h-10 rounded-full px-5 bg-[#303030] outline-none focus:scale-105 hover:scale-105 transition-transform ease-in-out duration-300"
				/>
				{searchState ? (
					<span
						onClick={() => {
							setSearchState(false);
							setSearchData(null);
							setTrackName("");
						}}
						className="inline z-50"
					>
						<IoMdCloseCircle className="text-lg text-zinc-500 hover:text-zinc-100 transition-colors ease-in-out duration-200" />
					</span>
				) : null}
			</form>
			{searchState ? (
				<div className="absolute w-full inset-0 m-auto top-20 pb-10 rounded-3xl h-auto overflow-y-scroll min-h-80 bg-zinc-800 bg-opacity-15 backdrop-blur-md">
					<div className="w-[90%] relative mx-auto mt-16 px-10 h-auto flex flex-col gap-2 items-center">
						{searchData
							? searchData.tracks.items.map((track, index) => (
									<TrackPreview
										key={track.id}
										title={track.name}
										artistName={formatArtists(
											track
										)}
										duration={formatDuration(
											track.duration_ms
										)}
										albumArtUrl={track.album.images[2].url}
										index={index}
									/>
							  ))
							: null}
					</div>
				</div>
			) : (
				<></>
			)}
			{children}
		</div>
	);
}
