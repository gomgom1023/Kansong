import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/", // 상대 경로 사용
  plugins: [react()],
  optimizeDeps: {
    include: [
      "gsap",
      "gsap/ScrollTrigger",
      "gsap/Flip",
      "gsap/ScrollToPlugin",
      "locomotive-scroll"
    ], // GSAP 전체 포함
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store", // 캐시 문제 방지
    },
  },
  define: {
    "process.env": {},
  },
  build: {
    outDir: "dist", // 빌드 폴더 경로
    assetsDir: "assets", // 정적 파일 저장 경로
    sourcemap: true,
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react")) return "react-vendor"; //React 번들 분리
            if (id.includes("firebase")) return "firebase-vendor"; // Firebase 번들 분리
            if (id.includes("gsap")) return "gsap-vendor"; // GSAP 번들 분리
            return "vendor"; // 나머지 라이브러리는 기본 vendor로 묶기
          }
        },
      },
    },
  },
  publicDir: "public", // public 폴더 유지
});
