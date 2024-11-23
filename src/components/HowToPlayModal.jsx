import React, {useCallback} from "react";
import {X} from "lucide-react";

const HandCricketRulesModal = ({isOpen, onClose}) => {
	if (!isOpen) return null;

	const handleBackdropClick = useCallback(
		(e) => {
			if (e.target === e.currentTarget) {
				onClose();
			}
		},
		[onClose]
	);

	return (
		<div
			className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
			onClick={handleBackdropClick}>
			<div className="bg-white rounded-lg w-[480px] h-[600px] relative flex flex-col">
				{/* Close button */}
				<button
					onClick={onClose}
					className="absolute right-3 top-3 text-gray-500 hover:text-gray-700">
					<X className="h-5 w-5" />
				</button>

				{/* Header */}
				<div className="p-4 border-b border-gray-200 shrink-0">
					<h2 className="text-xl font-bold text-center text-gray-900">
						How to Play Hand Cricket
					</h2>
				</div>

				{/* Scrollable Content */}
				<div className="overflow-y-auto flex-grow p-4">
					<div className="space-y-5">
						{/* Getting Started */}
						<div className="space-y-2">
							<h3 className="text-base font-semibold text-green-700">
								Getting Started
							</h3>
							<div className="space-y-2 pl-3 text-sm">
								<p className="text-gray-700">
									• Create or join a game room and share the
									game code with a friend
								</p>
								<p className="text-gray-700">
									• Once both players have joined, the room
									owner can start the game
								</p>
							</div>
						</div>

						{/* Game Setup */}
						<div className="space-y-2">
							<h3 className="text-base font-semibold text-green-700">
								Game Setup
							</h3>
							<div className="space-y-2 pl-3 text-sm">
								<p className="text-gray-700">
									• Begin with a toss: play
									rock-paper-scissors to decide who chooses
									first
								</p>
								<p className="text-gray-700">
									• Toss winner picks batting or bowling; if
									no choice is made in 10 seconds, bowling is
									assigned
								</p>
							</div>
						</div>

						{/* Game Rules */}
						<div className="space-y-2">
							<h3 className="text-base font-semibold text-green-700">
								Playing the Game
							</h3>
							<div className="space-y-2 pl-3 text-sm">
								<p className="text-gray-700">
									• Choose a number from 1 to 6 (fingers
									represent numbers, thumb = 6)
								</p>
								<p className="text-gray-700">
									• If both players pick the same number, the
									batting player is out
								</p>
								<p className="text-gray-700">
									• Otherwise, the batting player scores the
									number they chose
								</p>
							</div>
						</div>

						{/* Winning Conditions */}
						<div className="space-y-2">
							<h3 className="text-base font-semibold text-green-700">
								Winning the Game
							</h3>
							<div className="space-y-2 pl-3 text-sm">
								<p className="text-gray-700">
									• After the first innings, the second player
									tries to beat the score
								</p>
								<p className="text-gray-700">
									• Score more runs to win
								</p>
								<p className="text-gray-700">
									• Get out before tying the score and lose
								</p>
								<p className="text-gray-700">
									• If scores are tied = Draw
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Footer */}
				<div className="p-4 border-t border-gray-200 shrink-0">
					<button
						onClick={onClose}
						className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 text-sm font-medium">
						Got it!
					</button>
				</div>
			</div>
		</div>
	);
};

export default HandCricketRulesModal;
