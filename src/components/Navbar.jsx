import React, { useState, useEffect, useRef } from "react";
import {
    Menu, User, Shield, Wallet, LogOut, X, ChevronRight,
    QrCode, Copy, Check, Clock, Settings, ShoppingBag,
    Bookmark, LogIn, Globe, Plus, TrendingUp, Package,
    CreditCard, Star, Zap, BarChart2, History
} from "lucide-react";

// ──────────────────────────────────────────────────────────────────
// Animated counter hook
// ──────────────────────────────────────────────────────────────────
const useCountUp = (target, duration = 1000, active = true) => {
    const [value, setValue] = useState(0);
    useEffect(() => {
        if (!active) return;
        let start = null;
        const num = parseInt(target.replace(/\D/g, ""), 10);
        const step = (ts) => {
            if (!start) start = ts;
            const progress = Math.min((ts - start) / duration, 1);
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(Math.floor(ease * num));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [active, target, duration]);
    return value;
};

// Transaction icon mapping
const TX_META = {
    deposit: { icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10", label: "Nạp tiền" },
    repair:  { icon: Zap,        color: "text-blue-400",  bg: "bg-blue-500/10",  label: "Dịch vụ" },
    purchase:{ icon: Package,    color: "text-orange-400",bg: "bg-orange-500/10",label: "Mua hàng" },
};

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [copied, setCopied] = useState(false);
    const [currentLang, setCurrentLang] = useState("VI");
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [activeTab, setActiveTab] = useState("overview"); // "overview" | "history"

    const userData = {
        name: "Hồ Duy Long",
        level: "Thành viên Bạc",
        levelProgress: 76,
        nextLevelValue: "1.250.000 VNĐ",
        balance: "1.700.000 VNĐ",
        balanceRaw: 1700000,
        avatar: "https://files.catbox.moe/uoz3to.jpg",
        isOnline: true,
        joinDate: "15/03/2023",
        totalOrders: 24,
        totalPoints: 840,
        recentTransactions: [
            { id: 1, desc: "Nạp tiền hệ thống",         amount: "+500.000đ", date: "Hôm nay",    type: "plus",  txType: "deposit"  },
            { id: 2, desc: "Sửa chữa máy tính",          amount: "-150.000đ", date: "Hôm qua",   type: "minus", txType: "repair"   },
            { id: 3, desc: "Mua linh kiện chính hãng",   amount: "-850.000đ", date: "1 tuần trước", type: "minus", txType: "purchase" },
            { id: 4, desc: "Nạp tiền hệ thống",          amount: "+200.000đ", date: "2 tuần trước", type: "plus",  txType: "deposit"  },
            { id: 5, desc: "Sửa chữa điện thoại",        amount: "-300.000đ", date: "1 tháng trước", type: "minus", txType: "repair"  },
        ]
    };

    const navItems = [
        { href: "#Home",       label: "Trang chủ" },
        { href: "#About",      label: "Về chúng tôi" },
        { href: "#Portofolio", label: "Dịch vụ & Tính năng" },
        { href: "#Contact",    label: "Hỗ trợ" },
    ];

    // Counter animation when sidebar opens
    const balanceCount = useCountUp(userData.balance, 1200, isSidebarOpen && isLoggedIn);
    const formattedBalance = isSidebarOpen && isLoggedIn
        ? balanceCount.toLocaleString("vi-VN") + " VNĐ"
        : userData.balance;

    const handleCopy = () => {
        navigator.clipboard.writeText("Nạp Tiền Vào Tài Khoản #1890");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleLoginRedirect = () => {
        setIsLoggedIn(true);
        setIsSidebarOpen(false);
        setIsOpen(false);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
            const sections = navItems.map(item => {
                const section = document.querySelector(item.href);
                if (section) return { id: item.href.replace("#", ""), offset: section.offsetTop - 550, height: section.offsetHeight };
                return null;
            }).filter(Boolean);
            const active = sections.find(s => window.scrollY >= s.offset && window.scrollY < s.offset + s.height);
            if (active) setActiveSection(active.id);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow = (isOpen || isSidebarOpen || isDepositModalOpen || isLangOpen) ? "hidden" : "unset";
    }, [isOpen, isSidebarOpen, isDepositModalOpen, isLangOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();
        document.querySelector(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
        setIsOpen(false);
    };

    // ──────────────────────────────────────────────────────────────
    // Language Switcher
    // ──────────────────────────────────────────────────────────────
    const LanguageSwitcher = () => (
        <div className="relative">
            <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-semibold hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300"
            >
                <Globe size={14} className="text-cyan-400" />
                <span>{currentLang}</span>
                <ChevronRight size={12} className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? "rotate-90 text-cyan-400" : ""}`} />
            </button>
            {isLangOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)} />
                    <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#0b081f]/95 border border-white/10 p-1.5 backdrop-blur-xl shadow-2xl z-50">
                        {["VI","EN"].map(lang => (
                            <button key={lang} onClick={() => { setCurrentLang(lang); setIsLangOpen(false); }}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all mt-1 first:mt-0 ${currentLang === lang ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/20" : "text-slate-400 hover:text-white hover:bg-white/5"}`}>
                                <span>{lang === "VI" ? "Tiếng Việt" : "English"}</span>
                                {currentLang === lang && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );

    // ──────────────────────────────────────────────────────────────
    // Membership card (metallic design)
    // ──────────────────────────────────────────────────────────────
    const MemberCard = () => (
        <div className="relative overflow-hidden rounded-2xl p-4 cursor-default select-none"
            style={{ background: "linear-gradient(135deg, #1e1040 0%, #2d1b6b 40%, #1a2a6b 100%)" }}>
            {/* Shine overlay */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)" }} />
            {/* Decorative circles */}
            <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full opacity-20"
                style={{ background: "radial-gradient(circle, #a855f7, transparent)" }} />
            <div className="absolute -right-2 -bottom-4 w-20 h-20 rounded-full opacity-15"
                style={{ background: "radial-gradient(circle, #6366f1, transparent)" }} />

            {/* Top row */}
            <div className="flex items-center justify-between mb-5 relative z-10">
                <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                        <Shield className="w-4 h-4 text-purple-300" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">SC Platform</span>
                </div>
                <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-[9px] font-black text-yellow-300 uppercase tracking-widest">Silver</span>
                </div>
            </div>

            {/* Name */}
            <div className="relative z-10 mb-4">
                <p className="text-[9px] text-white/40 uppercase tracking-widest font-bold mb-0.5">Thành viên</p>
                <p className="text-white font-black text-base tracking-tight">{userData.name}</p>
            </div>

            {/* Progress */}
            <div className="relative z-10">
                <div className="flex justify-between text-[8px] text-white/40 font-bold uppercase tracking-widest mb-1.5">
                    <span>Tiến độ lên hạng Vàng</span>
                    <span className="text-purple-300">{userData.levelProgress}%</span>
                </div>
                <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                        style={{ width: `${userData.levelProgress}%`, background: "linear-gradient(90deg, #6366f1, #a855f7, #ec4899)" }} />
                </div>
                <p className="text-[8px] text-white/30 mt-1.5">Thiếu {userData.nextLevelValue}</p>
            </div>
        </div>
    );

    // ──────────────────────────────────────────────────────────────
    // Quick stats row
    // ──────────────────────────────────────────────────────────────
    const QuickStats = () => (
        <div className="grid grid-cols-3 gap-2">
            {[
                { label: "Đơn hàng", value: userData.totalOrders, icon: ShoppingBag, color: "text-blue-400", suffix: "" },
                { label: "Điểm tích lũy", value: userData.totalPoints, icon: Star, color: "text-yellow-400", suffix: "" },
                { label: "Ngày tham gia", value: "2023", icon: BarChart2, color: "text-purple-400", suffix: "" },
            ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all">
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    <span className={`text-sm font-black ${stat.color}`}>{stat.value}</span>
                    <span className="text-[8px] text-gray-500 font-bold uppercase tracking-wider text-center">{stat.label}</span>
                </div>
            ))}
        </div>
    );

    // ──────────────────────────────────────────────────────────────
    // Wallet card with inline deposit button
    // ──────────────────────────────────────────────────────────────
    const WalletCard = () => (
        <div className="relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-gradient-to-br from-green-500/8 to-emerald-500/5">
            <div className="p-3 rounded-xl bg-green-500/10">
                <Wallet className="text-green-400 w-6 h-6" />
            </div>
            <div className="flex-grow">
                <p className="text-[9px] text-gray-500 uppercase font-extrabold tracking-widest">Số dư khả dụng</p>
                <p className="text-green-400 font-black text-xl leading-none mt-1 tabular-nums">{formattedBalance}</p>
            </div>
            {/* Inline deposit button */}
            <button
                onClick={() => { setIsSidebarOpen(false); setIsDepositModalOpen(true); }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-green-500/15 border border-green-500/25 text-green-400 text-xs font-black uppercase tracking-wide hover:bg-green-500/25 hover:border-green-500/40 active:scale-95 transition-all"
            >
                <Plus className="w-3.5 h-3.5" />
                Nạp
            </button>
        </div>
    );

    // ──────────────────────────────────────────────────────────────
    // Transaction list (categorized icons)
    // ──────────────────────────────────────────────────────────────
    const TransactionList = ({ limit }) => {
        const txs = limit ? userData.recentTransactions.slice(0, limit) : userData.recentTransactions;
        return (
            <div className="space-y-2">
                {txs.map(tx => {
                    const meta = TX_META[tx.txType] || TX_META.deposit;
                    const Icon = meta.icon;
                    return (
                        <div key={tx.id}
                            className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/8 transition-all cursor-default">
                            <div className={`p-2 rounded-lg ${meta.bg} shrink-0`}>
                                <Icon className={`w-4 h-4 ${meta.color}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold text-sm truncate">{tx.desc}</p>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-bold uppercase tracking-wider ${meta.color} opacity-70`}>{meta.label}</span>
                                    <span className="text-[9px] text-gray-600">·</span>
                                    <span className="text-[9px] text-gray-500 font-medium">{tx.date}</span>
                                </div>
                            </div>
                            <span className={`font-bold text-sm tabular-nums shrink-0 ${tx.type === "plus" ? "text-green-400" : "text-red-400"}`}>
                                {tx.amount}
                            </span>
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <>
            {/* ================================================================ */}
            {/* NAVBAR */}
            {/* ================================================================ */}
            <nav className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                scrolled || isSidebarOpen || isDepositModalOpen || isOpen
                    ? "bg-[#030014]/80 backdrop-blur-xl border-b border-white/10"
                    : "bg-transparent"
            }`}>
                <div className="mx-auto px-[5%] lg:px-[10%] flex items-center justify-between h-16">
                    <a href="#Home" onClick={(e) => scrollToSection(e, "#Home")}
                        className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent tracking-tighter">
                        SC PLATFORM
                    </a>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-8">
                            {navItems.map(item => (
                                <a key={item.label} href={item.href} onClick={(e) => scrollToSection(e, item.href)}
                                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${activeSection === item.href.substring(1) ? "text-white" : "text-[#e2d3fd] hover:text-white"}`}>
                                    {item.label}
                                    {activeSection === item.href.substring(1) && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
                                    )}
                                </a>
                            ))}
                        </div>
                        <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                            <LanguageSwitcher />
                            <button onClick={() => setIsSidebarOpen(true)}
                                className="relative p-0.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:scale-105 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]">
                                {isLoggedIn ? (
                                    <>
                                        <img src={userData.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-[#030014] object-cover" />
                                        {userData.isOnline && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#030014] rounded-full animate-pulse" />}
                                    </>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#030014] flex items-center justify-center">
                                        <User className="text-white w-5 h-5" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav */}
                    <div className="md:hidden flex items-center gap-4">
                        <LanguageSwitcher />
                        <button onClick={() => setIsSidebarOpen(true)}
                            className="relative p-0.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                            {isLoggedIn ? (
                                <img src={userData.avatar} className="w-8 h-8 rounded-full border border-[#030014]" alt="User" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#030014] flex items-center justify-center">
                                    <User className="text-white w-4 h-4" />
                                </div>
                            )}
                        </button>
                        <button onClick={() => setIsOpen(!isOpen)} className="text-[#e2d3fd] ml-1">
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile menu dropdown */}
            {isOpen && (
                <div className="fixed top-16 inset-x-0 z-40 bg-[#030014]/95 backdrop-blur-xl border-b border-white/10 md:hidden">
                    <div className="px-6 py-4 flex flex-col gap-1">
                        {navItems.map(item => (
                            <a key={item.label} href={item.href} onClick={(e) => scrollToSection(e, item.href)}
                                className={`py-3 px-2 text-sm font-medium border-b border-white/5 last:border-0 transition-colors ${activeSection === item.href.substring(1) ? "text-white" : "text-gray-400 hover:text-white"}`}>
                                {item.label}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* ================================================================ */}
            {/* SIDEBAR OVERLAY */}
            {/* ================================================================ */}
            {isSidebarOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]" onClick={() => setIsSidebarOpen(false)} />
            )}

            {/* ================================================================ */}
            {/* SIDEBAR PANEL */}
            {/* ================================================================ */}
            <div className={`fixed top-0 right-0 h-full w-[340px] bg-[#030014]/97 border-l border-white/8 backdrop-blur-2xl z-[1000] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
                <div className="p-5 flex flex-col h-full overflow-y-auto" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.1) transparent" }}>

                    {/* ── Header ── */}
                    {isLoggedIn ? (
                        /* PROFILE HERO */
                        <div className="relative mb-6">
                            {/* Close button */}
                            <button onClick={() => setIsSidebarOpen(false)}
                                className="absolute top-0 right-0 text-gray-400 hover:text-white p-1.5 hover:bg-white/5 rounded-lg transition-colors z-10">
                                <X size={18} />
                            </button>

                            {/* Avatar + name block */}
                            <div className="flex items-center gap-4">
                                <div className="relative shrink-0">
                                    <div className="p-0.5 rounded-full bg-gradient-to-br from-[#6366f1] to-[#a855f7] shadow-[0_0_20px_rgba(99,102,241,0.4)]">
                                        <img src={userData.avatar} alt={userData.name}
                                            className="w-16 h-16 rounded-full object-cover border-2 border-[#030014]" />
                                    </div>
                                    {userData.isOnline && (
                                        <span className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-[#030014] rounded-full shadow-[0_0_8px_#22c55e]" />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest mb-0.5">Xin chào,</p>
                                    <h3 className="text-white font-black text-lg tracking-tight leading-none truncate">{userData.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-1.5">
                                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/15 border border-purple-500/25">
                                            <Shield className="w-3 h-3 text-purple-400" />
                                            <span className="text-[9px] text-purple-300 font-black uppercase tracking-wide">{userData.level}</span>
                                        </div>
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
                                        <span className="text-[9px] text-green-400 font-bold">Online</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* GUEST HEADER */
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-xl font-bold text-white tracking-tight uppercase">Tài khoản</h2>
                            <button onClick={() => setIsSidebarOpen(false)}
                                className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors">
                                <X />
                            </button>
                        </div>
                    )}

                    {/* ── Content ── */}
                    {isLoggedIn ? (

                        <div className="space-y-4 animate-fadeIn flex-1">

                            {/* Tab switcher */}
                            <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/5">
                                {[
                                    { id: "overview", label: "Tổng quan", icon: BarChart2 },
                                    { id: "history",  label: "Lịch sử",   icon: History  },
                                ].map(tab => (
                                    <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${
                                            activeTab === tab.id
                                                ? "bg-gradient-to-r from-[#6366f1]/30 to-[#a855f7]/30 text-white border border-white/10 shadow-sm"
                                                : "text-gray-500 hover:text-gray-300"
                                        }`}>
                                        <tab.icon className="w-3.5 h-3.5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {activeTab === "overview" ? (
                                <>
                                    {/* Membership card */}
                                    <MemberCard />

                                    {/* Quick stats */}
                                    <QuickStats />

                                    {/* Wallet */}
                                    <WalletCard />

                                    {/* Recent transactions (limited) */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2.5 px-0.5">
                                            <div className="flex items-center gap-2 text-gray-400">
                                                <Clock className="w-4 h-4" />
                                                <span className="text-[10px] font-extrabold uppercase tracking-widest">Giao dịch gần đây</span>
                                            </div>
                                            <button onClick={() => setActiveTab("history")}
                                                className="text-[9px] text-blue-400 hover:text-blue-300 font-bold hover:underline transition-colors">
                                                Xem tất cả →
                                            </button>
                                        </div>
                                        <TransactionList limit={2} />
                                    </div>

                                    {/* Quick actions */}
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { icon: ShoppingBag, label: "Đơn hàng", color: "text-blue-400"   },
                                            { icon: Bookmark,    label: "Đã lưu",   color: "text-pink-400"   },
                                            { icon: Settings,    label: "Cài đặt",  color: "text-gray-400"   },
                                        ].map((item, idx) => (
                                            <button key={idx}
                                                className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-90 group">
                                                <item.icon className={`w-5 h-5 ${item.color} group-hover:scale-110 transition-transform`} />
                                                <span className="text-[9px] text-gray-400 font-extrabold uppercase group-hover:text-white transition-colors">{item.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                /* HISTORY TAB */
                                <>
                                    <div className="flex items-center gap-2 text-gray-400 px-0.5 mb-1">
                                        <History className="w-4 h-4" />
                                        <span className="text-[10px] font-extrabold uppercase tracking-widest">Tất cả giao dịch</span>
                                    </div>
                                    <TransactionList />

                                    {/* Summary strip */}
                                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between text-center">
                                        <div>
                                            <p className="text-green-400 font-black text-sm">+700.000đ</p>
                                            <p className="text-[8px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">Tổng nạp</p>
                                        </div>
                                        <div className="w-px bg-white/10" />
                                        <div>
                                            <p className="text-red-400 font-black text-sm">-1.300.000đ</p>
                                            <p className="text-[8px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">Tổng chi</p>
                                        </div>
                                        <div className="w-px bg-white/10" />
                                        <div>
                                            <p className="text-white font-black text-sm">5</p>
                                            <p className="text-[8px] text-gray-500 uppercase tracking-wider font-bold mt-0.5">Giao dịch</p>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* Logout */}
                            <button onClick={() => setIsLoggedIn(false)}
                                className="w-full flex items-center justify-center gap-3 p-3.5 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/15 hover:border-red-500/25 transition-all font-bold group">
                                <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                <span className="tracking-tight text-sm">Đăng xuất</span>
                            </button>
                        </div>

                    ) : (

                        /* GUEST STATE */
                        <div className="flex flex-col items-center justify-center flex-1 text-center space-y-8 px-4 animate-slideUp">
                            <div className="relative">
                                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative z-10">
                                    <User className="w-12 h-12 text-gray-600" />
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-white font-black text-2xl tracking-tight">Chào khách quý!</h3>
                                <p className="text-sm text-gray-400 leading-relaxed max-w-[200px] mx-auto font-medium">
                                    Đăng nhập để xem số dư, lịch sử và ưu đãi thành viên.
                                </p>
                            </div>
                            <button onClick={handleLoginRedirect}
                                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all group">
                                <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                <span className="uppercase tracking-widest text-sm">Đăng nhập ngay</span>
                            </button>
                            <div className="pt-8 border-t border-white/5 w-full">
                                <p className="text-[10px] text-gray-600 italic uppercase font-bold tracking-[0.2em]">SC Platform Global</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ================================================================ */}
            {/* DEPOSIT MODAL */}
            {/* ================================================================ */}
            {isDepositModalOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => setIsDepositModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-[#030014] border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <button onClick={() => setIsDepositModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                            <X />
                        </button>
                        <div className="text-center">
                            <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 mb-6 border border-blue-500/20">
                                <QrCode className="text-blue-400 w-10 h-10" />
                            </div>
                            <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Cổng nạp tiền</h3>
                            <p className="text-gray-500 text-sm mb-6">Quét mã QR để thực hiện giao dịch tự động</p>
                            <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Nạp Tiền #1890`} alt="QR" className="w-48 h-48" />
                            </div>
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between hover:border-blue-500/30 transition-colors">
                                <span className="text-blue-400 font-mono text-sm font-bold uppercase tracking-widest">Nạp Tiền #1890</span>
                                <button onClick={handleCopy} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                                    {copied ? <Check className="text-green-400" /> : <Copy className="text-gray-400" />}
                                </button>
                            </div>
                            <p className="text-[10px] text-gray-600 mt-6 font-bold uppercase tracking-widest italic">
                                Lưu ý: Giao dịch được xử lý trong 1–3 phút
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;
