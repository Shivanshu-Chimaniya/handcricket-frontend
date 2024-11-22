import React, {useEffect, useState} from "react";
import BIdle from "../assets/hands/Idle-b.png";
import B1 from "../assets/hands/1-b.png";
import B2 from "../assets/hands/2-b.png";
import B3 from "../assets/hands/3-b.png";
import B4 from "../assets/hands/4-b.png";
import B5 from "../assets/hands/5-b.png";
import B6 from "../assets/hands/6-b.png";
import BIdle2 from "../assets/hands/Idle-b.png";
import B7 from "../assets/hands/1-b.png";
import B8 from "../assets/hands/2-b.png";
import B9 from "../assets/hands/3-b.png";
import B10 from "../assets/hands/4-b.png";
import B11 from "../assets/hands/5-b.png";
import B12 from "../assets/hands/6-b.png";
import "./handcss.css";

export default function Righthand({choice}) {
	const map = [
		BIdle,
		B1,
		B2,
		B3,
		B4,
		B5,
		B6,
		BIdle2,
		B7,
		B8,
		B9,
		B10,
		B11,
		B12,
	];
	const [rotate, setRotate] = useState(0);
	const [show, setShow] = useState(false);
	const [Image, setImage] = useState(BIdle);

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
