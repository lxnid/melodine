import React from "react";
import { FaBackwardStep, FaCirclePlay, FaForwardStep } from "react-icons/fa6";
import { IoRepeat, IoShuffle } from "react-icons/io5";
import Image from "next/image";

const Player = () => {
	return (
		<div className="fixed bottom-0 bg-black shadow-[rgba(0,0,0,0.8)_10px_-10px_500px_-46px] w-screen h-36 flex items-center justify-center z-20">
			<div className="flex flex-nowrap w-full h-full p-3 gap-2">
				<span className="flex p-3 rounded-box hover:scale-105 duration-500 ease-out cursor-pointer hover:bg-[#2e2e2ecf]">
					<div className="rounded-box flex-none h-full w-[7rem] place-items-center bg-pink-500 overflow-hidden">
						<Image
							src={"/cover-img-03.jpg"}
							alt={"logo"}
							width={120}
							height={120}
						/>
					</div>
					<div className="hidden lg:flex shrink flex-col h-full w-[15vw] p-2 overflow-hidden">
						<h3 className="font-medium h-fit">song name</h3>
						<p className="h-fit text-xs opacity-70">
							Artist | fFt | Genre
						</p>
					</div>
				</span>
				<div className="flex flex-col h-full flex-grow p-2">
					<div className="w-full flex gap-3 items-center flex-grow justify-center">
						<span className="btn btn-ghost min-h-fit h-auto p-0 hover:opacity-80 hover:scale-95 ease-out duration-500">
							<IoShuffle className="text-2xl" />
						</span>
						<span className="btn btn-ghost min-h-fit h-auto p-0 hover:opacity-80 hover:scale-95 ease-out duration-500">
							<FaBackwardStep className="text-2xl" />
						</span>
						<span className="btn btn-ghost min-h-fit h-auto p-0 hover:opacity-80 hover:scale-95 ease-out duration-500">
							<FaCirclePlay className="text-2xl" />
						</span>
						<span className="btn btn-ghost min-h-fit h-auto p-0 hover:opacity-80 hover:scale-95 ease-out duration-500">
							<FaForwardStep className="text-2xl" />
						</span>
						<span className="btn btn-ghost min-h-fit h-auto p-0 hover:opacity-80 hover:scale-95 ease-out duration-500">
							<IoRepeat className="text-2xl" />
						</span>
					</div>
					<div className="w-full flex items-center flex-grow justify-center px-5 gap-3">
						<span className="text-xs">02.31</span>
						<span className="flex-grow">
							<div className="relative before:content['*'] before:h-[4px] before:w-full before:block before:bg-[#d9d9d9] before:opacity-30 before:rounded-xl before:absolute after:content['*'] after:h-[4px] after:w-[68%] after:block after:bg-[#d9d9d9] after:hover:h-[6px] after:rounded-xl"></div>
						</span>
						<span className="text-xs">00.35</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Player;
