import {Clock} from "lucide-react";
import React, {useEffect, useState} from "react";

const StartingModal = ({game, isLeader, timer, startFirstInning}) => {
	const [timeLeft, setTimeLeft] = useState(timer);
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		const countdown = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(countdown);
					setIsOpen(false);
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			clearInterval(countdown);
		};
	}, []);
	if (!isOpen) {
		startFirstInning();
		return null;
	}
	let players = game.players;
	let didIWinToss =
		(isLeader && game.tossWinner == 0) ||
		(!isLeader && game.tossWinner == 1);
	let amIBatting =
		(isLeader && game.battingTurn == 0) ||
		(!isLeader && game.battingTurn == 1);
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
				{/* Header */}
				<div className="text-center mb-6">
					<h2
						className={`text-3xl font-bold mb-2 ${
							didIWinToss ? "text-green-600" : "text-red-600"
						}`}>
						{amIBatting
							? "You'll Bat First!"
							: "You'll Bowl First!"}
					</h2>
					<p className="text-gray-600">
						{didIWinToss
							? amIBatting
								? "Time to set a big target and dominate the game!"
								: `The pressure is on ${
										players[game.battingTurn].playerName
								  } to bat. Use your bowling skills to dominate!`
							: amIBatting
							? `${
									players[game.tossWinner].playerName
							  } chose to bowl first. Let's make them regret it by scoring big!`
							: `${
									players[game.tossWinner].playerName
							  } chose to bat first! Bring your best bowling to restrict their total!`}
					</p>
				</div>
				<div className="flex justify-center">
					<span
						className="flex text-center bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-semibold transition-colors"
						disabled>
						<Clock className="mr-2 text-white" />
						Game Begins in {timeLeft} seconds.
					</span>
				</div>
			</div>
		</div>
	);
};

export default StartingModal;
