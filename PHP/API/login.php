<?php

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Request-With');
header("X-Content-Type-Options: nosniff");
header("X-Frame-Options: DENY");
header_remove("X-Powered-By");

include('./function.php');

$requestMethod = $_SERVER["REQUEST_METHOD"];

if ($requestMethod == "OPTIONS") {
    http_response_code(200);
    exit();
}

if ($requestMethod == "POST") {
    $inputData = json_decode(file_get_contents("php://input"), true);

    if (empty($inputData)) {
        $login = login($_POST);
    } else {
        $login = login($inputData);
    }
    echo $login;
    exit();
} else {
    $data = [
        'status' => 405,
        'message' => $requestMethod . ' method not allowed'
    ];
    header("HTTP/1.0 405 Method Not Allowed");
    echo json_encode($data);
}
