import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "../supabase";
import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import { Code, Boxes, ShieldCheck, X, Send, User, Settings, Bot, ImagePlus, Paperclip } from "lucide-react";
import { predictResponse } from "../chatbot";

// ---------------------------------------------------------------------------
// Dữ liệu tĩnh
// ---------------------------------------------------------------------------
const servicesData = [
  {
    id: 1,
    Title: "Kết nối thợ kỹ thuật",
    Description: "Hệ thống kết nối trực tiếp với thợ lành nghề. Biết trước giá, hồ sơ thợ minh bạch và an toàn tuyệt đối.",
    Img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop",
    Link: "technician-list",
    category: "Dịch vụ",
  },
  {
    id: 2,
    Title: "Tìm kiếm linh kiện",
    Description: "Cung cấp linh kiện chính hãng từ Samsung, LG, Daikin... Xác thực qua mã QR và kích hoạt bảo hành ngay.",
    Img: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop",
    Link: "distributor-list",
    category: "Dịch vụ",
  },
  {
    id: 3,
    Title: "Chẩn đoán lỗi bằng AI",
    Description: "Tích hợp Chatbot AI hỗ trợ kiểm tra lỗi sơ bộ qua mô tả. Hướng dẫn sửa lỗi nhẹ hoặc gợi ý thợ phù hợp.",
    Img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    Link: "ai-assistant",
    category: "Dịch vụ",
  },
];

const insuranceData = [
  {
    id: 1,
    Img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    Title: "Gói Bảo Trì Cá Nhân",
    Description: "Bảo trì định kỳ 6 tháng/lần cho các thiết bị điện tử gia dụng cơ bản như điều hòa, tủ lạnh, máy giặt.",
  },
  {
    id: 2,
    Img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
    Title: "Gói Bảo Hiểm Doanh Nghiệp",
    Description: "Giải pháp bảo trì toàn diện cho văn phòng, quán cà phê với thời gian phản hồi nhanh trong 2h.",
  },
  {
    id: 3,
    Img: "https://files.catbox.moe/5vb690.avif",
    Title: "Gói Ưu Đãi Thành Viên",
    Description: "Đặc quyền dành cho khách hàng thân thiết với mức chiết khấu linh kiện lên đến 20% và miễn phí kiểm tra.",
  },
];

const distributors = [
  { name: "LG Electronics", logo: "https://files.catbox.moe/jc0d71.png",          url: "https://www.lg.com/vn" },
  { name: "Daikin VN",      logo: "https://cdn.worldvectorlogo.com/logos/daikin.svg", url: "https://www.daikin.com.vn" },
  { name: "Toshiba",        logo: "https://cdn.worldvectorlogo.com/logos/toshiba.svg", url: "https://www.toshiba.com.vn" },
  { name: "Samsung",        logo: "https://files.catbox.moe/w1mz32.png",           url: "https://www.samsung.com/vn" },
  { name: "Panasonic",      logo: "https://files.catbox.moe/371cr6.png",            url: "https://www.panasonic.com/vn" },
  { name: "Sharp",          logo: "https://files.catbox.moe/5cwzl3.png",            url: "https://vn.sharp" },
];

const techStacks = [
  { icon: "html.svg",       language: "HTML" },
  { icon: "css.svg",        language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg",   language: "Tailwind CSS" },
  { icon: "reactjs.svg",    language: "ReactJS" },
  { icon: "vite.svg",       language: "Vite" },
  { icon: "nodejs.svg",     language: "Node JS" },
  { icon: "bootstrap.svg",  language: "Bootstrap" },
  { icon: "firebase.svg",   language: "Firebase" },
  { icon: "MUI.svg",        language: "Material UI" },
  { icon: "vercel.svg",     language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

const INITIAL_MESSAGES = [
  {
    role: "ai",
    content:
      "Chào bạn! Tôi là trợ lý AI Smart Connect. Hãy mô tả lỗi thiết bị của bạn (điều hòa, tủ lạnh, máy giặt...) để tôi hỗ trợ chẩn đoán nhé! 🔧",
  },
];

// ---------------------------------------------------------------------------
// Utility: render markdown đơn giản thành JSX (không cần thư viện ngoài)
// Hỗ trợ: **bold**, *italic*, `inline code`, ```code block```, số thứ tự, gạch đầu dòng
// ---------------------------------------------------------------------------
function renderMarkdown(text) {
  if (!text) return null;

  const lines = text.split("\n");
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Code block ```...```
    if (line.trimStart().startsWith("```")) {
      const codeLines = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      elements.push(
        <pre key={i} className="bg-black/40 border border-white/10 rounded-lg p-3 my-2 text-xs text-green-300 overflow-x-auto font-mono whitespace-pre-wrap">
          {codeLines.join("\n")}
        </pre>
      );
      i++;
      continue;
    }

    // Dòng trống
    if (line.trim() === "") {
      elements.push(<br key={i} />);
      i++;
      continue;
    }

    // Render inline: **bold**, *italic*, `code`
    const renderInline = (str) => {
      const parts = [];
      const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`)/g;
      let last = 0;
      let match;
      let idx = 0;
      while ((match = regex.exec(str)) !== null) {
        if (match.index > last) parts.push(<span key={idx++}>{str.slice(last, match.index)}</span>);
        if (match[2]) parts.push(<strong key={idx++} className="font-semibold text-white">{match[2]}</strong>);
        else if (match[3]) parts.push(<em key={idx++} className="italic">{match[3]}</em>);
        else if (match[4]) parts.push(<code key={idx++} className="bg-black/40 text-green-300 px-1 rounded text-xs font-mono">{match[4]}</code>);
        last = match.index + match[0].length;
      }
      if (last < str.length) parts.push(<span key={idx++}>{str.slice(last)}</span>);
      return parts.length > 0 ? parts : str;
    };

    // Danh sách số (1. 2. 3.)
    if (/^\d+\.\s/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(<li key={i} className="ml-4 mb-1">{renderInline(lines[i].replace(/^\d+\.\s/, ""))}</li>);
        i++;
      }
      elements.push(<ol key={`ol-${i}`} className="list-decimal list-inside my-1 space-y-0.5">{items}</ol>);
      continue;
    }

    // Danh sách gạch đầu dòng (- hoặc *)
    if (/^[-*]\s/.test(line.trimStart())) {
      const items = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i].trimStart())) {
        items.push(<li key={i} className="ml-4 mb-1">{renderInline(lines[i].replace(/^[-*]\s/, ""))}</li>);
        i++;
      }
      elements.push(<ul key={`ul-${i}`} className="list-disc list-inside my-1 space-y-0.5">{items}</ul>);
      continue;
    }

    // Heading ## hoặc ###
    if (line.startsWith("### ")) {
      elements.push(<p key={i} className="font-semibold text-purple-300 mt-2 mb-1">{renderInline(line.slice(4))}</p>);
    } else if (line.startsWith("## ")) {
      elements.push(<p key={i} className="font-bold text-purple-200 mt-3 mb-1 text-base">{renderInline(line.slice(3))}</p>);
    } else {
      // Đoạn văn thông thường
      elements.push(<p key={i} className="mb-1">{renderInline(line)}</p>);
    }
    i++;
  }

  return <div className="space-y-0.5">{elements}</div>;
}

// ---------------------------------------------------------------------------
// Component bong bóng "đang nhập..."
// ---------------------------------------------------------------------------
function TypingBubble() {
  return (
    <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="max-w-[85%] p-4 rounded-2xl rounded-tl-none bg-[#16162d] border border-white/10 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TabPanel
// ---------------------------------------------------------------------------
function TabPanel({ children, value, index, ...other }) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Component chính
// ---------------------------------------------------------------------------
export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState(servicesData);
  const [certificates, setCertificates] = useState(insuranceData);
  const [activeModal, setActiveModal] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState(INITIAL_MESSAGES);
  const [isAiTyping, setIsAiTyping] = useState(false);          // ← loading state
  const [technicians, setTechnicians] = useState(["Hồ Duy Long", "Nguyễn Trung", "Lê Công", "Xem thêm"]);

  // Ảnh đính kèm cho câu hỏi AI
  const [selectedImage, setSelectedImage] = useState(null); // { dataUrl, name }

  // Ref để cuộn xuống cuối danh sách tin nhắn
  const chatEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => { AOS.init({ once: false }); }, []);

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc AI đang nhập
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  // ---------------------------------------------------------------------------
  // Fetch dữ liệu từ Supabase
  // ---------------------------------------------------------------------------
  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        supabase.from("projects").select("*").order("id", { ascending: false }),
        supabase.from("certificates").select("*").order("id", { ascending: false }),
      ]);
      if (pRes.data?.length > 0) setProjects(pRes.data);
      if (cRes.data?.length > 0) setCertificates(cRes.data);
    } catch (error) {
      console.error("Supabase error:", error.message);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  // ---------------------------------------------------------------------------
  // Modal handlers
  // ---------------------------------------------------------------------------
  const handleServiceClick = (link) => {
    setActiveModal(link);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "auto";
    setChatMessages(INITIAL_MESSAGES);
    setChatInput("");
    setIsAiTyping(false);
    setSelectedImage(null);
  };

  const handleTechnicianClick = (name) => {
    if (name === "Xem thêm") {
      setTechnicians(["Hồ Duy Long", "Nguyễn Trung", "Lê Công", "Trần Anh", "Phạm Minh", "Hoàng Nam", "Vũ Hải", "Đặng Việt"]);
    }
  };

  // ---------------------------------------------------------------------------
  // Chọn ảnh từ thiết bị
  // ---------------------------------------------------------------------------
  const MAX_IMAGE_SIZE = 4 * 1024 * 1024; // 4MB

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn một file ảnh (jpg, png, webp...).");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      alert("Ảnh quá lớn (tối đa 4MB). Vui lòng chọn ảnh khác.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage({ dataUrl: reader.result, name: file.name });
    };
    reader.readAsDataURL(file);

    // Cho phép chọn lại cùng file lần sau
    e.target.value = "";
  };

  const removeSelectedImage = () => setSelectedImage(null);

  // ---------------------------------------------------------------------------
  // Gửi tin nhắn – async thực thụ, truyền toàn bộ history vào AI
  // ---------------------------------------------------------------------------
  const handleSendMessage = async () => {
    const trimmed = chatInput.trim();
    const image = selectedImage;
    if ((!trimmed && !image) || isAiTyping) return;

    const userMsg = {
      role: "user",
      content: image ? { text: trimmed, image: image.dataUrl } : trimmed,
    };
    const updatedHistory = [...chatMessages, userMsg];

    setChatMessages(updatedHistory);
    setChatInput("");
    setSelectedImage(null);
    setIsAiTyping(true);

    try {
      // Truyền history + ảnh (nếu có) vào chatbot.js để giữ ngữ cảnh hội thoại
      const aiText = await predictResponse(trimmed, chatMessages, image?.dataUrl || null);
      setChatMessages((prev) => [...prev, { role: "ai", content: aiText }]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        { role: "ai", content: "Đã xảy ra lỗi khi kết nối AI. Vui lòng thử lại." },
      ]);
    } finally {
      setIsAiTyping(false);
      // Focus lại ô nhập sau khi AI trả lời
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
          Dịch Vụ & Tính Năng
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          Giải pháp toàn diện cho việc sửa chữa và bảo trì thiết bị gia đình.
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "20px",
            overflow: "hidden",
          }}
          className="md:px-4"
        >
          <Tabs
            value={value}
            onChange={(e, v) => setValue(v)}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                color: "#94a3b8",
                textTransform: "none",
                borderRadius: "12px",
                margin: "8px",
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(59,130,246,0.2))",
                },
              },
              "& .MuiTabs-indicator": { height: 0 },
            }}
          >
            <Tab icon={<Code className="mb-2 w-5 h-5" />} label="Dịch Vụ" />
            <Tab icon={<ShieldCheck className="mb-2 w-5 h-5" />} label="Gói Bảo Hiểm" />
            <Tab icon={<Boxes className="mb-2 w-5 h-5" />} label="Tech Stack" />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          {/* Tab Dịch Vụ */}
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.map((project, index) => (
                <div
                  key={project.id || index}
                  data-aos="fade-up"
                  onClick={() => handleServiceClick(project.Link)}
                  className="cursor-pointer transform transition-all hover:scale-[1.02]"
                >
                  <CardProject Img={project.Img} Title={project.Title} Description={project.Description} id={project.id} />
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Tab Gói Bảo Hiểm */}
          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {certificates.map((cert, index) => (
                <div key={cert.id || index} data-aos="fade-up">
                  <CardProject Img={cert.Img} Title={cert.Title} Description={cert.Description} id={cert.id} />
                </div>
              ))}
            </div>
          </TabPanel>

          {/* Tab Tech Stack */}
          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-5">
              {techStacks.map((stack, index) => (
                <div key={index} data-aos="zoom-in">
                  <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} />
                </div>
              ))}
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>

      {/* ------------------------------------------------------------------ */}
      {/* Modal overlay                                                        */}
      {/* ------------------------------------------------------------------ */}
      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#0b0b1a] border border-white/20 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(79,70,229,0.3)]">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-white/10 rounded-full z-[10000] transition-transform hover:rotate-90"
            >
              <X size={24} />
            </button>

            <div className="p-6 md:p-10 overflow-y-auto w-full h-full">
              {/* ---------------------------------------------------------- */}
              {/* AI Chatbot                                                   */}
              {/* ---------------------------------------------------------- */}
              {activeModal === "ai-assistant" && (
                <div className="flex flex-col h-[70vh] w-full">
                  {/* Header */}
                  <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl">
                      <Bot className="text-purple-400 w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Smart Diagnosis AI</h3>
                      <p className="text-xs text-green-400 flex items-center gap-1">
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        {isAiTyping ? "Đang phân tích..." : "Hệ thống đang trực tuyến"}
                      </p>
                    </div>
                  </div>

                  {/* Khu vực tin nhắn */}
                  <div className="flex-1 bg-[#050510]/50 border border-white/5 rounded-2xl p-4 md:p-6 overflow-y-auto mb-6 space-y-4 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                      >
                        <div
                          className={`max-w-[85%] p-4 rounded-2xl text-[13.5px] leading-relaxed ${
                            msg.role === "user"
                              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-purple-900/20"
                              : "bg-[#16162d] text-slate-200 rounded-tl-none border border-white/10"
                          }`}
                        >
                          {msg.role === "ai" ? (
                            renderMarkdown(msg.content)
                          ) : typeof msg.content === "object" && msg.content !== null ? (
                            <div className="flex flex-col gap-2">
                              {msg.content.image && (
                                <img
                                  src={msg.content.image}
                                  alt="Ảnh đính kèm"
                                  className="max-w-full max-h-60 rounded-xl border border-white/10 object-contain"
                                />
                              )}
                              {msg.content.text && <span>{msg.content.text}</span>}
                            </div>
                          ) : (
                            msg.content
                          )}
                        </div>
                      </div>
                    ))}

                    {/* Bong bóng loading khi AI đang xử lý */}
                    {isAiTyping && <TypingBubble />}

                    {/* Anchor để auto-scroll */}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Preview ảnh đã chọn */}
                  {selectedImage && (
                    <div className="flex items-center gap-3 mb-3 p-2 pr-3 bg-white/5 border border-white/10 rounded-xl w-fit">
                      <img
                        src={selectedImage.dataUrl}
                        alt="Xem trước"
                        className="w-12 h-12 object-cover rounded-lg border border-white/10"
                      />
                      <span className="text-xs text-slate-300 max-w-[140px] truncate">{selectedImage.name}</span>
                      <button
                        onClick={removeSelectedImage}
                        className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                        title="Xoá ảnh"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}

                  {/* Ô nhập liệu */}
                  <div className="relative group">
                    {/* Lớp glow trang trí – pointer-events-none để không chặn click các phần tử bên trên */}
                    <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />

                    {/* Input file ẩn dùng để chọn ảnh */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="hidden"
                    />

                    <input
                      ref={inputRef}
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isAiTyping}
                      placeholder={
                        isAiTyping
                          ? "AI đang phân tích..."
                          : selectedImage
                          ? "Mô tả thêm về ảnh (tuỳ chọn)..."
                          : "Mô tả tình trạng thiết bị của bạn..."
                      }
                      className="relative w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-16 text-white text-sm focus:outline-none focus:border-purple-500 focus:bg-[#16162d] transition-all shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed"
                    />

                    {/* Nút mở chọn ảnh – z-10 để luôn nổi trên ô input, tránh bị input "che" mất vùng click */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isAiTyping}
                      title="Tải ảnh lên"
                      className="absolute left-3 top-3 z-10 p-3 text-slate-400 hover:text-purple-400 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {selectedImage ? <ImagePlus size={22} className="text-purple-400" /> : <Paperclip size={22} />}
                    </button>

                    <button
                      type="button"
                      onClick={handleSendMessage}
                      disabled={isAiTyping || (!chatInput.trim() && !selectedImage)}
                      className="absolute right-3 top-3 z-10 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all shadow-lg active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
                    >
                      <Send size={22} />
                    </button>
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* Danh sách kỹ thuật viên                                     */}
              {/* ---------------------------------------------------------- */}
              {activeModal === "technician-list" && (
                <div className="w-full">
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <User className="text-purple-500 w-8 h-8" /> Kết nối chuyên gia
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {technicians.map((name, i) => (
                      <div
                        key={i}
                        className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${
                          name === "Xem thêm"
                            ? "bg-purple-600/10 border-purple-500/30 cursor-pointer hover:bg-purple-600/20"
                            : "bg-white/5 border-white/10 hover:border-white/20 hover:translate-x-2"
                        }`}
                        onClick={() => name === "Xem thêm" && handleTechnicianClick(name)}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${
                              name === "Xem thêm"
                                ? "bg-purple-500 text-white"
                                : "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg"
                            }`}
                          >
                            {name === "Xem thêm" ? "+" : name[0]}
                          </div>
                          <div>
                            <p className="text-white text-lg font-semibold">{name}</p>
                            <p className="text-sm text-slate-400 italic">Kỹ thuật viên chuyên nghiệp • 5.0 ★</p>
                          </div>
                        </div>
                        <button
                          className={`px-6 py-2.5 rounded-xl font-bold transition-all ${
                            name === "Xem thêm"
                              ? "text-purple-400 border border-purple-500/50"
                              : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"
                          }`}
                        >
                          {name === "Xem thêm" ? "Mở rộng" : "Đặt lịch"}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ---------------------------------------------------------- */}
              {/* Linh kiện chính hãng                                        */}
              {/* ---------------------------------------------------------- */}
              {activeModal === "distributor-list" && (
                <div className="w-full">
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                    <Settings className="text-blue-500 w-8 h-8" /> Linh kiện chính hãng
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {distributors.map((brand, i) => (
                      <a
                        key={i}
                        href={brand.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group p-6 bg-[#16162d] rounded-3xl border border-white/10 flex flex-col items-center gap-5 hover:border-blue-500/50 transition-all hover:-translate-y-2"
                      >
                        <div className="w-full h-28 flex items-center justify-center bg-white rounded-2xl p-4 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{brand.name}</p>
                          <span className="text-[11px] px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full font-medium mt-2 inline-block">
                            Đối tác chính thức
                          </span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
