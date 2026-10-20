<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../core/db.php';

$response = [
    'result' => true,
    'error'  => '',
    'data'   => []
];

global $pdo;

/* =========================
   Auth
========================= */
$token = $_GET['token'] ?? '';

$stmt = $pdo->prepare("SELECT id FROM admin WHERE token = ?");
$stmt->execute([$token]);

if (!$stmt->rowCount()) {
    $response['result'] = false;
    if (!$stmt->rowCount()) {

        http_response_code(401);

        echo json_encode([
            'result' => false,
            'error'  => 'Unauthorized'
        ]);

        exit;
    }
    echo json_encode($response);
    exit;
}

/* =========================
   Get List
========================= */
$stmt = $pdo->prepare("
    SELECT *
    FROM admin
    ORDER BY id DESC
");
$stmt->execute();

$response['data'] = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($response);
