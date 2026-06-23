import { Navigate, Outlet, useOutletContext } from "react-router-dom";
import { getAccessToken } from "@utils/authStore";

function ProtectedRoute() {
  const token = getAccessToken();
  const outletContext = useOutletContext();

  if (!token) {
    alert("로그인 이후 접속해주세요.");
    return <Navigate to="/login" replace />;
  }

  return <Outlet context={outletContext} />;
}

export default ProtectedRoute;