"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Skeleton } from '@/components/ui/skeleton'

export default function HomeSkeleton() {
    return (
        <section className='relative flex flex-col items-center justify-center min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden'>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute -bottom-24 -left-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-purple-200 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-pink-200 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container relative px-4">
                <div className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 py-8 md:py-12">
                    <div className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left">
                        <div className="space-y-4 md:space-y-6">
                            <Skeleton className="h-12 md:h-16 w-full" />
                            <Skeleton className="h-24 md:h-32 w-full" />
                        </div>
                        <Skeleton className="h-12 w-48" />
                    </div>

                    <div className="flex-1 relative w-full max-w-xl mt-8 lg:mt-0">
                        <div className="absolute -right-4 md:-right-8 top-0 w-8 md:w-16 h-full bg-gradient-to-b from-amber-200 to-amber-50 rounded-r-3xl shadow-lg"></div>
                        <Skeleton className="relative aspect-square w-full rounded-3xl shadow-2xl" />
                    </div>
                </div>

                <motion.div
                    className="absolute top-10 left-0 w-full transform"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{
                        opacity: [0.7, 1, 0.7],
                        y: [0, -10, 0],
                        rotate: [0, 5, 0]
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                >
                    <Skeleton className="w-20 h-20 md:w-28 md:h-28 rounded-3xl" />
                </motion.div>
            </div>
        </section>
    )
} 