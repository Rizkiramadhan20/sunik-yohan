"use client"

import React from 'react'

import { homeProps } from '@/components/content/home/types/home'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

import Link from "next/link"

import varchar1 from "@/base/assets/home.jpg"

import { motion } from 'framer-motion'

export default function Home({ homeData }: { homeData: homeProps[] }) {

    return (
        <section className='relative flex flex-col items-center justify-center min-h-screen py-20 bg-gradient-to-br from-white via-gray-50 to-gray-100 overflow-hidden'>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-24 -right-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-blue-200 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
                <div className="absolute -bottom-24 -left-24 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-purple-200 to-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-gradient-to-r from-pink-200 to-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container relative px-4">
                {
                    homeData.map((Item, idx) => {
                        return (
                            <motion.div
                                key={idx}
                                className="flex flex-col lg:flex-row items-center justify-between gap-8 md:gap-16 py-8 md:py-12"
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: idx * 0.2 }}
                            >
                                <motion.div
                                    className="flex-1 space-y-6 md:space-y-8 text-center lg:text-left"
                                    initial={{ opacity: 0, x: -50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, delay: idx * 0.3 }}
                                >
                                    <div className="space-y-4 md:space-y-6">
                                        <motion.h1
                                            className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent leading-tight tracking-tight"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, delay: idx * 0.4 }}
                                        >
                                            {Item.title}
                                        </motion.h1>
                                        <motion.p
                                            className="text-lg md:text-xl text-gray-600 max-w-2xl leading-relaxed"
                                            initial={{ opacity: 0, y: 20 }}
                                            whileInView={{ opacity: 1, y: 0 }}
                                            viewport={{ once: true, amount: 0.3 }}
                                            transition={{ duration: 0.6, delay: idx * 0.5 }}
                                        >
                                            {Item.description}
                                        </motion.p>
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.6, delay: idx * 0.6 }}
                                    >
                                        <Link href={Item.button.href}>
                                            <Button className='group relative px-8 md:px-12 py-6 md:py-8 text-base md:text-lg font-semibold bg-gradient-to-r from-[#d9b596] to-[#c4a080] text-white rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#d9b596]/30 hover:-translate-y-1'>
                                                <span className="relative z-10 flex items-center gap-2">
                                                    {Item.button.label}
                                                    <svg
                                                        className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                                        />
                                                    </svg>
                                                </span>
                                                <div className="absolute inset-0 bg-gradient-to-r from-[#c4a080] to-[#d9b596] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </motion.div>

                                <motion.div
                                    className="flex-1 relative w-full max-w-xl mt-8 lg:mt-0"
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true, amount: 0.3 }}
                                    transition={{ duration: 0.8, delay: idx * 0.3 }}
                                >
                                    <div className="absolute -right-4 md:-right-8 top-0 w-8 md:w-16 h-full bg-gradient-to-b from-amber-200 to-amber-50 rounded-r-3xl shadow-lg"></div>
                                    <motion.div
                                        className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl transform hover:scale-[1.02] transition-transform duration-500"
                                        whileHover={{ scale: 1.02 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Image
                                            src={Item.imageUrl}
                                            alt={Item.title}
                                            fill
                                            className="object-cover"
                                            quality={100}
                                            priority
                                        />
                                    </motion.div>
                                </motion.div>
                            </motion.div>
                        )
                    })
                }

                <motion.div
                    className="absolute top-10 left-0 w-full transform hidden md:block"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{
                        opacity: 1,
                        y: 0
                    }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{
                        duration: 0.8
                    }}
                >
                    <motion.div
                        className="relative"
                        animate={{
                            y: [0, -15, 0, -15, 0],
                            rotate: [0, 3, 0, -3, 0]
                        }}
                        transition={{
                            duration: 6,
                            repeat: Infinity,
                            ease: "easeInOut",
                            times: [0, 0.25, 0.5, 0.75, 1]
                        }}
                    >
                        <Image
                            src={varchar1}
                            alt='varchar'
                            className="relative rounded-3xl w-20 h-20 md:w-28 md:h-28"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
