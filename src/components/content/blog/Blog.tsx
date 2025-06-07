"use client"

import React from 'react'

import Image from 'next/image'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { motion } from 'framer-motion'

import varcha1 from "@/base/assets/Rectangle1.png"

import varcha2 from "@/base/assets/Rectangle3.png"

import { BlogData } from '@/components/content/blog/types/blog'

export default function Blog({ blogData }: { blogData: BlogData[] }) {
    return (
        <section className='py-16 lg:py-20 bg-white relative'>
            <div className='container px-4 md:px-10'>
                <div className='flex flex-col sm:flex-row justify-between items-start md:items-center mb-10 sm:mb-20'>
                    <div className='flex flex-col gap-2 mb-0'>
                        <span className='text-sm sm:text-base md:text-lg text-[#FF204E] leading-relaxed font-medium'>Blog</span>
                        <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mt-2 sm:mt-3 mb-4 sm:mb-6 max-w-lg'>Blog Terbaru Kami</h3>
                    </div>

                    <div className='flex items-center gap-4'>
                        <Link href="/blogs">
                            <Button className='bg-[#FF204E] text-white'>
                                View All Blog
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className='relative flex items-center justify-center'>
                    {/* Left Arrow */}
                    <button className='absolute left-0 -ml-16 md:-ml-20 lg:-ml-24 xl:-ml-32 w-12 h-12 rounded-full bg-[#FF204E] flex items-center justify-center text-white hover:bg-[#FF204E]/60 transition-colors duration-200 focus:outline-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
                        {blogData.slice(0, 3).map((blog) => (
                            <Card key={blog.id} className='overflow-hidden pb-6'>
                                <CardContent className="p-0">
                                    <Image
                                        src={blog.thumbnail}
                                        alt={blog.title}
                                        width={500}
                                        height={300}
                                        className='w-full aspect-[4/3] object-cover'
                                    />
                                </CardContent>
                                <CardHeader className='p-6 text-center'>
                                    <CardTitle className='text-xl font-semibold text-gray-800 mb-2'>{blog.title}</CardTitle>
                                    <CardDescription className='text-gray-600 text-sm mb-4'>
                                        {blog.description}
                                    </CardDescription>
                                    <Link href={`/blogs/${blog.slug}`} className='text-red-500 hover:text-red-600 font-medium flex items-center justify-center'>
                                        Read Blog
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.5 8.5l4 4-4 4M3.5 12.5h18" />
                                        </svg>
                                    </Link>
                                </CardHeader>
                            </Card>
                        ))}
                    </div>

                    {/* Right Arrow */}
                    <button className='absolute right-0 -mr-16 md:-mr-20 lg:-mr-24 xl:-mr-32 w-12 h-12 rounded-full bg-[#FF204E] flex items-center justify-center text-white hover:bg-[#FF204E]/60 transition-colors duration-200 focus:outline-none'>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </button>
                </div>
            </div>

            <motion.div
                className="absolute top-2 left-56 transform block"
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
                        y: [0, -20, 0, -20, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                >
                    <Image
                        src={varcha1}
                        alt='varchar'
                        className="relative w-6 h-6"
                    />
                </motion.div>
            </motion.div>

            <motion.div
                className="absolute bottom-5 right-20 transform block"
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
                        y: [0, -20, 0, -20, 0],
                        rotate: [0, 5, 0, -5, 0]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        times: [0, 0.25, 0.5, 0.75, 1]
                    }}
                >
                    <Image
                        src={varcha2}
                        alt='varchar'
                        className="relative w-6 h-6"
                    />
                </motion.div>
            </motion.div>
        </section>
    )
}
