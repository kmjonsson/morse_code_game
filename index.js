
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
});
