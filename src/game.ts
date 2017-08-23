
import { MorseGame } from "./morsegame";

class KeyInfo {
	public count:number = 0;
	public sum:number = 0;
	add(n:number) {
		this.sum += n;
		this.count++;
	}
	avg():number {
		if(this.count == 0) {
			return 0;
		}
		return this.sum / this.count;
	}
}

class Distr {
	protected ch : { [id:string] : KeyInfo } = {};
	add(ch:string, n:number = 0) {
		if(this.ch[ch] === undefined) {
			this.ch[ch] = new KeyInfo();
		}
		if(n > 0) {
			this.ch[ch].add(n);
		}
	}
	sum() {
		let s = 0;
		let k:string[] = Object.keys(this.ch);
		for(let i=0;i<k.length;i++) {
			s += this.ch[k[i]].avg();
		}
		return s;
	}
	get():string {
		let s = this.sum();
		let n = Math.random() * s;
		let k:string[] = Object.keys(this.ch);
		for(let i=0;i<k.length;i++) {
			n -= this.ch[k[i]].avg();
			if(n <= 0) {
				return k[i];
			}
		}
		alert("MAJOR FUCKIP");
		return "A";
	}
}

export class BasicGame extends MorseGame {
	private letters:number;
	protected chars:string;
	protected dist:Distr = new Distr();
        constructor(id: string, name: string, letters:number) {
		super(id,name);
		this.letters = letters;
        }
	reset() {
		super.reset();
	}
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		this._current = "";
		for(let i=0;i<this.letters;i++) {
			this._current += this.dist.get();
		}
	}
	init() {
		let l:string[] = this.chars.split("");
		for(let i=0;i<l.length;i++) {
			this.dist.add(l[i],10);
		}
	}
	add_score(score : number) {
		super.add_score(score);
		let ia:string[] = this._input.split("");
		let l:string[] = this._current.split("");
		if(score > 10) {
			score = 10;
		}
		for(let i=0;i<l.length;i++) {
			if(ia[i] == l[i]) {
				this.dist.add(l[i],score);
			} else {
				this.dist.add(l[i],10);
			}
		}
	}
}

export class Letters extends BasicGame {
        constructor(id: string, name: string, letters:number) {
		super(id,name,letters);
		this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.init();
        }
}

export class AllChars extends BasicGame {
        constructor(id: string, name: string, letters:number) {
		super(id,name,letters);
		this.chars = "KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X";
		this.init();
        }
}

export class Koch extends BasicGame {
        constructor(id: string, name: string, lesson:number) {
		super(id,name,1);
		let s:string = "KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X";
		this.chars = s.substring(0,lesson+1);
		this.init();
        }
}

export class Game {
        constructor(public name: string, public description: string, public games: MorseGame[]) {
	}
}

export class Games {
	games :Game[] = [
		new Game('Koch', 'Each new lesson adds a new letter. Practice until you reach 90% accuracy', [
				new Koch('koch1' ,'KM',1),
				new Koch('koch2' ,'U',2),
				new Koch('koch3' ,'R',3),
				new Koch('koch4' ,'E',4),
				new Koch('koch5' ,'S',5),
				new Koch('koch6' ,'N',6),
				new Koch('koch7' ,'A',7),
				new Koch('koch8' ,'P',8),
				new Koch('koch9' ,'T',9),
				new Koch('koch10','L',10),
				new Koch('koch11','W',11),
				new Koch('koch12','I',12),
				new Koch('koch13','.',13),
				new Koch('koch14','J',14),
				new Koch('koch15','Z',15),
				new Koch('koch16','=',16),
				new Koch('koch17','F',17),
				new Koch('koch18','O',18),
				new Koch('koch19','Y',19),
				new Koch('koch20',',',20),
				new Koch('koch21','V',21),
				new Koch('koch22','G',22),
				new Koch('koch23','5',23),
				new Koch('koch24','/',24),
				new Koch('koch25','Q',25),
				new Koch('koch26','9',26),
				new Koch('koch27','2',27),
				new Koch('koch28','H',28),
				new Koch('koch29','3',29),
				new Koch('koch30','8',30),
				new Koch('koch31','B',31),
				new Koch('koch32','?',32),
				new Koch('koch33','4',33),
				new Koch('koch34','7',34),
				new Koch('koch35','C',35),
				new Koch('koch36','1',36),
				new Koch('koch37','D',37),
				new Koch('koch38','6',38),
				new Koch('koch39','0',39),
				new Koch('koch40','X',40),
			]),
		new Game('All Letters','Number of letters in a row',[
				new Letters('letters','1',1),
				new Letters('twoLetters','2',2),
				new Letters('threeLetters','3',3),
				new Letters('fourLetters','4',4),
				new Letters('fiveLetters','5',5),
			]),
		new Game('All Chars','Number in a row',[
				new AllChars('chars','1',1),
				new AllChars('twoChars','2',2),
				new AllChars('threeChars','3',3),
				new AllChars('fourChars','4',4),
				new AllChars('fiveChars','5',5),
			]),
	];
}

