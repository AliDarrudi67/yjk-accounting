<?php
header('Content-Type: application/json; charset=utf-8');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

include '../core/db.php';

global $pdo;

/* =========================
   Auth & Permission Check
========================= */

$token = $_GET['token'] ?? '';

// دریافت اطلاعات ادمین جاری برای چک کردن سوپرادمین بودن
$stmt = $pdo->prepare("SELECT id, main FROM admin WHERE token = ?");
$stmt->execute([$token]);
$admin = $stmt->fetch(PDO::FETCH_ASSOC);

// ۱. بررسی اعتبار توکن
if (!$admin) {
    http_response_code(401);
    echo json_encode(['result' => false, 'error' => 'Unauthorized']);
    exit;
}

// ۲. بررسی سطح دسترسی (آیا ادمین جاری سوپرادمین است؟)
if ($admin['main'] !== 'y') {
    http_response_code(403);
    echo json_encode(['result' => false, 'error' => 'شما اجازه حذف ادمین را ندارید']);
    exit;
}

/* =========================
   Delete Logic
========================= */

$adminIdToDelete = $_GET['id'] ?? null;

if (!$adminIdToDelete) {
    echo json_encode(['result' => false, 'error' => 'آیدی ادمین الزامی است']);
    exit;
}

// جلوگیری از حذف خود توسط سوپرادمین
if ($admin['id'] == $adminIdToDelete) {
    echo json_encode(['result' => false, 'error' => 'شما نمی‌توانید حساب خودتان را حذف کنید']);
    exit;
}

// بررسی ادمین هدف (آیا سوپرادمین است؟)
$stmt = $pdo->prepare("SELECT main FROM admin WHERE id = ?");
$stmt->execute([$adminIdToDelete]);
$targetAdmin = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$targetAdmin) {
    echo json_encode(['result' => false, 'error' => 'ادمین مورد نظر یافت نشد']);
    exit;
}

// ۳. جلوگیری از حذف سوپرادمین‌های دیگر
if ($targetAdmin['main'] === 'y') {
    echo json_encode(['result' => false, 'error' => 'امکان حذف سوپرادمین وجود ندارد']);
    exit;
}

/* =========================
   Execute Delete
========================= */

$stmt = $pdo->prepare("DELETE FROM admin WHERE id = ?");
$stmt->execute([$adminIdToDelete]);

echo json_encode([
    'result' => true,
    'message' => 'ادمین با موفقیت حذف شد'
]);
