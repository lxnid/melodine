import React from "react";
import MenuBtn from "./menu-btn";
import Link from "next/link";
import { FiSettings, FiUser } from "react-icons/fi";

const NavMenu = () => {
	return (
			<div className="drawer lg:drawer-open fixed z-20 lg:z-0">
				<input
					id="my-drawer-2"
					type="checkbox"
					className="drawer-toggle"
				/>
				<div className="drawer-content flex flex-col items-end justify-end h-auto p-8 lg:hidden">
					{/* Page content here */}
                        <MenuBtn/>
				</div>
				<div className="drawer-side absolute">
					<label
						htmlFor="my-drawer-2"
						aria-label="close sidebar"
						className="drawer-overlay"
					></label>
					<ul className="menu w-80 px-10 mt-40 border-r-[1px] border-neutral-700 h-[-webkit-fill-available]">
						{/* Sidebar content here */}
						<li className="btn-ghost transition duration-300 ease-out">
							<Link href={'/'}>Home</Link>
						</li>
						<li className="btn-ghost transition duration-300 ease-out">
                        <Link href={'/temp'}>Search</Link>
						</li>
						<li className="btn-ghost transition duration-300 ease-out">
                        <Link href={'/temp'}>Playlists</Link>
						</li>
						<li className="btn-ghost transition duration-300 ease-out">
                        <Link href={'/temp'}>Profile</Link>
						</li>
					</ul>
					<ul className="menu w-80 px-10 pb-14 bottom-32 absolute">
						{/* Sidebar content here */}
						<li className="active btn-ghost transition duration-300 ease-out">
							<Link href={''}><FiUser />Account</Link>
						</li>
						<li className="btn-ghost transition duration-300 ease-out">
							<a><FiSettings />Settings</a>
						</li>
					</ul>
				</div>
			</div>
	);
};

export default NavMenu;
