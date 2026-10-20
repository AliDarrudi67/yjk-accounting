<?php
include '../core/db.php';
include '../core/api.php';

api_init('POST');
global $pdo;

$userId = auth_user_id();
$id     = (int) (input()['id'] ?? 0);
if ($id <= 0) {
    fail('Invalid id');
}

$stmt = $pdo->prepare('DELETE FROM punches WHERE id = ? AND user_id = ?');
$stmt->execute([$id, $userId]);

if (!$stmt->rowCount()) {
    fail('Not found', 404);
}

json_out(['result' => true, 'error' => '', 'data' => ['id' => $id]]);
