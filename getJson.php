<?php

/*
 * Created by: Sainesh Mamgain
 * @Date: 2016-03-01
 * 89itworld Software Solutions
 */
header("Access-Control-Allow-Origin: http://localhost");

 echo json_encode(['status'=>1,'title'=>'Notification','message'=>'Hi this is custom notification.','image'=>'https://a3sne.com/img/videos/thumbnails/THUMB_IMG1454375057.jpg','host'=>$_GET['website']]);
die;
?>
