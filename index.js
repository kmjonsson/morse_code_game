
$(function() {
	let game = new MorseGame.Game();
	let html = "";
	for (let i = 0; i < game.games.length; i++) {
		html += '<a class="game" href="play.html?' + game.games[i].id + '">' + 
		game.games[i].name+'</a><br>\n';
	}
	$("#games").html(html);
	$("body").on('click','a.game', function() {
		document.location = $(this).attr("href")
		+ "/" + $("select[name=count]").val()
		+ "/" + $("select[name=pitch]").val()
		+ "/" + $("select[name=wpm]").val()
		+ "/" + $("select[name=fwpm]").val();
		return false;
	});
});
