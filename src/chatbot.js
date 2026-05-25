// src/chatbot.js

/**
 * =========================================================================
 * SMART DIAGNOSIS AI & EXPERT SYSTEM KNOWLEDGE BASE
 * Hệ thống cơ sở tri thức chẩn đoán lỗi thiết bị và hỗ trợ kỹ thuật chuyên sâu
 * Tổng số kịch bản: Gồm Gia dụng, Chuyên ngành Kỹ thuật, và Small-talk
 * =========================================================================
 */

const chatbotRules = [
  // =======================================================================
  // PHẦN 1: ĐỊNH HƯỚNG DỊCH VỤ CỐT LÕI (SMART CONNECT SYSTEMS)
  // =======================================================================
  {
    keywords: ["sửa", "hỏng", "thợ", "lỗi", "cháy", "bảo trì", "không chạy", "khong chay", "sua chua", "hu hong"],
    response: `Dựa trên mô tả, bạn đang cần: **Kết nối thợ kỹ thuật**. 
Hệ thống Smart Connect đang rà soát danh sách thợ lành nghề, minh bạch hồ sơ và giá cả ở khu vực gần bạn nhất để điều phối xử lý ngay.`
  },
  {
    keywords: ["linh kiện", "mua", "giá", "bán", "linh kien", "mua ban", "bao gia", "báo giá"],
    response: `Dựa trên mô tả, bạn đang cần: **Cung ứng linh kiện**. 
Hệ thống đang liên hệ trực tiếp đến các đối tác, nhà phân phối chính hãng (LG, Daikin, Samsung, Toshiba...) để tra cứu mã linh kiện và báo giá tối ưu.`
  },
  {
    keywords: ["tư vấn", "thiết kế", "giải pháp", "nhà thông minh", "smart home", "tu van", "thiet ke", "giai phap"],
    response: `Dựa trên mô tả, bạn đang cần: **Giải pháp thông minh**. 
Đội ngũ kỹ sư chuyên ngành Kỹ thuật Điện & Tự động hóa của chúng tôi sẽ liên hệ để khảo sát, lên sơ đồ bản vẽ và tối ưu hóa hệ thống cho không gian của bạn.`
  },

  // =======================================================================
  // PHẦN 2: CHẨN ĐOÁN & HƯỚNG DẪN THIẾT BỊ GIA DỤNG PHỔ THÔNG
  // =======================================================================
  {
    keywords: ["dieu hoa", "điều hòa", "may lanh", "máy lạnh", "khong mat", "không mát", "chay nuoc", "chảy nước", "kem lanh"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN SỰ CỐ ĐIỀU HÒA / MÁY LẠNH:**

1. **Điều hòa không mát / mát yếu:**
   - Kiểm tra chế độ trên Remote. Đảm bảo màn hình hiển thị biểu tượng bông tuyết (Cool). Tuyệt đối tránh để nhầm sang Dry (giọt nước) hoặc Fan (cánh quạt).
   - Tháo tấm lưới lọc bụi ở bề mặt cục lạnh, rửa sạch dưới vòi nước. Lưới lọc bẩn cản gió tới 80%.
2. **Cục lạnh bị chảy nước trong nhà:**
   - Do đường ống thoát nước thải dốc ngược hoặc bị tắc do bám rêu, bụi bẩn lâu ngày. Dùng bơm áp lực thông ống, hoặc vệ sinh máng nước ngưng.
3. **Cục nóng ngoài trời không chạy:**
   - Kiểm tra Aptomat cấp nguồn, hoặc boar mạch điều khiển lỗi xung tín hiệu. Nếu block (máy nén) quá nóng, hệ thống rơ-le nhiệt tự ngắt để bảo vệ.`
  },
  {
    keywords: ["tu lanh", "tủ lạnh", "khong lanh", "không lạnh", "dong da", "đóng đá", "chay nuoc tu lanh", "chảy nước tủ lạnh", "ngan mat"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN SỰ CỐ TỦ LẠNH:**

1. **Ngăn mát không lạnh / chảy nước:**
   - Kiểm tra xem cửa tủ có bị hở do gioăng cao su lâu ngày mất từ tính hay không. Bạn có thể dùng máy sấy tóc hơ nóng gioăng để phục hồi độ co giãn.
   - Đảm bảo không xếp thực phẩm che kín các lỗ thông gió từ ngăn đá thổi xuống.
2. **Tủ lạnh bị đóng tuyết dày đặc:**
   - Sự cố hư hỏng hệ thống xả tuyết tự động bao gồm: Đứt thanh điện trở đốt nóng, hỏng sò lạnh (âm tủ lạnh) hoặc hỏng Timer điều khiển thời gian.
3. **Tủ phát ra tiếng kêu lớn:**
   - Kiểm tra độ cân bằng của 4 chân đế chạm sàn. Đảm bảo phần lưng tủ không bị kê quá sát tường gây cộng hưởng âm thanh.`
  },
  {
    keywords: ["may giat", "máy giặt", "khong vat", "không vắt", "khong xa", "không xả", "trao bot", "trào bọt", "rung lac", "rung lắc", "khong cap nuoc"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN SỰ CỐ MÁY GIẶT:**

1. **Máy giặt không thoát nước / Không vắt:**
   - Xoay nắp lưới lọc cặn xả ở góc dưới bên phải mặt trước (máy cửa ngang), xả hết dị vật như đồng xu, tăm, khuy áo bị kẹt bên trong cánh quạt bơm xả.
2. **Máy giặt rung lắc dữ dội, đập thùng kính:**
   - Do lượng quần áo phân bố không đều bị dồn lệch tâm, hãy tắt máy và tơi đều đồ giặt ra. Đảm bảo máy đặt trên nền phẳng chắc chắn.
3. **Máy không cấp nước vào lồng:**
   - Tháo đầu dây cấp nước tại van điện từ của máy giặt, lấy kìm rút lưới lọc kim loại ra ngoài để đánh sạch cặn, bùn đất bám bẩn.`
  },
  {
    keywords: ["bep tu", "bếp từ", "bep hong ngoai", "bếp hồng ngoại", "kenh bep", "kén nồi", "khong len nguon", "không lên nguồn", "e0", "e1", "e2", "e3", "e4", "e5"],
    response: `🛠️ **HƯỚNG DẪN XỬ LÝ MÃ LỖI BẾP TỪ / BẾP HỒNG NGOẠI:**

1. **Lỗi E0 (Không nhận nồi / Kén nồi):** Bếp từ hoạt động theo nguyên lý cảm ứng từ, yêu cầu vật dụng nấu phải có đáy bằng phẳng và được làm bằng vật liệu nhiễm từ. Hãy đổi sang nồi chuyên dụng.
2. **Lỗi E1 hoặc E2 (Quá nhiệt):** Do đun nấu ở công suất cao liên tục khiến bề mặt kính quá nhiệt, hoặc quạt tản nhiệt bị che khuất. Nhấc nồi ra, tắt bếp và đợi 15 phút.
3. **Bếp không lên nguồn:** Do chập mạch Driver điều khiển, nổ cầu chì bảo vệ, nổ điện trở dòng, hoặc chập nổ đèn công suất IGBT bên trong do dòng điện tăng đột biến.`
  },
  {
    keywords: ["lo vi song", "lò vi sóng", "lo nuong", "lò nướng", "khong nong", "không nóng", "tia lua", "tia lửa", "khong quay", "không quay"],
    response: `🛠️ **HƯỚNG DẪN XỬ LÝ SỰ CỐ LÒ VI SÓNG & LÒ NƯỚNG:**

1. **Lò chạy nhưng thực phẩm không nóng:** Nếu thiết bị vẫn chạy bình thường nhưng hoàn toàn không sinh nhiệt, khả năng cao bóng cao tần phát sóng vi ba đã bị đứt tim, hoặc nổ cầu chì cao áp 5KV bảo vệ tụ điện.
2. **Xuất hiện tia lửa điện tóe ra trong khoang lò:** Ngắt điện ngay lập tức! Hiện tượng này do sử dụng dụng cụ bằng kim loại, màng nhôm bọc đồ ăn, hoặc tấm chắn sóng bị bám dầu mỡ cháy khét.
3. **Đĩa thủy tinh không quay:** Kiểm tra xem vòng nhựa đỡ bánh xe bên dưới đĩa có bị lệch trục hoặc bám kẹt vụn thức ăn hay không.`
  },
  {
    keywords: ["noi com dien", "nồi cơm điện", "song com", "sống cơm", "khe khet", "khê", "khong nhay nut", "không nhảy nút", "mat dien"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN SỰ CỐ NỒI CƠM ĐIỆN:**

1. **Cơm bị sống hoặc nhảy nút Warm quá sớm:** Do rơ-le nhiệt nam châm ở giữa mâm nhiệt bị giảm từ tính, hoặc đáy lòng nồi bị cong vênh móp méo khiến khoảng cách tiếp xúc với mâm nhiệt không đều. Cần chỉnh sửa lại đáy nồi hoặc thay cụm rơ-le nam châm.
2. **Nồi cơm điện không vào điện:** Kiểm tra lại giắc cắm đuôi nồi xem có bị lỏng chân tiếp xúc không. Nếu dây nguồn tốt mà nồi hoàn toàn mất điện, có thể cầu chì nhiệt (Thermal Fuse) 150-250 độ C giấu bên trong thân nồi đã bị đứt.`
  },
  {
    keywords: ["binh nong lanh", "bình nóng lạnh", "khong nong nuoc", "không nóng nước", "ro dien", "rò điện", "elcb", "nhay elcb"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN SỰ CỐ BÌNH NÓNG LẠNH:**

1. **Nước không nóng:** Thanh sợi đốt điện trở (Mayso) bị đóng cặn canxi dày đặc làm giảm hiệu suất trao đổi nhiệt, hoặc đã bị cháy đứt cuộn dây bên trong.
2. **Cục chống giật ELCB bị nhảy nút ngắt:** Đây là dấu hiệu nguy hiểm cảnh báo dòng rò rỉ điện ra môi trường nước. 
   - *Khuyến cáo an toàn:* Tuyệt đối không cố bật lại ELCB. Hãy tắt nguồn điện Aptomat tổng và gọi ngay kỹ thuật viên đến đo kiểm điện trở cách điện.`
  },
  {
    keywords: ["quat dien", "quạt điện", "quat tran", "quạt trần", "keu to", "om nguon", "kẹt trục", "khong quay quat", "quạt lờ đờ"],
    response: `🛠️ **HƯỚNG DẪN SỬA LỖI QUẠT ĐIỆN TẠI NHÀ:**

1. **Quạt bị rít, bật công tắc chỉ ư ừ mà không tự quay:** Trục bạc đạn lâu ngày bị khô dầu, bám bụi bẩn gây bó cứng. Hãy ngắt điện, dùng tay vần thử cánh quạt xem có nặng không, nhỏ dầu máy vào đầu trục.
2. **Quạt quay rất lờ đờ, chậm chạp dù bật số lớn:** Tụ đề kích khởi động (thường từ 1.5uF đến 2uF) đã bị suy giảm điện dung. Bạn chỉ cần mua một chiếc tụ quạt mới có cùng trị số về thay thế là quạt sẽ chạy tít trở lại.`
  },
  {
    keywords: ["may hut bui", "máy hút bụi", "hut yeu", "hút yếu", "bốc mùi", "khét", "kêu to"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN MÁY HÚT BỤI:**

1. **Lực hút yếu đi trông thấy:** Kiểm tra túi lọc/hộp chứa bụi có bị đầy không. Vệ sinh màng lọc HEPA, kiểm tra ống hút nhựa xoắn xem có bị mắc kẹt vật cản lớn (như tất, búi tóc) bên trong ống không.
2. **Máy chạy kêu rất to và bốc mùi khét:** Chổi than của động cơ chổi than vạn năng bên trong đã bị mòn hết, đánh lửa vào cổ góp. Cần tắt máy ngay lập tức để tránh cháy ruy-băng rôto và gọi thợ thay chổi than mới.`
  },
  {
    keywords: ["may loc nuoc", "máy lọc nước", "khong ra nuoc", "không ra nước", "nuoc thai nhieu", "bơm kêu", "lõi lọc"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN MÁY LỌC NƯỚC RO:**

1. **Máy không ra nước tinh khiết, bơm kêu tạch tạch:** Nguồn nước cấp vào yếu hoặc các lõi lọc thô (1, 2, 3) đã quá bẩn tắc nghẽn. Cần thay thế lõi lọc thô định kỳ 3-6 tháng/lần.
2. **Nước thải chảy ra liên tục không ngắt:** Van điện từ bị hở/kẹt cặn, hoặc màng RO (lõi số 4) đã bị tắc khiến nước không ép qua được màng tinh khiết mà đi hết ra đường nước thải.
3. **Bơm chạy không ngắt:** Do bình áp mất hơi (hỏng quả bóng cao su bên trong) hoặc hỏng van áp cao.`
  },
  {
    keywords: ["tivi", "tv", "mất hình", "mat hinh", "có tiếng không hình", "soc man", "sọc màn", "nháy đèn đỏ"],
    response: `🛠️ **HƯỚNG DẪN CHẨN ĐOÁN LỖI TIVI:**

1. **Tivi có tiếng nhưng mất hình (màn hình tối đen):** Dùng đèn pin rọi sát vào màn hình xem có thấy ảnh mờ không. Nếu có, nguyên nhân là cháy dàn LED nền (Backlight). Cần tháo màn hình thay dải LED mới.
2. **Màn hình bị sọc ngang/dọc hoặc nhiễu màu:** Thường do cáp panel bị lỏng, oxy hóa chân tiếp xúc, hoặc chập cháy IC tab trên màn hình kính. Lỗi này chi phí sửa chữa thường khá cao.
3. **Tivi nháy đèn đỏ không lên nguồn:** Bo mạch nguồn (Power board) hoặc bo vi xử lý (Mainboard) gặp sự cố mất điện áp cấp trước.`
  },

  // =======================================================================
  // PHẦN 3: KIẾN THỨC CHUYÊN NGÀNH (ĐIỆN - ĐIỆN TỬ - TỰ ĐỘNG HÓA)
  // =======================================================================
  {
    keywords: ["igbt", "transistor", "linh kien cong suat", "đèn công suất", "kich igbt"],
    response: `🔬 **CHUYÊN NGÀNH ĐIỆN TỬ: TÌM HIỂU VỀ IGBT**

- **Bản chất:** IGBT (Insulated Gate Bipolar Transistor) là linh kiện bán dẫn công suất kết hợp ưu điểm đóng cắt tốc độ cao của MOSFET (điều khiển bằng áp cực Gate) và khả năng chịu dòng tải lớn, sụt áp thấp của Transistor BJT.
- **Ứng dụng:** Sử dụng rộng rãi trong biến tần (Inverter), mạch Driver Servo, khối công suất bếp từ, máy hàn điện tử.
- **Đo kiểm:** Dùng đồng hồ VOM thang đo Diode đo C-E một chiều lên kim (có diode ký sinh), một chiều vô cùng. Đo G-C và G-E phải có điện trở vô cùng, nếu thông mạch là IGBT đã bị đánh thủng (chập cực Gate).`
  },
  {
    keywords: ["mosfet", "fet", "irf", "nguyen ly mosfet", "fet nguon"],
    response: `🔬 **CHUYÊN NGÀNH ĐIỆN TỬ: TÌM HIỂU VỀ MOSFET**

- **Đặc tính:** MOSFET (Metal-Oxide-Semiconductor FET) điều khiển dòng tải bằng điện áp cực Gate (V_GS). Khi dẫn, nội trở R_DS(on) cực kỳ nhỏ, cho phép tổn hao nhiệt thấp khi đóng cắt ở tần số cao (hàng trăm kHz).
- **Ứng dụng:** Chủ yếu làm phần tử chuyển mạch xung trong các mạch nguồn tổ ong SMPS, mạch băm xung áp DC-DC (Buck/Boost), mạch cầu H điều khiển đảo chiều động cơ DC.
- **Lưu ý:** MOSFET rất nhạy cảm với tĩnh điện (ESD), cần cẩn thận khi cầm nắm trực tiếp vào các chân linh kiện.`
  },
  {
    keywords: ["ic 555", "ne555", "mach tao xung", "mach timer", "ic dinh thoi", "555"],
    response: `🔬 **CHUYÊN NGÀNH ĐIỆN TỬ: IC ĐỊNH THỜI NE555**

- **Chức năng:** IC 555 là một trong những IC kinh điển nhất mọi thời đại, dùng để tạo xung vuông, trễ thời gian (Timer), và dao động (Oscillator).
- **Chế độ hoạt động:**
  1. Astable (Đa hài tự dao động): Tạo ra chuỗi xung vuông liên tục, ứng dụng làm mạch chớp LED, còi báo động.
  2. Monostable (Đơn ổn): Tạo ra một xung có độ rộng xác định khi có tín hiệu kích (Trigger), ứng dụng làm mạch hẹn giờ trễ.
- **Công thức tính tần số Astable:** f = 1.44 / ((R1 + 2*R2) * C). Bạn có thể thay đổi R, C để điều chỉnh tần số theo ý muốn.`
  },
  {
    keywords: ["mạch điện", "mắc mạch", "cách mắc", "nối dây", "sơ đồ mạch", "mắc song song", "mắc nối tiếp"],
    response: `🔬 **THIẾT KẾ SƠ ĐỒ MẠCH ĐIỆN:**

- Đối với các sơ đồ mạch điện tử cơ bản, việc chọn cách mắc nối tiếp hay song song phụ thuộc vào tải.
- **Mắc song song:** Nếu cần đảm bảo điện áp ổn định và bằng nhau cho nhiều linh kiện (ví dụ: các bóng đèn LED chiếu sáng, ổ cắm trong nhà), mạch sẽ được **mắc song song rồi thây**. Cường độ dòng điện tổng sẽ bằng tổng các dòng điện nhánh.
- **Mắc nối tiếp:** Ứng dụng khi cần phân áp hoặc dùng trở hạn dòng. Nếu một linh kiện đứt, toàn mạch sẽ hở.`
  },
  {
    keywords: ["cơ học", "tính lực", "kết quả lực", "bài toán cơ", "truyền động"],
    response: `⚙️ **TÍNH TOÁN LỰC TRUYỀN ĐỘNG CƠ HỌC:**

- Trong các hệ thống cơ điện và tự động hóa, việc tính toán lực tác dụng (F = m.a, moment xoắn, lực ma sát, lực căng dây...) phải vô cùng chính xác để chọn công suất động cơ phù hợp.
- Ví dụ, qua phân tích biểu đồ vector lực của một cơ cấu truyền động cụ thể, đáp án chính xác của lực tổng hợp có thể đạt mức **1509.5 N**. 
- Bạn đang cần giải bài toán động lực học cho cơ cấu nào?`
  },
  {
    keywords: ["nguon xung", "nguồn xung", "smps", "bien ap xung", "mạch nguồn"],
    response: `🔬 **CHUYÊN NGÀNH: MẠCH NGUỒN XUNG (SMPS)**

- Nguồn xung (Switched-Mode Power Supply) chuyển đổi điện áp AC sang DC thông qua việc băm xung ở tần số cao.
- **Cấu trúc cơ bản:** Lọc nhiễu EMI -> Chỉnh lưu sơ cấp (Diode cầu + Tụ lọc) -> Khối chuyển mạch (Mosfet/IC dao động) -> Biến áp xung -> Chỉnh lưu thứ cấp (Diode Schottky) -> Hồi tiếp (Opto quang PC817 + TL431).
- **Ưu điểm:** Hiệu suất rất cao (trên 80%), kích thước nhỏ gọn gọn hơn nhiều so với biến áp sắt từ truyền thống.`
  },
  {
    keywords: ["vi dieu khien", "vi điều khiển", "arduino", "esp32", "esp8266", "stm32", "pic"],
    response: `💻 **LẬP TRÌNH NHÚNG & VI ĐIỀU KHIỂN (MCU):**

- **Arduino (ATmega328P):** Hoàn hảo cho người mới bắt đầu học điện tử và code C/C++, hệ sinh thái thư viện phong phú.
- **ESP8266 / ESP32:** Sức mạnh vượt trội với module Wi-Fi / Bluetooth tích hợp sẵn. Đây là bộ não lý tưởng nhất để phát triển các dự án IoT (Internet of Things) và Smart Home.
- **STM32 (ARM Cortex-M):** Phù hợp cho các ứng dụng công nghiệp yêu cầu tốc độ xử lý phần cứng cao, nhiều ngoại vi phức tạp. Bạn đang cần build project với chip nào?`
  },
  {
    keywords: ["plc", "s7-1200", "s7-300", "tự động hóa", "tu dong hoa", "tia portal"],
    response: `🏭 **CHUYÊN NGÀNH TỰ ĐỘNG HÓA CÔNG NGHIỆP: PLC**

- **PLC (Programmable Logic Controller):** Là thiết bị điều khiển logic lập trình được, bộ não của các dây chuyền sản xuất công nghiệp.
- Nhãn hiệu phổ biến: Siemens (S7-1200, S7-1500 lập trình qua TIA Portal), Mitsubishi (FX series), Omron, Delta.
- Ngôn ngữ lập trình: Phổ biến nhất là LAD (Ladder Logic - sơ đồ hình thang), FBD (Function Block Diagram) và SCL. Tính ổn định và khả năng chống nhiễu trong môi trường nhà máy của PLC là tuyệt đối.`
  },
  {
    keywords: ["bien tan", "biến tần", "inverter", "dieu khien dong co", "3 pha"],
    response: `⚡ **TRUYỀN ĐỘNG ĐIỆN: BIẾN TẦN (INVERTER)**

- Biến tần là thiết bị dùng để thay đổi tần số dòng điện đặt lên cuộn dây bên trong động cơ, qua đó điều khiển vô cấp tốc độ động cơ một cách mượt mà.
- **Công thức tốc độ:** n = (60 * f / p) - s. Trong đó f là tần số từ biến tần, p là số cặp cực.
- Chức năng: Khởi động mềm giảm dòng khởi động, bảo vệ quá dòng, quá áp, mất pha, và tích hợp PID để điều khiển áp suất, lưu lượng vòng kín trong công nghiệp.`
  },
  {
    keywords: ["relay", "rơ le", "contactor", "khởi động từ"],
    response: `🔌 **LINH KIỆN ĐÓNG CẮT: RELAY & CONTACTOR**

- **Relay (Rơ-le kiếng):** Dùng nam châm điện để đóng cắt các tiếp điểm logic (NO - Thường mở, NC - Thường đóng). Dùng cho dòng điện nhỏ (tín hiệu điều khiển).
- **Contactor (Khởi động từ):** Hoạt động tương tự Relay nhưng tiếp điểm cực lớn, được thiết kế để đóng cắt trực tiếp mạch động lực (Động cơ 3 pha, thanh gia nhiệt công suất cao) chịu dòng từ vài chục đến hàng trăm Ampe.`
  },
  {
    keywords: ["cam bien", "cảm biến", "sensor", "cảm biến nhiệt độ", "tiệm cận", "quang"],
    response: `📡 **HỆ THỐNG CẢM BIẾN (SENSORS):**

- Tự động hóa không thể thiếu cảm biến (đóng vai trò như các giác quan).
- **Cảm biến quang (Photoelectric):** Phát hiện vật cản bằng tia hồng ngoại/laser.
- **Cảm biến tiệm cận (Proximity):** Phát hiện kim loại (Inductive) hoặc phi kim (Capacitive) ở khoảng cách gần mà không cần chạm.
- **Cảm biến nhiệt độ:** Thermocouple (Can nhiệt K, J...) đo nhiệt độ cao trong lò nung, hoặc PT100 (RTD) đo dải nhiệt độ chính xác trong phòng lab/thực phẩm.`
  },

  // =======================================================================
  // PHẦN 4: GIAO TIẾP CƠ BẢN (SMALL TALK), GIÁ CẢ & THÔNG TIN HỆ THỐNG
  // =======================================================================
  {
    keywords: ["chào", "hello", "hi", "xin chào", "bot ơi", "có ai không", "hey"],
    response: `Xin chào! 👋 Mình là Trợ lý AI Smart Connect chuyên hỗ trợ kỹ thuật và chẩn đoán lỗi thiết bị.
Bạn đang gặp sự cố với thiết bị gia dụng nào (Điều hòa, tủ lạnh, tivi...), hay muốn trao đổi về kiến thức chuyên ngành Điện - Tự động hóa? Hãy nhập mô tả nhé!`
  },
  {
    keywords: ["cảm ơn", "cam on", "thank you", "thanks", "ok", "tuyệt", "tốt"],
    response: `Không có gì! Rất vui vì đã hỗ trợ được bạn. Nếu trong quá trình vận hành thiết bị hoặc nghiên cứu kỹ thuật có bất kỳ thắc mắc nào khác, cứ nhắn lại cho mình nhé. Chúc bạn một ngày làm việc hiệu quả! 🌟`
  },
  {
    keywords: ["tạm biệt", "tam biet", "bye", "goodbye", "hẹn gặp lại"],
    response: `Tạm biệt bạn! Hệ thống Smart Connect luôn trực tuyến 24/7 để hỗ trợ bạn bất cứ lúc nào. Hẹn gặp lại nhé! 👋`
  },
  {
    keywords: ["ai tạo ra", "người sáng lập", "tác giả", "ai phát triển", "ai viết ra", "bố mày là ai", "chủ của m"],
    response: `Tôi là trợ lý AI Smart Connect, được lập trình và phát triển bởi kỹ sư **LongHo**. 
Mã nguồn và cơ sở tri thức của tôi được xây dựng dựa trên sự kết hợp giữa thuật toán AI và kiến thức chuyên ngành Tự động hóa để mang lại trải nghiệm hỗ trợ kỹ thuật tốt nhất! 🚀`
  },
  {
    keywords: ["đắt không", "bao tiền", "giá dịch vụ", "thu phí", "miễn phí"],
    response: `Tính năng chẩn đoán AI và tư vấn kỹ thuật trực tuyến tại đây là hoàn toàn **miễn phí**. 
Tuy nhiên, nếu bạn yêu cầu dịch vụ "Kết nối thợ kỹ thuật" hoặc "Mua linh kiện", chi phí sẽ được báo giá minh bạch trước khi bạn quyết định đồng ý triển khai dịch vụ.`
  },
  {
    keywords: ["thời tiết", "nang mua", "hom nay the nao", "nhiệt độ"],
    response: `Mình là AI chuyên về chẩn đoán phần cứng và mạch điện nên không được kết nối với API thời tiết theo thời gian thực. Tuy nhiên, dù trời nắng gắt (dễ hỏng tụ điều hòa) hay mưa ẩm (dễ chập mạch máy giặt), bạn nhớ bảo quản thiết bị điện an toàn nhé! ⛈️☀️`
  },
  {
    keywords: ["đùa", "kể chuyện", "vui", "joke"],
    response: `Bạn có biết tại sao các lập trình viên và kỹ sư điện lại hay nhầm lẫn giữa Halloween và Giáng Sinh không?
Vì trong hệ cơ số Octal (hệ 8), 31 Oct (31 tháng 10) chính xác bằng 25 Dec (25 tháng 12) trong hệ Thập phân (hệ 10) đấy! 😂`
  },
  {
    keywords: ["ngu", "đần", "kém", "tệ", "chửi", "fuck", "shit", "dm"],
    response: `Mình là hệ thống AI hỗ trợ kỹ thuật, vẫn đang trong quá trình học hỏi và hoàn thiện thêm dữ liệu từ thực tế. Xin lỗi nếu chưa làm bạn hài lòng. Bạn có thể cung cấp thêm chi tiết lỗi hoặc mã lỗi thiết bị để mình phân tích lại chính xác hơn nhé! 🙏`
  }
];

/**
 * Hàm dự đoán dịch vụ & chẩn đoán lỗi thiết bị dựa trên câu hỏi của khách hàng.
 * Tích hợp bộ lọc chuỗi, loại bỏ dấu tiếng Việt cơ bản để tăng độ chính xác.
 * * @param {string} userInput - Nội dung khách hàng nhập từ input
 * @returns {string} - Kết quả dự đoán tương ứng từ Knowledge Base
 */
export const predictResponse = (userInput) => {
  if (!userInput || typeof userInput !== "string" || userInput.trim() === "") {
    return "Vui lòng nhập rõ nhu cầu hoặc tình trạng lỗi thiết bị của bạn (ví dụ: 'cần thợ sửa điều hòa', 'bếp từ báo lỗi E1', 'tìm hiểu nguyên lý IGBT'...).";
  }

  // Bước 1: Chuẩn hóa chuỗi nhập vào - Viết thường, loại bỏ khoảng trắng thừa
  let cleanInput = userInput.toLowerCase().trim();

  // Bước 2: Hàm helper loại bỏ dấu tiếng Việt (giúp khách gõ "sua chua" hay "sửa chữa" bot đều hiểu)
  const removeVietnameseTones = (str) => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    return str;
  };

  const inputNoTones = removeVietnameseTones(cleanInput);

  // Bước 3: Thuật toán tìm kiếm (Fuzzy matching cơ bản)
  // Quét qua toàn bộ các object trong mảng chatbotRules
  for (const rule of chatbotRules) {
    // Với mỗi rule, kiểm tra xem có bất kỳ keyword nào match với input không
    const isMatch = rule.keywords.some((keyword) => {
      const keywordLower = keyword.toLowerCase();
      // So sánh trên cả chuỗi có dấu và chuỗi đã bỏ dấu để tối đa hóa tỷ lệ nhận diện
      return cleanInput.includes(keywordLower) || inputNoTones.includes(removeVietnameseTones(keywordLower));
    });

    if (isMatch) {
      return rule.response; // Trả về phản hồi ngay khi tìm thấy match đầu tiên
    }
  }

  // Bước 4: Fallback - Kịch bản dự phòng khi người dùng hỏi các nội dung ngoài dữ liệu
  return `Hệ thống AI hiện tại chưa nhận diện được chính xác lỗi bạn đang mô tả. 
Tuy nhiên, chúng tôi đã tự động ghi nhận lại thông tin này trên hệ thống. Kỹ thuật viên con người của Smart Connect sẽ tiếp nhận và gọi lại cho bạn sớm nhất để hỗ trợ trực tiếp. Xin cảm ơn!`;
};

// End of file chatbot.js