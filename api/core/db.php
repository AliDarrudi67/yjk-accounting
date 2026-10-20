<?php
session_start();
//error_reporting(0);
error_reporting(E_ALL);
ini_set('display_errors', 1);
include('jdf.php');
try {
  $pdo = new PDO("mysql:host=localhost;dbname=yjk-accounting", "root", "");
  $pdo->exec('set names utf8');
} catch (PDOException $e) {
  echo $e->getMessage();
}

date_default_timezone_set('Asia/Tehran');
include 'functions.php';
$local = 'y';
$baseUrl = getBaseUrl();
