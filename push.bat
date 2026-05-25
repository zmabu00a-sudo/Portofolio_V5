@echo off
:: Di chuyển đến thư mục dự án (nếu bạn chạy file bat từ nơi khác)
:: cd /d "C:\WEB\Portofolio_V5"

echo Đang thêm file vào Git...
git add .

echo Đang commit thay đổi...
:: Bạn có thể thay đổi nội dung "Auto update" bên dưới
git commit -m "Auto update: %date% %time%"

echo Đang đẩy code lên GitHub...
git push origin main

echo Done! Đã push thành công.
pause