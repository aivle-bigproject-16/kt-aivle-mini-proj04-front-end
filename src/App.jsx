import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";
import "@/App.css";
import MainLayout from "@/common/layout/MainLayout.jsx";
import MainPage from "@screen/main.screen.jsx";
import BookList from "@screen/booklist.screen.jsx";
import BookDetail from "@screen/bookdetail/BookDetailPage.jsx";
import SubmitEdit from "@screen/submit_edit.screen.jsx";
import NotFound from "@screen/NotFound.screen.jsx";
import LoginScreen from "@screen/login.screen.jsx";
import SignupScreen from "@screen/signup.screen.jsx";
import EpisodeScreen from "@screen/episode.screen.jsx";
import EpisodeWriteScreen from "@screen/episode-write.screen.jsx";
import { refreshAccessToken } from "@hooks/auth/refreshAccessToken.hook";
import ProtectedRoute from "@components/ProtectedRoute.jsx";

function App() {
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        await refreshAccessToken();
      } catch (_) {
      } finally {
        setAuthReady(true);
      }
    };
    restoreAuth();
  }, []);

  if (!authReady) return null;

  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginScreen />} />
        <Route path="/users" element={<SignupScreen />} />

        <Route element={<MainLayout />}>
          <Route index element={<MainPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="books">
              <Route index element={<BookList />} />
              <Route path=":id" element={<BookDetail />} />
              <Route path=":id/edit" element={<SubmitEdit />} />
              <Route path="submit" element={<SubmitEdit />} />
            </Route>

            <Route path="/episodes/:id" element={<EpisodeScreen />} />
          </Route>
        </Route>
        <Route path="/episodes/:id" element={<EpisodeScreen />} />
        <Route path="/episodes/:id/edit" element={<EpisodeWriteScreen />} />
        <Route path="/books/:bookId/episodes/new" element={<EpisodeWriteScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
