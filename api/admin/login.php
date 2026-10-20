<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../core/db.php';

$response = [
   'result' => false,
   'error'  => '',
   'token'  => ''
];

global $pdo;

/* =========================
   POST Only
========================= */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
   $response['error']  = 'متد درخواست نامعتبر است';
   echo json_encode($response);
   exit;
}

/* =========================
   Form Data
========================= */
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');

/* =========================
   Validation
========================= */
if ($username === '' || $password === '') {
   $response['error']  = 'نام کاربری و رمز عبور الزامی است';
   echo json_encode($response);
   exit;
}

/* =========================
   Fetch User
========================= */
$stmt = $pdo->prepare("SELECT id, password FROM users WHERE username = ? LIMIT 1");
$stmt->execute([$username]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
   $response['error'] = 'نام کاربری یا رمز عبور اشتباه است';
   echo json_encode($response);
   exit;
}

/* =========================
   Verify Password
========================= */
if (!password_verify($password, $user['password'])) {
   $response['error'] = 'نام کاربری یا رمز عبور اشتباه است1';
   echo json_encode($response);
   exit;
}

/* =========================
   Generate Token
========================= */
$token = bin2hex(random_bytes(32));

$update = $pdo->prepare("UPDATE users SET token = ? WHERE id = ?");
$update->execute([$token, $user['id']]);

/* =========================
   Success
========================= */
$response['result']   = true;
$response['token']    = $token;
$response['user_id'] = $user['id'];

echo json_encode($response);
