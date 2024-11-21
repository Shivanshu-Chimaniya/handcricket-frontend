import React, {useState, useEffect} from "react";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";
import PlayerResult from "./PlayerResult";

const HalfTimeModal = ({game, isLeader, timer, switchedInning}) => {
	const [timeLeft, setTimeLeft] = useState(timer);
	const [isOpen, setIsOpen] = useState(true);

	useEffect(() => {
		const countdown = setInterval(() => {
			setTimeLeft((prev) => {
				if (prev <= 1) {
					clearInterval(countdown);
					setIsOpen(false);
					switchedInning();
					return 0;
				}
				return prev - 1;
			});
		}, 1000);

		return () => {
			clearInterval(countdown);
		};
	}, []);
	if (!isOpen) return null;
	let players = game.players;
	let wasIBatting =
		(isLeader && game.battingTurn == 1) ||
		(!isLeader && game.battingTurn == 0);
	let currBatting = (game.battingTurn + 1) % 2;
	let nextBatting = game.battingTurn;
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 m-4">
				{/* Header */}
				<div className="text-center mb-6">
					<h2
						className={`text-3xl font-bold mb-2 ${
							wasIBatting ? "text-red-600" : "text-green-600"
						}`}>
						{wasIBatting
							? "Great Job at the Crease! 🎯"
							: "Your Time to Shine! 🎉"}
					</h2>
					<p className="text-gray-600">
						{wasIBatting
							? `Don't let ${players[nextBatting].playerName} chase it down! Every ball counts. Bring your best!`
							: `${players[currBatting].playerName} has set a target of ${game.targetScore} runs. It's time to step up and chase it down!`}
					</p>
				</div>

				{/* Stats Section */}
				<div className="bg-gray-50 rounded-lg p-4 mb-6">
					<h3 className="text-center text-lg font-semibold mb-4">
						Summary
					</h3>
					{/* Player Stats */}

					<PlayerResult
						Inning={game.firstInning}
						battingTurn={currBatting}
						playerName={game.players[currBatting].playerName}
						playerScore={game.scores[currBatting]}
						playerSpan={game.spans[currBatting]}
					/>

					{/* Total Stats */}
					<div className="border-t border-gray-200 mt-4 pt-4">
						<div className="flex justify-between text-lg font-semibold">
							<span>Target Score:</span>
							<span>{game.targetScore}</span>
						</div>
					</div>
				</div>

				{/* Action Buttons */}
				<div className="flex gap-4">
					<button className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors">
						Second Inning Begins in {timeLeft} seconds.
					</button>
					{/* <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-colors">
						Rematch
					</button> */}
				</div>
			</div>
		</div>
	);
};

export default HalfTimeModal;
