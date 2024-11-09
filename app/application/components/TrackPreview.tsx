import React, { useState } from "react";
import Image from "next/image";
import { FaHeart, FaPause, FaPlay, FaRegHeart } from "react-icons/fa6";
import { motion } from "framer-motion";

interface TrackDetails {
	title: string;
	artistName: string;
	duration: string;
    albumArtUrl: string;
    index: number
}

const TrackPreview = ({
	title,
	artistName,
	duration,
    albumArtUrl,
    index
}: TrackDetails) => {
	const [iconStatus, setIconStatus] = useState(true);
	const [playStatus, setPlayStatus] = useState(true);
	return (
		<>
			<motion.div initial={{opacity: 0,y: 50}} animate={{opacity: 1, y:0}} transition={{ease: 'easeInOut', duration: 0.5, delay: index/10+0.2}} className="w-[800px] rounded-lg h-14 flex overflow-hidden pr-8 hover:bg-[#303030] hover:scale-[1.02] transition ease-in-out duration-150 cursor-pointer">
				<Image
					src={`${albumArtUrl}`}
					width={100}
					height={100}
					alt={""}
					className="w-auto h-auto rounded-md"
				/>
				<div className="flex flex-grow">
					<div className="flex flex-col justify-center px-5">
						<h1 className="text-sm font-semibold">{title}</h1>
						<p className="text-xs">{artistName}</p>
					</div>
					<div className="flex-grow"></div>
				</div>
				<div className="flex justify-center items-center gap-10">
					<p className="text-sm">{duration}</p>
					<span onClick={() => {setIconStatus(false)}} className="cursor-pointer hover:text-red-700 transition-transform ease-in-out duration-200">
						{iconStatus ? (
							<FaRegHeart className="text-lg" />
						) : (
							<FaHeart className="text-lg text-red-700" />
						)}
					</span>
					<span onClick={() => {setPlayStatus(false)}} className="cursor-pointer">
						{playStatus ? (
							<FaPlay className="text-lg" />
						) : (
							<FaPause className="text-lg" />
						)}
					</span>
				</div>
			</motion.div>
		</>
	);
};

export default TrackPreview;
