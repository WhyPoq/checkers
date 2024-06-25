import { useState } from "react";
import BoardComponent from "./components/BoardComponent.tsx";
import Player from "./commonTypes/Player.ts";

function App() {
	const [curPlayer, setCurPlayer] = useState(Player.White);

	function changePlayer() {
		setCurPlayer((prevPlayer) => {
			return prevPlayer === Player.White ? Player.Black : Player.White;
		});
	}

	return (
		<div>
			<h1 className="font-bold text-center text-4xl m-5">Checkers</h1>
			<p className="font-bold text-center text-xl m-2">
				{curPlayer === Player.White ? (
					<span className="text-purple-700">White's move</span>
				) : (
					<span className="text-red-700">Black's move</span>
				)}
			</p>
			<div className="flex flex-col items-center">
				<div className="max-w-xl w-11/12 rounded-lg overflow-hidden shadow-xl">
					<BoardComponent curPlayer={curPlayer} changePlayer={changePlayer} />
				</div>
			</div>
		</div>
	);
}

export default App;
