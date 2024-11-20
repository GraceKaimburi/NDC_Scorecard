"use client";

import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { MdMenuOpen, MdClose } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthContext';
import LogoutButton from './LogoutButton';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeLink, setActiveLink] = useState('home');
    const menuRef = useRef(null);

    const router = useRouter();
    const { user, isAuthenticated } = useAuth();

    const handleToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const handleOutsideClick = (e) => {
        if (
            isOpen &&
            menuRef.current &&
            !menuRef.current.contains((e.target))
        ) {
            setIsOpen(false);
        }
    };

    const scrollToOverview = () => {
        const overviewElement = document.getElementById('overview');
        if (overviewElement) {
            overviewElement.scrollIntoView({ behavior: 'smooth' });
            setActiveLink('overview');
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

    return (
        <nav className='fixed w-full z-10 bg-white shadow-sm shadow-gray-400 flex justify-between items-center px-6 py-5 font-poppins h-12'>
            <div>
                <h1 className='font-bold text-sm sm:text-md md:text-lg text-blue-600'>
                    NDC CAPACITY SCORECARD
                </h1>
            </div>

            <div className='flex gap-4 items-center'>   
                {/* Large screen navlinks */}
                <div className='hidden sm:flex gap-4'>
                    <button 
                        onClick={() => router.push('/')}
                        className={`navlinks ${activeLink === 'home' ? "text-blue-600" : ""}`}
                    >
                        Home
                    </button>
                    <button 
                        onClick={scrollToOverview}
                        className={`navlinks ${activeLink === 'overview' ? "text-blue-600" : ""}`}
                    >
                        Overview
                    </button>
                </div>

                {/* Mobile menu toggle icon */}
                <div className="sm:hidden ml-2 mr-2">
                    {isOpen ? (
                        <MdClose
                            className="text-3xl"
                            onClick={handleToggleMenu}
                        />
                    ) : (
                        <MdMenuOpen
                            className="text-3xl"
                            onClick={handleToggleMenu}
                        />
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
                            onClick={() => router.push('/')}
                            className={`navlinks ${activeLink === 'home' ? "text-blue-600" : ""}`}
                        >
                            Home
                        </button>
                        <button
                            onClick={scrollToOverview}
                            className={`navlinks ${activeLink === 'overview' ? "text-blue-600" : ""}`}
                        >
                            Overview
                        </button>
                    </div>
                </div>

                <div className={`border-l border-l-gray-900 pl-4`}></div>
                {isAuthenticated ? (
                    <div className="flex gap-4 items-center">
                        <span className="text-sm">Welcome, {user.first_name}!</span>
                        <LogoutButton />
                    </div>
                ) : (
                    <button 
                        className='bg-blue-600 text-white px-4 py-2 rounded-md text-sm text-nowrap'
                        onClick={() => router.push('/register')}
                    >
                        Sign Up/Login
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;