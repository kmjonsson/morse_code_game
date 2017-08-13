
import { MorseGame } from "./morsegame";
import { CallSigns } from "./callsigns";

export class Letters extends MorseGame {
	private letters:number;
        constructor(id: string, name: string, letters:number) {
		super(id,name);
		this.letters = letters;
        }
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let s:string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		let l:string[] = s.split("");
		this._current = "";
		for(let i=0;i<this.letters;i++) {
			this._current += l[Math.floor((Math.random() * s.length))];
		}
	}
}

export class Koch extends MorseGame {
	private lesson:number;
        constructor(id: string, name: string, lesson:number) {
		super(id,name);
		this.lesson = lesson;
        }
	next() {
		if(this.done()) {
			return;
		}
		super.next();
		let s:string = "KMURESNAPTLWI.JZ=FOY,VG5/Q92H38B?47C1D60X";
		let l:string[] = s.split("");
		this._current = l[Math.floor(Math.random() * (1+this.lesson))];
	}
}

export class Game {
        constructor(public name: string, public description: string, public games: MorseGame[]) {
	}
}

export class Games {
	games :Game[] = [
		new Game('Koch', 'Each new lesson adds a new letter. Practice until you reach 90% accuracy', [
				new Koch('kosh1' ,'KM',1),
				new Koch('kosh2' ,'U',2),
				new Koch('kosh3' ,'R',3),
				new Koch('kosh4' ,'E',4),
				new Koch('kosh5' ,'S',5),
				new Koch('kosh6' ,'N',6),
				new Koch('kosh7' ,'A',7),
				new Koch('kosh8' ,'P',8),
				new Koch('kosh9' ,'T',9),
				new Koch('kosh10','L',10),
				new Koch('kosh11','W',11),
				new Koch('kosh12','I',12),
				new Koch('kosh13','.',13),
				new Koch('kosh14','J',14),
				new Koch('kosh15','Z',15),
				new Koch('kosh16','=',16),
				new Koch('kosh17','F',17),
				new Koch('kosh18','O',18),
				new Koch('kosh19','Y',19),
				new Koch('kosh20',',',20),
				new Koch('kosh21','V',21),
				new Koch('kosh22','G',22),
				new Koch('kosh23','5',23),
				new Koch('kosh24','/',24),
				new Koch('kosh25','Q',25),
				new Koch('kosh26','9',26),
				new Koch('kosh27','2',27),
				new Koch('kosh28','H',28),
				new Koch('kosh29','3',29),
				new Koch('kosh30','8',30),
				new Koch('kosh31','B',31),
				new Koch('kosh32','?',32),
				new Koch('kosh33','4',33),
				new Koch('kosh34','7',34),
				new Koch('kosh35','C',35),
				new Koch('kosh36','1',36),
				new Koch('kosh37','D',37),
				new Koch('kosh38','6',38),
				new Koch('kosh39','0',39),
				new Koch('kosh40','X',40),
			]),
		new Game('All Letters','Number of letters in a row',[
				new Letters('letters','1',1),
				new Letters('twoLetters','2',2),
				new Letters('threeLetters','3',3),
				new Letters('fourLetters','4',4),
				new Letters('fiveLetters','5',5),
			]),
		new Game('Random Call Signs','Complete callsigns from MASTER-files',[
				new CallSigns('callSigns','Random Callsigns'),
			]),
	];
}

