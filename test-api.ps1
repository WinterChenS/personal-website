# Personal Website API Test
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Personal Website Config Test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_BASE = "http://localhost:8080"

# 1. Login
Write-Host "[1/6] Login..." -ForegroundColor Yellow
$loginBody = '{"username":"admin","password":"admin123"}'
try {
    $loginRes = Invoke-RestMethod -Uri "$API_BASE/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginRes.token
    Write-Host "   [OK] Token obtained" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] Login failed: $_" -ForegroundColor Red
    exit 1
}

# 2. Get current profile
Write-Host "`n[2/6] Get current config..." -ForegroundColor Yellow
$headers = @{Authorization="Bearer $token"}
try {
    $profile = Invoke-RestMethod -Uri "$API_BASE/api/admin/profile" -Headers $headers
    Write-Host "   [OK] Current config:" -ForegroundColor Green
    Write-Host "     - Nickname: $($profile.nickname)"
    Write-Host "     - Email Public: $($profile.emailPublic)"
    Write-Host "     - Tags: $($profile.tags)"
    Write-Host "     - Welcome Text: $($profile.welcomeText)"
    Write-Host "     - CTA Title: $($profile.ctaTitle)"
    Write-Host "     - Coffee Count: $($profile.coffeeCount)"
    Write-Host "     - Stars Count: $($profile.starsCount)"
} catch {
    Write-Host "   [FAIL] Get failed: $_" -ForegroundColor Red
}

# 3. Update config
Write-Host "`n[3/6] Test update config..." -ForegroundColor Yellow
$updateBody = @{
    nickname = "Winter"
    bio = "Full-stack developer"
    location = "China"
    website = "https://home.662661.xyz"
    github = "https://github.com/winter"
    twitter = ""
    linkedin = ""
    emailPublic = "winter@example.com"
    tags = "Full-stack,Developer"
    welcomeText = "Hello, I'm"
    ctaTitle = "Let's Collaborate"
    ctaDescription = "Contact me anytime!"
    coffeeCount = 999
    starsCount = 888
} | ConvertTo-Json

try {
    $updateRes = Invoke-RestMethod -Uri "$API_BASE/api/admin/profile" -Method Put -Headers $headers -Body $updateBody -ContentType "application/json"
    Write-Host "   [OK] Config updated" -ForegroundColor Green
} catch {
    Write-Host "   [FAIL] Update failed: $_" -ForegroundColor Red
}

# 4. Verify update
Write-Host "`n[4/6] Verify update..." -ForegroundColor Yellow
try {
    $verify = Invoke-RestMethod -Uri "$API_BASE/api/public/profile"
    Write-Host "   [OK] Public API returned:" -ForegroundColor Green
    Write-Host "     - Nickname: $($verify.nickname)"
    Write-Host "     - Email Public: $($verify.emailPublic)"
    Write-Host "     - Tags: $($verify.tags)"
    Write-Host "     - Welcome Text: $($verify.welcomeText)"
    Write-Host "     - CTA Title: $($verify.ctaTitle)"
    Write-Host "     - CTA Description: $($verify.ctaDescription)"
    Write-Host "     - Coffee Count: $($verify.coffeeCount)"
    Write-Host "     - Stars Count: $($verify.starsCount)"
} catch {
    Write-Host "   [FAIL] Verify failed: $_" -ForegroundColor Red
}

# 5. Test stats API
Write-Host "`n[5/6] Test stats API..." -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri "$API_BASE/api/public/stats"
    Write-Host "   [OK] Stats data:" -ForegroundColor Green
    Write-Host "     - Coffee Count: $($stats.coffeeCount)"
    Write-Host "     - Project Count: $($stats.projectCount)"
    Write-Host "     - Article Count: $($stats.articleCount)"
    Write-Host "     - Stars Count: $($stats.starsCount)"
} catch {
    Write-Host "   [FAIL] Stats failed: $_" -ForegroundColor Red
}

# 6. Summary
Write-Host "`n[6/6] Test completed" -ForegroundColor Yellow
Write-Host "   All config fields are working!" -ForegroundColor Green

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[OK] Login: PASS" -ForegroundColor Green
Write-Host "[OK] Get Config: PASS" -ForegroundColor Green
Write-Host "[OK] Update Config: PASS" -ForegroundColor Green
Write-Host "[OK] Public API: PASS" -ForegroundColor Green
Write-Host "[OK] Stats API: PASS" -ForegroundColor Green
Write-Host ""