const searchPlaceholderSearchInput = document.querySelector('.js-search-input');
const searchPlaceholderBtn = $('.js-search-btn');
const main = document.querySelector('.main');

var mainStatus = true;

window.onload = function(){
  mainStatus = false;
};

function placeholderRemover () {
  searchPlaceholderSearchInput.classList.remove('placeholder')
  searchPlaceholderBtn.classList.remove('placeholder')
  searchPlaceholderBtn.classList.remove('placeholder-wave')
  main.style.pointerEvents = 'auto';
}
setInterval(function () {
  if (mainStatus === false) {
      placeholderRemover();
  }
} , 1050);