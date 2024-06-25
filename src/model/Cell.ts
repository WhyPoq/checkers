import CellState from "./CellState";
import { Move } from "./MovesInfo";

class Cell {
	public x: number;
	public y: number;
	public state: CellState;
	public selected: boolean;
	public possibleMove: Move | null;

	public constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.state = CellState.Empty;
		this.selected = false;
		this.possibleMove = null;
	}
}

export default Cell;
