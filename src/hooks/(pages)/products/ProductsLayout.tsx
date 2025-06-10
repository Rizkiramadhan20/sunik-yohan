"use client"

import React, { Fragment, useEffect, useState } from 'react'

import { ProductsData } from "@/components/content/products/types/products"

import { BannerData } from "@/hooks/(pages)/banner/types/banner"

import Image from 'next/image'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

import { motion, AnimatePresence } from 'framer-motion'

import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function ProductsLayout({ productsData, bannerData }: { productsData: ProductsData[], bannerData: BannerData[] }) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)

    useEffect(() => {
        if (!isHovered) {
            const timer = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % bannerData.length)
            }, 5000)
            return () => clearInterval(timer)
        }
    }, [isHovered, bannerData.length])

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % bannerData.length)
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + bannerData.length) % bannerData.length)
    }

    return (
        <Fragment>
            <div className='min-h-[50vh] container px-4 md:px-8 relative overflow-hidden pt-24'>
                <div
                    className="relative aspect-[21/9] w-full overflow-hidden rounded-2xl shadow-xl"
                    onMouseEnter={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.7, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={bannerData[currentIndex].imageUrl}
                                alt='banner_image'
                                quality={100}
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        </motion.div>
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: isHovered ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between px-4 md:px-8"
                    >
                        <button
                            onClick={prevSlide}
                            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95"
                            aria-label="Previous slide"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                            onClick={nextSlide}
                            className="bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all transform hover:scale-110 active:scale-95"
                            aria-label="Next slide"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3"
                    >
                        {bannerData.map((_, idx) => (
                            <button
                                key={idx}
                                onClick={() => setCurrentIndex(idx)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${idx === currentIndex
                                    ? 'bg-white scale-125'
                                    : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                aria-label={`Go to slide ${idx + 1}`}
                            />
                        ))}
                    </motion.div>

                    <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-white/50"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        key={currentIndex}
                    />
                </div>
            </div>

            <section className='min-h-screen py-20 bg-gray-50'>
                <div className="container px-4 md:px-8">
                    <div className='grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
                        {
                            productsData.map((item, idx) => {
                                return (
                                    <div key={idx} className={`group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${idx === 0 ? 'ring-2 ring-blue-500' : ''}`}>
                                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                            <div className='p-6'>
                                                <h3 className='font-bold text-xl mb-2 line-clamp-1'>{item.title}</h3>
                                                <p className='text-gray-600 text-sm mb-4 line-clamp-2'>{item.description}</p>
                                                <div className='flex items-center justify-between'>
                                                    <span className='font-bold text-lg text-blue-600'>Rp. {item.price}</span>
                                                </div>

                                                <Link href={item.slug} className='mt-8 flex'>
                                                    <Button>Lihat Details</Button>
                                                </Link>
                                            </div>

                                            <div className='relative aspect-square w-full overflow-hidden'>
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    quality={100}
                                                    fill
                                                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                                                />

                                                <div className='absolute right-0 bottom-0 p-2 rounded-tl-2xl bg-white'>
                                                    <button className=' text-black rounded-full p-3 transition-colors duration-300'>
                                                        <svg
                                                            className="w-6 h-6"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                                            />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </section>
        </Fragment>
    )
}
