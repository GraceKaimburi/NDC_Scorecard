import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";
import Link from 'next/link';

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-8 mt-4">
            <div className="max-w-6xl mx-auto px-4">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-8 text-center">NDC Scorecard</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contacts Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Contacts</h3>
                        <ul className="space-y-4">
                            {/* Address */}
                            <li className="flex items-center">
                                <FaMapMarkerAlt className="text-blue-500 w-5 h-5 mr-3 flex-shrink-0" />
                                <span>Blue Violet Plaza, 5th Floor, Suite No 507, Kindaruma Road Kilimani, Nairobi, Kenya</span>
                            </li>
                            {/* Phone */}
                            <li className="flex items-center">
                                <FaPhoneAlt className="text-blue-500 w-5 h-5 mr-3 flex-shrink-0" />
                                <span>+254 705 742 836</span>
                            </li>
                            {/* Email */}
                            <li className="flex items-center">
                                <FaEnvelope className="text-blue-500 w-5 h-5 mr-3 flex-shrink-0" />
                                <span>info@agnesafrica.org</span>
                            </li>
                            {/* WhatsApp */}
                            <li className="flex items-center">
                                <FaWhatsapp className="text-blue-500 w-5 h-5 mr-3 flex-shrink-0" />
                                <span>+254 705 742 836</span>
                            </li>
                            {/* Office Hours */}
                            <li className="flex items-center">
                                <FaClock className="text-blue-500 w-5 h-5 mr-3 flex-shrink-0" />
                                <span>08:00 - 17:00</span>
                            </li>
                        </ul>
                    </div>

                    {/* Quick Links Section */}
                    <div>
                        <h3 className="text-lg font-semibold mb-4 text-blue-600">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/" className="hover:text-blue-500 transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link href="/register" className="hover:text-blue-500 transition-colors">
                                    Get Started
                                </Link>
                            </li>
                            <li>
                                <Link href="/login" className="hover:text-blue-500 transition-colors">
                                    Login
                                </Link>
                            </li>
                            {/* <li>
                                <Link href="/privacy-policy" className="hover:text-blue-500 transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms-of-service" className="hover:text-blue-500 transition-colors">
                                    Terms of Service
                                </Link>
                            </li> */}
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center mt-8 pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                        © {new Date().getFullYear()} NDC Scorecard. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;