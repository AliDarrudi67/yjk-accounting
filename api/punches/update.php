<?php
include '../core/db.php';
include '../core/api.php';

api_init('POST');
global $pdo;

$userId = auth_user_id();
$in     = input();

$id   = (int) ($in['id'] ?? 0);
$time = $in['time'] ?? '';
if ($id <= 0 || !valid_time($time)) {
    fail('Invalid id or time');
}

$check = $pdo->prepare('SELECT id FROM punches WHERE id = ? AND user_id = ?');
$check->execute([$id, $userId]);
if (!$check->fetchColumn()) {
    fail('Not found', 404);
}

try {
    $stmt = $pdo->prepare('UPDATE punches SET punch_time = ? WHERE id = ? AND user_id = ?');
    $stmt->execute([$time, $id, $userId]);
} catch (PDOException $e) {
    if ($e->getCode() === '23000') {
        fail('This punch already exists', 409);
    }
    fail('Server error', 500);
}

json_out([
    'result' => true,
    'error'  => '',
    'data'   => ['id' => $id, 'time' => $time],
]);
