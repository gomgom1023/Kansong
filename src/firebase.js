// Firebase SDK 가져오기
import { initializeApp } from "firebase/app";
import { getFirestore, serverTimestamp, Timestamp } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";

// Firebase 설정 정보
const firebaseConfig = {
  apiKey: "AIzaSyCcyG9InrxdqVX8mfm4EdhWJDsDkdqsaS4",
  authDomain: "kansung-8e750.firebaseapp.com",
  projectId: "kansung-8e750",
  storageBucket: "kansung-8e750",
  messagingSenderId: "478207281099",
  appId: "1:478207281099:web:3c38a3508d2f1aa9cd984e",
  measurementId: "G-37ZSVQRJ9M"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Firebase 서비스 가져오기
export const db = getFirestore(app); // Firestore 인스턴스
export const auth = getAuth(app); // Firebase 인증
export const storage = getStorage(app); // Firebase 스토리지
export const googleProvider = new GoogleAuthProvider(); // Google 로그인 공급자

// Firestore Timestamp 내보내기
export { serverTimestamp, Timestamp };
