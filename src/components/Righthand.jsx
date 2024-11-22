import React, {useEffect, useState} from "react";
import FIdle from "../assets/hands/Idle-f.png";
import F1 from "../assets/hands/1-f.png";
import F2 from "../assets/hands/2-f.png";
import F3 from "../assets/hands/3-f.png";
import F4 from "../assets/hands/4-f.png";
import F5 from "../assets/hands/5-f.png";
import F6 from "../assets/hands/6-f.png";
import FIdle2 from "../assets/hands/Idle-f.png";
import F7 from "../assets/hands/1-f.png";
import F8 from "../assets/hands/2-f.png";
import F9 from "../assets/hands/3-f.png";
import F10 from "../assets/hands/4-f.png";
import F11 from "../assets/hands/5-f.png";
import F12 from "../assets/hands/6-f.png";
import "./handcss.css";

export default function Righthand({choice}) {
	const map = [
		FIdle,
		F1,
		F2,
		F3,
		F4,
		F5,
		F6,
		FIdle2,
		F7,
		F8,
		F9,
		F10,
		F11,
		F12,
	];
	const [rotate, setRotate] = useState(0);
	const [show, setShow] = useState(false);
	const [Image, setImage] = useState(FIdle);

	useEffect(() => {
		const performHandAnimation = async (Img) => {
			function wait(ms) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			}
			setRotate(-20);
			await wait(90);
			setRotate(5);
			await wait(100);
			setRotate(-22);
			await wait(100);
			setRotate(0);
			setImage(Img);
			setShow(true);
		};
		if (choice !== -1) {
			setShow(false);
			performHandAnimation(map[choice]);
		}
	}, [choice]);

	return (
		<div className="handImageConatainer">
			<img
				className="handImage"
				style={{
					width: "100%",
					transform: `rotate(${rotate}deg)`,
				}}
				src={show ? Image : map[0]}
				alt={choice}
			/>
		</div>
	);
}
