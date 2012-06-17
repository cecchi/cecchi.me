<?php
/* 
 * All directory requests within "/sources" are routed through this script,
 * and the contents (slide images) are output as a JSON array
 */

// Open the directory
if($handle = opendir($_GET['path'])) {
  $files = array();
  // Iterate through the files
  while(false !== ($entry = readdir($handle))) {
    // Ignore all files but .png and .jp(e)g
    if(preg_match('%^\d+\.(png|jpe?g)$%', $entry)) {
      array_push($files, $entry);
    }
  }

  // Sort the slides numerically
  sort($files);

  // Output as a simple JSON array
  echo json_encode($files);

  // Close the directory handle
  closedir($handle);
}
?>