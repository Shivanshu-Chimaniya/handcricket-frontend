import React, {useEffect, useState} from "react";
import BIdle from "../assets/hands/Idle-b.png";
import FIdle from "../assets/hands/Idle-f.png";
import F1 from "../assets/hands/1-f.png";
import F2 from "../assets/hands/2-f.png";
import F3 from "../assets/hands/3-f.png";
import F4 from "../assets/hands/4-f.png";
import F5 from "../assets/hands/5-f.png";
import F6 from "../assets/hands/6-f.png";
import B1 from "../assets/hands/1-b.png";
import B2 from "../assets/hands/2-b.png";
import B3 from "../assets/hands/3-b.png";
import B4 from "../assets/hands/4-b.png";
import B5 from "../assets/hands/5-b.png";
import B6 from "../assets/hands/6-b.png";
import "./handcss.css";

export default function Righthand({choice}) {
	const map = [FIdle, F1, F2, F3, F4, F5, F6];
	const [rotate, setRotate] = useState(0);
	const [show, setShow] = useState(0);
	const [Image, setImage] = useState(0);

	useEffect(() => {
		const performHandAnimation = async (Img) => {
			function wait(ms) {
				return new Promise((resolve) => setTimeout(resolve, ms));
			}
			setShow(false);
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
		if (choice == -1) {
			setImage(map[0]);
		} else {
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
