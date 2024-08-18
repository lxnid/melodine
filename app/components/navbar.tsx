import React from "react";
import Image from "next/image";
import Link from "next/link";

const Navbar = () => {
	return (
		<div className="w-auto py-8 px-10 fixed lg:z-10">
			<Link href={"/"}>
				<Image
					src={"./logo.svg"}
					alt={"logo"}
					width={120}
					height={120}
					className="hover:scale-105 transition duration-500 ease-out"
				/>
			</Link>
		</div>
	);
};

export default Navbar;
