/* Abstract class for MorseGame */
export abstract class MorseGame {
	protected _correct: number = 0;
	protected _score:   number = 0;
	protected _current: string = "";
	protected _input: string = "";
	protected _start_time: number = 0;
	protected _at: number = 0;
	constructor(public id: string, public name: string) {
		this.reset();
		this.next();
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
			if(d < this._start_time) {
				d = this._start_time+10000;
			}
			this.add_score((d-this._start_time) / 1000.0);
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
	abstract count() : number;
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

export class Letters extends MorseGame {
	private letters: number;
	constructor(public id: string, public name: string, letters: number) {
		super(id,name);
		this.letters = letters;
	}
	count(): number {
		return this.letters;
	}
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let s:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let l:string[] = s.split("");
		this._current = l[Math.floor((Math.random() * s.length))];
	}
}

export class TwoLetters extends MorseGame {
	private letters: number;
	constructor(public id: string, public name: string, letters: number) {
		super(id,name);
		this.letters = letters;
	}
	count(): number {
		return this.letters;
	}
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let s:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let l:string[] = s.split("");
		this._current = l[Math.floor((Math.random() * s.length))] + l[Math.floor((Math.random() * s.length))];
	}
}

export class Game {
	games :MorseGame[] = [
		new Letters('letters10','Letters 10',10),
		new TwoLetters('twoLetters10','TwoLetters 11',10),
	];
}
