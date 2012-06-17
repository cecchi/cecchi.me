<?php
if($handle = opendir($_GET['path'])) {
  $files = array();
  while(false !== ($entry = readdir($handle))) {
    if(preg_match('%^\d+\.(png|jpe?g)$%', $entry)) {
      array_push($files, $entry);
    }
  }

  echo json_encode(sort($files));

  closedir($handle);
}
?>