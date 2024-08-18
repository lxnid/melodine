import React, { ReactNode } from "react";
import Image from "next/image";
import { FaCirclePlay, FaRegHeart } from "react-icons/fa6";

const CardTrack = (props: { trackDuration: ReactNode; trackName: string; artist: string; imageUrl: string }) => {
	return (
		<div className="bg-[#2c2c2c] hover:opacity-90 hover:scale-[101%] duration-200 ease-in w-full h-24 rounded-2xl flex overflow-hidden mb-3 cursor-pointer">
			<div className="h-full w-24 lg:w-28">
				<Image
					src={props.imageUrl}
					alt={"track cover art"}
					width={160}
					height={160}
				/>
			</div>
			<div className="flex-grow flex items-center px-5">
				<div className="flex flex-col">
					<h3 className="font-medium h-fit">{props.trackName}</h3>
					<p className="h-fit text-xs opacity-70">
						{props.artist}
					</p>
				</div>
				<div className="flex-grow flex justify-end px-8 text-sm">
					{props.trackDuration}
				</div>
				<div className="px-3 flex gap-5">
					<span className="cursor-pointer">
						<FaCirclePlay className="text-2xl hover:scale-110 duration-500 ease-out" />
					</span>
					<span className="cursor-pointer">
						<FaRegHeart className="text-2xl hover:scale-110 hover:text-red-700 duration-500 ease-out" />
					</span>
				</div>
			</div>
		</div>
	);
};

export default CardTrack;
