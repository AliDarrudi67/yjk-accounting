<?php
function per_to_latin($per_date)
{
  $per_date = str_replace('-', '/', $per_date);
  $arr_temp = explode('/', $per_date);
  $gdate = jalali_to_gregorian($arr_temp[0], $arr_temp[1], $arr_temp[2]);
  $year = $gdate[0];
  if (strlen($gdate[1]) == 1)
    $month = '0' . $gdate[1];
  else
    $month = $gdate[1];
  if (strlen($gdate[2]) == 1)
    $day = '0' . $gdate[2];
  else
    $day = $gdate[2];
  $latin_date = $year . '/' . $month . '/' . $day;
  return $latin_date;
}

//convert latin date to persian date
function latin_to_per($latin_date, $format)
{
  $latin_date = str_replace('-', '/', $latin_date);
  if ($format == 'date') {
    $arr_temp = explode(' ', $latin_date);
    $arr_date = explode('/', $arr_temp[0]);
    $arr_temp = gregorian_to_jalali($arr_date[0], $arr_date[1], $arr_date[2]);
    $str_date = implode('/', $arr_temp);
    return $str_date;
  } elseif ($format == 'date_time') {
    $arr_temp1 = explode(' ', $latin_date);
    $arr_date = explode('/', $arr_temp1[0]);
    $arr_temp = gregorian_to_jalali($arr_date[0], $arr_date[1], $arr_date[2]);
    $str_date = implode('/', $arr_temp) . ' ' . $arr_temp1[1];
    return $str_date;
  }
}


//set a random name for images
function generateFileName($dir, $OriginalFilename)
{
  $OriginalFilename = str_replace(' ', '_', $OriginalFilename);
  $OriginalFilename = str_replace('(', '', $OriginalFilename);
  $OriginalFilename = str_replace(')', '', $OriginalFilename);
  $FileCounter = 1;
  $filename = pathinfo($OriginalFilename, PATHINFO_FILENAME);
  $extension = pathinfo($OriginalFilename, PATHINFO_EXTENSION);
  $FinalFilename = $OriginalFilename;
  while (fileExists($dir . $FinalFilename))
    $FinalFilename = $filename . '_' . $FileCounter++ . '.' . $extension;
  return $FinalFilename;
}

function ins_test($data)
{
  global $pdo;
  $insert = $pdo->prepare("insert into test(name)values(:name)");
  $insert->execute(array(
    ':name' => $data
  ));
}

function fileExists($filePath)
{
  return is_file($filePath) && file_exists($filePath);
}

function getBaseUrl()
{
  if (isset($_SERVER['HTTPS'])) {
    $protocol = ($_SERVER['HTTPS'] && $_SERVER['HTTPS'] != "off") ? "https" : "http";
  } else {
    $protocol = 'http';
  }
  $temp = explode('/', $_SERVER["REQUEST_URI"]);
  return $protocol . "://" . $_SERVER['HTTP_HOST'] . '/' . $temp[1] . '/';
}



function getMonthName($month)
{
  switch ($month) {
    case '01':
    case '1':
      return 'فروردین';
    case '02':
    case '2':
      return 'اردیبهشت';
    case '03':
    case '3':
      return 'خرداد';
    case '04':
    case '4':
      return 'تیر';
    case '05':
    case '5':
      return 'مرداد';
    case '06':
    case '6':
      return 'شهریور';
    case '07':
    case '7':
      return 'مهر';
    case '08':
    case '8':
      return 'آبان';
    case '09':
    case '9':
      return 'آذر';
    case '10':
      return 'دی';
    case '11':
      return 'بهمن';
    case '12':
      return 'اسفند';
  }
}

function persianDate($persianDate)
{
  $temp = explode('/', $persianDate);
  $month = getMonthName($temp[1]);
  return $temp[2] . ' ' . $month . ' ' . $temp[0];
}

function getRandomStringRandomInt($length = 16)
{
  $stringSpace = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  $pieces = [];
  $max = mb_strlen($stringSpace, '8bit') - 1;
  for ($i = 0; $i < $length; ++$i) {
    $pieces[] = $stringSpace[random_int(0, $max)];
  }
  return implode('', $pieces);
}

function json_out(array $payload, int $code = 200): void
{
  http_response_code($code);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE);
  exit;
}

function fail(string $error, int $code = 400): void
{
  json_out(['result' => false, 'error' => $error, 'data' => []], $code);
}

/** هدرهای CORS + مدیریت preflight + چک متد */
function api_init(string $method): void
{
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Methods: $method, OPTIONS");
  header('Access-Control-Allow-Headers: Content-Type, Authorization');

  if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
  }
  if ($_SERVER['REQUEST_METHOD'] !== $method) {
    fail('Method not allowed', 405);
  }
}

/** توکن را از هدر Authorization (Bearer) می‌خواند؛ برای سازگاری با قبل ?token= هم قبول می‌کند */
function auth_user_id(): int
{
  global $pdo;

  $header = $_SERVER['HTTP_AUTHORIZATION']
    ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION']
    ?? '';
  $token = stripos($header, 'Bearer ') === 0 ? trim(substr($header, 7)) : '';
  if ($token === '') {
    $token = $_GET['token'] ?? '';
  }
  if ($token === '') {
    fail('Unauthorized', 401);
  }

  $stmt = $pdo->prepare('SELECT id FROM admin WHERE token = ?');
  $stmt->execute([$token]);
  $id = $stmt->fetchColumn();
  if (!$id) {
    fail('Unauthorized', 401);
  }
  return (int) $id;
}

/** بدنه JSON (یا فرم) را برمی‌گرداند */
function input(): array
{
  $json = json_decode(file_get_contents('php://input'), true);
  return is_array($json) ? $json : $_POST;
}

function valid_date(?string $d): bool
{
  $dt = DateTime::createFromFormat('Y-m-d', (string) $d);
  return $dt && $dt->format('Y-m-d') === $d;
}

function valid_time(?string $t): bool
{
  $dt = DateTime::createFromFormat('H:i', (string) $t);
  return $dt && $dt->format('H:i') === $t;
}
