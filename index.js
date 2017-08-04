
$(function() {
	let game = new MorseGame.Game();
	let html = "";
	let gamelength = [10,20,50,100,250];
	for (let i = 0; i < game.games.length; i++) {
		html += game.games[i].name + " ";
		for (let j = 0; j < gamelength.length; j++) {
			html += '<a href="play.html?' + game.games[i].id + '/' + gamelength[j] +'">[' + gamelength[j] + ']</a> ';
		}
		html += "<br>\n";
	}
	$("#games").html(html);
});
