var repeat_time = 3000;
var start_time = 3000;
var next_time = 1000;

function get_game(game) {
	let hash=window.location.href;
	if ( hash.indexOf("?") > -1 ) {
		let cfg=hash.substr(hash.indexOf("?")+1).split("/");
		for (i = 0; i < game.games.length; i++) {
			if(game.games[i].id == cfg[0]) {
				if(cfg[1] !== undefined) {
					game.games[i].set_count(cfg[1]);
				}
				return { "game" : game.games[i], "count": cfg[1],
					"pitch": cfg[2],
					"wpm": cfg[3],
					"fwpm": cfg[4] 
				};
			}
		}
	} else {
		alert("No game :-(");
	}
	return;
}

function update_score_board(game) {
	$("#cnt").html(game.count());
	$("#score").html(game.score().toFixed(2));
	$("#correct").html(game.correct());
	$("#current").html(game.current());
	if(!game.done()) {
		$("#left").html("" + (game.count()-game.at()+1) + " left, ") ;
	} else {
		$("#left").html("");
	}
}

var play_timer;
var set_time = true;
function play(morse,game) {
	let t = morse.play(game.current());
	if(set_time) {
		let d = new Date();
		game.set_start_time(d.getTime() + t*1000);
		set_time = false;
	}
	play_timer = setTimeout(function() {
		play(morse,game);
	}, repeat_time + t*1000);
}

$(function() {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        var ctx = new AudioContext();
	var morsegame = new MorseGame.Game();
	var cfg = get_game(morsegame);
	if(cfg === undefined) {
		return;
	}
	var game = cfg.game;
        var morse = new MorsePlayer.MorsePlayer(ctx,cfg.pitch,cfg.wpm,cfg.fwpm);
        var kbd = new Keyboard.Keyboard('#keyboard');
	document.addEventListener("visibilitychange", function() {
		if(document.visibilityState == 'hidden') {
			clearTimeout(play_timer);
		}
		if(document.visibilityState == 'visible') {
			play_timer = setTimeout(function() {
				play(morse,game);
			}, start_time);
		}
	});
        kbd.on_click(function(key,obj) {
		if(game.done()) {
			return;
		}
		clearTimeout(play_timer);
		let correct = game.event(key);
		if(correct) {
			$(obj).animate({ backgroundColor: "green" }, 250, function() {
				$(obj).animate({ backgroundColor: "#306090" }, 250);
			});
		} else {
			let c = game.get_current_char();
			let s = '.keyboard[key="' + c + '"]';
			$(obj).animate({ backgroundColor: "red" }, 250, function() {
				$(obj).animate({ backgroundColor: "#306090" }, 250);
			});
			$(s).animate({ backgroundColor: "green" }, 250, function() {
				$(s).animate({ backgroundColor: "#306090" }, 250);
			});
		}
		if(game.goto_next()) {
			clearTimeout(play_timer);
			game.next();
			update_score_board(game);
			if(!game.done()) {
				set_time = true;
				play_timer = setTimeout(function() {
					play(morse,game);
				}, next_time);
			} else {
				alert("Percent: " + (game.correct()*100/game.count()).toFixed(1)
					+ "%\nScore: " + game.score().toFixed(2) + "p");
				game.reset();
				game.next();
				set_time = true;
				play_timer = setTimeout(function() {
					play(morse,game);
				}, start_time);
			}
			update_score_board(game);
		}
        });
        kbd.setup();
        game.next();
	update_score_board(game);
	play_timer = setTimeout(function() {
		play(morse,game);
	}, start_time);
});
