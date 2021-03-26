<?php

// Ensure that user-uploaded files have not exceeded their hour-long storage limit
function check_time_overload($path) {
  // Iterate through all files in $path variable
  foreach (glob($path . "/*", GLOB_MARK) as $file) {
    // If the file is a directory, check all files inside of it
    if (is_dir($file)) {
      check_time_overload($file);
    }
    // If the file is not a directory, check the time
    else {
      // If the file has been on the server for more than an hour, remove it
      if (time() - filectime($file) > 3600) {
        unlink($file);
      }
    }
  }
}

// Grab argument data
if ($argc > 1) {
  // Convert argument JSON into a PHP object
  $data = json_decode($argv[1];);
}

// Determine what task is needed
switch ($data->task) {
  // Create a directory for the user if it doesn't exist already
  case "create dir":
    if (!file_exists("uploads/" . $data->user)) {
      // Create a directory with writing permissions
      mkdir("uploads/" . $data->user, 0777, true);
    }
    break;

  // Remove argument files
  case "remove":
    // Iterate through files specified
    foreach ($data->files as $file) {
      // Delete the file
      unlink($file);
    }
    break;
}

check_time_overload("uploads");

?>
