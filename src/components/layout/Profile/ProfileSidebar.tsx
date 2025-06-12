"use client";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
    User,
    LifeBuoy,
    LogOut,
    ChevronRight,
    Shield,
    ChevronDown,
    CreditCard,
    UserPen,
    MapPin
} from "lucide-react";

import { useState } from "react";

import { cn } from "@/lib/utils";

import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";

import { ScrollArea } from "@/components/ui/scroll-area";

import { Separator } from "@/components/ui/separator";

interface ProfileSidebarProps {
    onLinkClick?: () => void;
}

interface SubItem {
    title: string;
    href: string;
}

interface NavItem {
    title: string;
    href: string;
    icon: any;
    subItems?: SubItem[];
}

const sidebarNavItems: NavItem[] = [
    {
        title: "Overview",
        href: "/profile",
        icon: User,
    },

    {
        title: "Transaksi",
        href: "/profile/tranksaksi",
        icon: CreditCard,
        subItems: [
            { title: "Tranksaksi", href: "/profile/tranksaksi/tranksaksi" },
            { title: "Tertunda", href: "/profile/tranksaksi/pending" },
            { title: "Dikirim", href: "/profile/tranksaksi/delivery" },
            { title: "Berhasil", href: "/profile/tranksaksi/success" },
            { title: "Dibatalkan", href: "/profile/tranksaksi/canceled" },
        ],
    },

    {
        title: "Alamat",
        href: "/profile/address",
        icon: MapPin,
    },

    {
        title: "Security",
        href: "/profile/security",
        icon: Shield,
        subItems: [
            { title: "Password", href: "/profile/security/password" },
            { title: "Delete Accounts", href: "/profile/security/delete" },
        ],
    },

    {
        title: "Profile",
        href: "/profile/profile",
        icon: UserPen,
    },

    {
        title: "Support",
        href: "/profile/support",
        icon: LifeBuoy,
        subItems: [
            { title: "Help Center", href: "/profile/support/help" },
            { title: "Contact Us", href: "/profile/support/contact" },
            { title: "FAQ", href: "/profile/support/faq" },
        ],
    },
];

export default function ProfileSidebar({ onLinkClick }: ProfileSidebarProps) {
    const { user, logout } = useAuth();
    const pathname = usePathname();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    if (!user) return null;

    const toggleItem = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href)
                ? prev.filter(item => item !== href)
                : [...prev, href]
        );
    };

    const isItemExpanded = (href: string) => expandedItems.includes(href);
    const isActive = (href: string) => pathname === href;
    const isSubItemActive = (subItems?: SubItem[]) =>
        subItems?.some(subItem => pathname === subItem.href) || false;

    return (
        <div className="w-64 bg-background border-r flex flex-col h-full">
            <div className="p-4">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Avatar className="w-6 h-6">
                            {user.photoURL ? (
                                <AvatarImage src={user.photoURL} alt={user.displayName || "Profile"} className="object-cover" />
                            ) : (
                                <AvatarFallback className="text-sm text-primary">
                                    {user.displayName?.charAt(0) || "U"}
                                </AvatarFallback>
                            )}
                        </Avatar>
                    </div>
                    <div>
                        <h2 className="text-sm font-medium text-foreground">{user.displayName}</h2>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-2">
                <nav className="space-y-1">
                    {sidebarNavItems.map((item) => {
                        const hasSubItems = item.subItems && item.subItems.length > 0;
                        const isExpanded = isItemExpanded(item.href);
                        const isItemActive = isActive(item.href) || isSubItemActive(item.subItems);

                        return (
                            <div key={item.href} className="space-y-1">
                                {hasSubItems ? (
                                    <Collapsible
                                        open={isExpanded}
                                        onOpenChange={() => toggleItem(item.href)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                className={cn(
                                                    "w-full justify-start items-center h-9 px-2",
                                                    isItemActive && "bg-primary/10 text-primary"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "w-4 h-4 mr-2",
                                                    isItemActive ? "text-primary" : "text-muted-foreground"
                                                )} />
                                                <span className="text-sm">{item.title}</span>
                                                <ChevronDown
                                                    className={cn(
                                                        "w-4 h-4 ml-auto transition-transform duration-200",
                                                        isExpanded && "transform rotate-180"
                                                    )}
                                                />
                                            </Button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="pl-4 space-y-1">
                                            {item.subItems?.map((subItem) => (
                                                <Link key={subItem.href} href={subItem.href} onClick={onLinkClick}>
                                                    <Button
                                                        variant="ghost"
                                                        className={cn(
                                                            "w-full justify-start items-center h-8 px-2 text-sm",
                                                            isActive(subItem.href) && "bg-primary/10 text-primary"
                                                        )}
                                                    >
                                                        {subItem.title}
                                                        {isActive(subItem.href) && (
                                                            <ChevronRight className="w-4 h-4 ml-auto" />
                                                        )}
                                                    </Button>
                                                </Link>
                                            ))}
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <Link href={item.href} onClick={onLinkClick}>
                                        <Button
                                            variant="ghost"
                                            className={cn(
                                                "w-full justify-start items-center h-9 px-2",
                                                isItemActive && "bg-primary/10 text-primary"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-4 h-4 mr-2",
                                                isItemActive ? "text-primary" : "text-muted-foreground"
                                            )} />
                                            <span className="text-sm">{item.title}</span>
                                            {isItemActive && (
                                                <ChevronRight className="w-4 h-4 ml-auto" />
                                            )}
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="p-2">
                <Separator className="mb-2" />
                <Button
                    variant="ghost"
                    className="w-full justify-start items-center h-9 px-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    <span className="text-sm">Logout</span>
                </Button>
            </div>
        </div>
    );
} 