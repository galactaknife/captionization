var captions, video;
var converting = false;

function handleVideoDrop(e) {
  if (!["mp4", "mov", "mpg", "m4v"].includes(e.originalEvent.dataTransfer.files[0].name.split(".").pop())) {
    $("#videoDrop h2").html("Invalid file type.");
  }
  else {
    video = e.originalEvent.dataTransfer.files[0];
    $("#videoDrop h2").html(video.name);
  }
}

function handleCaptionDrop(e) {
  if (e.originalEvent.dataTransfer.files[0].name.split(".").pop() != "srt") {
    $("#captionsDrop h2").html("Invalid file type.  Only accepts .srt files");
  }
  else {
    captions = e.originalEvent.dataTransfer.files[0];
    $("#captionsDrop h2").html(captions.name);
  }
}

function sendImages() {
  if (!video || !captions) {
    return;
  }
  else if (converting) {
    alert("You already have a conversion in process.");
    return;
  }
  var formData = new FormData();

  formData.append("srt", captions);
  formData.append("vid", video);
  formData.append("extension", video.name.split(".").pop());

  converting = true;

  $.ajax({
    url: "/file",
    type: "POST",
    data: formData,
    success: function(data) {
      onUrlReceived(data.url);
      converting = false;
    },

    cache: false,
    contentType: false,
    processData: false,

    error: function(err) {
      alert("There was an error somewhere.");
      console.log(err);
      converting = false;
    }
  });
}

$(document).ready(() => {
  $("#captionsDrop, #videoDrop").on("dragover", function(e) {
    e.preventDefault();
    e.stopPropagation();
  });

  $("#captionsDrop, #videoDrop").on("dragleave", function(e) {
      e.preventDefault();
      e.stopPropagation();
  });

  $("#captionsDrop").on("drop", function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleCaptionDrop(e);
  });

  $("#videoDrop").on("drop", function(e) {
      e.preventDefault();
      e.stopPropagation();
      handleVideoDrop(e);
  });

  $("form").submit(function(e) {
    e.preventDefault();
    sendImages();
  })

  $("#videoDrop").on("click", function() {
    $("#vidTempFile").click();
  });

  $("#captionsDrop").on("click", function() {
    $("#srtTempFile").click();
  });

  $("#vidTempFile").change(function() {
    video = $(this).get(0).files[0];
    $("#videoDrop h2").html(video.name);
  });

  $("#srtTempFile").change(function() {
    captions = $(this).get(0).files[0];
    $("#captionsDrop h2").html(captions.name);
  });
});
