import { Link } from "react-router-dom";

export default function MobileSubNav() {
    return (
        <div className="sticky top-16 z-40 flex justify-around items-center py-3 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100 transition-all">
            <Link to="/" className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Inicio</span>
            </Link>

            <Link to="/services" className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <line x1="22" x2="11" y1="2" y2="13" />
                        <polygon points="22 2 15 22 11 13 2 9 22 2" />
                    </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Envia</span>
            </Link>

            <Link to="/tracking" className="flex flex-col items-center gap-1 group">
                <div className="p-2 rounded-full bg-orange-50 text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect width="20" height="16" x="2" y="4" rx="2" />
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                </div>
                <span className="text-xs font-medium text-gray-600 group-hover:text-primary">Rastreo</span>
            </Link>
        </div>
    );
}
