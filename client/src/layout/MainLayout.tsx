import { Outlet } from "react-router-dom";
import { Bell } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";

const MainLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar
                variant="desktop"
            />

            <div className="flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-20 bg-white shadow px-6 py-3 md:py-4 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Search..."
                        aria-label="Search"
                        className="w-full max-w-xl px-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="ml-4 flex items-center justify-center p-2 border border-slate-300 rounded-full hover:bg-gray-100 transition"
                    >
                        <Bell size={20} />
                    </button>
                </header>

                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet/>
                </main>

                <footer className="bg-white border-t border-gray-200 px-4 sm:px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <p className="text-center sm:text-left">
                            © {new Date().getFullYear()} Snaarp. All rights reserved.
                        </p>

                        <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-center">
                            <span className="hover:text-gray-700 cursor-pointer transition">
                                Privacy Policy
                            </span>
                            <span className="hover:text-gray-700 cursor-pointer transition">
                                Terms of Service
                            </span>
                            <span className="hover:text-gray-700 cursor-pointer transition">
                                Support
                            </span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default MainLayout;