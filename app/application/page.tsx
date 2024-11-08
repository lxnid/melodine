'use client'
import React, { useEffect } from "react";
import getData from "./api";

export default function App() {
	useEffect(() => {
		getData();
	}, []);

	return <div>Page</div>;
}