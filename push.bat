@echo off
echo --- BAT DAU PUSH CODE LEN GITHUB ---
git add .
git commit -m "Auto update: %date% %time%"
git push origin main
if %errorlevel% neq 0 (
    echo [LOI] Co loi xay ra khi push! Hay kiem tra ket noi mang.
) else (
    echo [THANH CONG] Code da len GitHub!
    echo Vui long kiem tra trang Dashboard cua Vercel.
)
pause