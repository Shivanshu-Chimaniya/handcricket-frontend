import React, {useEffect, useState} from "react";

export default function BouncyBalls({count = 5}) {
	const [balls, setBalls] = useState([]);
	useEffect(() => {
		let arr = [];
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
		for (let i = 0; i < count; i++) {
			let newObj = {
				color: `${colors[Math.floor(Math.random() * colors.length)]}`,
				width: `${Math.random() * 6}`,
				top: `${5 + Math.random() * 90}`,
				left: `${10 + Math.random() * 80}`,
				animationDelay: `${Math.random() * 3}`,
				animationDuration: `${1 + Math.random() * 2}`,
			};
			arr.push(newObj);
		}
		setBalls(arr);
	}, []);
	return (
		<div className="absolute inset-0 overflow-hidden">
			{balls.map((object, i) => (
				<div
					key={i}
					className={`absolute  aspect-square rounded-full ${object.color} opacity-10 animate-bounce`}
					style={{
						width: `${object.width}rem`,
						aspectRatio: "1/1",
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
