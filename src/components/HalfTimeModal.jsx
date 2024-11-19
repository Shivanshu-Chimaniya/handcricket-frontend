import React, {useState, useEffect} from "react";
import ball from "../assets/ball.png";
import bat from "../assets/bat.png";

const HalfTimeModal = ({players, game, isPlayer1, timer, switchedInning}) => {
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
	console.log(game);
	let wasIBatting =
		(isPlayer1 && game.battingTurn == 0) ||
		(!isPlayer1 && game.battingTurn == 1);
	let currBatting = game.battingTurn;
	let nextBatting = (game.battingTurn + 1) % 2;
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
							? `Don't let ${players[nextBatting].name} chase it down! Every ball counts. Bring your best!`
							: `${players[currBatting].name} has set a target of ${game.scores[currBatting]} runs. It's time to step up and chase it down!`}
					</p>
				</div>

				{/* Stats Section */}
				<div className="bg-gray-50 rounded-lg p-4 mb-6">
					<h3 className="text-center text-lg font-semibold mb-4">
						Summary
					</h3>
					{/* Player Stats */}

					<div className="mb-4 last:mb-0">
						<div className="flex justify-between items-center mb-2">
							<span className="font-medium">
								{players[currBatting].name}
							</span>

							<span className="text-blue-600 font-bold">
								{game.scores[currBatting]} runs
							</span>
						</div>

						{/* Runs Array */}
						<div
							style={{scrollbarWidth: "none"}}
							className="flex  overflow-scroll  gap-2 mb-2">
							<img
								className="BattingBallingSymbol mt-1"
								src={bat}
								alt="batting:"
							/>
							{game.firstInning.map((run, runIndex) => (
								<span
									key={runIndex}
									style={{backgroundColor: "#D9EAD3"}}
									className=" text-blue-800 px-2 py-1 rounded text-sm">
									{currBatting == 0
										? run.player1
										: run.player2}
								</span>
							))}
						</div>
						<div
							style={{scrollbarWidth: "none"}}
							className="flex overflow-scroll gap-2 mb-2">
							<img
								className="BattingBallingSymbol mt-1"
								src={ball}
								alt="balling:"
							/>
							{game.firstInning.map((run, runIndex) => (
								<span
									key={runIndex}
									style={{backgroundColor: "#F4DFB7"}}
									className="text-blue-800 px-2 py-1 rounded text-sm">
									{nextBatting == 0
										? run.player1
										: run.player2}
								</span>
							))}
						</div>

						<div className="text-sm text-gray-600">
							Balls played: {game.spans[currBatting]}
						</div>
					</div>

					{/* Total Stats */}
					<div className="border-t border-gray-200 mt-4 pt-4">
						<div className="flex justify-between text-lg font-semibold">
							<span>Target Score:</span>
							<span>{game.scores[currBatting]}</span>
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
