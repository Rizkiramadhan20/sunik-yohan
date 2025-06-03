import Image from "next/image";
import Link from "next/link";
import { Menu, X, MapPin, ShoppingCart, LogIn, Home, Info, Utensils, Newspaper, Phone } from "lucide-react";
import { menuHamburger } from "@/components/layout/Header/data/Header"
import React, { useEffect, useState } from "react";
import { useAuth } from "@/utils/context/AuthContext";
import ProfileMenu from "@/components/layout/Header/ProfileMenu";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";

import Logo from "@/base/assets/logo.jpeg"

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const pathname = usePathname();

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 180);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed ${scrolled ? 'top-0' : 'top-2'} left-0 right-0 z-50 flex justify-center items-start h-24 px-3 lg:px-12 transition-all duration-500`}>
            <div className={`w-full container rounded-[var(--radius)] ${scrolled ? 'bg-white/90 backdrop-blur-lg' : 'bg-white'} px-6 py-3 flex items-center justify-between h-16 transition-all duration-500`}>
                {/* Left Section - Logo */}
                <div className="flex items-center">
                    <Link href="/" className="flex-shrink-0 hover:opacity-80 transition-all duration-300">
                        <Image
                            src={Logo}
                            alt="Logo"
                            width={110}
                            height={40}
                            className="h-10 w-auto"
                            priority
                        />
                    </Link>
                </div>

                {/* Center Section - Navigation */}
                <NavigationMenu className="hidden lg:flex">
                    <NavigationMenuList className="gap-8">
                        {menuHamburger.map((item) => (
                            (item.name === "Login" && user) ? null : (
                                <NavigationMenuItem key={item.href}>
                                    <Button
                                        variant="ghost"
                                        onClick={() => window.location.href = item.href}
                                        className={`text-gray-600 hover:text-gray-900 font-medium text-sm transition-all duration-300 hover:scale-105 ${pathname === item.href ? 'text-gray-900 bg-gray-100' : ''
                                            }`}
                                    >
                                        {item.name === "Home" && <Home className="h-5 w-5" />}
                                        {item.name === "About" && <Info className="h-5 w-5" />}
                                        {item.name === "Our Menu" && <Utensils className="h-5 w-5" />}
                                        {item.name === "Blog" && <Newspaper className="h-5 w-5" />}
                                        {item.name === "Contact" && <Phone className="h-5 w-5" />}
                                        {item.name}
                                    </Button>
                                </NavigationMenuItem>
                            )
                        ))}
                    </NavigationMenuList>
                </NavigationMenu>

                {/* Right Section - Cart, Login/Profile, and Hamburger */}
                <div className="flex items-center gap-0 md:gap-4">
                    <Button
                        variant="ghost"
                        className={`hover:bg-gray-100/80 gap-2 relative group transition-all duration-300 ${pathname === '/cart' ? 'text-gray-900 bg-gray-100' : ''
                            }`}
                        onClick={() => window.location.href = '/cart'}
                    >
                        <ShoppingCart className="h-5 w-5 text-gray-600 group-hover:scale-110 transition-transform duration-300" />
                        <span className="text-gray-600 group-hover:text-gray-900 transition-colors duration-300">Cart</span>
                        <span className="absolute -top-1 -right-1 bg-gray-200 text-gray-600 text-xs rounded-full w-5 h-5 flex items-center justify-center group-hover:bg-gray-300 transition-colors duration-300">
                            {cartCount}
                        </span>
                    </Button>
                    {user ? (
                        <ProfileMenu
                            isProfileOpen={isProfileOpen}
                            toggleProfile={toggleProfile}
                        />
                    ) : (
                        <Button
                            variant="default"
                            className={`bg-gray-900 cursor-pointer hover:bg-gray-800 text-white transition-all duration-300 hover:scale-105 hidden sm:flex ${pathname === '/signin' ? 'bg-gray-800' : ''
                                }`}
                            onClick={() => window.location.href = '/signin'}
                        >
                            Login
                        </Button>
                    )}
                    {!user && (
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`sm:hidden hover:bg-gray-100/80 transition-all duration-300 ${pathname === '/signin' ? 'bg-gray-100' : ''
                                }`}
                            onClick={() => window.location.href = '/signin'}
                        >
                            <LogIn className="h-5 w-5 text-gray-600" />
                        </Button>
                    )}
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="lg:hidden hover:bg-gray-100/80 transition-all duration-300">
                                <Menu className="h-5 w-5 text-gray-600" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="bottom" className="h-[75vh] p-0 bg-white/95 backdrop-blur-lg border-t rounded-t-[var(--radius)]">
                            <div className="flex flex-col h-full">
                                <SheetHeader className="px-6 py-4 border-b">
                                    <SheetTitle className="text-gray-900 text-xl font-semibold">Menu</SheetTitle>
                                </SheetHeader>
                                <nav className="flex-1 px-6 py-4 overflow-y-auto">
                                    <ul className="flex flex-col gap-4">
                                        {menuHamburger.map((item) => (
                                            (item.name === "Login" && user) ? null : (
                                                <li key={item.href}>
                                                    <Button
                                                        variant="ghost"
                                                        onClick={() => window.location.href = item.href}
                                                        className={`text-gray-600 hover:text-gray-900 text-base font-medium transition-all duration-300 w-full justify-start hover:bg-gray-100/80 rounded-[var(--radius)] py-6 gap-3 ${pathname === item.href ? 'text-gray-900 bg-gray-100' : ''
                                                            }`}
                                                    >
                                                        {item.name === "Home" && <Home className="h-5 w-5" />}
                                                        {item.name === "About" && <Info className="h-5 w-5" />}
                                                        {item.name === "Our Menu" && <Utensils className="h-5 w-5" />}
                                                        {item.name === "Blog" && <Newspaper className="h-5 w-5" />}
                                                        {item.name === "Contact" && <Phone className="h-5 w-5" />}
                                                        {item.name}
                                                    </Button>
                                                </li>
                                            )
                                        ))}
                                    </ul>
                                </nav>
                                <div className="px-6 py-4 border-t">
                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-[var(--radius)]">
                                        <MapPin className="text-gray-400 text-xl" />
                                        <div>
                                            <h4 className="text-gray-900 font-medium text-sm">Visit Us</h4>
                                            <p className="text-gray-500 text-xs mt-1">123 Business Avenue, Suite 500<br />New York, NY 10001</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    );
}