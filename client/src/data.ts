import { BarChart3, Activity, Building2, CreditCard, HardDrive, HelpCircle, LayoutDashboard, Monitor, PanelLeft, Settings, User } from "lucide-react";
import type { NavItem, Widget } from "./types/widget";

export const initialWidgets: Widget[] = [
    { id: "cloud", title: "Cloud Network" },
    { id: "file", title: "File Sharing" },
    { id: "active", title: "Active Users" },
    { id: "device", title: "Device Management" },
    { id: "productivity", title: "Productivity Report" },
];

export const mainNav: NavItem[] = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Organization & Reg.", icon: Building2, path: "/organization" },
    { name: "Reporting", icon: BarChart3, path: "/reporting" },
    { name: "Billing", icon: CreditCard, path: "/billing" },
    { name: "Account", icon: User, path: "/account" },
    { name: "Storage", icon: HardDrive, path: "/storage" },
    { name: "Settings", icon: Settings, path: "/settings" },
    { name: "Device Management", icon: Monitor, path: "/devices" },
    { name: "Productivity Report", icon: Activity, path: "/productivity" },
];

export const bottomNav: NavItem[] = [
    { name: "User Panel", icon: PanelLeft, path: "/users" },
    { name: "Support", icon: HelpCircle, path: "/support" },
];

