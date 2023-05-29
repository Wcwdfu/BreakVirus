$(document).ready(function() { 
    document.body.style.backgroundImage = "url('img/scoreImg/background.jpg')";
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
	$.ajax({
		url: "data/playing.json",
		dataType: "json",
		success: function (data) {
			$("#score_num").text("Score: " + data.score);
		},
	});
    setInterval(moveBackground, 20);
});