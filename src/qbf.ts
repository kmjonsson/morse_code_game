
// External libs
import $ = require("jquery");
import Cookies = require("js-cookie");

import { MorsePlayer } from "../external/morse_code_player/src/morse";

class QBF {
	private repeat_time : number = 5000;
	private start_time : number = 1000;
	private next_time : number = 1000;

	private pitch: number;
	private wpm: number;
	private fwpm: number;

	private morse: MorsePlayer;

	private qbf: string      = "= THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG. = @";
	private qbf_show: string;
	private remove_order:string = "=NLOEIXVTAZHRDFYXBPSUQWKMXGJ@";
	private remove_id:number = 0;

	private play_timer:any;

	constructor() {
		let hash=window.location.href;
		if ( hash.indexOf("?") < 0 ) {
			alert("No game :-(");
		}
		let cfg=hash.substr(hash.indexOf("?")+1).split("/");

		this.qbf_show = this.qbf;

		this.pitch = parseInt(cfg[0]);
		this.wpm   = parseInt(cfg[1]);
		this.fwpm  = parseInt(cfg[2]);

		{ // Setup Morse player
			//window.AudioContext = window.AudioContext || window.webkitAudioContext;
			let ctx = new AudioContext();
			this.morse = new MorsePlayer(ctx,this.pitch,this.wpm,this.fwpm);
			//this.load_volume();
		}

		// play the fox :-)
		this.update_html();
		this.start();
	}
	update_html() {
		$("#qbf").html(this.qbf_show);
	}
	update_qbf() {
		let c = (this.remove_order.split(''))[this.remove_id];
		console.log(c,this.remove_id);
		if(c === undefined || c === null) {
			return 1;
		}
		this.remove_id++;
		let re = new RegExp(c,"g");
		this.qbf_show = this.qbf_show.replace(re,"#");
		this.update_html();
		return 0;
	}
	play() {
		let t = this.morse.play(this.qbf);
		this.play_timer = setTimeout(function() {
				if(!this.update_qbf()) {
					this.play();
				}
			}.bind(this), this.repeat_time + t*1000);
	}
	start() {
		this.play_timer = setTimeout(function() {
			this.play();
		}.bind(this), this.start_time);
	}
	stop() {
		this.pause();
	}
	pause() {
		clearTimeout(this.play_timer);
	}
}

// Start the game :-)
$(function() {
	let qbf = new QBF();
});
