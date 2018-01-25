// External libs
import $ = require("jquery");
import Cookies = require("js-cookie");

import { Games, Game } from "./game";
import { MorseGame } from "./morsegame";
import { ModalDialogs, ModalDialog } from "./modal";
import { Blink } from "./blink";

class Index {
	game: MorseGame;
	dialogs: ModalDialogs=new ModalDialogs([
			new ModalDialog('#aboutDialog'),
			new ModalDialog('#cookieDialog'),
			new ModalDialog('#setupDialog')
		]);
	constructor() {
		{ // Setup games
			let game = new Games();
			let html = "";
			for (let i = 0; i < game.games.length; i++) {
				html += "<h2>" + game.games[i].name + "</h2>";
				html += "<div>" + game.games[i].description + "</div>";
				html += "<div>";
				let games = game.games[i].games;
				for (let j = 0; j < games.length; j++) {
					html += '<a class="game" id="' + games[j].id + '" href="play.html?' + games[j].id + '">' + 
					games[j].name+'</a> ';
				}
				html += "</div>";
			}
			$("#games").html(html);
		}

		{ // Handle Cookies
			if(Cookies.get("accept-cookies") !== undefined) {
				let count:string = Cookies.get('count');
				if(count === undefined) {
					count = "10";
				}
				let randompitch:string = Cookies.get('randompitch');
				if(randompitch === undefined) {
					randompitch = "false";
				}
				let pitch:string = Cookies.get('pitch');
				if(pitch === undefined) {
					pitch = "550";
				}
				let wpm:string = Cookies.get('wpm');
				if(wpm === undefined) {
					wpm = "20";
				}
				let fwpm:string = Cookies.get('fwpm');
				if(fwpm === undefined) {
					fwpm = "10";
				}
				let repeat:string = Cookies.get('repeat');
				if(repeat === undefined) {
					repeat = "2";
				}
				let gcount:string = Cookies.get('gcount');
				if(gcount === undefined) {
					gcount = "1";
				}
				let randomgcount:string = Cookies.get('randomgcount');
				if(randomgcount === undefined) {
					randomgcount = "false";
				}
				let incdec:string = Cookies.get('incdec');
				if(incdec === undefined) {
					incdec = "false";
				}
				$("select[name=count]").val(count);
				$( "#randomPitch" ).prop( "checked", randompitch == "true" );
				$("select[name=pitch]").val(pitch);
				$("select[name=wpm]").val(wpm);
				$("select[name=fwpm]").val(fwpm);
				$("select[name=repeat]").val(repeat);
				$( "#randomGCount" ).prop( "checked", randomgcount == "true" );
				$("select[name=gcount]").val(gcount);
				$( "#incdec" ).prop( "checked", incdec == "true" );
			}
		}

		{ // update bg
			setTimeout(function() { 
				this.update_bg(); 
			}.bind(this),100);
		}

		// add game parameters to game page.
		$("body").on('click','a.game', function() {
			let p:string = "" + $("select[name=pitch]").val();
			let gc:string = "" + $("select[name=gcount]").val();
			document.location.href = $(this).attr("href")
			+ "/" + $("select[name=count]").val()
			+ "/" + (parseInt(p) * ( $('#randomPitch').prop('checked') == true ? -1 : 1 )).toLocaleString()
			+ "/" + $("select[name=wpm]").val()
			+ "/" + $("select[name=fwpm]").val()
			+ "/" + $("select[name=repeat]").val()
			+ "/" + (parseInt(gc) * ( $('#randomGCount').prop('checked') == true ? -1 : 1 ))
			+ "/" + ( $('#incdec').prop('checked') == true ? 1 : 0 )
			;
			return false;
		});

		// Accept cookies
		$("#acceptButton").click(function() {
			Cookies.set('accept-cookies',"yes" , { expires: 30, path: '' });
			$("#save").click();
			this.dialogs.close();
		}.bind(this));

		// Save config.
		$("#save").click(function() {
			if(Cookies.get("accept-cookies") !== undefined) {
				// Renew
				Cookies.set('accept-cookies',"yes" , { expires: 30, path: '' });
				Cookies.set('count', $("select[name=count]").val() , { expires: 30, path: '' });
				Cookies.set('randompitch', $("#randomPitch").prop('checked') , { expires: 30, path: '' });
				Cookies.set('pitch', $("select[name=pitch]").val() , { expires: 30, path: '' });
				Cookies.set('wpm', $("select[name=wpm]").val() , { expires: 30, path: '' });
				Cookies.set('fwpm', $("select[name=fwpm]").val() , { expires: 30, path: '' });
				Cookies.set('repeat', $("select[name=repeat]").val() , { expires: 30, path: '' });
				Cookies.set('gcount', $("select[name=gcount]").val() , { expires: 30, path: '' });
				Cookies.set('randomgcount', $("#randomGCount").prop('checked') , { expires: 30, path: '' });
				Cookies.set('incdec', $("#incdec").prop('checked') , { expires: 30, path: '' });

				// Blink save button green
				Blink.blink("#save",'clicked_green');
				setTimeout(function() { 
					this.dialogs.close();
				}.bind(this),500);	
			} else {
				this.dialogs.show("#cookieDialog");
			}
		}.bind(this));

		// Update backgrounds
		$("select").change(function() { this.update_bg(); }.bind(this));

		// Close Dialog
		$("a.close").click(function(event) {
			event.preventDefault();
			this.dialogs.close();
		}.bind(this));

		// Open Dialog
		$("button.dialog").click(function(event) {
			event.preventDefault();
			this.dialogs.show($(event.target).attr('target'));
		}.bind(this));

		// Open Dialog
		$("a.dialog").click(function(event) {
			event.preventDefault();
			this.dialogs.show($(event.target).attr('href'));
		}.bind(this));
	}
	update_bg() {
		let id_suffix = "_" + [$("select[name=count]").val(),$("select[name=wpm]").val(),
									   $("select[name=fwpm]").val(),$("select[name=repeat]").val(),
									   $("select[name=gcount]").val(),
									   ( $('#incdec').prop('checked') == true ? 1 : 0 )].join("_");
		$('a.game').each(function() {
			let id = $(this).attr('id') + id_suffix;
			let best = Cookies.getJSON(id);
			if(best !== undefined && best.percent >= 90.0) {
				$(this).addClass("above90");
			} else {
				$(this).removeClass("above90");
			}
		});
	}
}

$(function() {
	let index = new Index();
});
