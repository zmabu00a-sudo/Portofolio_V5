import React, { useEffect, useRef, useMemo } from "react"
import { Wrench, Settings, Cpu, Database } from "lucide-react"

const AnimatedBackground = () => {
	const blobRefs = useRef([])
	const spotlightRef = useRef(null)
	const gridRef = useRef(null)
	const mouseRef = useRef({ x: 0, y: 0 })

	const initialPositions = [
		{ x: -4, y: 0 },
		{ x: -4, y: 0 },
		{ x: 20, y: -8 },
		{ x: 20, y: -8 },
	]

	// Tạo danh sách 30 icon ngẫu nhiên về vị trí, kích thước, góc xoay
	// + thông số cho hiệu ứng "trôi nổi" (ý tưởng #3)
	const randomIcons = useMemo(() => {
		const icons = [Wrench, Settings, Cpu, Database]
		return [...Array(30)].map((_, i) => ({
			id: i,
			Icon: icons[Math.floor(Math.random() * icons.length)],
			top: `${Math.random() * 100}%`,
			left: `${Math.random() * 100}%`,
			size: Math.floor(Math.random() * 60) + 20, // 20 - 80
			rotate: Math.floor(Math.random() * 360),
			duration: (Math.random() * 8 + 8).toFixed(1), // 8s - 16s
			delay: (Math.random() * -16).toFixed(1), // lệch pha cho từng icon
			distance: Math.floor(Math.random() * 18) + 10, // 10px - 28px
		}))
	}, [])

	// Hạt sáng mô phỏng "dữ liệu truyền" bay chéo lên (ý tưởng #5)
	const particles = useMemo(() => {
		const colors = ["#a855f7", "#22d3ee", "#3b82f6"]
		return [...Array(22)].map((_, i) => ({
			id: i,
			top: `${Math.random() * 100}%`,
			left: `${Math.random() * 100}%`,
			size: Math.floor(Math.random() * 3) + 2, // 2px - 4px
			color: colors[Math.floor(Math.random() * colors.length)],
			duration: (Math.random() * 14 + 12).toFixed(1), // 12s - 26s
			delay: (Math.random() * -26).toFixed(1),
			tx: Math.floor(Math.random() * 200 - 100), // -100px -> 100px
			ty: Math.floor(Math.random() * -200 - 80), // -80px -> -280px (luôn bay lên)
		}))
	}, [])

	useEffect(() => {
		const prefersReduced = window.matchMedia(
			"(prefers-reduced-motion: reduce)"
		).matches
		let requestId

		// Theo dõi vị trí chuột (chuẩn hoá về [-0.5, 0.5]) cho parallax + spotlight
		const handleMouseMove = (e) => {
			mouseRef.current = {
				x: e.clientX / window.innerWidth - 0.5,
				y: e.clientY / window.innerHeight - 0.5,
			}
		}

		// (Ý tưởng #8) Một loop requestAnimationFrame DUY NHẤT chạy liên tục,
		// đọc scrollY mỗi frame thay vì tạo loop mới mỗi lần có scroll event
		// (bug cũ: mỗi scroll lại spawn thêm 1 vòng RAF -> chồng chéo, giật lag)
		const tick = () => {
			const scrollY = window.pageYOffset

			blobRefs.current.forEach((blob, index) => {
				if (!blob) return
				const initialPos = initialPositions[index]

				// Di chuyển theo scroll - giữ nguyên hiệu ứng gốc
				const xOffset = Math.sin(scrollY / 100 + index * 0.5) * 340
				const yOffset = Math.cos(scrollY / 100 + index * 0.5) * 40

				// (Ý tưởng #2) Parallax nhẹ theo chuột, mỗi blob có độ sâu khác nhau
				const depth = (index + 1) * 18
				const mx = prefersReduced ? 0 : mouseRef.current.x * depth
				const my = prefersReduced ? 0 : mouseRef.current.y * depth

				const x = initialPos.x + xOffset + mx
				const y = initialPos.y + yOffset + my

				blob.style.transform = `translate(${x}px, ${y}px)`
			})

			// (Ý tưởng #4) Vùng sáng (spotlight) bám theo con trỏ
			if (spotlightRef.current && !prefersReduced) {
				const sx = (mouseRef.current.x + 0.5) * 100
				const sy = (mouseRef.current.y + 0.5) * 100
				spotlightRef.current.style.setProperty("--spot-x", `${sx}%`)
				spotlightRef.current.style.setProperty("--spot-y", `${sy}%`)
			}

			// (Ý tưởng #9) Lưới nền sáng dần khi cuộn xuống
			if (gridRef.current) {
				const progress = Math.min(scrollY / 900, 1)
				gridRef.current.style.opacity = 0.4 + progress * 0.6
			}

			requestId = requestAnimationFrame(tick)
		}

		window.addEventListener("mousemove", handleMouseMove)
		requestId = requestAnimationFrame(tick)

		return () => {
			window.removeEventListener("mousemove", handleMouseMove)
			cancelAnimationFrame(requestId)
		}
	}, [])

	return (
		<div className="fixed inset-0">
			{/* Các khối blob: di chuyển theo scroll + chuột, "thở" và đổi sắc nhẹ */}
			{/* (Ý tưởng #1 + #6): mỗi blob được bọc trong 1 div ngoài (JS điều khiển vị trí) */}
			{/* và 1 div trong chạy animation CSS độc lập (scale "thở" + hue-rotate đổi màu) */}
			<div className="absolute inset-0">
				<div
					ref={(ref) => (blobRefs.current[0] = ref)}
					className="absolute top-0 -left-4 md:w-96 md:h-96 w-72 h-72"
					style={{ transition: "transform 1.4s ease-out" }}
				>
					<div
						className="w-full h-full bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 animate-blob-life"
						style={{ animationDelay: "0s, 0s" }}
					></div>
				</div>

				<div
					ref={(ref) => (blobRefs.current[1] = ref)}
					className="absolute top-0 -right-4 w-96 h-96 hidden sm:block"
					style={{ transition: "transform 1.4s ease-out" }}
				>
					<div
						className="w-full h-full bg-cyan-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 animate-blob-life"
						style={{ animationDelay: "-3s, -7s" }}
					></div>
				</div>

				<div
					ref={(ref) => (blobRefs.current[2] = ref)}
					className="absolute -bottom-8 left-[-40%] md:left-20 w-96 h-96"
					style={{ transition: "transform 1.4s ease-out" }}
				>
					<div
						className="w-full h-full bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-40 md:opacity-20 animate-blob-life"
						style={{ animationDelay: "-6s, -14s" }}
					></div>
				</div>

				<div
					ref={(ref) => (blobRefs.current[3] = ref)}
					className="absolute -bottom-10 right-20 w-96 h-96 hidden sm:block"
					style={{ transition: "transform 1.4s ease-out" }}
				>
					<div
						className="w-full h-full bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 md:opacity-10 animate-blob-life"
						style={{ animationDelay: "-9s, -21s" }}
					></div>
				</div>
			</div>

			{/* (Ý tưởng #4) Vùng sáng bám theo con trỏ - chỉ hiện ở desktop */}
			<div
				ref={spotlightRef}
				className="absolute inset-0 hidden md:block pointer-events-none"
				style={{
					background:
						"radial-gradient(circle at var(--spot-x, 50%) var(--spot-y, 30%), rgba(168,85,247,0.12), transparent 45%)",
				}}
			></div>

			{/* Lớp chứa các Icon mờ, ngẫu nhiên - (Ý tưởng #3) giờ trôi nổi nhẹ nhàng */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.06]">
				{randomIcons.map((item) => (
					<div
						key={item.id}
						className="absolute text-slate-400 animate-icon-float"
						style={{
							top: item.top,
							left: item.left,
							"--icon-rotate": `${item.rotate}deg`,
							"--float-distance": `-${item.distance}px`,
							animationDuration: `${item.duration}s`,
							animationDelay: `${item.delay}s`,
						}}
					>
						<item.Icon size={item.size} />
					</div>
				))}
			</div>

			{/* (Ý tưởng #5) Hạt sáng bay chéo lên, mô phỏng dữ liệu đang truyền */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				{particles.map((p) => (
					<div
						key={p.id}
						className="absolute rounded-full animate-particle-drift"
						style={{
							top: p.top,
							left: p.left,
							width: `${p.size}px`,
							height: `${p.size}px`,
							backgroundColor: p.color,
							boxShadow: `0 0 ${p.size * 3}px ${p.color}`,
							"--drift-x": `${p.tx}px`,
							"--drift-y": `${p.ty}px`,
							animationDuration: `${p.duration}s`,
							animationDelay: `${p.delay}s`,
						}}
					></div>
				))}
			</div>

			{/* (Ý tưởng #7) Lớp noise/grain rất nhẹ giúp gradient bớt "phẳng" */}
			<div
				className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
				style={{
					backgroundImage:
						"url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
				}}
			></div>

			{/* (Ý tưởng #9) Lưới nền - độ sáng tăng dần theo tiến trình cuộn trang */}
			<div
				ref={gridRef}
				className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f10_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f10_1px,transparent_1px)] bg-[size:24px_24px]"
				style={{ opacity: 0.4, transition: "opacity 0.6s ease-out" }}
			></div>

			{/* Keyframes cho các animation tuỳ biến (không có sẵn trong Tailwind) */}
			<style>{`
				/* (Ý tưởng #1) Blob "thở": phình to/nhỏ lại nhẹ nhàng */
				@keyframes blob-breathe {
					0%, 100% { transform: scale(1); }
					50% { transform: scale(1.15); }
				}
				/* (Ý tưởng #6) Màu blob đổi sắc rất chậm theo thời gian */
				@keyframes blob-hue {
					0%, 100% { filter: blur(128px) hue-rotate(0deg); }
					50% { filter: blur(128px) hue-rotate(35deg); }
				}
				.animate-blob-life {
					transform-origin: center;
					animation:
						blob-breathe 9s ease-in-out infinite,
						blob-hue 22s ease-in-out infinite;
				}

				/* (Ý tưởng #3) Icon trôi nổi lên xuống nhẹ, vẫn giữ góc xoay ban đầu */
				@keyframes icon-float {
					0%, 100% { transform: translateY(0) rotate(var(--icon-rotate)); }
					50% { transform: translateY(var(--float-distance)) rotate(var(--icon-rotate)); }
				}
				.animate-icon-float {
					animation-name: icon-float;
					animation-timing-function: ease-in-out;
					animation-iteration-count: infinite;
				}

				/* (Ý tưởng #5) Hạt sáng mờ dần - bay theo hướng ngẫu nhiên - mờ dần */
				@keyframes particle-drift {
					0% { transform: translate(0, 0); opacity: 0; }
					15% { opacity: 0.6; }
					85% { opacity: 0.6; }
					100% { transform: translate(var(--drift-x), var(--drift-y)); opacity: 0; }
				}
				.animate-particle-drift {
					animation-name: particle-drift;
					animation-timing-function: ease-in-out;
					animation-iteration-count: infinite;
				}

				/* Tôn trọng người dùng bật "Reduce Motion" */
				@media (prefers-reduced-motion: reduce) {
					.animate-blob-life,
					.animate-icon-float,
					.animate-particle-drift {
						animation: none !important;
					}
				}
			`}</style>
		</div>
	)
}

export default AnimatedBackground
