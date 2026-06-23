import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { hookSignup } from "@hooks/auth/signup.hook";
import "@screen/signup.screen.css";

function SignupScreen() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    loginId: "",
    password: "",
    name: "",
    gubun: 1,
    email: "",
    phone: "",
    address: "",
  });
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
      await hookSignup(form);
      navigate("/login");
    } catch (err) {
      const code = err.response?.data?.code;
      if (code === "DUPLICATE_LOGIN_ID") {
        setError("이미 사용 중인 아이디입니다.");
      } else {
        setError("회원가입 중 오류가 발생했습니다.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <h1 className="signup-title">회원가입</h1>

        <form className="signup-form" onSubmit={handleSubmit}>
          <div className="signup-field">
            <label htmlFor="name">이름</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div className="signup-field">
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

          <div className="signup-field">
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

          <div className="signup-field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="이메일을 입력하세요"
              required
            />
          </div>

          <div className="signup-field">
            <label htmlFor="phone">전화번호 <span className="optional">(선택)</span></label>
            <input
              id="phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
            />
          </div>

          <div className="signup-field">
            <label htmlFor="address">주소 <span className="optional">(선택)</span></label>
            <input
              id="address"
              name="address"
              type="text"
              value={form.address}
              onChange={handleChange}
              placeholder="주소를 입력하세요"
            />
          </div>

          {error && <p className="signup-error">{error}</p>}

          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <p className="signup-footer">
          이미 계정이 있으신가요?{" "}
          <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupScreen;
