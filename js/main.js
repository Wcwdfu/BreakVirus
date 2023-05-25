$(document).ready(function() {
	set_menu();
	$("#start_btn h1").hover(function() { $(this).css("color", "red"); }, function() { $(this).css("color", "black"); });

	$("#setting_btn h1").hover(function() { $(this).css("color", "red"); }, function() { $(this).css("color", "black"); });

	$("#how_to_play_btn h1").hover(function() { $(this).css("color", "red"); }, function() { $(this).css("color", "black"); });

	// Start 버튼 클릭
	$("#start_btn").click(function() {
		window.location.href = "phase1.html";
	});

	// Setting 버튼 클릭
	$("#setting_btn").click(function() {
		$("#main").css("display", "none");
		$("#setting_screen").show();
	});

	// How to play 버튼 클릭
	$("#how_to_play_btn").click(function() {
		$("#main").css("display", "none");
		$("#how_to_play_screen").show();
	});

	// 설정창에서 Confirm 버튼 클릭
	$("#setting_confirm_btn").click(function() {
		$("#setting_screen").hide();
		$("#main").css("display", "block");
	});

	// 설정창 화면에서 Back 버튼 클릭
	$("#setting_back_btn").click(function() {
		$("#setting_screen").hide();
		$("#main").css("display", "block");
	});

	// How to play 화면에서 Back 버튼 클릭
	$("#how_to_play_back_btn").click(function() {
		$("#how_to_play_screen").hide();
		$("#main").css("display", "block");
	});
	  
});

function set_menu() {
	var t = ($(window).height() - $("#start_btn").height())/20;
	var l = ($(window).width() - $("#title").width())/2;
	$("#title").css( {left: l, top: 2*t} );
	l = ($(window).width() - $("#start_btn").width())/2;
	$("#start_btn").css( {left: l, top: 10*t} );
	l = ($(window).width() - $("#setting_btn").width())/2;
	$("#setting_btn").css( {left: l, top: 14*t} );
	l = ($(window).width() - $("#how_to_play_btn").width())/2;
	$("#how_to_play_btn").css( {left: l, top: 18*t} );
}