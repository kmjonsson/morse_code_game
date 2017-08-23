/* Abstract class for MorseGame */
export abstract class MorseGame {
	protected _correct: number = 0;
	protected _score:   number = 0;
	protected _current: string = "";
	protected _input: string = "";
	protected _start_time: number = 0;
	protected _at: number = 0;
	protected _count: number = 10;
	protected _charCount: number = 0;
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
		this._charCount = 0
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
			this._charCount += this._input.length;
			let d:number = new Date().getTime();
			if(d > this._start_time) {
				this.add_score(((d-this._start_time) / 1000.0));
			} else {
				this.add_score(0);
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
	}
	add_score(score: number) {
		let ia:string[] = this._input.split("");
		let ca:string[] = this._current.split("");
		if(score > 0) {
			for(let i=0;i<ia.length;i++) {
				if(ia[i] == ca[i]) {
					this._correct++;
					this._score += score;
				}
			}
		}
	}
	score() : number {
		if(this.correct() == 0) {
                        return 0;
                }
                return this._score / this.correct();
	}
	percent():number {
                return this.correct()*100/this.charCount();
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
	charCount() : number {
		return this._charCount;
	}
}
