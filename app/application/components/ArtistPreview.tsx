import React from "react";
import Image from "next/image";

interface artistDetails {
	artistName: string;
	coverArtUrl: string;
}

const ArtistPreview = ({ artistName, coverArtUrl }: artistDetails) => {
	return (
		<>
            <div className="flex flex-col">
                <Image src={coverArtUrl} alt={""} width={100} height={100} className="w-auto h-auto rounded-full" />
                <h1 className="font-bold">{artistName}</h1>
                <p>Artist</p>
            </div>
		</>
	);
};

export default ArtistPreview;
