const comicPages = [
  { image: "img/tutorialImg/title.jpg", sound: null },
  {
    image: "img/tutorialImg/tutorial1.jpg",
    sound: "sound/tutorialSound/effect1.mp3",
  },
  {
    image: "img/tutorialImg/tutorial2.jpg",
    sound: "sound/tutorialSound/effect2.mp3",
  },
  {
    image: "img/tutorialImg/tutorial3.jpg",
    sound: "sound/tutorialSound/effect3.mp3",
  },
  {
    image: "img/tutorialImg/tutorial4.jpg",
    sound: "sound/tutorialSound/effect4.mp3",
  },
  { image: "img/tutorialImg/tutorial5.jpg", sound: null },
  { image: "img/tutorialImg/tutorial6.jpg", sound: null },
  { image: "img/tutorialImg/tutorial7.jpg", sound: null },
  { image: "img/tutorialImg/tutorial8.jpg", sound: null },
  { image: "img/tutorialImg/tutorial9.jpg", sound: null },
  { image: "img/tutorialImg/tutorial10.jpg", sound: null },
];

var currentPage = 0;

$(document).ready(function () {
  function playSoundEffect(soundPath) {
    var soundEffect = new Audio(soundPath);
    soundEffect.currentTime = 0;
    soundEffect.play();
  }

  function loadPage(pageIndex) {
    document.getElementById("comic-image").src = comicPages[pageIndex].image;
    playSoundEffect(comicPages[pageIndex].sound);

    if (pageIndex === 0) {
      $("#prev_img").hide();
    } else {
      $("#prev_img").show();
    }

    if (pageIndex === 10) {
      $("#next_img").hide();
    } else {
      $("#next_img").show();
    }
  }

  function nextPage() {
    if (currentPage < comicPages.length - 1) {
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

  loadPage(currentPage);

  $("#prev_img").on("click", prevPage);
  $("#next_img").on("click", nextPage);
  $("#skip-button").on("click", function () {
    window.location.href = "main.html";
  });
});
