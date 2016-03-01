<?php
/*
 * Created by: Sainesh Mamgain
 * @Date: 2016-03-01
 * 89itworld Software Solutions
 */
//header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Origin: http://localhost");
//header("Access-Control-Allow-Credentials: true");
//echo json_encode(['status' => 1, 'message' => 'success','ep'=>$_GET]);
sendGoogleCloudMessage(array('message from here'),array($_GET['endpoint']));
function sendGoogleCloudMessage($data, $ids)
{
	// Insert real GCM API key from Google APIs Console
	// https://code.google.com/apis/console/
	$apiKey = '';
	// Define URL to GCM endpoint
	$url = 'https://android.googleapis.com/gcm/send';
	// Set GCM post variables (device IDs and push payload)
	$post = array(
		'registration_ids' => $ids,
		'data'=>array('message'=>$data)
	);
	// Set CURL request headers (authentication and type)
	$headers = array(
		'Authorization: key=' . $apiKey,
		'Content-Type: application/json'
	);
	// Initialize curl handle
	$ch = curl_init();
	// Set URL to GCM endpoint
	curl_setopt($ch, CURLOPT_URL, $url);
	// Set request method to POST
	curl_setopt($ch, CURLOPT_POST, true);
	// Set our custom headers
	curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
	// Get the response back as string instead of printing it
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	// Set JSON post data
	curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($post));
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	// Actually send the push
	$result = curl_exec($ch);
	// Error handling
	if (curl_errno($ch)) {
		echo 'GCM error: ' . curl_error($ch);
	}
	// Close curl handle
	curl_close($ch);
	// Debug GCM response
//	echo $result;
}

?>
