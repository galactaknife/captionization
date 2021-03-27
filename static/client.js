$(document).ready(function() {
  $("form").submit(function(e) {
    // Prevent an HTTP POST request
    e.preventDefault();

    // Check that the video size isn't larger than 50 MB
    if ($("input[name='vid']")[0].files[0].size > 50000000) {
      // If file size is too large, notify user
      $("#message").show();
      $("#message").html("Video file is too large.  Max file size is 50 MB");
    }

    else {
      // Create FormData instance to send to server
      var f = new FormData();

      // Create file name of output file
      var name = $("input[type='file']").get(0).files[0].name.split(".")[0] + "-captioned." + $("input[type='file']").get(0).files[0].name.split(".").pop();

      // Add data to form
      f.append("vid", $("input[name='vid']")[0].files[0]);
      f.append("srt", $("input[name='srt']")[0].files[0]);
      f.append("extension", $("input[type='file']").get(0).files[0].name.split(".").pop());

      // Notify client that the conversion is starting
      $("#message").show();
      $("#message").html("In the process of captionizing.  Please do not close this tab.  The process will take between one and five minutes.");

      $.ajax({
        url: "/file",
        type: "POST",
        data: f,
        success: function(data) {
          // Show download links
          document.getElementById("output").style.display = "block";
          document.querySelector("#output a").href = data["url"];
          document.querySelector("#output a:not(a[target='_blank'])").download = name;

          // Notify user that the process is complete
          $("#message").html("Captionization process complete!");

          // Reset the form
          $(this).trigger("reset");
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
