$ErrorActionPreference = "Stop"

$BASE_URL = "https://gogig-api.onrender.com"
$SAMPLE_DIR = ".\sample-images"
$OUTPUT = ".\docs\production-test-results.md"

New-Item -ItemType Directory -Force -Path ".\docs" | Out-Null

function Write-Section($text) {
    Add-Content -Path $OUTPUT -Value "`n$text`n"
}

function Write-Code($text) {
    Add-Content -Path $OUTPUT -Value '```text'
    Add-Content -Path $OUTPUT -Value $text
    Add-Content -Path $OUTPUT -Value '```'
}

"# GoGig Intelligent Media Pipeline - Sample API Results" | Set-Content $OUTPUT
Add-Content $OUTPUT "Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss zzz')"
Add-Content $OUTPUT "Production API: $BASE_URL"
Add-Content $OUTPUT ""
Add-Content $OUTPUT "> This file contains production API evidence for all three provided sample images plus important edge-case tests."

Write-Section "## 1. Production Health Check"
$health = curl.exe -s "$BASE_URL/health"
Write-Code "GET $BASE_URL/health`n`n$health"

Write-Section "## 2. Root Route"
$root = curl.exe -s "$BASE_URL/"
Write-Code "GET $BASE_URL/`n`n$root"

$results = @()

foreach ($i in 1..3) {
    $file = Join-Path $SAMPLE_DIR "sample_$i.png"

    Write-Section "## 3.$i Sample Image $i - Upload, Async Status and Result"

    if (-not (Test-Path $file)) {
        Add-Content $OUTPUT "**ERROR:** File not found: ``$file``"
        continue
    }

    $uploadRaw = curl.exe -s -X POST "$BASE_URL/api/v1/images" -F "image=@$file"
    Add-Content $OUTPUT "### Upload"
    Write-Code "POST $BASE_URL/api/v1/images`n-F image=@$file`n`n$uploadRaw"

    try {
        $upload = $uploadRaw | ConvertFrom-Json
        $processingId = $upload.data.processingId
    } catch {
        Add-Content $OUTPUT "**Could not parse upload response as JSON.**"
        continue
    }

    if ([string]::IsNullOrWhiteSpace($processingId)) {
        Add-Content $OUTPUT "**Upload did not return a processingId.**"
        continue
    }

    Add-Content $OUTPUT "Processing ID: $processingId"

    $finalStatus = $null
    $statusHistory = @()

    for ($attempt = 1; $attempt -le 60; $attempt++) {
        Start-Sleep -Seconds 2
        $statusRaw = curl.exe -s "$BASE_URL/api/v1/images/$processingId/status"
        $statusHistory += $statusRaw

        try {
            $statusJson = $statusRaw | ConvertFrom-Json
            $finalStatus = $statusJson.data.status
        } catch {
            $finalStatus = "unknown"
        }

        if ($finalStatus -in @("completed","failed")) {
            break
        }
    }

    Add-Content $OUTPUT "### Status polling"
    Write-Code ("GET $BASE_URL/api/v1/images/$processingId/status`n`n" + ($statusHistory -join "`n"))

    $resultRaw = curl.exe -s "$BASE_URL/api/v1/images/$processingId/result"
    Add-Content $OUTPUT "### Final Result"
    Write-Code "GET $BASE_URL/api/v1/images/$processingId/result`n`n$resultRaw"

    $results += [PSCustomObject]@{
        Sample = "sample_$i.png"
        ProcessingId = $processingId
        FinalStatus = $finalStatus
    }
}

Write-Section "## 4. Edge Case Tests"

Write-Section "### 4.1 Missing image file"
$missing = curl.exe -s -X POST "$BASE_URL/api/v1/images"
Write-Code "POST $BASE_URL/api/v1/images`n`n$missing"

Write-Section "### 4.2 Invalid file type"
$invalidFile = Join-Path $env:TEMP "gogig-invalid-test.txt"
"this is not an image" | Out-File -Encoding ascii $invalidFile
$invalid = curl.exe -s -X POST "$BASE_URL/api/v1/images" -F "image=@$invalidFile"
Write-Code "POST $BASE_URL/api/v1/images`n-F image=@$invalidFile`n`n$invalid"

Write-Section "### 4.3 Non-existent processing ID - status"
$zeroId = "00000000-0000-0000-0000-000000000000"
$notFoundStatus = curl.exe -s "$BASE_URL/api/v1/images/$zeroId/status"
Write-Code "GET $BASE_URL/api/v1/images/$zeroId/status`n`n$notFoundStatus"

Write-Section "### 4.4 Non-existent processing ID - result"
$notFoundResult = curl.exe -s "$BASE_URL/api/v1/images/$zeroId/result"
Write-Code "GET $BASE_URL/api/v1/images/$zeroId/result`n`n$notFoundResult"

Write-Section "## 5. Test Summary"
Add-Content $OUTPUT "| Test | Expected behavior |"
Add-Content $OUTPUT "|---|---|"
Add-Content $OUTPUT "| Health check | API UP and database/Redis UP |"
Add-Content $OUTPUT "| 3 sample uploads | Each returns a unique processing ID |"
Add-Content $OUTPUT "| Async processing | Status progresses through pending/processing to completed or failed |"
Add-Content $OUTPUT "| Result API | Returns structured image checks and vehicle/AI analysis |"
Add-Content $OUTPUT "| Missing file | MISSING_FILE error |"
Add-Content $OUTPUT "| Invalid MIME type | INVALID_FILE_TYPE error |"
Add-Content $OUTPUT "| Unknown processing ID | NOT_FOUND error |"

Write-Section "## 6. Notes"
Add-Content $OUTPUT "- Production endpoint is intentionally API-first; `GET /` currently returns `ROUTE_NOT_FOUND`, which is not a core assignment failure."
Add-Content $OUTPUT "- The assignment explicitly lists a dashboard/UI as optional bonus, so a minimal upload-and-results page can be added if time permits."
Add-Content $OUTPUT "- Do not manually edit the generated JSON outputs. Re-run this script after deployment changes to regenerate the evidence."

Write-Section "## 7. Production Run Summary"
$results | Format-Table -AutoSize | Out-String | ForEach-Object { Add-Content $OUTPUT $_ }

Write-Host "Created $OUTPUT"
Write-Host "Run this script from the repository root after ensuring sample-images/sample_1.png, sample_2.png and sample_3.png exist."
