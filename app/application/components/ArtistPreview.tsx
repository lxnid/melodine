import React from "react";
import Image from "next/image";

interface artistDetails {
	artistName: string;
	coverArtUrl: string;
}

const ArtistPreview = ({ artistName, coverArtUrl }: artistDetails) => {
	return (
		<>
			<div className="flex flex-col gap-2 rounded-3xl hover:scale-105 cursor-pointer transition-transform ease-in-out duration-300">
				<Image
					src={coverArtUrl}
					alt={""}
					width={100}
					height={100}
					className="w-[10vw] h-[10vw] rounded-full"
				/>
				<div className="flex flex-col gap-0 leading-tight">
					<h1 className="font-bold">{artistName}</h1>
					<p className="text-sm text-neutral-400">Artist</p>
				</div>
			</div>
		</>
	);
};

export default ArtistPreview;
