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

$stmt = $pdo->prepare("SELECT id, role, main FROM admin WHERE token = ?");
$stmt->execute([$token]);

$currentAdmin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$currentAdmin) {

    http_response_code(401);

    echo json_encode([
        'result' => false,
        'error'  => 'Unauthorized'
    ]);

    exit;
}

$currentId   = $currentAdmin['id'];
$currentRole = $currentAdmin['role'];
$currentMain = $currentAdmin['main'];


/* =========================
   Method Check
========================= */

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    echo json_encode([
        'result' => false,
        'error'  => 'متد درخواست نامعتبر است'
    ]);

    exit;
}


/* =========================
   Inputs
========================= */

$id = (int) ($_POST['id'] ?? 0);
$fullName = trim($_POST['fullName'] ?? '');
$username = trim($_POST['username'] ?? '');
$role     = trim($_POST['role'] ?? '');
$password = trim($_POST['password'] ?? '');



/* =========================
   Validation
========================= */

if ($id <= 0) {
    echo json_encode([
        'result' => false,
        'error'  => 'شناسه ادمین نامعتبر است'
    ]);
    exit;
}

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

if (!in_array($role, ['admin', 'operator'])) {
    echo json_encode([
        'result' => false,
        'error'  => 'نقش کاربر نامعتبر است'
    ]);
    exit;
}


/* =========================
   Check Target Admin
========================= */

$stmt = $pdo->prepare("SELECT id, main FROM admin WHERE id = ?");
$stmt->execute([$id]);

$targetAdmin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$targetAdmin) {

    echo json_encode([
        'result' => false,
        'error'  => 'ادمین مورد نظر یافت نشد'
    ]);

    exit;
}

$targetMain = $targetAdmin['main'];


/* =========================
   Operator cannot edit Super Admin
========================= */

if ($currentRole === 'operator' && $targetMain === 'y') {

    echo json_encode([
        'result' => false,
        'error'  => 'شما اجازه ویرایش سوپر ادمین را ندارید'
    ]);

    exit;
}


/* =========================
   Super Admin cannot change own role
========================= */

if ($currentId == $id && $targetMain === 'y' && $role === 'operator') {

    echo json_encode([
        'result' => false,
        'error'  => 'سوپر ادمین نمی‌تواند نقش خود را به اپراتور تغییر دهد'
    ]);

    exit;
}


/* =========================
   Check Duplicate Username
========================= */

$stmt = $pdo->prepare("
    SELECT COUNT(*)
    FROM admin
    WHERE username = ? AND id != ?
");

$stmt->execute([$username, $id]);

if ($stmt->fetchColumn() > 0) {

    echo json_encode([
        'result' => false,
        'error'  => 'این نام کاربری قبلاً ثبت شده است'
    ]);

    exit;
}


/* =========================
   Password Validation
========================= */

if ($password !== '' && mb_strlen($password) < 6) {

    echo json_encode([
        'result' => false,
        'error'  => 'رمز عبور باید حداقل ۶ کاراکتر باشد'
    ]);

    exit;
}


/* =========================
   Update
========================= */

if ($password !== '') {

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $stmt = $pdo->prepare("
        UPDATE admin
        SET
            fullName = ?,
            username = ?,
            password = ?,
            role     = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $fullName,
        $username,
        $hashedPassword,
        $role,
        $id
    ]);
} else {

    $stmt = $pdo->prepare("
        UPDATE admin
        SET
            fullName = ?,
            username = ?,
            role     = ?
        WHERE id = ?
    ");

    $stmt->execute([
        $fullName,
        $username,
        $role,
        $id
    ]);
}

echo json_encode($response);
