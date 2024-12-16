"use client";

import React from "react";
import { useState, useEffect, useRef } from "react";
import { MdMenuOpen, MdClose } from "react-icons/md";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "../../store/AuthContext";
import LogoutButton from "../reusables/LogoutButton";
import MaxWidth from "../max-width";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const menuRef = useRef(null);

  const router = useRouter();
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleOutsideClick = (e) => {
    if (isOpen && menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  const scrollToOverview = () => {
    const overviewElement = document.getElementById("overview");
    if (overviewElement) {
      overviewElement.scrollIntoView({ behavior: "smooth" });
      setActiveLink("overview");
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  // Determine whether to show dashboard or logout button
  const RightSideButton = () => {
    if (!isAuthenticated) {
      return (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-nowrap"
          onClick={() => router.push("/register")}
        >
          Sign Up/Login
        </button>
      );
    }

    if (pathname === "/") {
      return (
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-nowrap"
          onClick={() => router.push("/dashboard")}
        >
          Go to Dashboard
        </button>
      );
    }

    return <LogoutButton />;
  };

  return (
    <nav className="fixed w-full z-[999999] bg-white shadow-sm shadow-gray-400 px-6 py-5 font-poppins h-12 flex items-center">
      <MaxWidth className=" flex justify-between items-center w-full">
        <div>
        <Link 
        href="/" 
        className="block"
      >
        <h1 className="font-bold text-xs sm:text-sm md:text-md text-blue-600">
          NDC Capacity Scorecard
        </h1>
      </Link>
        </div>

        <div className="flex gap-4 items-center">
          {/* Large screen navlinks */}
          <div className="hidden sm:flex gap-4">
            <button
              onClick={() => router.push("/")}
              className={`navlinks ${
                activeLink === "home" ? "text-blue-600" : ""
              }`}
            >
              Home
            </button>
            {/* <button 
                        onClick={scrollToOverview}
                        className={`navlinks ${activeLink === 'overview' ? "text-blue-600" : ""}`}
                    >
                        Overview
                    </button> */}
          </div>

          {/* Mobile menu toggle icon */}
          <div className="sm:hidden ml-2 mr-2">
            {isOpen ? (
              <MdClose className="text-3xl" onClick={handleToggleMenu} />
            ) : (
              <MdMenuOpen className="text-3xl" onClick={handleToggleMenu} />
            )}
          </div>

          {/* Navlinks mobile */}
          <div
            className={`${
              isOpen ? "flex" : "hidden"
            } absolute top-12 left-0 w-full flex-col sm:hidden bg-white shadow-sm mt-0 pt-4 pb-2 items-center`}
          >
            <div
              ref={menuRef}
              className="flex flex-col gap-2 w-[95%] bg-slate-50 py-2 items-center rounded-xl"
            >
              <button
                onClick={() => router.push("/")}
                className={`navlinks ${
                  activeLink === "home" ? "text-blue-600" : ""
                }`}
              >
                Home
              </button>
              {/* <button
                            onClick={scrollToOverview}
                            className={`navlinks ${activeLink === 'overview' ? "text-blue-600" : ""}`}
                        >
                        Overview
                        </button> */}
            </div>
          </div>

          <div className={`border-l border-l-gray-900 pl-4`}></div>
          {isAuthenticated && (
            <span className="text-sm mr-4">Welcome, {user.first_name}!</span>
          )}
          <RightSideButton />
        </div>
      </MaxWidth>
    </nav>
  );
};

export default Navbar;
