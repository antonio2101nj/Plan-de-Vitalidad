<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Responder a requisições OPTIONS (CORS preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Método não permitido']);
    exit;
}

// Verificar se o arquivo foi enviado
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    echo json_encode(['success' => false, 'message' => 'Nenhum arquivo foi enviado ou erro no upload']);
    exit;
}

$file = $_FILES['image'];

// Configurações
$uploadDir = __DIR__ . '/uploads/imagens/';
$maxFileSize = 5 * 1024 * 1024; // 5MB
$allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp'];

// Criar diretório se não existir
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        echo json_encode(['success' => false, 'message' => 'Erro ao criar diretório de upload']);
        exit;
    }
}

// Validar tamanho do arquivo
if ($file['size'] > $maxFileSize) {
    echo json_encode(['success' => false, 'message' => 'Arquivo muito grande. Máximo permitido: 5MB']);
    exit;
}

// Validar tipo do arquivo
if (!in_array($file['type'], $allowedTypes)) {
    echo json_encode(['success' => false, 'message' => 'Tipo de arquivo não permitido. Use JPG, PNG ou WebP']);
    exit;
}

// Validar extensão do arquivo
$fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
if (!in_array($fileExtension, $allowedExtensions)) {
    echo json_encode(['success' => false, 'message' => 'Extensão de arquivo não permitida']);
    exit;
}

// Gerar nome único para o arquivo
$fileName = uniqid('banner_', true) . '.' . $fileExtension;
$filePath = $uploadDir . $fileName;

// Mover arquivo para o diretório de upload
if (!move_uploaded_file($file['tmp_name'], $filePath)) {
    echo json_encode(['success' => false, 'message' => 'Erro ao salvar arquivo']);
    exit;
}

// Otimizar imagem se necessário
try {
    optimizeImage($filePath, $fileExtension);
} catch (Exception $e) {
    // Se a otimização falhar, continua sem ela
    error_log('Erro na otimização da imagem: ' . $e->getMessage());
}

// URL completa do arquivo
$baseUrl = 'https://app.plandevitalidad.com';
$fileUrl = $baseUrl . '/uploads/imagens/' . $fileName;

// Resposta de sucesso
echo json_encode([
    'success' => true,
    'message' => 'Upload realizado com sucesso',
    'url' => $fileUrl,
    'filename' => $fileName
]);

/**
 * Otimizar imagem reduzindo qualidade se necessário
 */
function optimizeImage($filePath, $extension) {
    $maxWidth = 1920;
    $maxHeight = 1080;
    $quality = 85;
    
    // Verificar se GD está disponível
    if (!extension_loaded('gd')) {
        return;
    }
    
    // Obter dimensões da imagem
    $imageInfo = getimagesize($filePath);
    if (!$imageInfo) {
        return;
    }
    
    $width = $imageInfo[0];
    $height = $imageInfo[1];
    
    // Se a imagem já está no tamanho adequado, não fazer nada
    if ($width <= $maxWidth && $height <= $maxHeight) {
        return;
    }
    
    // Calcular novas dimensões mantendo proporção
    $ratio = min($maxWidth / $width, $maxHeight / $height);
    $newWidth = intval($width * $ratio);
    $newHeight = intval($height * $ratio);
    
    // Criar imagem a partir do arquivo
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            $sourceImage = imagecreatefromjpeg($filePath);
            break;
        case 'png':
            $sourceImage = imagecreatefrompng($filePath);
            break;
        case 'webp':
            $sourceImage = imagecreatefromwebp($filePath);
            break;
        default:
            return;
    }
    
    if (!$sourceImage) {
        return;
    }
    
    // Criar nova imagem redimensionada
    $destImage = imagecreatetruecolor($newWidth, $newHeight);
    
    // Preservar transparência para PNG
    if ($extension === 'png') {
        imagealphablending($destImage, false);
        imagesavealpha($destImage, true);
        $transparent = imagecolorallocatealpha($destImage, 255, 255, 255, 127);
        imagefill($destImage, 0, 0, $transparent);
    }
    
    // Redimensionar imagem
    imagecopyresampled(
        $destImage, $sourceImage,
        0, 0, 0, 0,
        $newWidth, $newHeight, $width, $height
    );
    
    // Salvar imagem otimizada
    switch ($extension) {
        case 'jpg':
        case 'jpeg':
            imagejpeg($destImage, $filePath, $quality);
            break;
        case 'png':
            imagepng($destImage, $filePath, 8);
            break;
        case 'webp':
            imagewebp($destImage, $filePath, $quality);
            break;
    }
    
    // Liberar memória
    imagedestroy($sourceImage);
    imagedestroy($destImage);
}

/**
 * Validar e limpar nome do arquivo
 */
function sanitizeFileName($fileName) {
    // Remover caracteres especiais
    $fileName = preg_replace('/[^a-zA-Z0-9._-]/', '', $fileName);
    
    // Limitar tamanho do nome
    if (strlen($fileName) > 100) {
        $fileName = substr($fileName, 0, 100);
    }
    
    return $fileName;
}

/**
 * Log de upload para auditoria
 */
function logUpload($fileName, $fileSize, $clientIP) {
    $logFile = __DIR__ . '/logs/uploads.log';
    $logDir = dirname($logFile);
    
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    $timestamp = date('Y-m-d H:i:s');
    $logEntry = "[$timestamp] Upload: $fileName | Size: $fileSize bytes | IP: $clientIP" . PHP_EOL;
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// Log do upload (opcional)
$clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
logUpload($fileName, $file['size'], $clientIP);
?>