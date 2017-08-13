var repeat_time = 3000;
var start_time = 1000;
var next_time = 1000;

function get_game(game) {
	let hash=window.location.href;
	if ( hash.indexOf("#") > -1 ) {
		hash=hash.substr(0,hash.indexOf("#"));
	}
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
	$(".items_cnt").html(game.count());
	if(game.correct() > 0) {
		$(".score").html((game.score() / game.correct()).toFixed(2));
	} else {
		$(".score").html("0.00");
	}
	$(".correct").html(game.correct());
	$(".correct_percent").html((game.correct()*100/game.count()).toFixed(1));
	$(".current").html(game.current());
	if(!game.done()) {
		$(".items_left").html("" + (game.count()-game.at()+1) + " left, ") ;
	} else {
		$(".items_left").html("");
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

function start(morse,game) {
	game.reset();
	game.next();
	set_time = true;
	update_score_board(game);
	play_timer = setTimeout(function() {
		play(morse,game);
	}, start_time);
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
	$("span.game").html(game.name);
	$("span.wpm").html(cfg.wpm);
	$("span.fwpm").html(cfg.fwpm);
	$("span.count").html(cfg.count);
	
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
		if(!(""+document.location).match(/#play/)) {
			return;
		}
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
				setTimeout(function() {
					document.location = "#scoreBoard";
				},1000);
			}
			update_score_board(game);
		}
        });
        kbd.setup();
	$("#startButton").click(function() {
		document.location = "#play";
		start(morse,game);
	});
	setTimeout(function() {
		document.location = "#startDialog";
	},100);
	$('body').keypress(function(ev) {
		if((ev.key == 'Enter' || ev.key == " ")
			&& (""+document.location).match(/#startDialog/)) {
			document.location = "#play";
			start(morse,game);
			return;
		}
		if((ev.key == 'Escape' || ev.key == 'Enter' || ev.key == " ")
			&& (""+document.location).match(/#scoreBoard/)) {
			document.location = "#startDialog";
			return;
		}
		if(ev.key == 'Escape'
			&& (""+document.location).match(/#startDialog/)) {
			setTimeout(function() {
				document.location = "index.html";
			},100);
			return;
		}
		if(ev.key == 'Escape'
			&& (""+document.location).match(/#play/)) {
			clearTimeout(play_timer);
			setTimeout(function() {
				document.location = "#scoreBoard";
			},100);
			return;
		}
	});
});
