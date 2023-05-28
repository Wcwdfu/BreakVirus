$(document).ready(function() {

	document.body.style.backgroundImage = "url('img/mainImg/background2.png')";
	document.body.style.backgroundSize = "cover";
	document.body.style.backgroundRepeat = "no-repeat";

	var position = 0;
	var speed = 1; // 이동 속도 조정
	var windowWidth = window.innerWidth; // 창의 가로 크기

	function moveBackground() {
		position -= speed;
		if (position <= -windowWidth) {
			position = 0;
		}
		document.body.style.backgroundPosition = position + "px 0";
	}

	setInterval(moveBackground, 20);

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
		if(!$("#bgm_checkbox").prop("checked"))
			return;
        var audio = document.getElementById("hover_sound");
        audio.currentTime = 0;
        audio.play();
      }

	// click시 효과음
	function playClickSound() {
		if(!$("#bgm_checkbox").prop("checked"))
			return;
        var audio = document.getElementById("click_sound");
        audio.currentTime = 0;
        audio.play();
      }
	function saveSetting() {
		var body = {
			bgm: $("#bgm_checkbox").prop("checked"),
			infinite: $("#infL_checkbox").prop("checked")
		}
		$.ajax({
			url: "http://localhost:8080/saveSetting",
			contentType: 'application/json',
			type: "POST",
			async: false,
			data: JSON.stringify(body),
			success: function (data) {
				console.log("save success");
			},
		});
	}
	// Start 버튼 클릭
	$("#start_btn").click(function() {
		playClickSound();
		window.location.href = "phase1.html";
	});

	// Setting 버튼 클릭
	$("#settings_btn").click(function() {
		playClickSound();
		$("#main").hide();
		$("#setting_screen").show();
	});

	// How to play 버튼 클릭
	$("#how_to_play_btn").click(function() {
		playClickSound();
		$("#main").hide();
		$("#how_to_play_screen").show();
	});

	// 설정창에서 Confirm 버튼 클릭
	$("#settings_ok").click(function() {
		playClickSound();
		saveSetting();
		$("#setting_screen").hide();
		$("#main").show();
	});

	// 설정창 화면에서 Back 버튼 클릭
	$("#settings_back").click(function() {
		playClickSound();
		$("#setting_screen").hide();
		$("#main").show();
	});

	// How to play 화면에서 Back 버튼 클릭
	$("#htp_back").click(function() {
		playClickSound();
		$("#how_to_play_screen").hide();
		$("#main").show();
	});

	// BGM 체크 박스
	$("#bgm_checkbox").change(function () {
		if ($(this).prop("checked")) {
			$("#bgm_checkbox_img").attr("src", "img/mainImg/bgm_checked.png");
		} else {
			$("#bgm_checkbox_img").attr("src", "img/mainImg/bgm_unchecked.png");
		}
	});
  
	// Infinite Life Mode 체크 박스
	$("#infL_checkbox").change(function () {
		if ($(this).prop("checked")) {
			$("#infinite_checkbox_img").attr("src", "img/mainImg/infL_checked.png");
		} else {
			$("#infinite_checkbox_img").attr("src", "img/mainImg/infL_unchecked.png");
		}
	});

	$('#left_character').css({ left: '-100%' }).animate({ left: '50' }, 1000);

	$('#right_character').css({ right: '-100%' }).animate({ right: '50' }, 1000);
	  
});