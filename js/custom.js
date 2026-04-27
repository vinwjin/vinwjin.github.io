document.addEventListener('DOMContentLoaded', function() {
  var webBg = document.getElementById('web_bg');
  if (!webBg) return;
  var ticking = false;
  function updateBackgroundFade() {
    var scrollY = window.scrollY;
    var windowHeight = window.innerHeight;
    var maxScroll = windowHeight * 0.6;
    var fadeProgress = Math.min(scrollY / maxScroll, 1);
    var opacity = Math.max(1 - fadeProgress * 0.85, 0.15);
    webBg.style.opacity = opacity;
    webBg.style.filter = 'blur(' + (fadeProgress * 2) + 'px)';
    ticking = false;
  }
  window.addEventListener('scroll', function() {
    if (!ticking) { requestAnimationFrame(updateBackgroundFade); ticking = true; }
  }, { passive: true });
  updateBackgroundFade();
});
