import "./App.scss";

import React from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { Login, Main, Register, PostView } from "./routes";
import { Footer, Header, Logout, NotFound, Navigation } from "./components";

export const AuthContext = React.createContext(false);

const App = () => {
  return (
    <AuthContext.Provider value={false}>
      <BrowserRouter>
        <Header />
        <main className="main">
          <Navigation Avatar={undefined} />
          <section className="main-section">
            <div className="wrapper">
              <Routes>
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/all" element={<Main />}>
                  <Route path=":pageNum" element={<Main />} />
                </Route>
                <Route path="/post/:postNum" element={<PostView />} />
                <Route path="/feed" element={<Main />}>
                  <Route path=":pageNum" element={<Main />} />
                </Route>
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
