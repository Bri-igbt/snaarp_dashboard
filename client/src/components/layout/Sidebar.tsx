import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { bottomNav, mainNav } from "../../data";
import type {SidebarProps} from "../../types/widget.ts";

const Sidebar = ({ variant = "desktop", isOpen = false, onNavigate }: SidebarProps) => {
    const isOverlay = variant === "overlay";

    return (
        <aside
            className={`${
                isOverlay
                    ? `fixed top-0 left-0 h-full z-50 flex flex-col justify-center transition-[width] duration-300 ${
                        isOpen ? "w-full" : "w-0 overflow-hidden"
                    } bg-white/50 backdrop-blur`
                    : "h-screen w-20 md:w-64 bg-white border-r border-gray-200 flex flex-col justify-between p-2 md:p-5"
            }`}
        >
            <div
                className={`${
                    isOverlay
                        ? "flex flex-col items-center justify-between h-full p-6 w-full max-w-xs mx-auto bg-white rounded-2xl shadow-lg transition-all duration-300"
                        : "flex flex-col justify-between h-full"
                }`}
            >
                {isOverlay && (
                    <div className="w-full flex justify-end">
                        <button type="button" aria-label="Close menu" onClick={onNavigate} className="p-2 rounded-lg hover:bg-gray-100 transition">
                            <X size={24} />
                        </button>
                    </div>
                )}

                <nav className={`flex flex-col gap-2 ${isOverlay ? "mt-8 items-center" : ""}`}>
                    {mainNav.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                onClick={onNavigate}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                                    ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1"}`
                                }
                            >
                                <Icon size={18} />
                                <span className="hidden md:inline">{item.name}</span> {/* Hidden on small screens */}
                            </NavLink>
                        );
                    })}
                </nav>

                <div className="mt-auto space-y-6">
                    <nav className="flex flex-col gap-2">
                        {bottomNav.map((item) => {
                            const Icon = item.icon;
                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={onNavigate}
                                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:translate-x-1 transition"
                                >
                                    <Icon size={18} />
                                    <span className="hidden md:inline">{item.name}</span> {/* Hidden on small screens */}
                                </NavLink>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                        <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                            C
                        </div>
                        <div className="hidden md:block">
                            <p className="text-sm font-medium text-gray-800">Chima Bright</p>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;