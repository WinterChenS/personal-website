$loginBody = '{"username":"admin","password":"admin123"}'
$loginRes = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginRes.token

$updateBody = @{
  nickname = "Winter"
  bio = "全栈开发者，热爱技术与开源"
  bioEn = "Full-stack developer passionate about technology"
  location = "中国"
  website = "https://home.662661.xyz"
  github = "https://github.com/winter"
  twitter = ""
  linkedin = ""
  emailPublic = "winter@example.com"
  tags = "全栈开发者,技术爱好者"
  tagsEn = "Full-stack Developer,Tech Enthusiast"
  welcomeText = "你好，我是"
  welcomeTextEn = "Hello, I'm"
  ctaTitle = "一起创造吧"
  ctaTitleEn = "Let's Create Together"
  ctaDescription = "有想法？随时联系我！"
  ctaDescriptionEn = "Have an idea? Let's collaborate!"
  coffeeCount = 999
  starsCount = 888
} | ConvertTo-Json

$headers = @{
  Authorization = "Bearer $token"
  "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:8080/api/admin/profile" -Method Put -Headers $headers -Body $updateBody | ConvertTo-Json

Write-Host "`nTesting zh version:"
Invoke-RestMethod -Uri "http://localhost:8080/api/public/profile?lang=zh" | ConvertTo-Json

Write-Host "`nTesting en version:"
Invoke-RestMethod -Uri "http://localhost:8080/api/public/profile?lang=en" | ConvertTo-Json