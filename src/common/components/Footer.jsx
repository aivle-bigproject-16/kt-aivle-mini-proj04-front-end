import style from "@/common/components/Footer.module.css";
import ServiceLogo from "@/common/components/ServiceLogo";

function CompanyInfo() {
  return (
    <div className={style["company-info"]}>
      <div
        style={{
          display: "flex",
          gap: "24px",
        }}>
        <span>이용약관</span>
        <span>개인정보처리방침</span>
        <span>고객센터</span>
      </div>
      <span>문의 전화: 010-0000-0000</span>
      <span>{"ⓒ 2026. PIC:STORY Co., Ltd. All rights reserved."}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer>
      <ServiceLogo className="footer-text-logo" />
      <CompanyInfo />
    </footer>
  );
}

export default Footer;
