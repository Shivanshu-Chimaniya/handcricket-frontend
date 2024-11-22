import React from "react";

const Modal = ({isOpen, onClose, title, children}) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
			<div className="bg-white rounded-lg p-6 max-w-lg w-full m-4">
				<div className="flex justify-between items-center mb-4">
					<h2 className="text-2xl font-bold">{title}</h2>
					<button
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700">
						<b>X</b>
					</button>
				</div>
				{children}
			</div>
		</div>
	);
};

export default Modal;
