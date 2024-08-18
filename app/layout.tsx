import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import BackdropFixed from "./components/backdrop";
import Navbar from "./components/navbar";
import NavMenu from "./components/nav-menu";
import Player from "./components/player";

const font = DM_Sans({
	subsets: ['latin'],   // Define subsets
	weight: ['200','400', '500', '700'], // Specify font weights
	style: ['normal', 'italic'],   // Specify styles
	display: 'swap',      // Control how font is displayed
	preload: true,        // Enable preloading
  })

export const metadata: Metadata = {
	title: "Melodine",
	description: "Music Streaming",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={font.className}>
				<Navbar />
				<NavMenu />
				<BackdropFixed />
        <Player/>
        <main>{children}</main>
			</body>
		</html>
	);
}
