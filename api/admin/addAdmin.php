<?php

header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../core/db.php';

$response = [
   'result' => true,
   'error'  => '',
];

global $pdo;

/* =========================
   Auth
========================= */

$token = $_GET['token'] ?? '';

$stmt = $pdo->prepare("SELECT id FROM admin WHERE token = ?");
$stmt->execute([$token]);

$admin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$admin) {

   http_response_code(401);

   echo json_encode([
      'result' => false,
      'error'  => 'Unauthorized'
   ]);

   exit;
}

$creatorId = $admin['id'];

/* =========================
   POST Only
========================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

   echo json_encode([
      'result' => false,
      'error'  => 'متد درخواست نامعتبر است'
   ]);

   exit;
}

/* =========================
   Form Data
========================= */

$fullName = trim($_POST['fullName'] ?? '');
$username = trim($_POST['username'] ?? '');
$password = trim($_POST['password'] ?? '');
$role     = trim($_POST['role'] ?? '');

/* =========================
   Validation
========================= */

if ($fullName === '') {
   echo json_encode([
      'result' => false,
      'error'  => 'نام کامل الزامی است'
   ]);
   exit;
}

if ($username === '') {
   echo json_encode([
      'result' => false,
      'error'  => 'نام کاربری الزامی است'
   ]);
   exit;
}

if ($password === '') {
   echo json_encode([
      'result' => false,
      'error'  => 'رمز عبور الزامی است'
   ]);
   exit;
}

if (mb_strlen($password) < 6) {
   echo json_encode([
      'result' => false,
      'error'  => 'رمز عبور باید حداقل ۶ کاراکتر باشد'
   ]);
   exit;
}

if (!in_array($role, ['admin', 'operator'])) {
   echo json_encode([
      'result' => false,
      'error'  => 'نقش کاربر نامعتبر است'
   ]);
   exit;
}

/* =========================
   Check Duplicate Username
========================= */

$stmt = $pdo->prepare("SELECT COUNT(*) FROM admin WHERE username = ?");
$stmt->execute([$username]);

if ($stmt->fetchColumn() > 0) {

   echo json_encode([
      'result' => false,
      'error'  => 'این نام کاربری قبلاً ثبت شده است'
   ]);

   exit;
}

/* =========================
   Insert Admin
========================= */

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$stmt = $pdo->prepare("
   INSERT INTO admin
   (fullName, username, password, role, created, creator)
   VALUES (?, ?, ?, ?, NOW(), ?)
");

$stmt->execute([
   $fullName,
   $username,
   $hashedPassword,
   $role,
   $creatorId
]);

$response['id'] = (int)$pdo->lastInsertId();

echo json_encode($response);
