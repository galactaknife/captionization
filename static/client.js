$(document).ready(function() {
  $("form").submit(function(e) {
    // Prevent the form from creating a POST request
    e.preventDefault();

    // Check that the video size isn't larger than 30 MB
    if ($("input[name='vid']")[0].files[0].size > 30000000) {
      // If file size is too large, notify user
      $("#message").show();
      $("#message").html("Video file is too large.  Max file size is 30 MB");
    }

    else {
      // Create FormData instance to send to server
      var fd = new FormData();
      fd.append("vid", $("input[name='vid']")[0].files[0]);
      fd.append("srt", $("input[name='srt']")[0].files[0]);
      fd.append("extension", $("input[type='file']").get(0).files[0].name.split(".").pop());

      // Notify client that the conversion is starting
      $("#message").show();
      $("#message").html("In the process of captionizing.  Please do not close this tab.  The process will take between one and five minutes.");

      $.ajax({
        url: "/file",
        type: "POST",
        data: fd,
        success: function(data) {
          // Show download links
          document.getElementById("output").style.display = "block";
          document.querySelector("#output a").href = data["url"];

          // Notify user that the process is complete
          $("#message").html("Captionization process complete!");
        },

        cache: false,
        contentType: false,
        processData: false,

        // Notify client if there is an error
        error: function() {
          $("#message").html("There was an error somewhere");
        }
      });
    }
  });
});
