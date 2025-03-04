import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signOut, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "./firebase";
import useAuthStore from "./Pages/Board/store/useAuthStore";
import "./admin.css";

const AdminLogin = () => {
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const { setAdmin, setUser, fetchUserRole } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [emailActive, setEmailActive] = useState(false);
  const [passwordActive, setPasswordActive] = useState(false);

  useEffect(() => {
    fetchUserRole();
  }, []);

  const handleEmailChange = (e) => {
    setLoginInput({ ...loginInput, email: e.target.value });
    setEmailActive(e.target.value.trim() !== "");
  };

  const handlePasswordChange = (e) => {
    setLoginInput({ ...loginInput, password: e.target.value });
    setPasswordActive(e.target.value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = loginInput;

    try {
        await setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        console.log("로그인 성공, UID:", user.uid);

        await fetchUserRole(user);
        console.log("fetchUserRole 실행 후 isAdmin 상태:", useAuthStore.getState().isAdmin);

        if (!useAuthStore.getState().isAdmin) {
            console.warn("관리자 계정이 아님! 로그아웃 처리");
            await signOut(auth);
            setUser(null);
            setError("관리자 계정이 아닙니다.");
            return;
        }

        setUser(user);
        alert("관리자 로그인 성공!");
        navigate('/TotalBoard');
    } catch (error) {
        console.error("로그인 실패", error);
        setError("로그인 실패! 이메일과 비밀번호를 확인하세요.");
    }
};

  return (
    <div className="admin">
      <div className="admin_con">
        <h2 className="font-eulyoo">관리자 로그인</h2>
        <form onSubmit={handleSubmit}>
          <div className="form1">
            <label className={emailActive ? 'active_email' : ''}>이메일</label>
            <input type="email" className={emailActive ? 'active' : ''} value={loginInput.email}
              placeholder="admin@example.com" onChange={handleEmailChange} required />
          </div>
          <div className="form2">
            <label className={passwordActive ? 'active_password' : ''}>비밀번호</label>
            <div className="password-input-wrapper">
              <input className={passwordActive ? 'active' : ''} type={showPassword ? "text" : "password"}
                value={loginInput.password} onChange={handlePasswordChange} placeholder="123456" required />
              <i className={showPassword ? 'xi-eye-o' : 'xi-eye-off-o'} onClick={() => setShowPassword(!showPassword)} />
            </div>
          </div>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <button className="submit" type="submit">로그인</button>
          <button className="home" onClick={() => navigate('/')}>홈으로</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
