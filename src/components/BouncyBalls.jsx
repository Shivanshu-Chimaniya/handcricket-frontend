import React, {useEffect, useState} from "react";

export default function BouncyBalls({count = 5}) {
	const [balls, setBalls] = useState([]);
	const colors = ["orange", "green", "blue", "red", "fuchsia"];
	useEffect(() => {
		let arr = [];
		for (let i = 0; i < count; i++) {
			let newObj = {
				color: `${colors[Math.floor(Math.random() * 5)]}`,
				width: `${Math.random() * 6}`,
				top: `${5 + Math.random() * 90}`,
				left: `${10 + Math.random() * 80}`,
				animationDelay: `${Math.random() * 3}`,
				animationDuration: `${1 + Math.random() * 2}    `,
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
					className={`absolute  aspect-square rounded-full bg-${
						colors[Math.floor(Math.random() * 5)]
					}-200 opacity-10 animate-bounce`}
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
