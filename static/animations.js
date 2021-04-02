function onUrlReceived(url) {
  $(".header, .footer, .content").fadeOut(1500);
  $(".glassCard a").prop("href", url);
  $(".overlay").fadeIn(1500);
  setTimeout(() => {
    $(".glassCard").fadeIn(300);
  }, 1500);
}
