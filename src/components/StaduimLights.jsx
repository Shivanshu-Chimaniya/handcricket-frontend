import React, {useEffect, useState} from "react";

export default function StadiumLights({count = 15}) {
	const [lights, setLights] = useState([]);
	const colors = [
		"bg-white",
		"bg-red-200",
		"bg-orange-200",
		"bg-amber-200",
		"bg-yellow-200",
		"bg-lime-200",
		"bg-green-2000",
		"bg-emerald-200",
		"bg-teal-200",
		"bg-cyan-200",
		"bg-sky-200",
		"bg-blue-200",
		"bg-Indigo-200",
		"bg-violet-200",
		"bg-purple-200",
		"bg-fuchsia-200",
		"bg-pink-200",
		"bg-rose-200",
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
					className={`absolute rounded-full w-2 h-2 ${object.color} opacity-15 animate-pulse`}
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
