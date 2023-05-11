const comicPages = ["tutor1.jpg", "tutor2.jpg"];

var currentPage = 0;

$(document).ready(function() {
  $("#next-arrow").click(nextPage);
  $("#prev-arrow").click(prevPage);

  function nextPage() {
  if (currentPage < comicPages.length - 1) {
    currentPage++;
    document.getElementById("comic-image").src = comicPages[currentPage];
  }
}

function prevPage() {
  if (currentPage > 0) {
    currentPage--;
    document.getElementById("comic-image").src = comicPages[currentPage];
  }
}
});