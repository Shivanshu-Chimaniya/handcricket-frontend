import React, {useEffect, useState} from "react";
import B1 from "../assets/hands/1-b.png";
import B2 from "../assets/hands/2-b.png";
import B3 from "../assets/hands/3-b.png";
import B4 from "../assets/hands/4-b.png";
import B5 from "../assets/hands/5-b.png";
import B6 from "../assets/hands/6-b.png";
import BIdle from "../assets/hands/Idle-b.png";
import "./handcss.css";

export default function Righthand({choice}) {
	const map = [BIdle, B1, B2, B3, B4, B5, B6];
	const [rotate, setRotate] = useState(0);
	const [show, setShow] = useState(true);
	const [Image, setImage] = useState(0);

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
		if (choice == -1) {
			setShow(false);
		} else {
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
