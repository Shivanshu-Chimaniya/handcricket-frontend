import React, {useEffect, useState} from "react";

export default function StadiumLights({count = 10}) {
	const [lights, setLights] = useState([]);
	const colors = [
		"white",
		"red-200",
		"orange-200",
		"amber-200",
		"yellow-200",
		"lime-200",
		"green-2000",
		"emerald-200",
		"teal-200",
		"cyan-200",
		"sky-200",
		"blue-200",
		"Indigo-200",
		"violet-200",
		"purple-200",
		"fuchsia-200",
		"pink-200",
		"rose-200",
	];
	useEffect(() => {
		let arr = [];
		for (let i = 0; i < count; i++) {
			let newObj = {
				color: `${colors[Math.floor(Math.random() * colors.length)]}`,
				top: `${2 + Math.random() * 96}`,
				left: `${2 + Math.random() * 96}`,
				animationDelay: `${Math.random() * 3}`,
				animationDuration: `${1 + Math.random() * 2}`,
			};
			arr.push(newObj);
		}
		setLights(arr);
	}, []);

	return (
		<div className="absolute inset-0 overflow-hidden">
			{lights.map((object, i) => (
				<div
					key={i}
					className={`absolute rounded-full w-2 h-2 bg-${object.color} opacity-10 animate-pulse`}
					style={{
						top: `${object.top}%`,
						left: `${object.left}%`,
						animationDelay: `${object.animationDelay}s`,
						animationDuration: `${object.animationDuration}s`,
					}}
				/>
			))}
		</div>
	);
}
