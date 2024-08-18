"use client";
import React, { useState } from "react";
import { FiMenu, FiSidebar } from "react-icons/fi";

const MenuBtn = () => {
	const [isToggled, setIsToggled] = useState(false);

	// Function to handle button click
	const handleToggle = () => {
		setIsToggled(!isToggled);
	};
	return (
		<label
			htmlFor="my-drawer-2"
			className="btn btn-ghost"
			onClick={handleToggle}
		>
			{isToggled ? <FiSidebar className="text-xl" /> : <FiMenu className="text-xl" />}{" "}
			{/* Conditional rendering of icons */}
		</label>
	);
};

export default MenuBtn;
