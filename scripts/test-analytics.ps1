# Test Analytics Endpoints
# Script para validar que los endpoints de analytics del backend funcionan correctamente

param(
    [string]$ApiUrl = "http://localhost:3001"
)

$ErrorActionPreference = "Continue"
$errors = @()
$warnings = @()

Write-Host "Testing IMAGIQ Analytics Endpoints" -ForegroundColor Cyan
Write-Host "API URL: $ApiUrl" -ForegroundColor Gray
Write-Host ""

# Test 1: GTM Bootstrap
Write-Host "[1/5] Testing GTM Bootstrap..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$ApiUrl/api/custommer/analytics/gtm.js" `
        -Headers @{"x-analytics-consent"="grant"} `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($response.StatusCode -eq 200) {
        if ($response.Content -match "GTM-MS5J6DQT") {
            Write-Host "   [PASS] GTM Bootstrap OK" -ForegroundColor Green
            Write-Host "      - Status: $($response.StatusCode)" -ForegroundColor Gray
            Write-Host "      - Size: $($response.Content.Length) bytes" -ForegroundColor Gray
        } else {
            $errors += "GTM Bootstrap: GTM-MS5J6DQT not found in response"
            Write-Host "   [FAIL] GTM Bootstrap: GTM ID not found" -ForegroundColor Red
        }
    } else {
        $errors += "GTM Bootstrap: Unexpected status $($response.StatusCode)"
        Write-Host "   [FAIL] GTM Bootstrap: Status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    $errors += "GTM Bootstrap: $_"
    Write-Host "   [ERROR] GTM Bootstrap: $_" -ForegroundColor Red
}

Write-Host ""

# Test 2: Meta Pixel Bootstrap
Write-Host "[2/5] Testing Meta Pixel Bootstrap..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$ApiUrl/api/custommer/analytics/meta-pixel.js" `
        -Headers @{"x-analytics-consent"="grant"} `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($response.StatusCode -eq 200) {
        if ($response.Content -match "25730530136536207") {
            Write-Host "   [PASS] Meta Pixel Bootstrap OK" -ForegroundColor Green
            Write-Host "      - Status: $($response.StatusCode)" -ForegroundColor Gray
            Write-Host "      - Size: $($response.Content.Length) bytes" -ForegroundColor Gray
        } else {
            $errors += "Meta Pixel Bootstrap: Pixel ID not found"
            Write-Host "   [FAIL] Meta Pixel Bootstrap: Pixel ID not found" -ForegroundColor Red
        }
    } else {
        $errors += "Meta Pixel Bootstrap: Unexpected status $($response.StatusCode)"
        Write-Host "   [FAIL] Meta Pixel Bootstrap: Status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    $errors += "Meta Pixel Bootstrap: $_"
    Write-Host "   [ERROR] Meta Pixel Bootstrap: $_" -ForegroundColor Red
}

Write-Host ""

# Test 3: GTM Noscript
Write-Host "[3/5] Testing GTM Noscript..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$ApiUrl/api/custommer/analytics/gtm/noscript" `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($response.StatusCode -eq 200) {
        if ($response.Content -match "<iframe" -and $response.Content -match "GTM-MS5J6DQT") {
            Write-Host "   [PASS] GTM Noscript OK" -ForegroundColor Green
            Write-Host "      - Status: $($response.StatusCode)" -ForegroundColor Gray
        } else {
            $errors += "GTM Noscript: Invalid HTML"
            Write-Host "   [FAIL] GTM Noscript: Invalid HTML" -ForegroundColor Red
        }
    } else {
        $errors += "GTM Noscript: Unexpected status $($response.StatusCode)"
        Write-Host "   [FAIL] GTM Noscript: Status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    $errors += "GTM Noscript: $_"
    Write-Host "   [ERROR] GTM Noscript: $_" -ForegroundColor Red
}

Write-Host ""

# Test 4: Meta Pixel Noscript
Write-Host "[4/5] Testing Meta Pixel Noscript..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$ApiUrl/api/custommer/analytics/meta-pixel/noscript" `
        -UseBasicParsing `
        -TimeoutSec 10

    if ($response.StatusCode -eq 200) {
        if ($response.Content -match "<img" -and $response.Content -match "25730530136536207") {
            Write-Host "   [PASS] Meta Pixel Noscript OK" -ForegroundColor Green
            Write-Host "      - Status: $($response.StatusCode)" -ForegroundColor Gray
        } else {
            $errors += "Meta Pixel Noscript: Invalid HTML"
            Write-Host "   [FAIL] Meta Pixel Noscript: Invalid HTML" -ForegroundColor Red
        }
    } else {
        $errors += "Meta Pixel Noscript: Unexpected status $($response.StatusCode)"
        Write-Host "   [FAIL] Meta Pixel Noscript: Status $($response.StatusCode)" -ForegroundColor Red
    }
} catch {
    $errors += "Meta Pixel Noscript: $_"
    Write-Host "   [ERROR] Meta Pixel Noscript: $_" -ForegroundColor Red
}

Write-Host ""

# Test 5: Health Check
Write-Host "[5/5] Testing API Health..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "$ApiUrl/health" `
        -UseBasicParsing `
        -TimeoutSec 5 `
        -ErrorAction SilentlyContinue

    if ($response.StatusCode -eq 200) {
        Write-Host "   [PASS] API Health OK" -ForegroundColor Green
    } else {
        $warnings += "API Health: Status $($response.StatusCode)"
        Write-Host "   [WARN] API Health: Unexpected status" -ForegroundColor Yellow
    }
} catch {
    $warnings += "API Health: Endpoint not found (optional)"
    Write-Host "   [WARN] API Health: Endpoint not found (optional)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""

# Resultado final
$totalTests = 4  # No contamos el health check
$passedTests = $totalTests - $errors.Count

if ($errors.Count -eq 0) {
    Write-Host "SUCCESS: ALL TESTS PASSED" -ForegroundColor Green
    Write-Host "Passed: $passedTests/$totalTests" -ForegroundColor Green

    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Warnings:" -ForegroundColor Yellow
        $warnings | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    }

    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start frontend: npm run dev" -ForegroundColor Gray
    Write-Host "2. Open browser: http://localhost:3000" -ForegroundColor Gray
    Write-Host "3. Check DevTools Console for consent messages" -ForegroundColor Gray
    Write-Host "4. Accept cookies and verify scripts load" -ForegroundColor Gray

    exit 0
} else {
    Write-Host "FAILED: $($errors.Count) TESTS FAILED" -ForegroundColor Red
    Write-Host "Passed: $passedTests/$totalTests" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Errors:" -ForegroundColor Red
    $errors | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }

    if ($warnings.Count -gt 0) {
        Write-Host ""
        Write-Host "Warnings:" -ForegroundColor Yellow
        $warnings | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
    }

    Write-Host ""
    Write-Host "Troubleshooting:" -ForegroundColor Cyan
    Write-Host "1. Ensure backend is running" -ForegroundColor Gray
    Write-Host "2. Ensure api-gateway is on port 3001" -ForegroundColor Gray
    Write-Host "3. Check CORS configuration" -ForegroundColor Gray
    Write-Host "4. Verify .env variables" -ForegroundColor Gray

    exit 1
}
