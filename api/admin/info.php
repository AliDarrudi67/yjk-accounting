<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../core/db.php';

$response = [
   'result' => true,
   'error'  => '',
];

global $pdo;

/* =========================
   Token
========================= */

$token = $_GET['token'] ?? '';

if ($token === '') {

   echo json_encode([
      'result' => false,
      'error'  => 'Token required'
   ]);

   exit;
}

/* =========================
   Get Admin
========================= */

$stmt = $pdo->prepare("
   SELECT id, username, created_at
   FROM users
   WHERE token = ?
   LIMIT 1
");

$stmt->execute([$token]);

if (!$stmt->rowCount()) {

   http_response_code(401);

   echo json_encode([
      'result' => false,
      'error'  => 'Unauthorized'
   ]);

   exit;
}

$admin = $stmt->fetch(PDO::FETCH_ASSOC);

$adminId = $admin['id'];
/* =========================
   Response
========================= */

$response['admin'] = [
   'id'       => (int)$admin['id'],
   'username' => $admin['username'],
   'created'  => $admin['created']
];

echo json_encode($response);
