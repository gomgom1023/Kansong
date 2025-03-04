import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase"; // Firestore 연결

const useAuthStore = create(
  persist(
    (set) => ({
      isAdmin: false,
      user: null,
      setAdmin: (isAdmin) => set({ isAdmin }),
      setUser: (user) => set({ user }),

      fetchUserRole: async (user) => {
        const currentUser = user || auth.currentUser; // ✅ 현재 로그인한 유저 정보
        if (!currentUser) {
            console.warn("🚨 [fetchUserRole] 현재 로그인한 유저가 없음!");
            return;
        }
    
        try {
            const userDoc = await getDoc(doc(db, "users", currentUser.uid)); // ✅ Firestore에서 유저 정보 가져오기
            if (userDoc.exists()) {
                const userData = userDoc.data();
                console.log("🔍 [fetchUserRole] Firestore에서 가져온 유저 정보:", userData);
    
                // ✅ Firestore에서 role이 정확하게 "admin"인지 확인
                set({ isAdmin: String(userData.role).toLowerCase() === "admin" });
    
                console.log("🔥 [fetchUserRole] isAdmin 상태:", useAuthStore.getState().isAdmin);
            } else {
                console.warn(`⚠ [fetchUserRole] Firestore에 해당 유저 정보 없음: ${currentUser.uid}`);
                set({ isAdmin: false });
            }
        } catch (error) {
            console.error("❌ Firestore에서 관리자 권한 확인 실패:", error);
        }
    },

      logout: () => set({ isAdmin: false, user: null }),
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 key 이름
    }
  )
);

export default useAuthStore;
