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
import { Code, Boxes, ShieldCheck, X, Send, User, Settings, Bot, ImagePlus, Paperclip, ArrowUpRight } from "lucide-react";
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
  { name: "Samsung",        logo: "https://files.catbox.moe/gflwjq.png",           url: "https://www.samsung.com/vn" },
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

// Gợi ý nhanh các lỗi thường gặp – hiển thị dưới dạng chip khi mới mở chat
const QUICK_REPLIES = [
  "Điều hòa không lạnh, chỉ chạy quạt gió",
  "Tủ lạnh có tiếng kêu to bất thường",
  "Máy giặt báo lỗi, không vào nước",
  "Tivi lên hình nhưng mất tiếng",
];

// ---------------------------------------------------------------------------
// Dữ liệu kỹ thuật viên
// ---------------------------------------------------------------------------
const technicianData = [
  {
    id: 1, name: "Hồ Duy Long", avatar: "H", color: "#7C3AED",
    role: "Kỹ thuật viên chuyên nghiệp", rating: 5.0, reviews: 128,
    online: true, experience: "5 năm kinh nghiệm", location: "Quận 1, TP.HCM",
    specialties: ["Điều hòa", "Tủ lạnh", "Máy giặt"],
    badges: ["Top Rated", "Phản hồi nhanh"], completedJobs: 312,
    bio: "Chuyên sửa chữa và bảo trì thiết bị điện lạnh gia đình. Cam kết đúng giờ, báo giá minh bạch trước khi làm.",
    certificates: ["Chứng chỉ Kỹ thuật Lạnh – Trường CĐ Kỹ thuật Cao Thắng", "Chứng nhận bảo hành Daikin"],
  },
  {
    id: 2, name: "Nguyễn Trung", avatar: "N", color: "#6D28D9",
    role: "Kỹ thuật viên chuyên nghiệp", rating: 4.9, reviews: 95,
    online: true, experience: "4 năm kinh nghiệm", location: "Quận 3, TP.HCM",
    specialties: ["TV", "Lò vi sóng", "Bếp từ"],
    badges: ["Phản hồi nhanh"], completedJobs: 241,
    bio: "Thợ điện tử gia dụng, thành thạo sửa tivi, bếp từ, lò vi sóng các thương hiệu Samsung, LG, Panasonic.",
    certificates: ["Chứng chỉ Điện tử Dân dụng – Trường TCN Nguyễn Trường Tộ"],
  },
  {
    id: 3, name: "Lê Công", avatar: "L", color: "#5B21B6",
    role: "Kỹ thuật viên chuyên nghiệp", rating: 4.8, reviews: 74,
    online: false, experience: "3 năm kinh nghiệm", location: "Quận 7, TP.HCM",
    specialties: ["Máy giặt", "Bình nóng lạnh"],
    badges: ["Top Rated"], completedJobs: 187,
    bio: "Chuyên xử lý các sự cố máy giặt, bình nóng lạnh. Có đầy đủ dụng cụ chuyên dụng, sửa tại nhà nhanh gọn.",
    certificates: ["Chứng chỉ Điện – Nước Gia dụng – Trung tâm GDNN Quận 7"],
  },
  {
    id: 4, name: "Trần Anh", avatar: "T", color: "#7C3AED",
    role: "Kỹ thuật viên chuyên nghiệp", rating: 5.0, reviews: 210,
    online: true, experience: "7 năm kinh nghiệm", location: "Bình Thạnh, TP.HCM",
    specialties: ["Điều hòa", "Tủ lạnh", "TV", "Bếp từ"],
    badges: ["Top Rated", "Phản hồi nhanh", "Thợ xuất sắc"], completedJobs: 520,
    bio: "Thợ lành nghề hơn 7 năm, từng làm tại trung tâm bảo hành Daikin. Nhận sửa tất cả thiết bị điện lạnh.",
    certificates: ["Chứng chỉ Kỹ thuật Lạnh – Trường CĐ Kỹ thuật Cao Thắng", "Chứng nhận bảo hành Daikin", "Chứng chỉ An toàn Điện – Sở LĐTBXH TP.HCM"],
  },
  {
    id: 5, name: "Phạm Minh", avatar: "P", color: "#6D28D9",
    role: "Kỹ thuật viên chuyên nghiệp", rating: 4.7, reviews: 56,
    online: false, experience: "2 năm kinh nghiệm", location: "Gò Vấp, TP.HCM",
    specialties: ["Quạt điện", "Máy hút bụi", "Lò vi sóng"],
    badges: [], completedJobs: 98,
    bio: "Thợ trẻ nhiệt tình, giá cả hợp lý. Chuyên các thiết bị gia dụng nhỏ, phục vụ tận nơi khu vực Gò Vấp.",
    certificates: [],
  },
  {
    id: 6, name: "Hoàng Nam", avatar: "H", color: "#5B21B6",
    role: "Kỹ thuật viên chuyên nghiệp", rating: 4.9, reviews: 143,
    online: true, experience: "6 năm kinh nghiệm", location: "Tân Bình, TP.HCM",
    specialties: ["Điều hòa", "Máy giặt", "Tủ lạnh"],
    badges: ["Top Rated", "Phản hồi nhanh"], completedJobs: 389,
    bio: "Chuyên bảo dưỡng và sửa chữa điều hòa, tủ lạnh thương hiệu lớn. Có chứng chỉ kỹ thuật lạnh từ trường nghề.",
    certificates: ["Chứng chỉ Kỹ thuật Lạnh – Trường CĐ Kỹ thuật Cao Thắng", "Chứng nhận bảo dưỡng LG Electronics"],
  },
];

const badgeStyle = {
  "Top Rated":      { bg: "#FEF3C7", text: "#92400E", icon: "🏆" },
  "Phản hồi nhanh": { bg: "#D1FAE5", text: "#065F46", icon: "⚡" },
  "Thợ xuất sắc":   { bg: "#EDE9FE", text: "#5B21B6", icon: "⭐" },
};

// ---------------------------------------------------------------------------
// ProfileModal – hồ sơ đầy đủ kỹ thuật viên
// ---------------------------------------------------------------------------
function ProfileModal({ tech, onClose, onBook }) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.85)", display: "flex",
        alignItems: "center", justifyContent: "center",
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#1A1730", borderRadius: 24, width: 460,
          maxWidth: "95vw", maxHeight: "90vh", overflowY: "auto",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
          border: "1px solid rgba(124,58,237,0.3)",
        }}
      >
        {/* Banner */}
        <div style={{ background: "linear-gradient(135deg, #4C1D95, #2D1B69)", padding: "28px 28px 0", position: "relative" }}>
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 14, right: 14,
              background: "rgba(255,255,255,0.12)", border: "none",
              borderRadius: "50%", width: 34, height: 34,
              color: "#fff", cursor: "pointer", fontSize: 20, lineHeight: 1,
            }}
          >×</button>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end", paddingBottom: 24 }}>
            <div style={{ position: "relative" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: tech.color, display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 30, fontWeight: 700, color: "#fff",
                border: "3px solid rgba(255,255,255,0.2)",
              }}>{tech.avatar}</div>
              <div style={{
                position: "absolute", bottom: 4, right: 4,
                width: 16, height: 16, borderRadius: "50%",
                background: tech.online ? "#10B981" : "#6B7280",
                border: "2px solid #1A1730",
              }} />
            </div>
            <div>
              <h2 style={{ color: "#fff", margin: 0, fontSize: 22, fontWeight: 700 }}>{tech.name}</h2>
              <p style={{ color: "#A78BFA", margin: "4px 0 0", fontSize: 13 }}>{tech.experience}</p>
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6, marginTop: 6,
                background: "rgba(255,255,255,0.1)", padding: "3px 12px", borderRadius: 20,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: tech.online ? "#10B981" : "#6B7280", display: "inline-block" }} />
                <span style={{ color: tech.online ? "#10B981" : "#94A3B8", fontSize: 12 }}>
                  {tech.online ? "Đang trực tuyến" : "Ngoại tuyến"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {[
            { label: "Đánh giá",   value: `${tech.rating} ★` },
            { label: "Lượt review", value: tech.reviews },
            { label: "Việc xong",  value: tech.completedJobs },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "16px 0", textAlign: "center",
              borderRight: i < 2 ? "1px solid rgba(255,255,255,0.06)" : "none",
            }}>
              <div style={{ color: "#A78BFA", fontWeight: 700, fontSize: 18 }}>{s.value}</div>
              <div style={{ color: "#475569", fontSize: 11, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Body */}
        <div style={{ padding: 24 }}>
          <p style={{ color: "#CBD5E1", fontSize: 14, lineHeight: 1.7, margin: "0 0 20px" }}>{tech.bio}</p>

          {/* Khu vực */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 16 }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <span style={{ color: "#475569", fontSize: 13, width: 70 }}>Khu vực</span>
            <span style={{ color: "#CBD5E1", fontSize: 14 }}>{tech.location}</span>
          </div>

          {/* Chuyên môn */}
          <div style={{ margin: "20px 0 8px", color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Chuyên môn</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {tech.specialties.map((s) => (
              <span key={s} style={{
                background: "rgba(124,58,237,0.15)", color: "#A78BFA",
                borderRadius: 8, padding: "5px 12px", fontSize: 13,
                border: "1px solid rgba(124,58,237,0.25)",
              }}>{s}</span>
            ))}
          </div>

          {/* Chứng chỉ hành nghề */}
          {tech.certificates && tech.certificates.length > 0 && (
            <>
              <div style={{ margin: "0 0 8px", color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Chứng chỉ hành nghề</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {tech.certificates.map((cert, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "flex-start", gap: 10,
                    background: "rgba(16,185,129,0.07)", border: "1px solid rgba(16,185,129,0.2)",
                    borderRadius: 10, padding: "9px 14px",
                  }}>
                    <span style={{ fontSize: 15, marginTop: 1 }}>📜</span>
                    <span style={{ color: "#6EE7B7", fontSize: 13, lineHeight: 1.5 }}>{cert}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Huy hiệu */}
          {tech.badges.length > 0 && (
            <>
              <div style={{ margin: "0 0 8px", color: "#475569", fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>Huy hiệu</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {tech.badges.map((b) => (
                  <span key={b} style={{
                    background: badgeStyle[b]?.bg, color: badgeStyle[b]?.text,
                    borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                  }}>{badgeStyle[b]?.icon} {b}</span>
                ))}
              </div>
            </>
          )}

          <button
            onClick={() => { onBook(tech); onClose(); }}
            style={{
              width: "100%", padding: 14,
              background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
              color: "#fff", border: "none", borderRadius: 12,
              fontSize: 15, fontWeight: 700, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(124,58,237,0.4)",
            }}
          >
            Đặt lịch với {tech.name.split(" ").pop()}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// TechCard – card trong danh sách
// ---------------------------------------------------------------------------
function TechCard({ tech, onViewProfile, onBook }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onViewProfile(tech)}
      style={{
        background: hovered ? "rgba(124,58,237,0.08)" : "rgba(255,255,255,0.025)",
        border: `1px solid ${hovered ? "rgba(124,58,237,0.35)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 16, padding: "14px 16px",
        display: "flex", alignItems: "center", gap: 14,
        cursor: "pointer", transition: "all 0.2s",
      }}
    >
      {/* Avatar + online dot */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div style={{
          width: 52, height: 52, borderRadius: "50%",
          background: tech.color, display: "flex",
          alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 700, color: "#fff",
        }}>{tech.avatar}</div>
        <div style={{
          position: "absolute", bottom: 1, right: 1,
          width: 13, height: 13, borderRadius: "50%",
          background: tech.online ? "#10B981" : "#6B7280",
          border: "2px solid #13111E",
        }} />
      </div>

      {/* Thông tin chính */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ color: "#E2E8F0", fontWeight: 600, fontSize: 15 }}>{tech.name}</span>
          {tech.badges.includes("Top Rated") && (
            <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 20 }}>🏆 TOP</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 3 }}>
          <span style={{ color: "#FBBF24", fontSize: 12 }}>{"★".repeat(Math.floor(tech.rating))}</span>
          <span style={{ color: "#94A3B8", fontSize: 12 }}>{tech.rating}</span>
          <span style={{ color: "#334155" }}>·</span>
          <span style={{ color: "#475569", fontSize: 12 }}>📍 {tech.location}</span>
        </div>
        <div style={{ display: "flex", gap: 6, marginTop: 5 }}>
          {tech.specialties.slice(0, 2).map((s) => (
            <span key={s} style={{
              background: "rgba(124,58,237,0.12)", color: "#8B5CF6",
              fontSize: 11, padding: "2px 8px", borderRadius: 6,
            }}>{s}</span>
          ))}
          {tech.specialties.length > 2 && (
            <span style={{ color: "#475569", fontSize: 11, paddingTop: 2 }}>+{tech.specialties.length - 2}</span>
          )}
        </div>
      </div>

      {/* Nút đặt lịch */}
      <div style={{ flexShrink: 0 }}>
        <button
          onClick={(e) => { e.stopPropagation(); onBook(tech); }}
          style={{
            background: "linear-gradient(135deg, #7C3AED, #5B21B6)",
            color: "#fff", border: "none", borderRadius: 10,
            padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >Đặt lịch</button>
      </div>
    </div>
  );
}

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
    <div className="flex items-end gap-2 justify-start animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Avatar mini của bot - vòng pulse thể hiện AI đang "suy nghĩ" */}
      <div className="relative w-7 h-7 flex items-center justify-center bg-purple-500/20 rounded-full shrink-0">
        <span className="absolute inset-0 rounded-full bg-purple-500/40 animate-ping" />
        <Bot size={14} className="relative text-purple-300" />
      </div>
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
  const [selectedTech, setSelectedTech] = useState(null);
  const [techFilter, setTechFilter] = useState("all");
  const [techToast, setTechToast] = useState(null);

  const handleBookTech = (tech) => {
    setTechToast(tech.name);
    setTimeout(() => setTechToast(null), 3000);
  };

  // Ảnh đính kèm cho câu hỏi AI
  const [selectedImage, setSelectedImage] = useState(null); // { dataUrl, name }
  // Ảnh đang được xem phóng to (lightbox)
  const [lightboxImage, setLightboxImage] = useState(null);

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
    setLightboxImage(null);
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
  const handleSendMessage = async (overrideText) => {
    const trimmed = (overrideText ?? chatInput).trim();
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
                    <div className="relative p-3 bg-purple-500/20 rounded-2xl">
                      {isAiTyping && <span className="absolute inset-0 rounded-2xl bg-purple-500/40 animate-ping" />}
                      <Bot className="relative text-purple-400 w-8 h-8" />
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
                  <div className="relative flex-1 mb-6">
                    {/* Hoạ tiết nền dạng lưới chấm - trang trí, không chặn tương tác */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle, rgba(139,92,246,0.16) 1px, transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />

                    <div className="relative z-10 h-full bg-[#050510]/60 border border-white/5 rounded-2xl p-4 md:p-6 overflow-y-auto space-y-4 custom-scrollbar">
                      {chatMessages.map((msg, i) => (
                        <React.Fragment key={i}>
                          <div
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
                                      onClick={() => setLightboxImage(msg.content.image)}
                                      className="max-w-full max-h-60 rounded-xl border border-white/10 object-contain cursor-zoom-in hover:opacity-90 transition-opacity"
                                    />
                                  )}
                                  {msg.content.text && <span>{msg.content.text}</span>}
                                </div>
                              ) : (
                                msg.content
                              )}
                            </div>
                          </div>

                          {/* Hành động gợi ý sau kết quả chẩn đoán mới nhất */}
                          {msg.role === "ai" && i > 0 && i === chatMessages.length - 1 && !isAiTyping && (
                            <div className="flex flex-wrap gap-2 pl-1 animate-in fade-in slide-in-from-bottom-2 duration-300">
                              <button
                                onClick={() => setActiveModal("technician-list")}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-purple-600/15 text-purple-300 border border-purple-500/30 rounded-full hover:bg-purple-600/25 hover:border-purple-500/50 transition-colors"
                              >
                                <User size={12} /> Đặt thợ ngay
                              </button>
                              <button
                                onClick={() => setActiveModal("distributor-list")}
                                className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 bg-blue-600/15 text-blue-300 border border-blue-500/30 rounded-full hover:bg-blue-600/25 hover:border-blue-500/50 transition-colors"
                              >
                                <Settings size={12} /> Tìm linh kiện thay thế
                              </button>
                            </div>
                          )}
                        </React.Fragment>
                      ))}

                      {/* Gợi ý nhanh các lỗi thường gặp - chỉ hiện khi chat vừa mở */}
                      {chatMessages.length === 1 && !isAiTyping && (
                        <div className="flex flex-wrap gap-2 pl-1 animate-in fade-in slide-in-from-bottom-2 duration-500">
                          {QUICK_REPLIES.map((q, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleSendMessage(q)}
                              className="text-xs px-3 py-2 bg-white/5 border border-white/10 text-slate-300 rounded-full hover:bg-purple-500/10 hover:border-purple-500/40 hover:text-purple-300 transition-all"
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Bong bóng loading khi AI đang xử lý */}
                      {isAiTyping && <TypingBubble />}

                      {/* Anchor để auto-scroll */}
                      <div ref={chatEndRef} />
                    </div>
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
                    <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/25 via-fuchsia-500/20 to-blue-500/25 blur-xl rounded-3xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />

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
                      onClick={() => handleSendMessage()}
                      disabled={isAiTyping || (!chatInput.trim() && !selectedImage)}
                      className="absolute right-3 top-3 z-10 p-3 bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white rounded-xl hover:from-purple-500 hover:to-fuchsia-500 hover:scale-105 transition-all shadow-lg shadow-purple-900/30 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:from-purple-600 disabled:to-fuchsia-600"
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
                  {/* Header */}
                  <div style={{ marginBottom: 24 }}>
                    <h3 className="text-3xl font-bold text-white flex items-center gap-3" style={{ marginBottom: 6 }}>
                      <User className="text-purple-500 w-8 h-8" /> Kết nối chuyên gia
                    </h3>
                    <p style={{ color: "#475569", fontSize: 13, margin: "0 0 16px" }}>
                      <span style={{ color: "#10B981", fontWeight: 600 }}>{technicianData.filter((t) => t.online).length}</span> thợ đang trực tuyến
                    </p>
                    {/* Filter */}
                    <div style={{ display: "flex", gap: 8 }}>
                      {[{ key: "all", label: "Tất cả" }, { key: "online", label: "⚡ Trực tuyến" }].map((f) => (
                        <button
                          key={f.key}
                          onClick={() => setTechFilter(f.key)}
                          style={{
                            padding: "6px 18px", borderRadius: 20, border: "none", fontSize: 13,
                            fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                            background: techFilter === f.key ? "#7C3AED" : "rgba(255,255,255,0.05)",
                            color: techFilter === f.key ? "#fff" : "#64748B",
                          }}
                        >{f.label}</button>
                      ))}
                    </div>
                  </div>

                  {/* Danh sách card */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {(techFilter === "online"
                      ? technicianData.filter((t) => t.online)
                      : technicianData
                    ).map((tech) => (
                      <TechCard key={tech.id} tech={tech} onViewProfile={setSelectedTech} onBook={handleBookTech} />
                    ))}
                  </div>

                  <p style={{ color: "#334155", fontSize: 12, textAlign: "center", marginTop: 16 }}>
                    Nhấn vào card để xem hồ sơ đầy đủ
                  </p>
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
                        className="group relative p-6 bg-[#16162d] rounded-3xl border border-white/10 flex flex-col items-center gap-5 transition-all duration-300 hover:-translate-y-2 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/20"
                      >
                        {/* Mũi tên gợi ý click ra ngoài */}
                        <ArrowUpRight
                          size={18}
                          className="absolute top-4 right-4 text-purple-400 opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-300"
                        />

                        {/* Khung logo - nổi lên kèm glow khi hover */}
                        <div className="w-full h-28 flex items-center justify-center bg-white rounded-2xl p-4 shadow-md transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:scale-105 group-hover:shadow-[0_12px_30px_rgba(124,58,237,0.35)]">
                          <img src={brand.logo} alt={brand.name} className="max-w-full max-h-full object-contain" />
                        </div>

                        <div className="text-center">
                          <p className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors">{brand.name}</p>
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
      
      {selectedTech && (
        <ProfileModal tech={selectedTech} onClose={() => setSelectedTech(null)} onBook={handleBookTech} />
      )}

      {/* Toast đặt lịch */}
      {techToast && (
        <div style={{
          position: "fixed", bottom: 32, left: "50%", transform: "translateX(-50%)",
          background: "#10B981", color: "#fff", padding: "14px 28px",
          borderRadius: 16, fontWeight: 600, fontSize: 15,
          boxShadow: "0 8px 30px rgba(16,185,129,0.4)", zIndex: 100000,
        }}>
          ✅ Đã đặt lịch với {techToast}!
        </div>
      )}

      {/* Lightbox xem ảnh đính kèm trong chat ở kích thước đầy đủ */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-[100001] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6 cursor-zoom-out animate-in fade-in duration-200"
        >
          <img
            src={lightboxImage}
            alt="Ảnh xem đầy đủ"
            className="max-w-full max-h-full rounded-2xl shadow-2xl border border-white/10 object-contain"
          />
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-5 right-5 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
