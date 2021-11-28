import "./App.scss";

import React, { useEffect, useState } from "react";
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
  DeletePost,
} from "./routes";
import { Footer, Header, NotFound, Navigation } from "./components";
import { promiseCopyPaste } from "./utils";

import IUser from "./interfaces/User";

export const AuthContext = React.createContext<{
  user?: IUser;
  setUser: React.Dispatch<
    React.SetStateAction<{
      user?: IUser;
    }>
  >;
}>({ user: undefined, setUser: () => {} });

const App = () => {
  const [userState, setUserState] = useState<{
    user?: IUser;
  }>({ user: undefined });

  useEffect(() => {
    // TODO Warning: Cannot update a component (`App`) while rendering a different component (`Logout`). To locate the bad setState() call inside `Logout`
    const token = localStorage.getItem("auth-token");
    if (!token) return;
    promiseCopyPaste(
      fetch("/api/v1/blog/user_profile", {
        method: "GET",
        headers: {
          Authorization: `Token ${token}`,
        },
      }),
      (result: {
        id: number;
        slug: string;
        avatar?: string;
        username: string;
        first_name: string;
        last_name: string;
      }) => {
        setUserState({
          user: {
            id: result.id,
            slug: result.slug,
            avatar: result.avatar,
            firstName: result.first_name,
            lastName: result.last_name,
            username: result.username,
          },
        });
      }
    );
  }, []);

  return (
    <AuthContext.Provider value={{ ...userState, setUser: setUserState }}>
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
                <Route path="/post/:postNum" element={<PostView />} />
                <Route path="/profile/:profileSlug/*" element={<Profile />}>
                  <Route path=":tabName" element={<Profile />} />
                </Route>
                {userState.user ? (
                  <>
                    <Route path="/logout" element={<Logout />} />

                    <Route path="/post/:postNum/edit" element={<EditPost />} />
                    <Route
                      path="/post/:postNum/delete"
                      element={<DeletePost />}
                    />
                    <Route path="/post/new" element={<NewPost />} />
                    <Route path="/following" element={<Followed />}>
                      <Route path=":pageNum" element={<Followed />} />
                    </Route>
                    <Route path="/bookmarked" element={<Bookmarked />}>
                      <Route path=":pageNum" element={<Bookmarked />} />
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
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
