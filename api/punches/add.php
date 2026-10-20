<?php
include '../core/db.php';
include '../core/api.php';

api_init('POST');
global $pdo;

$userId = auth_user_id();
$in     = input();

$date = $in['date'] ?? '';
$time = $in['time'] ?? '';
if (!valid_date($date) || !valid_time($time)) {
    fail('Invalid date or time');
}

try {
    $stmt = $pdo->prepare("
        INSERT INTO punches (user_id, punch_date, punch_time)
        VALUES (?, ?, ?)
    ");
    $stmt->execute([$userId, $date, $time]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        fail('This punch already exists', 409);
    }
    fail('Server error', 500);
}

json_out([
    'result' => true,
    'error'  => '',
    'data'   => ['id' => (int) $pdo->lastInsertId(), 'date' => $date, 'time' => $time],
]);
