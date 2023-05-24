$(document).ready(function() {
	set_menu();
	$("#start_btn h1").hover(function() { $(this).css("color", "red"); }, function() { $(this).css("color", "black"); });
	$("#start_btn").on("click", function() { select("#start_btn") });

	$("#setting_btn h1").hover(function() { $(this).css("color", "red"); }, function() { $(this).css("color", "black"); });
	$("#setting_btn").on("click", function() { select("#setting_btn") });

	$("#score_btn h1").hover(function() { $(this).css("color", "red"); }, function() { $(this).css("color", "black"); });
	$("#score_btn").on("click", function() { select("#score_btn") });
});

function select( menu ) {
	$("#main").css("display", "none");
	$(menu).css("display", "block");
}

function set_menu() {
	var t = ($(window).height() - $("#start_btn").height())/20;
	var l = ($(window).width() - $("#title").width())/2;
	$("#title").css( {left: l, top: 2*t} );
	l = ($(window).width() - $("#start_btn").width())/2;
	$("#start_btn").css( {left: l, top: 10*t} );
	l = ($(window).width() - $("#setting_btn").width())/2;
	$("#setting_btn").css( {left: l, top: 14*t} );
	l = ($(window).width() - $("#score_btn").width())/2;
	$("#score_btn").css( {left: l, top: 18*t} );
}