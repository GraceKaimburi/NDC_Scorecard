import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaClock } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-white text-gray-800 py-8 mt-4">
            <div className="max-w-3xl mx-auto">
                {/* Title */}
                <h2 className="text-2xl font-bold mb-6 text-center">NDC Scorecard</h2>

                {/* Contact Info */}
                <ul className="space-y-4">
                    {/* Address */}
                    <li className="flex items-center">
                        <FaMapMarkerAlt className="text-blue-500 w-5 h-5 mr-3" />
                        <span>Blue Violet Plaza, 5th Floor, Suite No 507, Kindaruma Road Kilimani, Nairobi, Kenya</span>
                    </li>
                    {/* Phone */}
                    <li className="flex items-center">
                        <FaPhoneAlt className="text-blue-500 w-5 h-5 mr-3" />
                        <span>+254 705 742 836</span>
                    </li>
                    {/* Email */}
                    <li className="flex items-center">
                        <FaEnvelope className="text-blue-500 w-5 h-5 mr-3" />
                        <span>info@agnesafrica.org</span>
                    </li>
                    {/* WhatsApp */}
                    <li className="flex items-center">
                        <FaWhatsapp className="text-blue-500 w-5 h-5 mr-3" />
                        <span>+254 705 742 836</span>
                    </li>
                    {/* Office Hours */}
                    <li className="flex items-center">
                        <FaClock className="text-blue-500 w-5 h-5 mr-3" />
                        <span>08:00 - 17:00</span>
                    </li>
                </ul>
            </div>
        </footer>
    );
};

export default Footer;
