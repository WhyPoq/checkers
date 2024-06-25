import Cell from "../model/Cell";
import CellState from "../model/CellState";

interface CellComponentProps {
	cell: Cell;
	selectCell: (cell: Cell) => void;
	doMove: (cell: Cell) => void;
	selectedCell: Cell | null;
}

const CellComponent = ({ cell, selectCell, doMove, selectedCell }: CellComponentProps) => {
	let color = "";
	if ((cell.x + cell.y) % 2 == 0) {
		if (cell.selected) {
			color = "bg-blue-300";
		} else {
			color = "bg-cyan-100";
		}
	} else {
		if (cell.selected) {
			color = "bg-blue-900";
		} else {
			color = "bg-cyan-950";
		}
	}

	function clickAction() {
		if (cell.possibleMove !== null) {
			doMove(cell);
		} else {
			selectCell(cell);
		}
	}

	return (
		<div
			className={["cell", color, "aspect-square", "hover:opacity-95", "p-1", "relative"].join(
				" "
			)}
			onClick={clickAction}
		>
			{cell.state === CellState.BlackPiece && (
				<div className="bg-red-700 border-red-500 w-full h-full rounded-full border-4 shadow"></div>
			)}
			{cell.state === CellState.WhitePiece && (
				<div className="bg-purple-700 border-purple-500 w-full h-full rounded-full border-4"></div>
			)}

			{cell.possibleMove !== null && (
				<div
					className={
						"absolute size-5 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" +
						(selectedCell?.state === CellState.WhitePiece
							? " bg-purple-500"
							: " bg-red-500")
					}
				></div>
			)}
		</div>
	);
};

export default CellComponent;
