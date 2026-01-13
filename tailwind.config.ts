import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
	],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        base: "#F8F9FC",
        surface: "#FFFFFF",
        primary: "#1A1A1A",
        // 状态色
        status: {
          collect: "#6C757D",      // 收集 - 灰
          pending: "#28A745",      // 待评估 - 绿
          verifying: "#FFC107",    // 验证中 - 黄
          verified: "#17A2B8",     // 已验证 - 蓝
          suspended: "#DC3545",    // 搁置 - 红
          archived: "#343A40",     // 归档 - 黑
        },
        // 技术可行性
        feasibility: {
          high: "#28A745",
          medium: "#17A2B8",
          low: "#DC3545",
        },
        // 交互反馈
        interactive: {
          hover: "#F1F3F5",
          active: "#E9ECEF",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#1A1A1A",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "modal-in": {
          "0%": { transform: "scale(0.9) translateY(-10px)", opacity: "0" },
          "100%": { transform: "scale(1) translateY(0)", opacity: "1" },
        },
        "status-badge": {
          "0%": { transform: "scaleY(0)" },
          "100%": { transform: "scaleY(1)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "modal-in": "modal-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1.0)",
        "status-badge": "status-badge 0.15s ease-out",
      },
      fontFamily: {
        sans: ['Inter UI', 'system-ui', 'sans-serif'],
        display: ['SF Pro Display', 'San Francisco', 'Roboto', 'sans-serif'],
        mono: ['SF Mono', 'Consolas', 'monospace'],
      },
      fontSize: {
        'h1': ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'h2': ['20px', { lineHeight: '1.2', fontWeight: '700' }],
        'h3': ['16px', { lineHeight: '1.2', fontWeight: '700' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'code': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config

