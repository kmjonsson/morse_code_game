
// External libs
import $ = require("jquery");
import Cookies = require("js-cookie");

import { Games, Game } from "./game";
import { MorseGame } from "./morsegame";
import { MorsePlayer } from "../external/morse_code_player/src/morse";
import { Keyboard } from "../external/virtual_keyboard/src/keyboard";
import { ModalDialogs, ModalDialog } from "./modal";

class Play {
	private repeat_time : number = 3000;
	private start_time : number = 1000;
	private next_time : number = 1000;

	private game: MorseGame;
	private pgame: Game;
	private count: number;
	private pitch: number;
	private wpm: number;
	private fwpm: number;

	private play_timer:any;
	private set_time:boolean = true;

	private morse: MorsePlayer;
	private kbd : Keyboard = new Keyboard('#keyboard');

	// in an active game?
	public active:boolean = false;

	private volume:number = 100;

        public dialogs: ModalDialogs=new ModalDialogs([
                        new ModalDialog('#startDialog'),
                        new ModalDialog('#scoreBoard')
                ]);

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

		this.dialogs.show("#startDialog");

		// On key press
		var play=this;
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
				play.set_volume(10);
				return;
			}
			if(ev.key == '-') {
				play.set_volume(-10);
				return;
			}

			// Debug
			if(ev.key == '@') {
				play.showInfo();
				return;
			}
		});
		document.addEventListener("visibilitychange", function() {
			if(document.visibilityState == 'hidden') {
				play.pause();
			}
			if(document.visibilityState == 'visible') {
				play.resume();
			}
		});
		// Check for action on the startbutton
		$("#startButton").click(function() {
			play.dialogs.close();
			play.start();
		});
		// Check if the scoreboard are closed.
		$("#scoreBoardClose").click(function(event) {
			event.preventDefault();
			play.dialogs.show("#startDialog");
		});
	}
	gamestr() {
		return [this.game.id,this.count,this.wpm,this.fwpm].join("_");
	}
	// Update html
	update_html() {
		$("span.items_cnt").html(""+this.game.count());
		$("span.score").html(this.game.score().toFixed(2));
		$("span.correct").html(""+this.game.correct());
		$("span.correct_percent").html(this.game.percent().toFixed(1));
		$("span.current").html(this.game.current());
		// TODO: Fix left kludge
		let left = (this.game.count()-this.game.at()+1);
		if(left > this.game.count()) { left = this.game.count() }
		if(!this.game.done()) {
			$("span.items_left").html("" + left + " left, ") ;
		} else {
			$("span.items_left").html("");
		}
		
		$("span.game").html(this.game.name);
		$("span.pgame").html(this.pgame.name);
		$("span.wpm").html(""+this.wpm);
		$("span.fwpm").html(""+this.fwpm);
		$("span.count").html(""+this.count);

		$("span.volume").html("" + this.volume);
	}
	play() {
		let t = this.morse.play(this.game.current());
		if(this.set_time) {
			let d = new Date();
			this.game.set_start_time(d.getTime() + t*1000);
			this.set_time = false;
		}
		// Start repeat in repeate_time ms after laste pip
		var self=this;
		this.play_timer = setTimeout(function() {
			self.play();
		}, this.repeat_time + t*1000);
	}
	start() {
		this.game.reset();
		this.game.next();
		this.set_time = true;
		this.update_html();
		this.active = true;
		// Start game in start_time ms
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

	blink(obj:any, css:string) {
		$(obj).addClass(css);
		setTimeout(function() {
			$(obj).removeClass(css);
		},250);
	}

	click(key:string,obj:any) {
		this.pause();
		if(this.game.done() || !this.active) {
			return;
		}
		let correct = this.game.event(key);
		if(correct) {
			this.blink(obj,'clicked_green');
		} else {
			this.blink(obj,'clicked_red');
			this.blink('.keyboard[key="' + this.game.get_current_char() + '"]','clicked_green');
		}
		if(this.game.goto_next()) {
			this.pause();
			this.game.next();
			if(!this.game.done()) {
				this.set_time = true;
				this.resume(true);
			} else {
				this.stop();
				let comment="";
				if(Cookies.get("accept-cookies") !== undefined && this.game.percent() >= 90.0) {
					let best = Cookies.getJSON(this.gamestr());
					if(best === undefined) {
						best = { score: this.game.score(), percent: this.game.percent() };
						comment = "Yes! First time reaching 90%!";
					}
					if(this.game.percent() > best.percent) {
						comment = "Yes! New personal best!";
						best.percent = this.game.percent();
						best.score = this.game.score();
					}
					if(this.game.percent() == best.percent && this.game.score() < best.score) {
						comment = "Yes! You beat your best score!";
						best.score = this.game.score();
					}
					Cookies.set("accept-cookies", 'yes' , { expires: 30, path: '' });
					Cookies.set(this.gamestr(), best , { expires: 30, path: '' });
				}
				$("span.comment").html(comment);
				this.dialogs.show("#scoreBoard");
			}
			this.update_html();
		}
	}

	// Debug
	showInfo() {
		alert(JSON.stringify(this.game));
	}

	// Volume stuff
	set_volume(dv:number) {
		this.volume += dv;
		if(this.volume > 100) { this.volume = 100; }
		if(this.volume < 0) { this.volume = 0; }
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
		this.update_html();
	}
}

// Start the game :-)
$(function() {
	let play = new Play();
});