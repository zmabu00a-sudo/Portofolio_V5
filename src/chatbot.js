// src/chatbot.js

/**
 * Smart Diagnosis AI – Powered by Groq API
 * Model: llama-3.3-70b-versatile
 * Free tier: 14,400 req/ngày, 30 req/phút – không cần retry phức tạp
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL   = "llama-3.3-70b-versatile";
// Model hỗ trợ vision (đọc ảnh) – dùng khi người dùng gửi kèm ảnh
const GROQ_VISION_MODEL = "meta-llama/llama-4-scout-17b-16e-instruct";

const SYSTEM_PROMPT = `Bạn là trợ lý AI của nền tảng Smart Connect – chuyên gia kỹ thuật điện lạnh và điện gia dụng với hơn 20 năm kinh nghiệm thực chiến.

Nhiệm vụ của bạn:
- Hỗ trợ chẩn đoán sơ bộ lỗi thiết bị (điều hòa, tủ lạnh, máy giặt, máy nước nóng...)
- Phân tích thông số kỹ thuật khi người dùng cung cấp (áp suất gas, nhiệt độ, ampere...)
- Gợi ý hướng xử lý hoặc đề xuất liên hệ thợ kỹ thuật qua Smart Connect
- Tư vấn linh kiện và thương hiệu phù hợp (LG, Daikin, Samsung, Toshiba, Panasonic...)

Quy tắc trả lời:
- Luôn dùng tiếng Việt, giọng điệu chuyên nghiệp nhưng thân thiện
- Dùng thuật ngữ kỹ thuật đúng: superheat, subcooling, TXV, gas R410A/R32/R22, inverter, PCB...
- Nếu thông tin người dùng cung cấp chưa đủ để chẩn đoán → hỏi lại các thông số còn thiếu
- Khi trả lời có danh sách bước → dùng định dạng đánh số rõ ràng
- Không bịa đặt thông tin; nếu không chắc → nói rõ và đề xuất kiểm tra thực tế
- Kết thúc mỗi câu trả lời bằng một câu hỏi mở để duy trì hội thoại (trừ khi vấn đề đã được giải quyết hoàn toàn)

## QUAN TRỌNG – Gợi ý thợ chuyên ngành:
Sau khi hướng dẫn cách sửa, BẮT BUỘC đánh giá độ khó và thêm phần gợi ý thợ theo mẫu sau:

**Nếu cách sửa ĐƠN GIẢN** (người dùng tự làm được: thay pin remote, vệ sinh lưới lọc, reset máy...):
→ Khuyến khích tự làm, không cần gợi ý thợ. Chỉ nói "Nếu vẫn không được sau khi thử, hãy liên hệ thợ qua mục **Kết nối thợ kỹ thuật** trên Smart Connect."

**Nếu cách sửa TRUNG BÌNH** (cần dụng cụ hoặc kiến thức cơ bản: thay lọc nước, vệ sinh dàn lạnh, kiểm tra cầu chì...):
→ Hướng dẫn chi tiết từng bước, sau đó thêm khung này:

---
🔧 **Bạn cần hỗ trợ thêm?**
Nếu chưa quen thao tác kỹ thuật, hãy để thợ chuyên nghiệp xử lý an toàn hơn:
- 👨‍🔧 **Thợ điện lạnh** – phù hợp cho: điều hòa, tủ lạnh, máy giặt
- 🏠 **Thợ điện dân dụng** – phù hợp cho: cầu dao, ổ cắm, đường điện
→ Đặt lịch ngay tại mục **"Kết nối thợ kỹ thuật"** trên Smart Connect – xem hồ sơ & giá trước khi đặt.
---

**Nếu cách sửa KHÓ hoặc NGUY HIỂM** (liên quan gas lạnh, board mạch PCB, motor, rò điện, cháy nổ...):
→ KHÔNG khuyến khích tự sửa. Bắt buộc hiển thị khung này ngay sau chẩn đoán:

---
⚠️ **Lỗi này cần thợ chuyên nghiệp – không nên tự sửa!**
Tự xử lý có thể gây nguy hiểm hoặc làm hỏng nặng thêm thiết bị.

**Loại thợ phù hợp cho vấn đề của bạn:**
[Chọn đúng loại thợ dựa theo thiết bị và lỗi cụ thể:]
- 🧊 **Thợ điện lạnh** – nạp gas, sửa máy nén, thay PCB điều hòa/tủ lạnh
- 🔌 **Thợ điện** – rò điện, chập mạch, cháy dây
- 🌀 **Thợ máy giặt** – motor, board điều khiển, vòng bi
- 🔥 **Thợ bình nóng lạnh** – rò rỉ, van áp suất, điện trở đốt
- 🏭 **Kỹ sư HVAC** – hệ thống trung tâm, VRV/VRF, điều hòa công nghiệp

→ **Đặt lịch ngay** tại mục **"Kết nối thợ kỹ thuật"** trên Smart Connect.
→ Xem trước hồ sơ thợ, đánh giá 5 sao và báo giá minh bạch trước khi xác nhận.
---`;

/**
 * Chuyển lịch sử hội thoại nội bộ [{role, content}]
 * sang định dạng OpenAI-compatible mà Groq sử dụng.
 */
function buildGroqMessages(history, userMessage, imageBase64 = null) {
  const messages = [{ role: "system", content: SYSTEM_PROMPT }];

  for (const msg of history) {
    // Bỏ qua tin chào mừng ban đầu để tránh nhiễu context
    if (msg.role === "ai" && typeof msg.content === "string" && msg.content.startsWith("Chào bạn! Tôi là trợ lý")) continue;

    // Tin nhắn cũ có ảnh ({text, image}) -> chỉ giữ lại text để tránh payload quá nặng
    const content = typeof msg.content === "string" ? msg.content : (msg.content?.text || "[Người dùng đã gửi một hình ảnh]");

    messages.push({
      role: msg.role === "user" ? "user" : "assistant",
      content,
    });
  }

  if (imageBase64) {
    messages.push({
      role: "user",
      content: [
        { type: "text", text: userMessage || "Hãy phân tích hình ảnh này và cho biết thiết bị đang gặp lỗi gì." },
        { type: "image_url", image_url: { url: imageBase64 } },
      ],
    });
  } else {
    messages.push({ role: "user", content: userMessage });
  }

  return messages;
}

/**
 * Gửi tin nhắn tới Groq API.
 * Groq dùng chuẩn OpenAI nên cú pháp rất đơn giản.
 *
 * @param {string} userMessage   - Tin nhắn mới nhất của người dùng
 * @param {Array}  history       - Lịch sử [{role: "user"|"ai", content: string|{text,image}}]
 * @param {string} imageBase64   - (tuỳ chọn) Data URL base64 của ảnh, ví dụ "data:image/jpeg;base64,...."
 * @returns {Promise<string>}    - Phản hồi dạng text từ AI
 */
export async function predictResponse(userMessage, history = [], imageBase64 = null) {
  const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  if (!API_KEY) {
    console.error("Thiếu VITE_GROQ_API_KEY trong file .env");
    return "⚠️ Chưa cấu hình Groq API key. Vui lòng thêm `VITE_GROQ_API_KEY` vào file `.env`.";
  }

  const messages = buildGroqMessages(history, userMessage, imageBase64);
  const model = imageBase64 ? GROQ_VISION_MODEL : GROQ_MODEL;

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 0.9,
        stream: false,
      }),
      signal: AbortSignal.timeout(30000), // ảnh cần xử lý lâu hơn -> 30 giây
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));

      if (response.status === 429) {
        console.warn("Groq 429 – rate limit:", err);
        return "⏳ Bạn hỏi hơi nhanh! Vui lòng chờ vài giây rồi thử lại nhé.";
      }
      if (response.status === 401) {
        console.error("Groq 401 – API key không hợp lệ");
        return "⚠️ API key không hợp lệ. Vui lòng kiểm tra lại `VITE_GROQ_API_KEY` trong file `.env`.";
      }
      if (response.status === 413) {
        console.error("Groq 413 – payload quá lớn:", err);
        return "⚠️ Ảnh quá lớn, vui lòng chọn ảnh nhỏ hơn (dưới ~4MB) rồi thử lại.";
      }

      console.error(`Groq lỗi ${response.status}:`, err);
      return "Hệ thống đang gặp sự cố. Vui lòng thử lại sau ít phút.";
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;

    if (!text) {
      console.error("Groq trả về response rỗng:", data);
      return "Không nhận được phản hồi từ AI. Vui lòng thử lại.";
    }

    return text.trim();

  } catch (error) {
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return "Kết nối tới AI quá chậm. Kiểm tra mạng và thử lại nhé.";
    }
    console.error("Lỗi gọi Groq API:", error);
    return "Hệ thống đang gặp sự cố kỹ thuật. Vui lòng thử lại sau ít phút.";
  }
}
