"use client"
import { MainHeader } from "@/components/headers/MainHeader";
import { ToastProvider } from "@/components/toasts/ToastProvider";
import QueryProvider from "@/lib/Providers/QueryClientProvider";
import ReduxProvider from "@/lib/Providers/ReduxProvider";
import { useEffect, useState } from "react";
import { MobileSideBar } from "@/components/sidebars/MobileSidebar";

export const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {

    const [isOpen, setIsOpen] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);
    return (
        <QueryProvider>
            <ReduxProvider>
                <ToastProvider />
                <MainHeader setIsOpen={() => setIsOpen(!isOpen)} />
                <div className="lg:flex">
                    <MobileSideBar isOpen={isOpen} setIsOpen={() => setIsOpen(!isOpen)} />
                    <div className="min-w-0 flex-1">
                        {isMounted && children}
                    </div>
                </div>
            </ReduxProvider>
        </QueryProvider>

    )
}