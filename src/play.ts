
import $ = require("jquery");
import Cookies = require("js-cookie");

import { Games, Game } from "./game";
import { MorseGame } from "./morsegame";

import { MorsePlayer } from "../external/morse_code_player/src/morse";
import { Keyboard } from "../external/virtual_keyboard/src/keyboard";

import { ModalDialogs, ModalDialog } from "./modal";



class Play {
	repeat_time : number = 3000;
	start_time : number = 1000;
	next_time : number = 1000;

	game: MorseGame;
	pgame: Game;
	count: number;
	pitch: number;
	wpm: number;
	fwpm: number;

	play_timer:any;
	set_time:boolean = true;

	morse: MorsePlayer;
	kbd : Keyboard = new Keyboard('#keyboard');

	// in an active game?
	active:boolean = false;

	volume:number = 100;

        dialogs: ModalDialogs=new ModalDialogs([
                        new ModalDialog('#startDialog'),
                        new ModalDialog('#scoreBoard')
                ]);

	showInfo() {
		alert(JSON.stringify(this.game));
	}

	incr_volume() {
		this.volume += 10;
		if(this.volume > 100) {
			this.volume = 100;
		}
		this.save_volume();
	};

	decr_volume() {
		this.volume -= 10;
		if(this.volume < 0) {
			this.volume = 0;
		}
		this.save_volume();
	};
	load_volume() {
		let volume = Cookies.get("volume")
		if(volume !== undefined) {
			this.volume = parseInt(volume);
		}
		this.save_volume();
	}

	save_volume() {
		if(Cookies.get("accept-cookies") !== undefined) {
			Cookies.set('volume', this.volume , { expires: 30, path: '' });
		}
		this.morse.set_volume(this.volume);
		$("span.volume").html("" + this.volume);
	}

	constructor() {
		let hash=window.location.href;
		if ( hash.indexOf("?") < 0 ) {
			alert("No game :-(");
		}
		let cfg=hash.substr(hash.indexOf("?")+1).split("/");
		let game = new Games();
		for (let i = 0; i < game.games.length; i++) {
			for (let j = 0; j < game.games[i].games.length; j++) {
				if(game.games[i].games[j].id == cfg[0]) {
					if(cfg[1] !== undefined) {
						game.games[i].games[j].set_count(parseInt(cfg[1]));
					}
					this.game = game.games[i].games[j];
					this.pgame = game.games[i];
					this.count = parseInt(cfg[1]);
					this.pitch = parseInt(cfg[2]);
					this.wpm   = parseInt(cfg[3]);
					this.fwpm  = parseInt(cfg[4]);
				}
			}
		}
		if(!this.game) {
			alert("No game :(");
		}
		{ // Setup Morse player
			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
			let ctx = new AudioContext();
			this.morse = new MorsePlayer(ctx,this.pitch,this.wpm,this.fwpm);
			this.load_volume();
		}
		{ // Setup keyboard
			var self = this;
			this.kbd.on_click(function(key,obj) {
				self.click(key,obj);
			});
			this.kbd.setup();
		}

		$("span.game").html(this.game.name);
		$("span.pgame").html(this.pgame.name);
		$("span.wpm").html(""+this.wpm);
		$("span.fwpm").html(""+this.fwpm);
		$("span.count").html(""+this.count);
	}
	gamestr() {
		return [this.game.id,this.count,this.wpm,this.fwpm].join("_");
	}
	score():number {
		if(this.game.correct() == 0) {
			return 0;
		}
		return this.game.score() / this.game.correct();
	}
	percent():number {
		return this.game.correct()*100/this.game.count();
	}

	update_score_board() {
		$("span.items_cnt").html(""+this.game.count());
		$("span.score").html(this.score().toFixed(2));
		$("span.correct").html(""+this.game.correct());
		$("span.correct_percent").html(this.percent().toFixed(1));
		$("span.current").html(this.game.current());
		if(!this.game.done()) {
			$("span.items_left").html("" + (this.game.count()-this.game.at()+1) + " left, ") ;
		} else {
			$("span.items_left").html("");
		}
	}
	play() {
		let t = this.morse.play(this.game.current());
		if(this.set_time) {
			let d = new Date();
			this.game.set_start_time(d.getTime() + t*1000);
			this.set_time = false;
		}
		var self=this;
		this.play_timer = setTimeout(function() {
			self.play();
		}, this.repeat_time + t*1000);
	}
	start() {
		this.game.reset();
		this.game.next();
		this.set_time = true;
		this.update_score_board();
		this.active = true;
		var self = this;
		this.play_timer = setTimeout(function() {
			self.play();
		}, this.start_time);
	}
	stop() {
		this.active = false;
		this.pause();
	}
	pause() {
		clearTimeout(this.play_timer);
	}
	resume(next:boolean=false) {
		if(!this.active) { return; }
		let t = this.start_time;
		if(next) {
			t = this.next_time;
		}
		var self = this;
		this.play_timer = setTimeout(function() {
			self.play();
		}, t);
	}
	click(key:string,obj:any) {
		if(this.game.done()) {
			return;
		}
		this.pause();
		if(!this.active) {
			return;
		}
		let correct = this.game.event(key);
		if(correct) {
			$(obj).addClass('clicked_green');
			setTimeout(function() {
				$(obj).removeClass('clicked_green');
			},250);
		} else {
			let c = this.game.get_current_char();
			let s = '.keyboard[key="' + c + '"]';
			$(obj).addClass('clicked_red');
			setTimeout(function() {
				$(obj).removeClass('clicked_red');
			},250);
			$(s).addClass('clicked_green');
			setTimeout(function() {
				$(s).removeClass('clicked_green');
			},250);
		}
		if(this.game.goto_next()) {
			this.pause();
			this.game.next();
			this.update_score_board();
			if(!this.game.done()) {
				this.set_time = true;
				this.resume(true);
			} else {
				this.stop();
				$("span.comment").html("");
				if(Cookies.get("accept-cookies") !== undefined && this.percent() >= 90.0) {
					let best = Cookies.getJSON(this.gamestr());
					if(best === undefined) {
						best = { score: this.score(), percent: this.percent() };
						$("span.comment").html("Yes! First time reaching 90%!");
					}
					if(this.percent() > best.percent) {
						$("span.comment").html("Yes! New personal best!");
						best.percent = this.percent();
						best.score = this.score();
					}
					if(this.percent() == best.percent && this.score() < best.score) {
						$("span.comment").html("Yes! You beat your best score!");
						best.score = this.score();
					}
					Cookies.set("accept-cookies", 'yes' , { expires: 30, path: '' });
					Cookies.set(this.gamestr(), best , { expires: 30, path: '' });
				}
				this.dialogs.show("#scoreBoard");
			}
			this.update_score_board();
		}
	}
}

$(function() {
	let play = new Play();

	play.dialogs.show("#startDialog");

	document.addEventListener("visibilitychange", function() {
		if(document.visibilityState == 'hidden') {
			play.pause();
		}
		if(document.visibilityState == 'visible') {
			play.resume();
		}
	});

	$("#startButton").click(function() {
		play.dialogs.close();
		play.start();
	});
        $("#scoreBoardClose").click(function(event) {
                event.preventDefault();
                play.dialogs.show("#startDialog");
        });

	$('body').keypress(function(ev) {
		if((ev.key == 'Enter' || ev.key == " ") && play.dialogs.visable('#startDialog')) {
			$("#startButton").click();
			return;
		}
		if((ev.key == 'Escape' || ev.key == 'Enter' || ev.key == " ") && play.dialogs.visable('#scoreBoard')) {
			play.dialogs.show('#startDialog');
			return;
		}
		if(ev.key == 'Escape' && play.dialogs.visable('#startDialog')) {
			// Show index.html
			setTimeout(function() { document.location.href = "."; },100);
			return;
		}
		if(ev.key == 'Escape' && play.active) {
			play.stop();
			play.dialogs.show('#scoreBoard');
			return;
		}
		if(ev.key == '+') {
			play.incr_volume();
			return;
		}
		if(ev.key == '-') {
			play.decr_volume();
			return;
		}
		if(ev.key == '@') {
			play.showInfo();
			return;
		}
	});
});
