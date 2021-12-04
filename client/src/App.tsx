import "./App.scss";

import { useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import {
  Login,
  Main,
  Register,
  PostView,
  Logout,
  Profile,
  NewPost,
  Followed,
  Bookmarked,
  EditPost,
  Liked,
} from "./routes";
import {
  Footer,
  Header,
  NotFound,
  Navigation,
  Popup,
  Settings,
} from "./components";
import { useDispatch } from "react-redux";

import { getUserDataAsync } from "./redux/userauth/userauthSlice";
import { useAppSelector } from "./redux/hooks";

const App = () => {
  const dispatch = useDispatch();
  const user = useAppSelector((state) => state.userauth.user);

  useEffect(() => {
    dispatch(getUserDataAsync());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Header />
      <main className="main">
        <Navigation />
        <section className="main-section">
          <div className="wrapper">
            <Routes>
              <Route path="/all" element={<Main />}>
                <Route path=":pageNum" element={<Main />} />
              </Route>
              <Route path="/post/view/:postNum" element={<PostView />} />
              <Route path="/profile/:profileSlug/*" element={<Profile />}>
                <Route path=":tabName" element={<Profile />} />
              </Route>
              {user ? (
                <>
                  <Route path="/logout" element={<Logout />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/post/edit/:postNum" element={<EditPost />} />
                  <Route path="/post/new" element={<NewPost />} />
                  <Route path="/following" element={<Followed />}>
                    <Route path=":pageNum" element={<Followed />} />
                  </Route>
                  <Route path="/bookmarked" element={<Bookmarked />}>
                    <Route path=":pageNum" element={<Bookmarked />} />
                  </Route>
                  <Route path="/liked" element={<Liked />}>
                    <Route path=":pageNum" element={<Liked />} />
                  </Route>
                </>
              ) : (
                <>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                </>
              )}
              <Route path="/" element={<Navigate to="/all" />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </section>
      </main>
      <Footer />
      <Popup />
    </BrowserRouter>
  );
};

export default App;
