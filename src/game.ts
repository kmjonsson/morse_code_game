
import { MorseGame } from "./morsegame";

class KeyInfo {
	private max:number = 3;
	private values:number[] = [];
	add(n:number) {
		this.values.push(n);
		while(this.values.length > this.max) {
			this.values.shift();
		}
	}
	avg():number {
		let v = this.values.reduce(function(x,v) { return x + v },0) / this.values.length || 0;
		if(v == 0) {
			return 0;
		}
		return Math.pow(2,v);
	}
	count():number {
		return this.values.length;
	}
}

class Distribution {
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
		return Object.keys(this.ch).reduce(function(sum,value) {
			if(this.ch[value].count()-1 > this.min()) {
				return sum;
			}
			return sum + this.ch[value].avg()
		}.bind(this),0);
	}
	min() {
		return Object.keys(this.ch).reduce(function(min,value) {
			if(min > this.ch[value].count()) {
				return this.ch[value].count();
			}
			return min;
		}.bind(this),Number.MAX_VALUE);
	}
	get():string {
		let n = Math.random() * this.sum();
		return Object.keys(this.ch).reduce(function(s,x) {
			if(this.ch[x].count()-1 > this.min()) {
				return s;
			}
			n -= this.ch[x].avg();
			if(n <= 0) {
				return s.concat(x);
			}
			return s;
		}.bind(this),[]).shift();
	}
}

export class BasicGame extends MorseGame {
	private letters:number;
	protected chars:string;
	protected dist:Distribution = new Distribution();
    constructor(id: string, name: string) {
		super(id,name);
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
		let gc = this.gcount();
		if(gc < 0) {
			gc = Math.floor(Math.random() * -gc) + 1;
		}
		for(let i=0;i<gc;i++) {
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

export class Calls extends BasicGame {
	private pfix:string[] = [ 'SM', 'VK', 'PY', 'S5', 'OK', 'EA', 'OH0', 'SA','SB','SK','SL','SM', 
				'HB9', 'ES', 'OZ', 'OE', 'EI', 'LU', 'HS', 'A','K','N','W', 'PA', 
				'SV', 'I', 'ZS', 'JA', 'EA8', 'YL', 'SP', 'ON', 'LA', 'OH', 'DL', 
				'LY', 'G','M', 'CT', 'TA', 'F', 'UA','RA', 'ZL', '5B', 'VE' ];
	protected dist:Distribution = new Distribution();
	extra:number = 1;
    constructor(id: string, name: string, extra:number) {
		super(id,name);
		this.extra = extra;
		this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.init();
    }
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let n = Math.floor(Math.random() * this.pfix.length);
		this._current = this.pfix[n] + Math.floor(Math.random() * 10);
		for(let i=0;i<this.extra;i++) {
			this._current += this.dist.get();
		}
	}
}

export class QCode extends MorseGame {
	private qc:string[] = [ 'QRK', 'QRK?', 'QRM', 'QRM?', 'QRN', 'QRN?', 'QRO', 'QRO?',
				'QRP', 'QRP?', 'QRS', 'QRS?', 'QRT', 'QRT?', 'QRV', 'QRV?',
				'QRX', 'QRX?', 'QRZ', 'QRZ?', 'QSB', 'QSB?', 'QSL', 'QSL?',
				'QSO', 'QSO?', 'QSY', 'QSY?', 'QTH', 'QTH?' ];
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let n = Math.floor(Math.random() * this.qc.length);
		this._current = this.qc[n];
	}
}

export class Abbreviation extends MorseGame {
	private qc:string[] = [ 'DE', 'TX', 'R', 'RX', 'BK', 'K', 'CQ', 'PSE', 'CW', 'UR', 'RST', 'MSG' ];
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let n = Math.floor(Math.random() * this.qc.length);
		this._current = this.qc[n];
	}
}

export class Words extends MorseGame {
	private qc:string[] = [ 'A', 'ABOUT', 'ALL', 'ALSO', 'AND', 'AS', 'AT', 'BE', 'BECAUSE',
		'BUT', 'BY', 'CAN', 'COME', 'COULD', 'DAY', 'DO', 'EVEN', 'FIND', 'FIRST', 'FOR',
		'FROM', 'GET', 'GIVE', 'GO', 'HAVE', 'HE', 'HER', 'HERE', 'HIM', 'HIS', 'HOW', 'I',
		'IF', 'IN', 'INTO', 'IT', 'ITS', 'JUST', 'KNOW', 'LIKE', 'LOOK', 'MAKE', 'MAN', 'MANY',
		'ME', 'MORE', 'MY', 'NEW', 'NO', 'NOT', 'NOW', 'OF', 'ON', 'ONE', 'ONLY', 'OR', 'OTHER',
		'OUR', 'OUT', 'PEOPLE', 'SAY', 'SEE', 'SHE', 'SO', 'SOME', 'TAKE', 'TELL', 'THAN',
		'THAT', 'THE', 'THEIR', 'THEM', 'THEN', 'THERE', 'THESE', 'THEY', 'THING', 'THINK',
		'THIS', 'THOSE', 'TIME', 'TO', 'TWO', 'UP', 'USE', 'VERY', 'WANT', 'WAY', 'WE',
		'WELL', 'WHAT', 'WHEN', 'WHICH', 'WHO', 'WILL', 'WITH', 'WOULD', 'YEAR', 'YOU', 'YOUR' ];
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let n = Math.floor(Math.random() * this.qc.length);
		this._current = this.qc[n];
	}
}


export class SwLetters extends BasicGame {
    constructor(id: string, name: string) {
		super(id,name);
		this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZÅÄÖ";
		this.init();
    }
}

export class Letters extends BasicGame {
    constructor(id: string, name: string) {
		super(id,name);
		this.chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		this.init();
    }
}

export class AllChars extends BasicGame {
    constructor(id: string, name: string) {
		super(id,name);
		this.chars = "KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X#+";
		this.init();
    }
}

export class Koch extends BasicGame {
	private lesson:number;
        constructor(id: string, name: string, lesson:number) {
		super(id,name);
		this.lesson = lesson;
		let s:string = "KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X";
		this.chars = s.substring(0,lesson+1);
		this.init();
    }
	init() {
		let l:string[] = this.chars.split("");
		for(let i=0;i<l.length;i++) {
			if(i < 2) {
				this.dist.add(l[i],1);
			} else {
				this.dist.add(l[i],1+(i*9.0/l.length));
			}
		}
	}
}

export class Sq extends BasicGame {
	private lesson:number;
        constructor(id: string, name: string, lesson:number) {
		super(id,name);
		this.lesson = lesson;
		let s:string = "=+NLOEIXVT/?AZHÖ#,RDFY-XÄBPSUQWKÅM7495XGJ813620~@";
		this.chars = s.substring(0,lesson+1);
		this.init();
    }
	init() {
		let l:string[] = this.chars.split("");
		for(let i=0;i<l.length;i++) {
			if(i < 2 || i < l.length-2) {
				this.dist.add(l[i],1);
			} else {
				this.dist.add(l[i],1+(i*9.0/l.length));
			}
		}
	}
}

export class Specials extends BasicGame {
	private lesson:number;
        constructor(id: string, name: string) {
		super(id,name);
		this.chars = "=+/?,.-~@#";
		this.init();
        }
}

export class Numbers extends BasicGame {
	private lesson:number;
        constructor(id: string, name: string) {
		super(id,name);
		this.chars = "0123456789";
		this.init();
        }
}

// <br/>
export class Br extends MorseGame { }
let br = new Br('br','<br/>');

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
		new Game('SK4SQ morse course order', 'Each new lesson adds a new letter. Practice until you reach 90% accuracy', [
				new Sq('sq1' ,'=+',1),
				new Sq('sq2' ,'N',2),
				new Sq('sq3' ,'L',3),
				new Sq('sq4' ,'O',4),
				new Sq('sq5' ,'E',5),
				new Sq('sq6' ,'I',6),
				new Sq('sq7' ,'X',7),
				new Sq('sq8' ,'V',8),
				new Sq('sq9' ,'T',9),
				new Sq('sq10','/',10),
				new Sq('sq11','?',11),
				new Sq('sq12','A',12),
				new Sq('sq13','Z',13),
				new Sq('sq14','H',14),
				new Sq('sq15','Ö',15),
				new Sq('sq16',"#",16),
				new Sq('sq17',',',17),
				new Sq('sq18','R',18),
				new Sq('sq19','D',19),
				new Sq('sq20','F',20),
				new Sq('sq21','Y',21),
				new Sq('sq22','-',22),
				new Sq('sq23','X',23),
				new Sq('sq24','Ä',24),
				new Sq('sq25','B',25),
				new Sq('sq26','P',26),
				new Sq('sq27','S',27),
				new Sq('sq28','U',28),
				new Sq('sq29','Q',29),
				new Sq('sq30','W',30),
				new Sq('sq31','K',31),
				new Sq('sq32','Å',32),
				new Sq('sq33','M',33),
				new Sq('sq34','7',34),
				new Sq('sq35','4',35),
				new Sq('sq36','9',36),
				new Sq('sq37','5',37),
				new Sq('sq38','X',38),
				new Sq('sq39','G',39),
				new Sq('sq40','J',40),
				new Sq('sq41','8',41),
				new Sq('sq42','1',42),
				new Sq('sq43','3',43),
				new Sq('sq44','6',44),
				new Sq('sq45','2',45),
				new Sq('sq46','0',46),
				new Sq('sq47','~',47),
				new Sq('sq48','@',48),
			]),
		new Game('All Letters','A-Z',[
				new Letters('letters','A-Z'),
				new SwLetters('swletters','A-Z ÅÄÖ'),
			]),
		new Game('All Chars','A-Z 0-9 =/+.,-#@',[
				new AllChars('chars','chars'),
			]),
		new Game('Other','Learn your',[
				new QCode('qcode','QCodes'),
				new Abbreviation('abbreviation','Abbreviation'),
				new Words('words','100 words'),
				new Specials('specials','Specials'),
				new Numbers('numbers','Numbers'),
				br,
				new Calls('call1','Calls, 1 in suffix',1),
				new Calls('call2','Calls, 2 in suffix',2),
				new Calls('call3','Calls, 3 in suffix',3),
			]),
	];
}

