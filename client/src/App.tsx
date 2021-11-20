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
  Followed as Following,
  Bookmarked,
} from "./routes";
import { Footer, Header, NotFound, Navigation } from "./components";

interface IUser {
  id: number;
  slug: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export const AuthContext = React.createContext<{
  user?: IUser;
  setUser: React.Dispatch<
    React.SetStateAction<{
      user?: IUser;
    }>
  >;
}>({ user: undefined, setUser: () => {} });

const App = () => {
  const [user, setUser] = useState<{
    user?: IUser;
  }>({ user: undefined });

  useEffect(() => {
    // TODO Warning: Cannot update a component (`App`) while rendering a different component (`Logout`). To locate the bad setState() call inside `Logout`
    const token = localStorage.getItem("auth-token");
    if (!token) return;
    fetch("/api/v1/blog/user_profile", {
      method: "GET",
      headers: {
        Authorization: `Token ${token}`,
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          localStorage.removeItem("auth-token");
          console.log(response.text());

          throw new Error("Something went wrong");
        }
      })
      .then(
        (result: {
          id: number;
          slug: string;
          avatar?: string;
          user: { username: string; first_name: string; last_name: string };
        }) => {
          setUser({
            user: {
              id: result.id,
              slug: result.slug,
              avatar: result.avatar,
              firstName: result.user.first_name,
              lastName: result.user.last_name,
              username: result.user.username,
            },
          });
        }
      )
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <AuthContext.Provider value={{ ...user, setUser }}>
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
                {user.user ? (
                  <>
                    <Route path="/logout" element={<Logout />} />
                    <Route path="/post/new" element={<NewPost />} />
                    <Route path="/following" element={<Following />}>
                      <Route path=":pageNum" />
                    </Route>
                    <Route path="/bookmarked" element={<Bookmarked />}>
                      <Route path=":pageNum" />
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
