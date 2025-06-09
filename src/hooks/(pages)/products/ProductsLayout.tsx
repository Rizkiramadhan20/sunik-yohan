"use client"

import React from 'react'

import { ProductsData } from "@/components/content/products/types/products"

import Image from 'next/image'

import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function ProductsLayout({ productsData }: { productsData: ProductsData[] }) {
    return (
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
    )
}
