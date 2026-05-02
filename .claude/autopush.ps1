$d = [Console]::In.ReadToEnd() | ConvertFrom-Json
$f = $d.tool_input.file_path
if ($f -notlike 'C:\Users\stasn\Downloads\wc2026-pwa*') { exit 0 }
Set-Location 'C:\Users\stasn\Downloads\wc2026-pwa'
git add -u
$status = git status --porcelain
if (-not $status) { exit 0 }
$name = [System.IO.Path]::GetFileName($f)
git commit -m "Update $name" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) { git push origin main 2>&1 | Out-Null }
