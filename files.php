<?php

// Get the size of a user's directory
function get_dir_size($user) {
  $bytes = 0;
  $path = realpath("uploads/" . $user);
  // If path exists, start calculation
  if ($path != false && $path != "" && file_exists($path)) {
    // Iterates through files and adds size to bytes variable
    foreach (new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path, FilesystemIterator::SKIP_DOTS)) as $file) {
      $bytes += $file->getSize();
    }
  }
  return $bytes;
}

// Gets the oldest file in directory
function get_oldest_file($user) {
  $files = glob("uploads/" . $user . "/*.*");
  // Sorts files so oldest is index zero
  array_multisort(array_map("filemtime", $files), SORT_NUMERIC, SORT_ASC, $files);
  // The oldest file
  return $files[0];
}

// Ensure that the user hasn't exceeded their file limit, and if so, remove their oldest file(s) until under the limit
function check_file_overload($user, $limit) {
  if (file_exists("uploads/" . $user)) {
    // Runs until the file limit is acceptable
    while (get_dir_size($user) > $limit) {
      // Deletes their oldest file
      unlink(get_oldest_file($user));
    }
  }
}

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
  $data = json_decode($argv[1]);
}

// Determine what task is needed
switch ($data->task) {
  // Create a directory for the user if it doesn't exist already
  case "create":
    if (!file_exists("uploads/" . $data->user)) {
      // Create a directory with writing permissions
      mkdir("uploads/" . $data->user, 0777, true);
    }
    break;

  case "check":
    // If the user's directory already exists, ensure they aren't taking up too much space
    if (file_exists("uploads/" . $data->user)) {
      check_file_overload($data->user, 100000000);
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
