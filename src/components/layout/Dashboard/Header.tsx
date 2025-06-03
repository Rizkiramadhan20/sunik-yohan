"use client"

import React, { useState } from 'react';

import { useAuth } from '@/utils/context/AuthContext';

import { User, LogOut, Bell, Mail, Menu } from 'lucide-react';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
    onMenuClick?: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
    const { user, logout } = useAuth();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showContacts, setShowContacts] = useState(false);
    return (
        <header className="sticky top-0 z-40 w-full bg-background border-b">
            <div className="flex items-center justify-between h-16 px-4">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <Button
                        onClick={onMenuClick}
                        variant="ghost"
                        size="icon"
                        className="lg:hidden"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </Button>
                    <div>
                        <h2 className="text-lg font-semibold text-foreground line-clamp-1">
                            Hello, {user?.displayName || 'User'}!
                        </h2>
                        <p className="text-sm text-muted-foreground hidden sm:block">
                            Welcome back to your dashboard
                        </p>
                    </div>
                </div>

                {/* Right side - Profile and notifications */}
                <div className="flex items-center gap-2 lg:gap-4">
                    {/* Contacts */}
                    <DropdownMenu open={showContacts} onOpenChange={setShowContacts}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                                <Mail className="w-5 h-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                                    3
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="px-4 py-2 border-b">
                                <h3 className="font-semibold">Contact Messages</h3>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="max-h-96 overflow-y-auto">
                                <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src="/avatars/01.png" alt="User" />
                                            <AvatarFallback>JD</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="text-sm font-medium">John Doe</p>
                                            <p className="text-xs text-muted-foreground">2 hours ago</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">Interested in your property listing...</p>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Notifications */}
                    <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative hidden sm:flex">
                                <Bell className="w-5 h-5" />
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                                    2
                                </Badge>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-80">
                            <div className="px-4 py-2 border-b">
                                <h3 className="font-semibold">Notifications</h3>
                            </div>
                            <DropdownMenuSeparator />
                            <div className="max-h-96 overflow-y-auto">
                                <DropdownMenuItem className="flex flex-col items-start gap-1 p-4">
                                    <div className="flex items-center gap-2">
                                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                                            <Bell className="w-4 h-4 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">New Property Listed</p>
                                            <p className="text-xs text-muted-foreground">1 hour ago</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-muted-foreground">A new property has been listed in your area...</p>
                                </DropdownMenuItem>
                            </div>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Profile */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 lg:gap-3">
                                <Avatar>
                                    {user?.photoURL ? (
                                        <AvatarImage src={user.photoURL} alt="Profile" />
                                    ) : (
                                        <AvatarFallback>
                                            <User className="w-4 h-4" />
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="hidden sm:block text-left">
                                    <p className="text-sm font-medium text-foreground line-clamp-1 max-w-[120px] lg:max-w-[200px]">
                                        {user?.displayName || 'User'}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Super Admin</p>
                                </div>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <div className="px-4 py-2 border-b">
                                <p className="text-sm font-medium">{user?.displayName || 'User'}</p>
                                <p className="text-xs text-muted-foreground">{user?.email}</p>
                            </div>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
} 