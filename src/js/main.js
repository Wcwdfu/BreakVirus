const htpPages = [
	{image: "img/mainImg/how_to1.png"},
	{image: "img/mainImg/how_to2.png"},
];

var currentPage = 0;
var audio = new Audio();
function loadAudio(audioSrc, callback) {
	var audio = new Audio();
	audio.src = audioSrc;
	audio.addEventListener('canplaythrough', function() {
	  // 로드 완료 시 콜백 호출
	  callback(audio);
	});
  }
var bgm = false;
var infinite = false;
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
	$(document).click(function(){
		if($("#bgm_checkbox").prop("checked")){
		loadAudio("sound/mainSound/main_bgm.wav", function(ad) {
			audio = ad;
			audio.loop = true;
			audio.play();
		$(document).unbind("click");
		});
	}
	});
	setInterval(moveBackground, 20);

	//메인화면 bgm 플레이
	

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

	//난이도 버튼 hover
	$("#easy_difficulty").hover(
		function() {
			$("#easy_difficulty").attr("src", "img/mainImg/easy_difficulty_2.png");
			playHoverSound();
		  }, function() {
			$("#easy_difficulty").attr("src", "img/mainImg/easy_difficulty_1.png");
	});

	$("#normal_difficulty").hover(
		function() {
			$("#normal_difficulty").attr("src", "img/mainImg/normal_difficulty_2.png");
			playHoverSound();
		  }, function() {
			$("#normal_difficulty").attr("src", "img/mainImg/normal_difficulty_1.png");
	});

	$("#hard_difficulty").hover(
		function() {
			$("#hard_difficulty").attr("src", "img/mainImg/hard_difficulty_2.png");
			playHoverSound();
		  }, function() {
			$("#hard_difficulty").attr("src", "img/mainImg/hard_difficulty_1.png");
	});


	// hover시 효과음
	function playHoverSound() {
		if ($("#bgm_checkbox").prop("checked")){
        var audio = document.getElementById("hover_sound");
        audio.currentTime = 0;
        audio.play();
		}
      }

	// click시 효과음
	function playClickSound() {
		if (bgm){
        var audio = document.getElementById("click_sound");
        audio.currentTime = 0;
        audio.play();
		}
      }
	
	function saveSetting() {
		var body = {
			bgm: $("#bgm_checkbox").prop("checked"),
			infinite: $("#infL_checkbox").prop("checked")
		}
		$.ajax({
			url: "/saveSetting",
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
		$("#main").hide();
		$("#difficult_set").show();
		// window.location.href = "phase1.html";
	});

	// 난이도 화면에서 각 난이도 버튼 클릭
	$("#easy_difficulty").click(function() {
		playClickSound();
		$.ajax({
			url: "/game/1",
			type: "GET",			
			success: function (data) {
				console.log("save success");
				window.location.href = "phase1.html";
			}
		})
	});

	$("#normal_difficulty").click(function() {
		playClickSound();
		$.ajax({
			url: "/game/2",
			type: "GET",			
			success: function (data) {
				console.log("save success");
				window.location.href = "phase1.html";
			}
		})

	});

	$("#hard_difficulty").click(function() {
		playClickSound();
		$.ajax({
			url: "/game/3",
			type: "GET",			
			success: function (data) {
				console.log("save success");
				window.location.href = "phase1.html";
			}
		})
	});

	// 난이도 화면에서 Back 버튼 클릭
	$("#start_back").click(function() {
		playClickSound();
		$("#difficult_set").hide();
		$("#main").show();
	});

	// Setting 버튼 클릭
	$("#settings_btn").click(function() {
		playClickSound();
		$("#main").hide();
		$("#setting_screen").show();
		$.ajax({
			url: "/getSetting",
			type: "GET",
			async: false,
			success: function (data) {
				bgm = data.bgm;
				$("#bgm_checkbox").prop("checked", data.bgm);

				infinite = data.infinite;
				$("#infL_checkbox").prop("checked", data.infinite);
				
			}
		})
	});

	// How to play 버튼 클릭
	$("#how_to_play_btn").click(function() {
		playClickSound();
		$("#main").hide();
		$("#how_to_play_screen").show();
		loadPage(currentPage);
	});

	// 설정창에서 Confirm 버튼 클릭
	$("#settings_ok").click(function() {
		playClickSound();
		saveSetting();
		bgm = $("#bgm_checkbox").prop("checked");
		infinite = $("#infL_checkbox").prop("checked");
		if(bgm)
			audio.play();
		else
			audio.pause();
		$("#setting_screen").hide();
		$("#main").show();
	});

	// 설정창 화면에서 Back 버튼 클릭
	$("#settings_back").click(function() {
		playClickSound();
		$("#bgm_checkbox").prop("checked", bgm);
		$("#infL_checkbox").prop("checked", infinite);
		if ($("#bgm_checkbox").prop("checked")) {
			$("#bgm_checkbox_img").attr("src", "img/mainImg/bgm_checked.png");
		} else {
			$("#bgm_checkbox_img").attr("src", "img/mainImg/bgm_unchecked.png");
		}
		if ($("#infL_checkbox").prop("checked")) {
			$("#infinite_checkbox_img").attr("src", "img/mainImg/infL_checked.png");
		} else {
			$("#infinite_checkbox_img").attr("src", "img/mainImg/infL_unchecked.png");
		}
		$("#setting_screen").hide();
		$("#main").show();
	});

	// How to play 화면 조절	

	
	$("#prev_img").on("click", prevPage);
	$("#next_img").on("click", nextPage);

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

function loadPage(pageIndex) {
	document.getElementById("htp_image").src = htpPages[pageIndex].image;

	if (pageIndex === 0) {
	  $("#prev_img").hide();
	} else {
	  $("#prev_img").show();
	}

	if (pageIndex === 1) {
	  $("#next_img").hide();
	} else {
	  $("#next_img").show();
	}
}

function nextPage() {
	if (currentPage < htpPages.length - 1) {
	  currentPage++;
	  loadPage(currentPage);
	}
}

function prevPage() {
	if (currentPage > 0) {
	  currentPage--;
	  loadPage(currentPage);
	}
}

