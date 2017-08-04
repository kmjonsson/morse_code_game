
import { MorseGame } from "./morsegame";
import { CallSigns } from "./callsigns";

export class Letters extends MorseGame {
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
	games :MorseGame[] = [
		new Letters('letters','All Letters'),
		new TwoLetters('twoLetters','Two Letters'),
		new CallSigns('callSigns','Random Callsigns'),
		new Koch('kosh1' ,'Koch Lesson 1 (KM)',1),
		new Koch('kosh2' ,'Koch Lesson 2 (U)',2),
		new Koch('kosh3' ,'Koch Lesson 3 (R)',3),
		new Koch('kosh4' ,'Koch Lesson 4 (E)',4),
		new Koch('kosh5' ,'Koch Lesson 5 (S)',5),
		new Koch('kosh6' ,'Koch Lesson 6 (N)',6),
		new Koch('kosh7' ,'Koch Lesson 7 (A)',7),
		new Koch('kosh8' ,'Koch Lesson 8 (P)',8),
		new Koch('kosh9' ,'Koch Lesson 9 (T)',9),
		new Koch('kosh10','Koch Lesson 10 (L)',10),
		new Koch('kosh11','Koch Lesson 11 (W)',11),
		new Koch('kosh12','Koch Lesson 12 (I)',12),
		new Koch('kosh13','Koch Lesson 13 (.)',13),
		new Koch('kosh14','Koch Lesson 14 (J)',14),
		new Koch('kosh15','Koch Lesson 15 (Z)',15),
		new Koch('kosh16','Koch Lesson 16 (=)',16),
		new Koch('kosh17','Koch Lesson 17 (F)',17),
		new Koch('kosh18','Koch Lesson 18 (O)',18),
		new Koch('kosh19','Koch Lesson 19 (Y)',19),
		new Koch('kosh20','Koch Lesson 20 (,)',20),
		new Koch('kosh21','Koch Lesson 21 (V)',21),
		new Koch('kosh22','Koch Lesson 22 (G)',22),
		new Koch('kosh23','Koch Lesson 23 (5)',23),
		new Koch('kosh24','Koch Lesson 24 (/)',24),
		new Koch('kosh25','Koch Lesson 25 (Q)',25),
		new Koch('kosh26','Koch Lesson 26 (9)',26),
		new Koch('kosh27','Koch Lesson 27 (2)',27),
		new Koch('kosh28','Koch Lesson 28 (H)',28),
		new Koch('kosh29','Koch Lesson 29 (3)',29),
		new Koch('kosh30','Koch Lesson 30 (8)',30),
		new Koch('kosh31','Koch Lesson 31 (B)',31),
		new Koch('kosh32','Koch Lesson 32 (?)',32),
		new Koch('kosh33','Koch Lesson 33 (4)',33),
		new Koch('kosh34','Koch Lesson 34 (7)',34),
		new Koch('kosh35','Koch Lesson 35 (C)',35),
		new Koch('kosh36','Koch Lesson 36 (1)',36),
		new Koch('kosh37','Koch Lesson 37 (D)',37),
		new Koch('kosh38','Koch Lesson 38 (6)',38),
		new Koch('kosh39','Koch Lesson 39 (0)',39),
		new Koch('kosh40','Koch Lesson 40 (X)',40),
	];
}

