"use client";

import { Bell, Search } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Badge } from "@/components/ui/badge";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Input } from "@/components/ui/input";

export default function ProfileHeader() {
    // Mock notifications - replace with real data later
    const notifications = [
        {
            id: 1,
            title: "Pesanan baru",
            message: "Pesanan #12345 telah diterima",
            time: "5 menit yang lalu",
            read: false,
        },
        {
            id: 2,
            title: "Pembayaran berhasil",
            message: "Pembayaran untuk pesanan #12344 telah dikonfirmasi",
            time: "1 jam yang lalu",
            read: true,
        },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className="h-16 border-b flex items-center justify-between px-4 lg:px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex items-center gap-2 flex-1 max-w-md ml-12 lg:ml-0">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Cari Product Kami..."
                        className="pl-9 bg-background/50 h-9 text-sm"
                    />
                </div>
            </div>
            <div className="flex items-center gap-2 lg:gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative h-9 w-9">
                            <Bell className="h-4 w-4" />
                            {unreadCount > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]"
                                >
                                    {unreadCount}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] lg:w-80">
                        <div className="flex items-center justify-between px-4 py-2 border-b">
                            <h2 className="font-semibold">Notifications</h2>
                            <Button variant="ghost" size="sm" className="h-8">
                                Mark all as read
                            </Button>
                        </div>
                        <ScrollArea className="h-[300px]">
                            {notifications.length > 0 ? (
                                <div className="p-2">
                                    {notifications.map((notification) => (
                                        <DropdownMenuItem
                                            key={notification.id}
                                            className="flex flex-col items-start gap-1 p-3 cursor-pointer"
                                        >
                                            <div className="flex items-center justify-between w-full">
                                                <span className="font-medium">{notification.title}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {notification.time}
                                                </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {notification.message}
                                            </p>
                                            {!notification.read && (
                                                <div className="w-2 h-2 rounded-full bg-primary mt-1" />
                                            )}
                                        </DropdownMenuItem>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-muted-foreground">
                                    No notifications
                                </div>
                            )}
                        </ScrollArea>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
} 