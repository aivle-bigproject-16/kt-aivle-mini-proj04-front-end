import { Outlet } from "react-router";
import Header from "@/common/components/Header";
import Footer from "@/common/components/Footer";
import Loading from "@/common/components/Loading";
import "@/App.css";
import { useState } from "react";

function MainLayout() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function changeLoading(status, message) {
    setLoading(status);
    setMessage(message);
  }

  return (
    <div className="layout-container">
      <Loading loading={loading} message={message} />
      <Header />
      <main className="main-content">
        <Outlet context={{ changeLoading }} />
      </main>
      <Footer />
    </div>
  );
}

export default MainLayout;
