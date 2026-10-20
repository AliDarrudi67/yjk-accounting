<?php
include '../core/db.php';
include '../core/api.php';

api_init('GET');
global $pdo;

$userId = auth_user_id();

$from = $_GET['from'] ?? '';
$to   = $_GET['to'] ?? '';
if (!valid_date($from) || !valid_date($to)) {
    fail('from and to are required (YYYY-MM-DD)');
}

$stmt = $pdo->prepare("
    SELECT id,
           punch_date AS date,
           TIME_FORMAT(punch_time, '%H:%i') AS time
    FROM punches
    WHERE user_id = ? AND punch_date BETWEEN ? AND ?
    ORDER BY punch_date, punch_time
");
$stmt->execute([$userId, $from, $to]);

json_out([
    'result' => true,
    'error'  => '',
    'data'   => $stmt->fetchAll(PDO::FETCH_ASSOC),
]);
