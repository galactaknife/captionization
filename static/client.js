// 'captions' and 'video' hold their respective files
// 'converting' is a boolean that is true if the user is converting
var captions, video, converting;

function handleVideoDrop(e) {
  // Check if file type is a valid video
  if (!["mp4", "mov", "mpg", "m4v"].includes(e.originalEvent.dataTransfer.files[0].name.split(".").pop())) {
    $("#videoDrop h2").html("Invalid file type");
  }
  // Ensure that the user isn't uploading a very large file
  else if (e.originalEvent.dataTransfer.files[0].size > 50000000) {
    $("#videoDrop h2").html("File is too large.  Max size is 50 MB");
  }
  // If video meets valid conditions, select video and notify user
  else {
    video = e.originalEvent.dataTransfer.files[0];
    $("#videoDrop h2").html(video.name);
  }
}

function handleCaptionDrop(e) {
  // Check that file is a valid srt file
  if (e.originalEvent.dataTransfer.files[0].name.split(".").pop() != "srt") {
    $("#captionsDrop h2").html("Invalid file type.  Only accepts .srt files");
  }
  // If file is valid, select file and notify user
  else {
    captions = e.originalEvent.dataTransfer.files[0];
    $("#captionsDrop h2").html(captions.name);
  }
}

function sendImages() {
  // Ensure that both files are uploaded
  if (!video || !captions) {
    return;
  }
  // If the user is converting already, notify them
  else if (converting) {
    alert("You already have a conversion in process.");
    return;
  }

  // Create FormData element in order to send through ajax
  var fd = new FormData();

  // Add items to FormData
  fd.append("srt", captions);
  fd.append("vid", video);
  fd.append("extension", video.name.split(".").pop());

  // Set conversion status to true
  converting = true;
  $("input[type='submit']").prop("value", "Converting...");

  // Send POST request to server
  $.ajax({
    url: "/file",
    type: "POST",
    data: fd,

    success: function(data) {
      // Process the new data from the server
      onUrlReceived(data.url);
      // Set conversion status to false
      converting = false;
    },

    cache: false,
    contentType: false,
    processData: false,

    error: function(err) {
      // If an error occurs, notify the user
      alert("There was an error somewhere.");
      console.log(err);

      // Set conversion status to false
      converting = false;
      $("input[type='submit']").prop("value", "Process");
    }
  });
}

$(document).ready(() => {
  // Enable  drag and drop
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

  // If the form is submitted, send it to the server
  $("form").submit(function(e) {
    e.preventDefault();
    sendImages();
  });


  // Allow users to select files from their computer
  $("#videoDrop").on("click", function() {
    $("#vidTempFile").click();
  });

  $("#captionsDrop").on("click", function() {
    $("#srtTempFile").click();
  });


  // After file is selected from browsing, select it
  $("#vidTempFile").change(function() {
    // Ensure that file isn't too large
    if ($(this).get(0).files[0].size > 50000000) {
      $("#videoDrop h2").html("File is too large.  Max size is 50 MB");
      return;
    }
    // Select  file and notify client
    video = $(this).get(0).files[0];
    $("#videoDrop h2").html(video.name);
  });

  $("#srtTempFile").change(function() {
    // Select file and notify client
    captions = $(this).get(0).files[0];
    $("#captionsDrop h2").html(captions.name);
  });
});
