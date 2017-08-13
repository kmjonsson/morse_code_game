/* Abstract class for MorseGame */
export abstract class MorseGame {
	protected _correct: number = 0;
	protected _score:   number = 0;
	protected _current: string = "";
	protected _input: string = "";
	protected _start_time: number = 0;
	protected _at: number = 0;
	protected _count: number = 10;
	constructor(public id: string, public name: string) {
		this.reset();
	}
	set_count(count:number) {
		this._count = count;
	}
	reset() {
		this._correct = 0;
		this._score   = 0;
		this._current = "";
		this._at = 0
	}
	set_start_time(t : number) {
		this._start_time = t;
	}
	get_current_char() : string {
		let pos = this._input.length - 1;
		return this._current.charAt(pos);
	}
	event(key: string) : boolean {
		if(this.goto_next()) {
			return false;
		}
		this._input += key;
		if(this._input.length == this._current.length) {
			let d:number = new Date().getTime();
			if(d > this._start_time) {
				this.add_score((d-this._start_time) / 1000.0);
			}
		}
		let pos = this._input.length - 1;
		return this._input.charAt(pos) == this._current.charAt(pos);
	}
	goto_next() : boolean {
		return this._input.length == this._current.length;
	}
	next() {
		let d = new Date();
		this._start_time = d.getTime();
		this._input = "";
		this._at++;
	};
	add_score(score: number) {
		if(this._input == this._current) {
			this._correct++;
			this._score += score;
		}
	}
	score() : number {
		return this._score;
	}
	count() : number {
		return this._count;
	}
	current() : string {
		return this._current;
	}
	correct() : number {
		return this._correct;
	}
	at() : number {
		return this._at;
	}
	done() : boolean {
		return this.count() < this.at();
	}
}
