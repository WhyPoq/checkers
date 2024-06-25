import { useEffect, useState } from "react";
import CellComponent from "./CellComponent";
import Player from "../commonTypes/Player.ts";

import Cell from "../model/Cell";
import Board from "../model/Board";
import { MoveType } from "../model/MovesInfo.ts";

interface BoardComponentProps {
	curPlayer: Player;
	changePlayer: () => void;
}

const BoardComponent = ({ curPlayer, changePlayer }: BoardComponentProps) => {
	const [board, _] = useState<Board>(new Board());
	const [curSelectedCell, setCurSelectedCell] = useState<Cell | null>(null);
	const [playerCapturing, setPlayerCapturing] = useState(false);
	const [needToCapture, setNeedToCapture] = useState(false);

	useEffect(() => {
		if (board.playerHasAnyCaptures(curPlayer)) setNeedToCapture(true);
		else setNeedToCapture(false);
	}, [curPlayer]);

	function selectCell(cell: Cell) {
		if (curSelectedCell === cell || playerCapturing) return;

		if (curSelectedCell !== null) {
			curSelectedCell.selected = false;
		}
		cell.selected = true;
		if (needToCapture) {
			board.showPossibleCaptures(cell, curPlayer);
		} else {
			board.showPossibleMoves(cell, curPlayer);
		}
		setCurSelectedCell(cell);
	}

	function doMove(cell: Cell) {
		const performedMove = board.doMove(cell);

		if (curSelectedCell !== null) {
			curSelectedCell.selected = false;
			setCurSelectedCell(null);
		}

		if (performedMove === MoveType.capture && board.hasCaptures(cell, curPlayer)) {
			setPlayerCapturing(true);
			setCurSelectedCell(cell);
			board.showPossibleCaptures(cell, curPlayer);
		} else {
			setPlayerCapturing(false);
			changePlayer();
		}
	}

	return (
		<div className={"grid grid-cols-8"}>
			{board.cells.map((row, y) => {
				return row.map((cell, x) => (
					<CellComponent
						key={x + "x" + y}
						cell={cell}
						selectCell={selectCell}
						doMove={doMove}
						selectedCell={curSelectedCell}
					></CellComponent>
				));
			})}
		</div>
	);
};

export default BoardComponent;
