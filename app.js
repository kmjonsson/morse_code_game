var repeat_time = 3000;
var start_time = 3000;
var next_time = 1000;

function update_score_board(game) {
	$("#cnt").html(game.count());
	$("#score").html(game.score().toFixed(2));
	$("#correct").html(game.correct());
	$("#current").html(game.current());
	$("#left").html(game.count()-game.at()+1);
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
        var morse = new MorsePlayer.MorsePlayer(ctx,550,20,10);
        var kbd = new Keyboard.Keyboard('#keyboard');
	var morsegame = new MorseGame.Game();
	var game = morsegame.games[0];
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
			update_score_board(game);
			game.next();
			if(!game.done()) {
				set_time = true;
				play_timer = setTimeout(function() {
					play(morse,game);
				}, next_time);
			} else {
				alert("Percent: " + game.correct()*100/game.count()
					+ "\nScore: " + game.score().toFixed(2));
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
	update_score_board(game);
	play_timer = setTimeout(function() {
		play(morse,game);
	}, start_time);
});
