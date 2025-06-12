"use client";

import { useAuth } from "@/utils/context/AuthContext";
import { Role } from "@/types/Auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProfileSidebar from "@/components/layout/Profile/ProfileSidebar";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Handle authentication and role check
    useEffect(() => {
        if (!user) {
            router.push("/signin");
        } else if (!hasRole(Role.USER)) {
            router.push("/");
        }
    }, [user, router, hasRole]);

    // Handle responsive layout
    useEffect(() => {
        const handleResize = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);
            if (!mobile) {
                setIsSidebarOpen(false);
            }
        };

        // Initial check
        handleResize();

        // Add event listener
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Early return if not authenticated
    if (!user || !hasRole(Role.USER)) return null;

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile Sidebar */}
            {isMobile && (
                <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                    <SheetContent side="left" className="p-0 w-80">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <ProfileSidebar onLinkClick={() => setIsSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
            )}

            {/* Desktop Sidebar */}
            {!isMobile && (
                <aside className="fixed top-0 left-0 z-30 h-screen bg-background border-r">
                    <ProfileSidebar />
                </aside>
            )}

            {/* Main content */}
            <div className="flex-1 flex flex-col min-h-screen lg:ml-64">
                {/* Mobile Header */}
                {isMobile && (
                    <div className="flex items-center justify-between p-4 border-b">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsSidebarOpen(true)}
                            className="lg:hidden"
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                    </div>
                )}
                {/* Page content */}
                <main className="flex-1 px-4 py-4 overflow-x-hidden">
                    {children}
                </main>
            </div>
        </div>
    );
} 