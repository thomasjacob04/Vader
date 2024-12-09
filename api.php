<?php
// Load .env file manually
$env = file_get_contents('.env');
$lines = explode("\n", $env);
foreach($lines as $line) {
    if (strpos($line, '=') !== false) {
        list($key, $value) = explode('=', $line, 2);
        putenv(trim($key) . '=' . trim($value));
    }
}



// Handle CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

header('Content-Type: application/json');

// Rest of your API code
$groq_api_key = getenv('GROQ_API_KEY');

// Get POST data
$json = file_get_contents('php://input');
$data = json_decode($json, true);

// Prepare the request to Groq
$ch = curl_init('https://api.groq.com/openai/v1/chat/completions');

$headers = [
    'Authorization: Bearer ' . $groq_api_key,
    'Content-Type: application/json'
];

$body = [
    'messages' => $data['messages'],
    'model' => 'llama-3.3-70b-specdec',
    'temperature' => 0.7,
    'max_tokens' => 2048
];

curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

if ($http_code !== 200) {
    http_response_code(500);
    echo json_encode(['error' => 'Request to Groq failed', 'details' => $response]);
    exit;
}

curl_close($ch);
echo $response;
?>