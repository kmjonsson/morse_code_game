
function update_bg() {
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

$(function() {
	let game = new MorseGame.Games();
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
	$("body").on('click','a.game', function() {
		document.location = $(this).attr("href")
		+ "/" + $("select[name=count]").val()
		+ "/" + $("select[name=pitch]").val()
		+ "/" + $("select[name=wpm]").val()
		+ "/" + $("select[name=fwpm]").val();
		return false;
	});
	$("#acceptButton").click(function() {
		Cookies.set('accept-cookies',"yes" , { expires: 30, path: '' });
		$("#save").click();
		setTimeout(function() {
			document.location = "#close";
		},100);
	});
	$("#save").click(function() {
		if(Cookies.get("accept-cookies") !== undefined) {
			Cookies.set('count', $("select[name=count]").val() , { expires: 30, path: '' });
			Cookies.set('pitch', $("select[name=pitch]").val() , { expires: 30, path: '' });
			Cookies.set('wpm', $("select[name=wpm]").val() , { expires: 30, path: '' });
			Cookies.set('fwpm', $("select[name=fwpm]").val() , { expires: 30, path: '' });
                        $(this).animate({ backgroundColor: "green" }, 250, function() {
                                $(this).animate({ backgroundColor: "#ddd" }, 250);
                        });

		} else {
			setTimeout(function() {
                                document.location = "#cookieDialog";
                        },100);
		}
	});
	if(Cookies.get("accept-cookies") !== undefined) {
		let count = Cookies.get('count');
		if(count === undefined) {
			count = 10;
		}
		let pitch = Cookies.get('pitch');
		if(pitch === undefined) {
			pitch = 550;
		}
		let wpm = Cookies.get('wpm');
		if(wpm === undefined) {
			wpm = 20;
		}
		let fwpm = Cookies.get('fwpm');
		if(fwpm === undefined) {
			fwpm = 10;
		}
		$("select[name=count]").val(count);
		$("select[name=pitch]").val(pitch);
		$("select[name=wpm]").val(wpm);
		$("select[name=fwpm]").val(fwpm);
	}
	setTimeout(function() { update_bg(); },100);
	$("select").change(function() { update_bg(); });
});
