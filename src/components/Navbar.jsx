import React, { useState, useEffect } from "react";
// Đã thêm import Globe cho icon ngôn ngữ
import { Menu, User, Shield, Wallet, LogOut, X, ChevronRight, QrCode, Copy, Check, Clock, Settings, ShoppingBag, Bookmark, LogIn, Globe } from "lucide-react";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [activeSection, setActiveSection] = useState("Home");
    const [copied, setCopied] = useState(false);

    // ================================================================
    // STATE QUẢN LÝ NGÔN NGỮ (TÍNH NĂNG MỚI)
    // ================================================================
    const [currentLang, setCurrentLang] = useState("VI");
    const [isLangOpen, setIsLangOpen] = useState(false);

    // ================================================================
    // TRẠNG THÁI ĐĂNG NHẬP
    // true  -> Nick thật hiện đầy đủ thông số
    // false -> Khách chỉ hiện logo + nút đăng nhập
    // ================================================================
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const userData = {
        name: "Hồ Duy Long",
        level: "Thành viên Thách Đấu",
        levelProgress: 76,
        nextLevelValue: "44.300.000 VNĐ",
        balance: "155.700.000 VNĐ",
        avatar: "https://files.catbox.moe/0wq6u1.png",
        isOnline: true,
        recentTransactions: [
            { id: 1, desc: "Nạp tiền hệ thống", amount: "+500.000đ", date: "Hôm nay", type: "plus" },
            { id: 2, desc: "Sửa chữa máy tính", amount: "-150.000đ", date: "Hôm qua", type: "minus" }
        ]
    };

    const navItems = [
        { href: "#Home", label: "Trang chủ" },
        { href: "#About", label: "Về chúng tôi" },
        { href: "#Portofolio", label: "Dịch vụ & Tính năng" },
        { href: "#Contact", label: "Hỗ trợ" },
    ];

    const handleCopy = () => {
        navigator.clipboard.writeText("Nạp Tiền Vào Tài Khoản #1890");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // ================================================================
    // ĐĂNG NHẬP THẬT
    // ================================================================
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

                if (section) {
                    return {
                        id: item.href.replace("#", ""),
                        offset: section.offsetTop - 550,
                        height: section.offsetHeight
                    };
                }

                return null;
            }).filter(Boolean);

            const currentPosition = window.scrollY;

            const active = sections.find(
                section =>
                    currentPosition >= section.offset &&
                    currentPosition < section.offset + section.height
            );

            if (active) setActiveSection(active.id);
        };

        window.addEventListener("scroll", handleScroll);

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        document.body.style.overflow =
            (isOpen || isSidebarOpen || isDepositModalOpen || isLangOpen)
                ? "hidden"
                : "unset";
    }, [isOpen, isSidebarOpen, isDepositModalOpen, isLangOpen]);

    const scrollToSection = (e, href) => {
        e.preventDefault();

        const section = document.querySelector(href);

        if (section) {
            window.scrollTo({
                top: section.offsetTop - 100,
                behavior: "smooth"
            });
        }

        setIsOpen(false);
    };

    // ================================================================
    // COMPONENT CHUYỂN ĐỔI NGÔN NGỮ (TÍNH NĂNG MỚI)
    // ================================================================
    const LanguageSwitcher = () => (
        <div className="relative">
            <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white/90 text-xs font-semibold hover:bg-white/10 hover:border-cyan-500/30 transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]"
            >
                <Globe size={14} className="text-cyan-400" />
                <span>{currentLang === "VI" ? "VI" : "EN"}</span>
                <ChevronRight
                    size={12}
                    className={`text-slate-400 transition-transform duration-300 ${isLangOpen ? "rotate-90 text-cyan-400" : ""}`}
                />
            </button>

            {isLangOpen && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsLangOpen(false)}></div>
                    <div className="absolute right-0 mt-2 w-32 rounded-xl bg-[#0b081f]/95 border border-white/10 p-1.5 backdrop-blur-xl shadow-2xl z-50">
                        <button
                            onClick={() => {
                                setCurrentLang("VI");
                                setIsLangOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                                currentLang === "VI"
                                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span>Tiếng Việt</span>
                            {currentLang === "VI" && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>}
                        </button>

                        <button
                            onClick={() => {
                                setCurrentLang("EN");
                                setIsLangOpen(false);
                            }}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all mt-1 ${
                                currentLang === "EN"
                                    ? "bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-cyan-400 border border-cyan-500/20"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            }`}
                        >
                            <span>English</span>
                            {currentLang === "EN" && <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></div>}
                        </button>
                    </div>
                </>
            )}
        </div>
    );

    return (
        <>
            <nav
                className={`fixed w-full top-0 z-50 transition-all duration-500 ${
                    scrolled || isSidebarOpen || isDepositModalOpen || isOpen
                        ? "bg-[#030014]/80 backdrop-blur-xl border-b border-white/10"
                        : "bg-transparent"
                }`}
            >
                <div className="mx-auto px-[5%] lg:px-[10%] flex items-center justify-between h-16">
                    <a
                        href="#Home"
                        onClick={(e) => scrollToSection(e, "#Home")}
                        className="text-xl font-bold bg-gradient-to-r from-[#a855f7] to-[#6366f1] bg-clip-text text-transparent tracking-tighter"
                    >
                        SC PLATFORM
                    </a>

                    <div className="hidden md:flex items-center space-x-8">
                        <div className="flex items-center space-x-8">
                            {navItems.map((item) => (
                                <a
                                    key={item.label}
                                    href={item.href}
                                    onClick={(e) => scrollToSection(e, item.href)}
                                    className={`relative px-1 py-2 text-sm font-medium transition-colors ${
                                        activeSection === item.href.substring(1)
                                            ? "text-white"
                                            : "text-[#e2d3fd] hover:text-white"
                                    }`}
                                >
                                    {item.label}

                                    {activeSection === item.href.substring(1) && (
                                        <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#6366f1] to-[#a855f7]" />
                                    )}
                                </a>
                            ))}
                        </div>

                        {/* Wrap Language Switcher & Avatar Desktop */}
                        <div className="flex items-center gap-4 border-l border-white/10 pl-6 ml-2">
                            <LanguageSwitcher />

                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="relative p-0.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7] hover:scale-105 transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                            >
                                {isLoggedIn ? (
                                    <>
                                        <img
                                            src={userData.avatar}
                                            alt="User"
                                            className="w-10 h-10 rounded-full border-2 border-[#030014] object-cover"
                                        />

                                        {userData.isOnline && (
                                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#030014] rounded-full animate-pulse"></span>
                                        )}
                                    </>
                                ) : (
                                    <div className="w-10 h-10 rounded-full bg-[#030014] flex items-center justify-center">
                                        <User className="text-white w-5 h-5" />
                                    </div>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="md:hidden flex items-center gap-4">
                        {/* Language Switcher Mobile */}
                        <LanguageSwitcher />

                        <button
                            onClick={() => setIsSidebarOpen(true)}
                            className="relative p-0.5 rounded-full bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
                        >
                            {isLoggedIn ? (
                                <img
                                    src={userData.avatar}
                                    className="w-8 h-8 rounded-full border border-[#030014]"
                                    alt="User"
                                />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-[#030014] flex items-center justify-center">
                                    <User className="text-white w-4 h-4" />
                                </div>
                            )}
                        </button>

                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-[#e2d3fd] ml-1"
                        >
                            {isOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* ================================================================ */}
            {/* SIDEBAR */}
            {/* ================================================================ */}

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999]"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-85 bg-[#030014]/95 border-l border-white/10 backdrop-blur-2xl z-[1000] transform transition-transform duration-500 ${
                    isSidebarOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">

                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-white tracking-tight uppercase">
                            Tài khoản
                        </h2>

                        <button
                            onClick={() => setIsSidebarOpen(false)}
                            className="text-gray-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <X />
                        </button>
                    </div>

                    {isLoggedIn ? (

                        // =========================================================
                        // ĐĂNG NHẬP BẰNG NICK THẬT
                        // =========================================================

                        <div className="space-y-6 animate-fadeIn">

                            {/* Cấp bậc */}

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 relative overflow-hidden group">

                                <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-40 transition-opacity">
                                    <Shield className="w-12 h-12 text-purple-500" />
                                </div>

                                <div className="flex items-center gap-4 mb-4 relative z-10">

                                    <div className="p-2 rounded-lg bg-purple-500/10">
                                        <Shield className="text-purple-400 w-5 h-5" />
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest">
                                            Hạng thành viên
                                        </p>

                                        <p className="text-purple-300 font-bold text-base">
                                            {userData.level}
                                        </p>
                                    </div>
                                </div>

                                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden mb-2">
                                    <div
                                        className="bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 h-full shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                                        style={{
                                            width: `${userData.levelProgress}%`
                                        }}
                                    ></div>
                                </div>

                                <div className="flex justify-between items-center text-[9px] font-bold uppercase tracking-tighter">
                                    <span className="text-gray-500 italic">
                                        Tiến độ: {userData.levelProgress}%
                                    </span>

                                    <span className="text-purple-400/80">
                                        Thiếu {userData.nextLevelValue} để lên hạng
                                    </span>
                                </div>
                            </div>

                            {/* Số dư */}

                            <button
                                onClick={() => {
                                    setIsSidebarOpen(false);
                                    setIsDepositModalOpen(true);
                                }}
                                className="w-full relative overflow-hidden flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10 hover:border-blue-500/40 transition-all group"
                            >
                                <div className="p-3 rounded-xl bg-green-500/10 group-hover:bg-green-500/20 transition-colors">
                                    <Wallet className="text-green-400 w-6 h-6 group-hover:scale-110 transition-transform" />
                                </div>

                                <div className="flex-grow text-left">
                                    <p className="text-[10px] text-gray-500 uppercase font-extrabold tracking-widest">
                                        Số dư ví khả dụng
                                    </p>

                                    <p className="text-green-400 font-black text-xl leading-none mt-1">
                                        {userData.balance}
                                    </p>
                                </div>

                                <ChevronRight className="text-gray-600 group-hover:text-white transition-colors" />
                            </button>

                            {/* Lịch sử giao dịch */}

                            <div className="space-y-3">

                                <div className="flex items-center justify-between px-1">
                                    <div className="flex items-center gap-2 text-gray-400">
                                        <Clock className="w-4 h-4" />

                                        <span className="text-[11px] font-extrabold uppercase tracking-widest">
                                            Giao dịch gần đây
                                        </span>
                                    </div>

                                    <span className="text-[9px] text-blue-400 cursor-pointer hover:underline">
                                        Xem tất cả
                                    </span>
                                </div>

                                {userData.recentTransactions.map(tx => (
                                    <div
                                        key={tx.id}
                                        className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 text-sm hover:bg-white/10 transition-all cursor-default"
                                    >
                                        <div className="flex flex-col">
                                            <p className="text-white font-semibold">
                                                {tx.desc}
                                            </p>

                                            <p className="text-[10px] text-gray-500 font-medium">
                                                {tx.date}
                                            </p>
                                        </div>

                                        <span
                                            className={`font-bold tabular-nums ${
                                                tx.type === "plus"
                                                    ? "text-green-400"
                                                    : "text-red-400"
                                            }`}
                                        >
                                            {tx.amount}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Tiện ích */}

                            <div className="grid grid-cols-3 gap-2 pt-2">

                                {[
                                    { icon: ShoppingBag, label: "Đơn hàng" },
                                    { icon: Bookmark, label: "Đã lưu" },
                                    { icon: Settings, label: "Cài đặt" }
                                ].map((item, idx) => (

                                    <button
                                        key={idx}
                                        className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all active:scale-90 group"
                                    >
                                        <item.icon className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />

                                        <span className="text-[9px] text-gray-400 font-extrabold uppercase group-hover:text-white">
                                            {item.label}
                                        </span>
                                    </button>
                                ))}
                            </div>

                            {/* Đăng xuất */}

                            <button
                                onClick={() => setIsLoggedIn(false)}
                                className="mt-6 w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/30 transition-all font-bold group shadow-sm"
                            >
                                <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />

                                <span className="tracking-tight">
                                    Đăng xuất tài khoản
                                </span>
                            </button>
                        </div>

                    ) : (

                        // =========================================================
                        // KHÁCH
                        // =========================================================

                        <div className="flex flex-col items-center justify-center h-[75vh] text-center space-y-8 px-4 animate-slideUp">

                            {/* Logo */}

                            <div className="relative">

                                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shadow-2xl relative z-10">
                                    <User className="w-12 h-12 text-gray-600" />
                                </div>

                                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
                            </div>

                            {/* Text */}

                            <div className="space-y-2">

                                <h3 className="text-white font-black text-2xl tracking-tight">
                                    Chào khách quý!
                                </h3>

                                <p className="text-sm text-gray-400 leading-relaxed max-w-[200px] mx-auto font-medium">
                                    Vui lòng đăng nhập để sử dụng đầy đủ chức năng hệ thống.
                                </p>
                            </div>

                            {/* Nút đăng nhập */}

                            <button
                                onClick={handleLoginRedirect}
                                className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-black hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] active:scale-95 transition-all group"
                            >
                                <LogIn className="w-6 h-6 group-hover:translate-x-1 transition-transform" />

                                <span className="uppercase tracking-widest text-sm">
                                    Đăng nhập ngay
                                </span>
                            </button>

                            {/* Footer */}

                            <div className="pt-8 border-t border-white/5 w-full">
                                <p className="text-[10px] text-gray-600 italic uppercase font-bold tracking-[0.2em]">
                                    SC Platform Global
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ================================================================ */}
            {/* MODAL NẠP TIỀN */}
            {/* ================================================================ */}

            {isDepositModalOpen && (
                <div className="fixed inset-0 z-[1100] flex items-center justify-center p-4">

                    <div
                        className="absolute inset-0 bg-black/80 backdrop-blur-md"
                        onClick={() => setIsDepositModalOpen(false)}
                    ></div>

                    <div className="relative w-full max-w-md bg-[#030014] border border-white/10 rounded-3xl p-8 shadow-2xl">

                        <button
                            onClick={() => setIsDepositModalOpen(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                        >
                            <X />
                        </button>

                        <div className="text-center">

                            <div className="inline-flex p-4 rounded-2xl bg-blue-500/10 mb-6 border border-blue-500/20">
                                <QrCode className="text-blue-400 w-10 h-10" />
                            </div>

                            <h3 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">
                                Cổng nạp tiền
                            </h3>

                            <p className="text-gray-500 text-sm mb-6">
                                Quét mã QR để thực hiện giao dịch tự động
                            </p>

                            <div className="bg-white p-4 rounded-2xl inline-block mb-8 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Nạp Tiền #1890`}
                                    alt="QR"
                                    className="w-48 h-48"
                                />
                            </div>

                            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group hover:border-blue-500/30 transition-colors">

                                <span className="text-blue-400 font-mono text-sm font-bold uppercase tracking-widest">
                                    Nạp Tiền #1890
                                </span>

                                <button
                                    onClick={handleCopy}
                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    {copied ? (
                                        <Check className="text-green-400" />
                                    ) : (
                                        <Copy className="text-gray-400" />
                                    )}
                                </button>
                            </div>

                            <p className="text-[10px] text-gray-600 mt-6 font-bold uppercase tracking-widest italic">
                                Lưu ý: Giao dịch được xử lý trong 1-3 phút
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;