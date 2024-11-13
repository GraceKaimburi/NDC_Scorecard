'use client'
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { MdMenuOpen, MdClose } from "react-icons/md";

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeSection, setActiveSection] = useState('overview');
    const menuRef = useRef(null);

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

    const handleScroll = () => {
        setIsOpen(false);
        
        // Update active section based on scroll position
        const sections = ['overview', 'purpose', 'benefits'];
        const current = sections.find(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                return rect.top >= 0 && rect.top <= 300; // Adjusted threshold
            }
            return false;
        });
        
        if (current) {
            setActiveSection(current);
        }
    };

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            const offset = 80; // Adjust this value based on your navbar height
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            setActiveSection(sectionId);
            setIsOpen(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            document.addEventListener("mousedown", handleOutsideClick);
        } else {
            document.removeEventListener("mousedown", handleOutsideClick);
        }

        // Add scroll event listener
        window.addEventListener("scroll", handleScroll);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            window.removeEventListener("scroll", handleScroll);
        };
    }, [isOpen]);

    return (
        <nav className='fixed w-full z-10 bg-white shadow-sm shadow-gray-400 flex justify-between items-center px-6 py-5 font-poppins h-12'>
            <div>
                <h1 className='font-bold text-sm sm:text-md md:text-lg text-blue-600'>NDC</h1>
            </div>

            <div className='flex gap-4 items-center'>   
                {/* Large screen navlinks */}
                <div className='hidden sm:flex gap-4'>
                    <button 
                        onClick={() => scrollToSection('overview')}
                        className={`navlinks ${activeSection === 'overview' ? "text-blue-600" : ""}`}
                    >
                        Overview
                    </button>
                    <button 
                        onClick={() => scrollToSection('purpose')}
                        className={`navlinks ${activeSection === 'purpose' ? "text-blue-600" : ""}`}
                    >
                        Purpose
                    </button>
                    <button 
                        onClick={() => scrollToSection('benefits')}
                        className={`navlinks ${activeSection === 'benefits' ? "text-blue-600" : ""}`}
                    >
                        Benefits
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
                            onClick={() => scrollToSection('overview')}
                            className={`navlinks ${activeSection === 'overview' ? "text-blue-600" : ""}`}
                        >
                            Overview
                        </button>
                        <button
                            onClick={() => scrollToSection('purpose')}
                            className={`navlinks ${activeSection === 'purpose' ? "text-blue-600" : ""}`}
                        >
                            Purpose
                        </button>
                        <button
                            onClick={() => scrollToSection('benefits')}
                            className={`navlinks ${activeSection === 'benefits' ? "text-blue-600" : ""}`}
                        >
                            Benefits
                        </button>
                    </div>
                </div>

                <div className={`border-l border-l-gray-900 pl-4`}></div>
            </div>
        </nav>
    );
}

export default Navbar;