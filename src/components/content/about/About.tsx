"use client"

import React from 'react'

import { AboutData } from '@/components/content/about/types/about'

import Image from 'next/image'

import { Button } from '@/components/ui/button'

import Link from "next/link"

import varchar1 from "@/base/assets/coffee2.png"

import { motion } from 'framer-motion'

export default function About({ aboutContentData }: { aboutContentData: AboutData[] }) {
    return (
        <section className='relative py-8 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden'>
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -bottom-12 md:-bottom-24 -left-12 md:-left-24 w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] bg-gradient-to-r from-[#e8a674]/50 via-[#e8a674]/30 to-[#e8a674]/20 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200px] sm:w-[300px] md:w-[600px] h-[200px] sm:h-[300px] md:h-[600px] bg-gradient-to-r from-[#e8a674]/40 via-[#e8a674]/20 to-[#e8a674]/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="container relative px-4 sm:px-6">
                {aboutContentData.map((Item, idx) => {
                    return (
                        <motion.div
                            key={idx}
                            className="flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-12 md:gap-20 xl:gap-28 py-8 sm:py-12 md:py-20"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ duration: 0.8, delay: idx * 0.2 }}
                        >
                            <motion.div
                                className="flex-1 relative w-full max-w-[280px] sm:max-w-[400px] md:max-w-2xl mx-auto lg:mx-0 mt-4 lg:mt-0"
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: idx * 0.3 }}
                            >
                                <div className="absolute -right-2 sm:-right-4 md:-right-8 top-0 w-4 sm:w-8 md:w-16 h-full bg-gradient-to-b from-[#e8a674]/70 to-[#e8a674]/30 rounded-r-3xl shadow-lg"></div>
                                <motion.div
                                    className="relative aspect-square w-full overflow-hidden rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl transform hover:scale-[1.02] transition-all duration-500 group z-[50]"
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                                    <Image
                                        src={Item.imageUrl}
                                        alt={Item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        quality={100}
                                        priority
                                    />
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="flex-1 space-y-6 sm:space-y-8 md:space-y-10 text-center lg:text-left z-[50] px-4 sm:px-0"
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, amount: 0.3 }}
                                transition={{ duration: 0.8, delay: idx * 0.3 }}
                            >
                                <div className="space-y-4 sm:space-y-6 md:space-y-8">
                                    <motion.h1
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#e8a674]/80 via-[#e8a674]/60 to-[#e8a674]/40 bg-clip-text text-transparent leading-tight tracking-tight"
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.3 }}
                                        transition={{ duration: 0.6, delay: idx * 0.4 }}
                                    >
                                        {Item.title}
                                    </motion.h1>
                                    <motion.p
                                        className="text-base sm:text-lg md:text-xl text-slate-600 max-w-2xl leading-relaxed"
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
                                        <Button className='group relative px-6 sm:px-8 md:px-12 py-5 sm:py-6 md:py-8 text-sm sm:text-base md:text-lg font-semibold bg-gradient-to-r from-[#e8a674]/80 via-[#e8a674]/70 to-[#e8a674]/80 text-white rounded-xl sm:rounded-2xl transition-all duration-300 hover:shadow-2xl hover:shadow-[#e8a674]/20 hover:-translate-y-1'>
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
                                            <div className="absolute inset-0 bg-gradient-to-r from-[#e8a674]/70 via-[#e8a674]/80 to-[#e8a674]/70 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        </Button>
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </motion.div>
                    )
                })}

                <motion.div
                    className="absolute top-10 -right-10 w-full transform hidden lg:block z-[0]"
                >
                    <motion.div
                        className="relative flex justify-end"
                    >
                        <Image
                            src={varchar1}
                            alt='varchar'
                            width={400}
                            height={400}
                            className="w-[300px] lg:w-[400px] xl:w-[500px]"
                        />
                    </motion.div>
                </motion.div>
            </div>
        </section>
    )
}
