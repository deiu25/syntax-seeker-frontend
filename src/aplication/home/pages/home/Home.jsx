import React, { useEffect, useState } from "react";
import "./Home.css";
import { HomeSidebar } from "../../../home/components/home-sidebar/HomeSidebar";
import { HomeCurentSection } from "../../customHooks/HomeCurentSection";
import { HomeAllPosts } from "../../../codeLC/components/home/home-posts/HomeAllPosts";
import { About } from "../../../about/pages/about/About";
import { BlogPosts } from "../../../blog/pages/blog-posts/BlogPosts";
import { Courses } from "../../../learn/pages/courses/Courses";


export const Home = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [currentTab, setCurrentTab] = useState("home");

  const handleTabChange = (tab) => {
    setCurrentTab(tab);
  };

  const renderCurrentTab = () => {
    switch (currentTab) {
      case "home":
        return <HomeCurentSection />;
      case "posts":
        return <HomeAllPosts />;
      case "blog":
        return <BlogPosts />;
      case "learn":
        return <Courses />;
      case "about":
        return <About />;
      default:
        return <HomeCurentSection />;
    }
  };

  return (
    <>
      {children}
      <div className=" home-container" id="wrapper">
        <div className="row">
          <HomeSidebar
            onTabChange={handleTabChange}
            currentTab={currentTab}
            isSidebarOpen={isSidebarOpen}
            toggleSidebar={toggleSidebar}
          />
          <div className={`col-md-${isSidebarOpen ? "9" : "11"}`}>
            <div id="main-area">
              {renderCurrentTab()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
