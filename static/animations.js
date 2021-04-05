function onUrlReceived(url) {
  $(".header, .content").fadeOut(500);
  $(".glassCard a").prop("href", url);
  $(".glassCard:not(.fileInputContainer)").fadeIn(300);
  setTimeout(() => {
    $(".overlay").fadeIn(1000);
  }, 500);
}
