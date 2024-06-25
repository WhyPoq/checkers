import Pos from "./Pos";

export enum MoveType {
	none,
	travel,
	capture,
}

export class Move {
	public type: MoveType;

	public constructor(type: MoveType) {
		this.type = type;
	}
}

export class TravelMove extends Move {
	public from: Pos;

	public constructor(from: Pos) {
		super(MoveType.travel);
		this.from = from;
	}
}

export class CaptureMove extends Move {
	public from: Pos;
	public captureTarget: Pos;

	public constructor(from: Pos, captureTarget: Pos) {
		super(MoveType.capture);
		this.from = from;
		this.captureTarget = captureTarget;
	}
}
