import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { hookLogin } from "@hooks/auth/login.hook";
import "@screen/login.screen.css";

function LoginScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ loginId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await hookLogin(form);
      navigate("/");
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "INVALID_CREDENTIALS") {
        setError("아이디 또는 비밀번호를 확인해주세요.");
      } else {
        setError("로그인 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">로그인</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-field">
            <label htmlFor="loginId">아이디</label>
            <input
              id="loginId"
              name="loginId"
              type="text"
              value={form.loginId}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>

          <div className="login-field">
            <label htmlFor="password">비밀번호</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <p className="login-footer">
          계정이 없으신가요?{" "}
          <Link to="/users">회원가입</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginScreen;
