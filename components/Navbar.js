'use client'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { usePathname } from "next/navigation";
// import ThemeSwitch from './ThemeSwitch';
import Link from 'next/link';
import { MdMenuOpen, MdClose } from "react-icons/md";

const Navbar = () => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const handleToggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const menuRef = useRef(null);

    const handleOutsideClick = (e) => {
        if (
            isOpen &&
            menuRef.current &&
            !menuRef.current.contains((e.target))
        ) {
            setIsOpen(false);
        }
    };

    const handleScroll = () => {
        setIsOpen(false);
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
            window.addEventListener("scroll", handleScroll);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("scroll", handleScroll);
        }

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen]);

   
    return (
        <nav className='fixed w-full z-10 bg-white shadow-sm shadow-gray-400  flex justify-between items-center px-6 py-5 font-poppins h-12 '>
            <div>
                {/* <Image 
                    width={45}
                    height={45}
                    src={currentLogo}
                    alt='Logo'
                /> */}
                <h1 className='font-bold text-sm sm:text-md md:text-lg text-blue-600'>NPC</h1>
            </div>

            {/* Theme switch and large screen nav links */}
            <div className='flex gap-4 items-center'>   
                {/* Large screen navlinks */}
                <div className='hidden sm:flex gap-4'>
                    <Link href='/' className={`navlinks ${pathname === "/" ? "active" : ""}`}>Overview</Link>
                    <Link href='/skills' className={`navlinks ${pathname === "/skills" ? "active" : ""}`}>Purpose</Link>
                    <Link href='/creations' className={`navlinks ${pathname.includes("/creations") ? "active" : ""}`}>Benefits</Link>
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
                    } absolute top-12 left-0 w-full flex-col sm:hidden bg-white shadow-sm mt-0 pt-4 pb-2 items-center `}
                >
                    <div
                        ref={menuRef}
                        className="flex flex-col gap-2 w-[95%] bg-slate-50 py-2  items-center rounded-xl"
                    >
                        <Link
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            href="/"
                            className={`navlinks ${pathname === "/" ? "active" : ""}`}
                        >
                            Overview
                        </Link>
                        <Link
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            href="/skills"
                            className={`navlinks ${pathname === "/skills" ? "active" : ""}`}
                        >
                            Purpose
                        </Link>
                        <Link
                            onClick={() => {
                                setIsOpen(false);
                            }}
                            href="/creations"
                            className={`navlinks ${pathname.includes("/creations") ? "active" : ""}`}
                        >
                            Benefits
                        </Link>
                    </div>
                </div>

                <div className={`border-l border-l-gray-900 pl-4`}></div>
            </div>
        </nav>
    );
}

export default Navbar;