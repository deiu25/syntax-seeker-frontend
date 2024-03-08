import axios from "axios";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./aplication/home/pages/home/Home";
import { HomeAllPosts } from "./aplication/codeLC/components/home/home-posts/HomeAllPosts";
import { About } from "./aplication/about/pages/about/About";
import { Login } from "./aplication/auth/pages/auth/Login";
import { Signup } from "./aplication/auth/pages/auth/Singup";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  setTheme,
} from "./redux/features/auth/authSlice";
import { useEffect } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ChangePassword } from "./aplication/auth/pages/changePassword/ChangePassword";
import { Leyout } from "./aplication/auth/components/layout/Leyaout";
import { Forgot } from "./aplication/auth/pages/auth/Forgot";
import { Reset } from "./aplication/auth/pages/auth/Reset";
import { LoginWithCode } from "./aplication/auth/pages/auth/LoginWithCode";
import { Verify } from "./aplication/auth/pages/auth/Verify";
import { Profile } from "./aplication/auth/pages/profile/Profile";
import { UserList } from "./aplication/auth/pages/userList/UserList";
import { NewProject } from "./aplication/codeLC/pages/newProject/NewProject";
import { ThePost } from "./aplication/codeLC/pages/thePost/ThePost";

import NewBlogPost from "./aplication/blog/pages/create-blog-post/NewBlogPost";
import { BlogPosts } from "./aplication/blog/pages/blog-posts/BlogPosts";
import { BlogPost } from "./aplication/blog/pages/blog-post/BlogPost";

import { JavascriptCourse } from "./aplication/learn/pages/javascript-course/JavascriptCourse";
import NewCourse from "./aplication/learn/pages/create-course-post/NewCourse";
import { JavascriptCoursePost } from "./aplication/learn/pages/javascript-course-post/JavascriptCoursePost";
import { ReduxCourse } from "./aplication/learn/pages/redux-course/ReduxCourse";
import { ReactCourse } from "./aplication/learn/pages/react-course/ReactCourse";
import { NodejsCourse } from "./aplication/learn/pages/node-course/NodejsCourse";

axios.defaults.withCredentials = true;

function App() {
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.body.className = savedTheme;
    }
    dispatch(getLoginStatus()).then(() => {
      if (isLoggedIn) {
        dispatch(getUser()).then((action) => {
          if (action.type.endsWith("fulfilled") && action.payload.theme) {
            if (action.payload.theme !== savedTheme) {
              localStorage.setItem('theme', action.payload.theme);
              document.body.className = action.payload.theme;
              dispatch(setTheme(action.payload.theme));
            }
          }
        });
      }
    });
  }, [dispatch, isLoggedIn]);

  return (
    <>
      <BrowserRouter>
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/posts" element={<HomeAllPosts />} />
            <Route path="/post/:id" element={<ThePost />} />

            <Route path="/blog" element={<BlogPosts />} />
            <Route path="/blog/:id" element={<BlogPost />} />

            <Route path="/about" element={<About />} />

            <Route path="/javascriptCourse" element={<JavascriptCourse />} />
            <Route
              path="/javascriptCourse/:id"
              element={<JavascriptCoursePost />}
            />

            <Route path="/reactCourse" element={<ReactCourse />} />
            <Route path="/nodejsCourse" element={<NodejsCourse />} />
            <Route path="/redux" element={<ReduxCourse />} />

            {isLoggedIn && (
              <>
                <Route path="/NewProject" element={<NewProject />} />
                <Route path="/NewBlogPost" element={<NewBlogPost />} />
                <Route path="/NewCourse" element={<NewCourse />} />
              </>
            )}
            <Route path="/login" element={<Login />} />
            <Route path="/singup" element={<Signup />} />
            <Route path="/forgot" element={<Forgot />} />
            <Route path="/resetPassword/:resetToken" element={<Reset />} />
            <Route path="/loginWithCode/:email" element={<LoginWithCode />} />
            <Route path="/verify/:verificationToken" element={<Verify />} />

            <Route
              path="/profile"
              element={
                <Leyout>
                  <Profile />
                </Leyout>
              }
            />
            <Route
              path="/changePassword"
              element={
                <Leyout>
                  <ChangePassword />
                </Leyout>
              }
            />
            <Route
              path="/users"
              element={
                <Leyout>
                  <UserList />
                </Leyout>
              }
            />
          </Routes>
        </GoogleOAuthProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
