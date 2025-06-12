"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { Role } from "@/types/Auth";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import ProfileSidebar from "@/components/layout/Profile/ProfileSidebar";

import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { Menu } from "lucide-react";

export default function ProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, hasRole } = useAuth();
    const router = useRouter();
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            router.push("/signin");
        } else if (!hasRole(Role.USER)) {
            router.push("/");
        }
    }, [user, router, hasRole]);

    if (!user || !hasRole(Role.USER)) return null;

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Mobile Sidebar Trigger */}
            <div className="lg:hidden fixed top-4 left-4 z-50">
                <Sheet open={isMobileSidebarOpen} onOpenChange={setIsMobileSidebarOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="bg-white rounded-md shadow-md">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0 bg-white border-r rounded-r-[var(--radius)]">
                        <SheetHeader className="sr-only">
                            <SheetTitle>Navigation Menu</SheetTitle>
                        </SheetHeader>
                        <ProfileSidebar onLinkClick={() => setIsMobileSidebarOpen(false)} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 flex-shrink-0">
                <ProfileSidebar />
            </div>

            <main className="flex-1 p-6 lg:ml-0 md:ml-20">
                {children}
            </main>
        </div>
    );
} 