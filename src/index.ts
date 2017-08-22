
import $ = require("jquery");
import Cookies = require("js-cookie");
import { Games, Game } from "./game";
import { MorseGame } from "./morsegame";
import { ModalDialogs, ModalDialog } from "./modal";

class Index {
	game: MorseGame;
	dialogs: ModalDialogs=new ModalDialogs([
			new ModalDialog('#aboutDialog'),
			new ModalDialog('#cookieDialog')
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
				$("select[name=count]").val(count);
				$("select[name=pitch]").val(pitch);
				$("select[name=wpm]").val(wpm);
				$("select[name=fwpm]").val(fwpm);
			}
		}
		{ // update bg
			var self=this;
			setTimeout(function() { 
				self.update_bg(); 
			},100);
		}
	}
	update_bg() {
		let id_suffix = "_" + [$("select[name=count]").val(),$("select[name=wpm]").val(),$("select[name=fwpm]").val()].join("_");
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
	$("body").on('click','a.game', function() {
		document.location.href = $(this).attr("href")
		+ "/" + $("select[name=count]").val()
		+ "/" + $("select[name=pitch]").val()
		+ "/" + $("select[name=wpm]").val()
		+ "/" + $("select[name=fwpm]").val();
		return false;
	});
	$("#acceptButton").click(function() {
		Cookies.set('accept-cookies',"yes" , { expires: 30, path: '' });
		$("#save").click();
		index.dialogs.close();
	});
	$("#save").click(function() {
		if(Cookies.get("accept-cookies") !== undefined) {
			// Renew
			Cookies.set('accept-cookies',"yes" , { expires: 30, path: '' });
			Cookies.set('count', $("select[name=count]").val() , { expires: 30, path: '' });
			Cookies.set('pitch', $("select[name=pitch]").val() , { expires: 30, path: '' });
			Cookies.set('wpm', $("select[name=wpm]").val() , { expires: 30, path: '' });
			Cookies.set('fwpm', $("select[name=fwpm]").val() , { expires: 30, path: '' });

			// Blink save button green
			var self=this;
			$(self).addClass('clicked_green');
			setTimeout(function() {
				$(self).removeClass('clicked_green');
			},250);
		} else {
			index.dialogs.show("#cookieDialog");
		}
	});

	// Update backgrounds
	$("select").change(function() { index.update_bg(); });

	// Close Dialog
	$("a.close").click(function(event) {
		event.preventDefault();
		index.dialogs.close();
	});

	// Open Dialog
	$("a.dialog").click(function(event) {
		event.preventDefault();
		index.dialogs.show($(this).attr('href'));
	});
});
