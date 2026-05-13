import React, { useEffect, useState, useCallback } from "react";
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
import { Code, Boxes, ShieldCheck, X, Send, User, Settings, Wrench, Bot } from "lucide-react";

// Dữ liệu dịch vụ thực tế cho Smart Connect
const servicesData = [
  {
    id: 1,
    Title: "Kết nối thợ kỹ thuật",
    Description: "Hệ thống kết nối trực tiếp với thợ lành nghề. Biết trước giá, hồ sơ thợ minh bạch và an toàn tuyệt đối.",
    Img: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?q=80&w=2070&auto=format&fit=crop", 
    Link: "technician-list",
    category: "Dịch vụ"
  },
  {
    id: 2,
    Title: "Tìm kiếm linh kiện",
    Description: "Cung cấp linh kiện chính hãng từ Samsung, LG, Daikin... Xác thực qua mã QR và kích hoạt bảo hành ngay.",
    Img: "https://images.unsplash.com/photo-1597733336794-12d05021d510?q=80&w=1974&auto=format&fit=crop",
    Link: "distributor-list",
    category: "Dịch vụ"
  },
  {
    id: 3,
    Title: "Chẩn đoán lỗi bằng AI",
    Description: "Tích hợp Chatbot AI hỗ trợ kiểm tra lỗi sơ bộ qua mô tả. Hướng dẫn sửa lỗi nhẹ hoặc gợi ý thợ phù hợp.",
    Img: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop",
    Link: "ai-assistant",
    category: "Dịch vụ"
  }
];

const insuranceData = [
  {
    id: 1,
    Img: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop",
    Title: "Gói Bảo Trì Cá Nhân",
    Description: "Bảo trì định kỳ 6 tháng/lần cho các thiết bị điện tử gia dụng cơ bản như điều hòa, tủ lạnh, máy giặt."
  },
  {
    id: 2,
    Img: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop",
    Title: "Gói Bảo Hiểm Doanh Nghiệp",
    Description: "Giải pháp bảo trì toàn diện cho văn phòng, quán cà phê với thời gian phản hồi nhanh trong 2h."
  },
  {
    id: 3,
    Img: "https://files.catbox.moe/5vb690.avif",
    Title: "Gói Ưu Đãi Thành Viên",
    Description: "Đặc quyền dành cho khách hàng thân thiết với mức chiết khấu linh kiện lên đến 20% và miễn phí kiểm tra."
  }
];

const distributors = [
  { name: "LG Electronics", logo: "https://files.catbox.moe/zjfx1a.png", url: "https://www.lg.com/vn" },
  { name: "Daikin VN", logo: "https://files.catbox.moe/ixo2nf.png", url: "https://www.daikin.com.vn" },
  { name: "Toshiba", logo: "https://files.catbox.moe/yseo8k.png", url: "https://www.toshiba.com.vn" },
  { name: "Samsung", logo: "https://files.catbox.moe/pbc3rn.png", url: "https://www.samsung.com/vn" },
  { name: "Panasonic", logo: "https://files.catbox.moe/bk5wzc.png", url: "https://www.panasonic.com/vn" },
  { name: "Sharp", logo: "https://files.catbox.moe/txyrrj.png", url: "https://vn.sharp" }
];

const techStacks = [
  { icon: "html.svg", language: "HTML" },
  { icon: "css.svg", language: "CSS" },
  { icon: "javascript.svg", language: "JavaScript" },
  { icon: "tailwind.svg", language: "Tailwind CSS" },
  { icon: "reactjs.svg", language: "ReactJS" },
  { icon: "vite.svg", language: "Vite" },
  { icon: "nodejs.svg", language: "Node JS" },
  { icon: "bootstrap.svg", language: "Bootstrap" },
  { icon: "firebase.svg", language: "Firebase" },
  { icon: "MUI.svg", language: "Material UI" },
  { icon: "vercel.svg", language: "Vercel" },
  { icon: "SweetAlert.svg", language: "SweetAlert2" },
];

const ToggleButton = ({ onClick, isShowingMore }) => (
  <button
    onClick={onClick}
    className="px-3 py-1.5 text-slate-300 hover:text-white text-sm font-medium transition-all duration-300 ease-in-out flex items-center gap-2 bg-white/5 hover:bg-white/10 rounded-md border border-white/10 hover:border-white/20 backdrop-blur-sm group relative overflow-hidden"
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? "See Less" : "See More"}
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-300 ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}`}><polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline></svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-500/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);

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

export default function FullWidthTabs() {
  const theme = useTheme();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState(servicesData);
  const [certificates, setCertificates] = useState(insuranceData);
  const [activeModal, setActiveModal] = useState(null);
  const [chatInput, setChatInput] = useState("");
  
  // Khởi tạo tin nhắn gốc để reset dễ dàng
  const initialMessages = [{ role: "ai", content: "Chào bạn! Tôi là trợ lý AI Smart Connect. Hãy mô tả lỗi thiết bị của bạn để tôi hỗ trợ nhé." }];
  const [chatMessages, setChatMessages] = useState(initialMessages);
  const [technicians, setTechnicians] = useState(["Hồ Duy Long", "Nguyễn Trung", "Lê Công", "Xem thêm"]);

  useEffect(() => { AOS.init({ once: false }); }, []);

  const fetchData = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        supabase.from("projects").select("*").order('id', { ascending: false }),
        supabase.from("certificates").select("*").order('id', { ascending: false }), 
      ]);
      if (pRes.data?.length > 0) setProjects(pRes.data);
      if (cRes.data?.length > 0) setCertificates(cRes.data);
    } catch (error) { console.error("Error:", error.message); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleServiceClick = (link) => { 
    setActiveModal(link); 
    document.body.style.overflow = 'hidden'; 
  };
  
  const closeModal = () => { 
    setActiveModal(null); 
    document.body.style.overflow = 'auto'; 
    // Quan trọng: Reset toàn bộ hội thoại và ô nhập khi đóng
    setChatMessages(initialMessages);
    setChatInput("");
  };

  const handleTechnicianClick = (name) => {
    if (name === "Xem thêm") {
      setTechnicians(["Hồ Duy Long", "Nguyễn Trung", "Lê Công", "Trần Anh", "Phạm Minh", "Hoàng Nam", "Vũ Hải", "Đặng Việt"]);
    } else { console.log("Đặt lịch với:", name); }
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    const userMsg = { role: "user", content: chatInput };
    const newMessages = [...chatMessages, userMsg];
    setChatMessages(newMessages);
    setChatInput("");

    setTimeout(() => {
      let aiResponse = "Tôi đã ghi nhận thông tin. Lỗi này có vẻ cần kiểm tra linh kiện bên trong, bạn nên đặt lịch thợ kỹ thuật.";
      if (chatInput.toLowerCase().includes("lỏng dây") || chatInput.toLowerCase().includes("pin") || chatInput.toLowerCase().includes("nguồn")) {
        aiResponse = "Có thể do nguồn điện không ổn định hoặc tiếp xúc kém. Bạn hãy thử kiểm tra ổ cắm hoặc thay pin điều khiển trước nhé!";
      }
      setChatMessages(prev => [...prev, { role: "ai", content: aiResponse }]);
    }, 800);
  };

  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-[#030014] overflow-hidden" id="Portofolio">
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">Dịch Vụ & Tính Năng</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">Giải pháp toàn diện cho việc sửa chữa và bảo trì thiết bị gia đình.</p>
      </div>

      <Box sx={{ width: "100%" }}>
        <AppBar position="static" elevation={0} sx={{ bgcolor: "transparent", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "20px", overflow: "hidden" }} className="md:px-4">
          <Tabs value={value} onChange={(e, v) => setValue(v)} textColor="secondary" indicatorColor="secondary" variant="fullWidth" sx={{ minHeight: "70px", "& .MuiTab-root": { color: "#94a3b8", textTransform: "none", borderRadius: "12px", margin: "8px", "&.Mui-selected": { color: "#fff", background: "linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(59, 130, 246, 0.2))" } }, "& .MuiTabs-indicator": { height: 0 } }}>
            <Tab icon={<Code className="mb-2 w-5 h-5" />} label="Dịch Vụ" />
            <Tab icon={<ShieldCheck className="mb-2 w-5 h-5" />} label="Gói Bảo Hiểm" />
            <Tab icon={<Boxes className="mb-2 w-5 h-5" />} label="Tech Stack" />
          </Tabs>
        </AppBar>

        <SwipeableViews axis={theme.direction === "rtl" ? "x-reverse" : "x"} index={value} onChangeIndex={setValue}>
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {projects.map((project, index) => (
                <div key={project.id || index} data-aos="fade-up" onClick={() => handleServiceClick(project.Link)} className="cursor-pointer transform transition-all hover:scale-[1.02]">
                  <CardProject Img={project.Img} Title={project.Title} Description={project.Description} id={project.id} />
                </div>
              ))}
            </div>
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {certificates.map((cert, index) => (
                <div key={cert.id || index} data-aos="fade-up">
                  <CardProject Img={cert.Img} Title={cert.Title} Description={cert.Description} id={cert.id} />
                </div>
              ))}
            </div>
          </TabPanel>

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

      {activeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md transition-all duration-300">
          <div className="bg-[#0b0b1a] border border-white/20 w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col relative shadow-[0_0_50px_rgba(79,70,229,0.3)]">
            <button onClick={closeModal} className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white bg-white/10 rounded-full z-[10000] transition-transform hover:rotate-90"><X size={24} /></button>
            
            <div className="p-6 md:p-10 overflow-y-auto w-full h-full">
              {activeModal === "ai-assistant" && (
                <div className="flex flex-col h-[70vh] w-full">
                  <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
                    <div className="p-3 bg-purple-500/20 rounded-2xl"><Bot className="text-purple-400 w-8 h-8" /></div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">AI Chuẩn Đoán Thông Minh</h3>
                      <p className="text-xs text-green-400 flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Hệ thống đang trực tuyến</p>
                    </div>
                  </div>

                  <div className="flex-1 bg-[#050510]/50 border border-white/5 rounded-2xl p-6 overflow-y-auto mb-6 space-y-4 custom-scrollbar">
                    {chatMessages.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl text-[14px] leading-relaxed ${msg.role === "user" ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tr-none shadow-lg shadow-purple-900/20" : "bg-[#16162d] text-slate-200 rounded-tl-none border border-white/10"}`}>
                          {msg.content}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="relative group">
                    <div className="absolute inset-0 bg-purple-500/10 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                    <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Mô tả tình trạng thiết bị của bạn..." className="relative w-full bg-white/5 border border-white/10 rounded-2xl py-5 px-6 pr-16 text-white text-sm focus:outline-none focus:border-purple-500 focus:bg-[#16162d] transition-all shadow-2xl" />
                    <button onClick={handleSendMessage} className="absolute right-3 top-3 p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-500 transition-all shadow-lg active:scale-90"><Send size={22} /></button>
                  </div>
                </div>
              )}

              {activeModal === "technician-list" && (
                <div className="w-full">
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><User className="text-purple-500 w-8 h-8" /> Kết nối chuyên gia</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {technicians.map((name, i) => (
                      <div key={i} className={`p-5 rounded-2xl border flex items-center justify-between transition-all ${name === "Xem thêm" ? "bg-purple-600/10 border-purple-500/30 cursor-pointer hover:bg-purple-600/20" : "bg-white/5 border-white/10 hover:border-white/20 hover:translate-x-2"}`} onClick={() => name === "Xem thêm" && handleTechnicianClick(name)}>
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-full flex items-center justify-center font-bold text-xl ${name === "Xem thêm" ? "bg-purple-500 text-white" : "bg-gradient-to-br from-purple-500 to-blue-600 text-white shadow-lg"}`}>{name === "Xem thêm" ? "+" : name[0]}</div>
                          <div><p className="text-white text-lg font-semibold">{name}</p><p className="text-sm text-slate-400 italic">Kỹ thuật viên chuyên nghiệp • 5.0 ★</p></div>
                        </div>
                        <button className={`px-6 py-2.5 rounded-xl font-bold transition-all ${name === "Xem thêm" ? "text-purple-400 border border-purple-500/50" : "bg-purple-600 text-white hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(147,51,234,0.5)]"}`}>{name === "Xem thêm" ? "Mở rộng" : "Đặt lịch"}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeModal === "distributor-list" && (
                <div className="w-full">
                  <h3 className="text-3xl font-bold text-white mb-8 flex items-center gap-3"><Settings className="text-blue-500 w-8 h-8" /> Linh kiện chính hãng</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                    {distributors.map((brand, i) => (
                      <a key={i} href={brand.url} target="_blank" rel="noopener noreferrer" className="group p-6 bg-[#16162d] rounded-3xl border border-white/10 flex flex-col items-center gap-5 hover:border-blue-500/50 transition-all hover:-translate-y-2">
                        <div className="w-full h-28 flex items-center justify-center bg-white rounded-2xl p-4 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>
                        <div className="text-center">
                          <p className="text-white font-bold text-lg group-hover:text-blue-400 transition-colors">{brand.name}</p>
                          <span className="text-[11px] px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full font-medium mt-2 inline-block">Đối tác chính thức</span>
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