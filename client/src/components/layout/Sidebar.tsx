import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { bottomNav, mainNav } from "../../data";
import type { SidebarProps } from "../../types/widget.ts";

const Sidebar = ({
                     variant = "desktop",
                     isOpen = false,
                     onNavigate,
                 }: SidebarProps) => {
    const isOverlay = variant === "overlay";

    return (
        <>
            {/* Backdrop (Mobile Only) */}
            {isOverlay && isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                    onClick={onNavigate}
                />
            )}

            <aside
                className={`
                ${
                    isOverlay
                        ? `fixed top-0 left-0 z-50 h-full w-64 bg-white shadow-xl
                           transform transition-transform duration-300
                           ${isOpen ? "translate-x-0" : "-translate-x-full"}`
                        : `h-screen bg-white border-r border-gray-200
                           w-14 sm:w-16 lg:w-64
                           flex flex-col justify-between
                           p-2 sm:p-3 lg:p-5`
                }
            `}
            >
                <div className="flex flex-col justify-between h-full">
                    {/* Close Button (Mobile Only) */}
                    {isOverlay && (
                        <div className="flex justify-end p-4">
                            <button
                                type="button"
                                aria-label="Close menu"
                                onClick={onNavigate}
                                className="p-2 rounded-lg hover:bg-gray-100 transition"
                            >
                                <X size={22} />
                            </button>
                        </div>
                    )}

                    {/* Main Navigation */}
                    <nav
                        className={`flex flex-col gap-2 ${
                            isOverlay ? "px-4 mt-4" : ""
                        }`}
                    >
                        {mainNav.map((item) => {
                            const Icon = item.icon;

                            return (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all
                                        ${
                                            isActive
                                                ? "bg-blue-50 text-blue-600"
                                                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                        }`
                                    }
                                >
                                    <Icon size={18} />
                                    <span className="hidden lg:inline">
                                        {item.name}
                                    </span>
                                </NavLink>
                            );
                        })}
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-auto space-y-6">
                        {/* Bottom Navigation */}
                        <nav className="flex flex-col gap-2">
                            {bottomNav.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <NavLink
                                        key={item.name}
                                        to={item.path}
                                        onClick={onNavigate}
                                        className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition"
                                    >
                                        <Icon size={18} />
                                        <span className="hidden lg:inline">
                                            {item.name}
                                        </span>
                                    </NavLink>
                                );
                            })}
                        </nav>

                        {/* Profile Section - Hidden on Small Screens */}
                        <div className="hidden lg:flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition">
                            <div className="h-9 w-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                                C
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-800">
                                    Chima Bright
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;