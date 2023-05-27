$(document).ready(function() {

	$("#start_btn img").hover(
		function() {
			$("#start_btn img").attr("src", "img/mainImg/start_2.png");
			playHoverSound();
		  }, function() {
			$("#start_btn img").attr("src", "img/mainImg/start_1.png");
		  });

	$("#settings_btn img").hover(
		function() {
			$("#settings_btn img").attr("src", "img/mainImg/settings_2.png");
			playHoverSound();
		}, function() { 
			$("#settings_btn img").attr("src", "img/mainImg/settings_1.png");
		});

	$("#how_to_play_btn img").hover(
		function() {
		$("#how_to_play_btn img").attr("src", "img/mainImg/htp_2.png");
		playHoverSound();
	}, function() { 
		$("#how_to_play_btn img").attr("src", "img/mainImg/htp_1.png");
	});

	// hover시 효과음
	function playHoverSound() {
        var audio = document.getElementById("hover_sound");
        audio.currentTime = 0;
        audio.play();
      }

	// Start 버튼 클릭
	$("#start_btn").click(function() {
		window.location.href = "phase1.html";
	});

	// Setting 버튼 클릭
	$("#settings_btn").click(function() {
		$("#main").hide();
		$("#setting_screen").show();
	});

	// How to play 버튼 클릭
	$("#how_to_play_btn").click(function() {
		$("#main").hide();
		$("#how_to_play_screen").show();
	});

	// 설정창에서 Confirm 버튼 클릭
	$("#setting_confirm_btn").click(function() {
		$("#setting_screen").hide();
		$("#main").show();
	});

	// 설정창 화면에서 Back 버튼 클릭
	$("#setting_back_btn").click(function() {
		$("#setting_screen").hide();
		$("#main").show();
	});

	// How to play 화면에서 Back 버튼 클릭
	$("#how_to_play_back_btn").click(function() {
		$("#how_to_play_screen").hide();
		$("#main").show();
	});
	  
});