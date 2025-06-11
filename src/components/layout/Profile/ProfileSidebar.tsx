"use client";

import Link from "next/link";

import { useAuth } from "@/utils/context/AuthContext";

import { usePathname } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
    User,
    Settings,
    LifeBuoy,
    LogOut,
    ChevronRight,
    Shield,
    ChevronDown,
    CreditCard,
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
        title: "Alamat",
        href: "/profile/address",
        icon: MapPin,
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
        title: "Security",
        href: "/profile/security",
        icon: Shield,
        subItems: [
            { title: "Password", href: "/profile/security/password" },
            { title: "Delete Accounts", href: "/profile/security/delete" },
        ],
    },

    {
        title: "Settings",
        href: "/profile/settings",
        icon: Settings,
        subItems: [
            { title: "Profile", href: "/profile/settings/profile" },
            { title: "Billing", href: "/profile/settings/billing" },
            { title: "Preferences", href: "/profile/settings/preferences" },
        ],
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
            <div className="p-6">
                <div className="flex flex-col items-center mb-6">
                    <Avatar className="w-20 h-20 mb-4 ring-4 ring-primary/10">
                        {user.photoURL ? (
                            <AvatarImage src={user.photoURL} alt={user.displayName || "Profile"} />
                        ) : (
                            <AvatarFallback className="text-2xl">
                                {user.displayName?.charAt(0) || "U"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <h2 className="text-lg font-semibold text-foreground truncate max-w-[180px] text-center">{user.displayName}</h2>
                    <p className="text-sm text-muted-foreground truncate max-w-[180px] text-center">{user.email}</p>
                </div>
            </div>

            <ScrollArea className="flex-1 px-3">
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
                                                    "w-full justify-start items-center",
                                                    isItemActive && "bg-accent text-accent-foreground"
                                                )}
                                            >
                                                <item.icon className={cn(
                                                    "w-5 h-5 mr-3",
                                                    isItemActive ? "text-primary" : "text-muted-foreground"
                                                )} />
                                                {item.title}
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
                                                            "w-full justify-start items-center text-sm",
                                                            isActive(subItem.href) && "bg-accent text-accent-foreground"
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
                                                "w-full justify-start items-center",
                                                isItemActive && "bg-accent text-accent-foreground"
                                            )}
                                        >
                                            <item.icon className={cn(
                                                "w-5 h-5 mr-3",
                                                isItemActive ? "text-primary" : "text-muted-foreground"
                                            )} />
                                            {item.title}
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

            <div className="p-3">
                <Separator className="mb-3" />
                <Button
                    variant="ghost"
                    className="w-full justify-start items-center text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={logout}
                >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                </Button>
            </div>
        </div>
    );
} 