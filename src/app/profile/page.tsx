"use client";

import { useAuth } from "@/utils/context/AuthContext";

import { useEffect } from "react";

import { useRouter } from "next/navigation";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { User, Mail, Phone, ChevronLeft } from "lucide-react";

import { Timestamp } from "firebase/firestore";

export default function ProfilePage() {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) {
            router.push("/signin");
            return;
        }
    }, [user, router]);

    if (!user) return null;

    return (
        <div className="w-full h-full p-4 sm:p-6 bg-white">
            <div className="flex items-center justify-between mb-4 sm:mb-8">
                <Button
                    variant="ghost"
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back
                </Button>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
                {/* Left Column - Profile Overview */}
                <div className="flex-1">
                    <Card>
                        <CardContent className="pt-4 sm:pt-6 relative">
                            <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                                <Avatar className="w-24 h-24 sm:w-32 sm:h-32 mb-3 sm:mb-4 ring-4 ring-primary/10">
                                    {user.photoURL ? (
                                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                                    ) : (
                                        <AvatarFallback className="text-3xl sm:text-4xl">
                                            {user.displayName?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <h2 className="text-xl sm:text-2xl font-bold text-gray-900">{user.displayName}</h2>
                                <p className="text-sm sm:text-base text-gray-600">{user.email}</p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg mb-4 sm:mb-6">
                                <div className="text-center">
                                    <p className="text-xs sm:text-sm text-gray-600">Member Since</p>
                                    <p className="text-sm sm:text-base font-semibold">
                                        {user.createdAt instanceof Timestamp
                                            ? user.createdAt.toDate().toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true,
                                                timeZone: 'Asia/Jakarta'
                                            })
                                            : new Date(user.createdAt).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true,
                                                timeZone: 'Asia/Jakarta'
                                            })}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-xs sm:text-sm text-gray-600">Last Updated</p>
                                    <p className="text-sm sm:text-base font-semibold">
                                        {(user.updatedAt instanceof Timestamp
                                            ? user.updatedAt.toDate()
                                            : new Date(user.updatedAt || user.createdAt)).toLocaleString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                                second: '2-digit',
                                                hour12: true,
                                                timeZone: 'Asia/Jakarta'
                                            })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-center mb-4 sm:mb-0 sm:absolute sm:top-6 sm:right-6">
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-green-50 rounded-lg">
                                    <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                            <polyline points="22 4 12 14.01 9 11.01" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-sm sm:text-base font-medium text-green-700">Verified Account</p>
                                        <p className="text-xs sm:text-sm text-green-600">Email verified</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3 sm:space-y-4">
                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600">Display Name</p>
                                        <p className="text-sm sm:text-base font-medium">{user.displayName}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                                        <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600">Email Address</p>
                                        <p className="text-sm sm:text-base font-medium">{user.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 bg-gray-50 rounded-lg">
                                    <div className="p-1.5 sm:p-2 bg-primary/10 rounded-lg">
                                        <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-xs sm:text-sm text-gray-600">Phone Number</p>
                                        <p className="text-sm sm:text-base font-medium">{user.phoneNumber || "Not provided"}</p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
} 