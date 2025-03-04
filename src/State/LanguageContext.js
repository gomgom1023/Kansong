import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useLanguageStore = create(
  persist(
    (set) => ({
      language: "kor",
      toggleLanguage: (lang) => set({ language: lang }),
    }),
    {
      name: "language-storage", // 로컬 스토리지 키
      getStorage: () => localStorage, // 로컬 스토리지 사용
    }
  )
);