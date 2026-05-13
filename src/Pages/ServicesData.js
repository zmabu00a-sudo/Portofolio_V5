import { UserCheck, Cpu, Bot, ShieldCheck } from "lucide-react";

export const servicesData = [
  {
    id: 1,
    title: "Kết nối thợ kỹ thuật",
    icon: UserCheck,
    description: "Hệ thống trung gian kết nối người dùng với mạng lưới thợ lành nghề đã qua kiểm duyệt.",
    features: ["Biết trước giá niêm yết", "Hồ sơ thợ minh bạch", "An toàn tuyệt đối"],
    subServices: ["Sửa tủ lạnh", "Sửa máy giặt", "Sửa điều hòa", "Sửa đồ gia dụng"],
    details: "Giải quyết khủng hoảng niềm tin bằng cách công khai đánh giá và lịch sử sửa chữa của thợ."
  },
  {
    id: 2,
    title: "Tìm kiếm linh kiện",
    icon: Cpu,
    description: "Nền tảng cung cấp linh kiện chính hãng từ các nhà phân phối lớn (Samsung, LG, Daikin...).",
    features: ["Xác thực mã QR", "Bảo hành hệ thống", "Giá cả minh bạch"],
    subServices: ["Linh kiện điện lạnh", "Linh kiện điện tử", "Phụ kiện thay thế"],
    details: "Thợ phải chụp mã QR linh kiện để hệ thống kích hoạt bảo hành tự động cho khách hàng."
  },
  {
    id: 3,
    title: "Chẩn đoán lỗi bằng AI",
    icon: Bot,
    description: "Tích hợp AI hỗ trợ kiểm tra lỗi sơ bộ qua hình ảnh và video gửi từ người dùng.",
    features: ["Hỗ trợ 24/7", "Tư vấn sửa lỗi nhẹ miễn phí", "Gợi ý thợ phù hợp"],
    subServices: ["Quét lỗi qua ảnh", "Chatbot tư vấn", "Video hướng dẫn"],
    details: "Giúp người dùng tiết kiệm thời gian và tránh bị 'vẽ bệnh' cho những lỗi vận hành cơ bản."
  },
  {
    id: 4,
    title: "Gói Bảo hiểm thiết bị",
    icon: ShieldCheck,
    description: "Mô hình đăng ký bảo trì định kỳ 6 tháng/lần cho hộ gia đình và văn phòng.",
    features: ["Ưu tiên xử lý 24/7", "Bảo trì định kỳ", "Tiết kiệm chi phí"],
    subServices: ["Gói Standard", "Gói Premium", "Gói Office"],
    details: "Đảm bảo thiết bị luôn trong tình trạng tốt nhất, giảm rủi ro hỏng hóc đột ngột."
  }
];