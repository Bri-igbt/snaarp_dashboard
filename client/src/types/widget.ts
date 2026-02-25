import type { ReactNode, ElementType } from "react";

export type WidgetId =
    | "cloud"
    | "file"
    | "active"
    | "device"
    | "productivity";

export interface Widget {
    id: WidgetId;
    title: string;
}

export interface Props {
    id: string;
    children: ReactNode;
}

export interface NavItem {
    name: string;
    icon: ElementType;
    path: string;
}

export type SidebarProps = {
    variant?: "desktop" | "overlay";
    isOpen?: boolean;
    onNavigate?: () => void;
};

export type WidgetCardProps = {
    title: string;
    children?: ReactNode;
};