import Player from "../commonTypes/Player";
import Cell from "./Cell";
import CellState from "./CellState";
import { CaptureMove, MoveType, TravelMove } from "./MovesInfo";
import Pos from "./Pos";

export class Board {
	public readonly size = 8;
	public cells: Cell[][];

	public constructor() {
		this.cells = [];
		for (let i = 0; i < this.size; i++) {
			const row: Cell[] = [];
			for (let j = 0; j < this.size; j++) {
				row.push(new Cell(j, i));
			}
			this.cells.push(row);
		}

		this.initPieces();
	}

	public getCell(x: number, y: number) {
		return this.cells[y][x];
	}

	private isInsideBoard(x: number, y: number) {
		return 0 <= x && x < this.size && 0 <= y && y < this.size;
	}

	private showPossibleTravelMove(fromX: number, fromY: number, toX: number, toY: number) {
		if (!this.isInsideBoard(toX, toY)) return;

		const toCell = this.getCell(toX, toY);
		if (toCell.state === CellState.Empty) {
			toCell.possibleMove = new TravelMove(new Pos(fromX, fromY));
		}
	}

	private showPossibleCapture(fromX: number, fromY: number, targetX: number, targetY: number) {
		if (!this.isInsideBoard(targetX, targetY)) return;

		const fromCell = this.getCell(fromX, fromY);
		const targetCell = this.getCell(targetX, targetY);
		if (targetCell.state === CellState.Empty || fromCell.state === targetCell.state) return;

		const endPosX = targetX + (targetX - fromX);
		const endPosY = targetY + (targetY - fromY);
		if (!this.isInsideBoard(endPosX, endPosY)) return;
		const endCell = this.getCell(endPosX, endPosY);

		if (endCell.state !== CellState.Empty) return;

		endCell.possibleMove = new CaptureMove(new Pos(fromX, fromY), new Pos(targetX, targetY));
	}

	private hasCapture(fromX: number, fromY: number, targetX: number, targetY: number) {
		if (!this.isInsideBoard(targetX, targetY)) return false;

		const fromCell = this.getCell(fromX, fromY);
		const targetCell = this.getCell(targetX, targetY);
		if (targetCell.state === CellState.Empty || fromCell.state === targetCell.state)
			return false;

		const endPosX = targetX + (targetX - fromX);
		const endPosY = targetY + (targetY - fromY);
		if (!this.isInsideBoard(endPosX, endPosY)) return false;
		const endCell = this.getCell(endPosX, endPosY);

		if (endCell.state !== CellState.Empty) return false;

		return true;
	}

	public hasCaptures(cell: Cell, curPlayer: Player) {
		if (curPlayer === Player.Black && cell.state !== CellState.BlackPiece) return;
		if (curPlayer === Player.White && cell.state !== CellState.WhitePiece) return;

		return (
			this.hasCapture(cell.x, cell.y, cell.x - 1, cell.y - 1) ||
			this.hasCapture(cell.x, cell.y, cell.x + 1, cell.y - 1) ||
			this.hasCapture(cell.x, cell.y, cell.x - 1, cell.y + 1) ||
			this.hasCapture(cell.x, cell.y, cell.x + 1, cell.y + 1)
		);
	}

	public playerHasAnyCaptures(curPlayer: Player) {
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				if (this.hasCaptures(this.getCell(x, y), curPlayer)) return true;
			}
		}
		return false;
	}

	private showAllCaptures(cell: Cell) {
		this.showPossibleCapture(cell.x, cell.y, cell.x - 1, cell.y - 1);
		this.showPossibleCapture(cell.x, cell.y, cell.x + 1, cell.y - 1);
		this.showPossibleCapture(cell.x, cell.y, cell.x - 1, cell.y + 1);
		this.showPossibleCapture(cell.x, cell.y, cell.x + 1, cell.y + 1);
	}

	public showPossibleCaptures(cell: Cell, curPlayer: Player) {
		this.clearPossibleMoves();

		if (curPlayer === Player.Black && cell.state !== CellState.BlackPiece) return;
		if (curPlayer === Player.White && cell.state !== CellState.WhitePiece) return;

		this.showAllCaptures(cell);
	}

	public showPossibleMoves(cell: Cell, curPlayer: Player) {
		this.clearPossibleMoves();

		if (curPlayer === Player.Black && cell.state !== CellState.BlackPiece) return;
		if (curPlayer === Player.White && cell.state !== CellState.WhitePiece) return;

		if (cell.state == CellState.WhitePiece) {
			this.showPossibleTravelMove(cell.x, cell.y, cell.x - 1, cell.y - 1);
			this.showPossibleTravelMove(cell.x, cell.y, cell.x + 1, cell.y - 1);
		} else if (cell.state == CellState.BlackPiece) {
			this.showPossibleTravelMove(cell.x, cell.y, cell.x - 1, cell.y + 1);
			this.showPossibleTravelMove(cell.x, cell.y, cell.x + 1, cell.y + 1);
		}

		this.showAllCaptures(cell);
	}

	// returns MoveType of the performed move
	public doMove(cell: Cell) {
		if (cell.possibleMove === null) return MoveType.none;

		const performedMove = cell.possibleMove.type;

		if (cell.possibleMove.type === MoveType.travel) {
			const fromPos = (cell.possibleMove as TravelMove).from;
			const fromCell = this.getCell(fromPos.x, fromPos.y);
			cell.state = fromCell.state;
			fromCell.state = CellState.Empty;
		} else if (cell.possibleMove.type === MoveType.capture) {
			const move = cell.possibleMove as CaptureMove;
			const fromPos = move.from;
			const fromCell = this.getCell(fromPos.x, fromPos.y);
			cell.state = fromCell.state;
			fromCell.state = CellState.Empty;

			const capturedPos = move.captureTarget;
			const capturedCell = this.getCell(capturedPos.x, capturedPos.y);
			capturedCell.state = CellState.Empty;
		}

		this.clearPossibleMoves();
		return performedMove;
	}

	private clearPossibleMoves() {
		for (let y = 0; y < this.size; y++) {
			for (let x = 0; x < this.size; x++) {
				this.getCell(x, y).possibleMove = null;
			}
		}
	}

	private initPieces() {
		// put black pieces
		for (let y = 0; y < 3; y++) {
			for (let x = (y + 1) % 2; x < this.size; x += 2) {
				this.getCell(x, y).state = CellState.BlackPiece;
			}
		}

		// put white pieces
		for (let y = this.size - 3; y < this.size; y++) {
			for (let x = (y + 1) % 2; x < this.size; x += 2) {
				this.getCell(x, y).state = CellState.WhitePiece;
			}
		}
	}
}

export default Board;
