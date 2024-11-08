"use client";
import Image from "next/image";
import { Poppins, Outfit } from "next/font/google";
import Link from "next/link";
import Marquee from "react-fast-marquee";
import { motion } from "framer-motion";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["600", "400"],
});

const outfit = Outfit({
	subsets: ["latin"],
	weight: "800",
});

export default function Home() {
	return (
		<div className="w-full min-h-screen">
			<nav
				className={`w-full h-16 flex justify-between items-center px-10 ${poppins.className} font-bold sticky top-0 z-50 bg-gradient-to-b from-black backdrop-blur-3xl`}
			>
				<Image
					src={"logo.svg"}
					alt={"Logo | Melodine"}
					width={100}
					height={100}
				/>
				<div className="items-center gap-20 flex-grow justify-center text-sm sm:flex hidden">
					<Link
						className="opacity-50 hover:opacity-95 transition-opacity ease-in-out duration-300"
						href={""}
					>
						Login
					</Link>
					<Link
						className="opacity-50 hover:opacity-95 transition-opacity ease-in-out duration-300"
						href={""}
					>
						Signup
					</Link>
					<Link
						className="opacity-50 hover:opacity-95 transition-opacity ease-in-out duration-300"
						href={""}
					>
						Support
					</Link>
				</div>
				<button className="px-5 py-1 md:block hidden rounded-full border-white border-2 hover:bg-white hover:text-black transition-colors ease-in-out duration-300">
					<Link href={"/application"} className="text-sm">
						Start Listening
					</Link>
				</button>
			</nav>
			<div className="w-full h-full flex justify-center items-center">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.5, delay: 0 }}
					className="w-[96%] xl:h-[66vh] lg:h-[60vh] md:h-[45vh] sm:h-[60vh] h-[72vh] bg-[url('../public/background.svg')] bg-cover bg-center rounded-3xl relative flex flex-col sm:flex-row items-center"
				>
					<div className="lg:px-20 sm:px-12 py-12 flex flex-col lg:gap-10 gap-6 text-center sm:text-start items-center sm:items-start">
						<motion.h1
							initial={{ y: 100, opacity: 0 }}
							whileInView={{ y: 0, opacity: 1 }}
							transition={{
								duration: 1,
								type: "spring",
								stiffness: 100,
								damping: 10,
								delay: 0.1,
							}}
							className={`2xl:text-8xl xl:text-8xl lg:text-7xl md:text-5xl sm:text-6xl text-5xl ${outfit.className} leading-none`}
						>
							Discover.Play.
							<br />
							Repeat
						</motion.h1>
						<motion.p
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{
								duration: 1,
								type: "spring",
								stiffness: 100,
								damping: 10,
								delay: 0.25,
							}}
							className={`${poppins.className} sm:w-[40%] w-[80%] text-xs md:text-sm xl:text-base`}
						>
							Experience your favorite music anytime, anywhere,
							tailored to your unique style. Seamlessly enjoy
							high-quality sound wherever life takes you, with
							full control over your listening experience.
						</motion.p>
						<motion.button
							initial={{ opacity: 0 }}
							whileInView={{ opacity: 1 }}
							transition={{
								duration: 1,
								type: "spring",
								stiffness: 100,
								damping: 10,
								delay: 0.5,
							}}
							className="lg:px-5 px-3 py-1 w-fit rounded-full bg-white text-[#84074c] hover:bg-[#84074c00] hover:text-white hover:border-white border-2 transition-colors ease-in-out duration-300"
						>
							<Link
								href={"/application"}
								className={`lg:text-sm text-xs ${poppins.className} font-bold z-50`}
							>
								Start Listening
							</Link>
						</motion.button>
					</div>
					<motion.span
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{
							duration: 1,
							type: "spring",
							stiffness: 100,
							damping: 10,
						}}
					>
						<Image
							src={"/hero-img.png"}
							alt={""}
							width={600}
							height={800}
							className="sm:absolute right-10 bottom-0 xl:w-[600px] h-auto lg:w-[520px] md:w-[420px] w-[360px]"
						/>
					</motion.span>
				</motion.div>
			</div>
			<Marquee
				autoFill={true}
				pauseOnHover={true}
				gradient={true}
				gradientColor="#000000"
				direction="right"
				className=""
			>
				<AlbumArt
					delay={0.1}
					url="https://charts-static.billboard.com/img/2019/12/the-weeknd-jlk-blindinglights-q48-180x180.jpg"
				/>
				<AlbumArt
					delay={0.2}
					url="https://charts-static.billboard.com/img/2019/02/lewis-capaldi-j7n-someoneyouloved-00a-180x180.jpg"
				/>
				<AlbumArt
					delay={0.3}
					url="https://charts-static.billboard.com/img/2011/07/ed-sheeran-w3r-180x180.jpg"
				/>
				<AlbumArt
					delay={0.4}
					url="https://charts-static.billboard.com/img/2016/10/the-weeknd-jlk-starboy-g5m-180x180.jpg"
				/>
				<AlbumArt
					delay={0.5}
					url="https://charts-static.billboard.com/img/2024/08/hanumankind-000-bigdawgs-qok-180x180.jpg"
				/>
				<AlbumArt
					delay={0.6}
					url="https://charts-static.billboard.com/img/2018/10/post-malone-uhe-sunflowerspidermanintothespiderverse-u2l-180x180.jpg"
				/>
				<AlbumArt
					delay={0.7}
					url="https://charts-static.billboard.com/img/2014/06/sabrina-carpenter-3b3-180x180.jpg"
				/>
				<AlbumArt
					delay={0.8}
					url="https://charts-static.billboard.com/img/2023/09/tyla-2zm-water-r4l-180x180.jpg"
				/>
				<AlbumArt
					delay={0.9}
					url="https://charts-static.billboard.com/img/2021/10/adele-0zg-easyonme-03x-180x180.jpg"
				/>
				<AlbumArt
					delay={0.1}
					url="https://charts-static.billboard.com/img/2024/08/lady-gaga-b8x-diewithasmile-gdz-180x180.jpg"
				/>
				<AlbumArt
					delay={0.11}
					url="https://charts-static.billboard.com/img/2024/04/sabrina-carpenter-3b3-espresso-q35-180x180.jpg"
				/>
			</Marquee>
		</div>
	);
}

interface Album {
	url: string;
	delay: number;
}

function AlbumArt({ url, delay }: Album) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{
				duration: 1,
				type: "tween",
				ease: "easeInOut",
				delay: 0.5 + delay,
			}}
			className="sm:w-52 sm:h-52 w-40 h-40 mx-2 my-5 bg-cover bg-center rounded-xl hover:scale-105 transition-transform ease-in-out duration-300"
			style={{ backgroundImage: `url(${url})` }}
		></motion.div>
	);
}
