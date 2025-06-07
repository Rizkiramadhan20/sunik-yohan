import React from 'react'

import { ProductsData } from '@/components/content/products/types/products'

import Link from 'next/link';

import Image from 'next/image';

import ShopeFod from "@/base/assets/shofepod.png"

import { Button } from '@/components/ui/button';

interface ProjectDetailsContentProps {
    slug: string;
    productsData: ProductsData | ProductsData[];
}

export default function ProjectDetailsContent({ slug, productsData }: ProjectDetailsContentProps) {
    const productsArray = Array.isArray(productsData) ? productsData : [productsData];
    const product = productsArray[0];

    if (!product) {
        return <section className='min-h-screen py-12 bg-white'>Product not found</section>;
    }

    return (
        <section className='min-h-screen py-8 md:py-12 lg:py-16 bg-gray-50'>
            <div className='container mx-auto px-4 lg:px-8'>
                <div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
                    {/* Image Gallery */}
                    <div className='w-full lg:w-1/2'>
                        <div className='w-full aspect-square rounded-3xl overflow-hidden bg-white shadow-lg transition-all duration-300 hover:shadow-xl'>
                            <div
                                className='w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105'
                                style={{ backgroundImage: `url(${product.thumbnail})` }}
                            />
                        </div>
                    </div>

                    {/* Product Details */}
                    <div className='w-full lg:w-1/2'>
                        <div className='sticky top-24 space-y-8 bg-white p-6 rounded-3xl shadow-sm'>
                            <div>
                                <p className='text-sm font-medium text-orange-500 mb-2 uppercase tracking-wider'>{product.category}</p>
                                <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-4'>{product.title}</h1>
                                <span className='text-3xl font-bold text-gray-900'>Rp. {product.price}</span>
                            </div>

                            {/* Stock Information */}
                            <div className='flex items-center gap-8 text-sm text-gray-500 bg-gray-50 p-4 rounded-xl'>
                                <div className='flex items-center gap-2'>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                                    </svg>
                                    <span className='font-semibold text-gray-900'>{product.sold || 0}</span>
                                    <span>sold</span>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                                    </svg>
                                    <span className='font-semibold text-gray-900'>{product.stock || 0}</span>
                                    <span>in stock</span>
                                </div>
                            </div>

                            {/* Description */}
                            <div className='text-gray-600 leading-relaxed text-lg'>
                                <p>{product.description || "N/A"}</p>
                            </div>

                            <div className='flex items-center gap-4'>
                                <span className='text-gray-700 font-medium flex items-center gap-2'>
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                                    </svg>
                                    Size:
                                </span>
                                <Button className='bg-gray-100 hover:bg-gray-200 text-gray-900 border-none'>
                                    {product.size}
                                </Button>
                            </div>

                            {/* Quantity and Add to Cart */}
                            <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-4'>
                                <div className='flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white'>
                                    <button className='px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors'>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path>
                                        </svg>
                                    </button>
                                    <span className='px-4 py-3 border-x border-gray-200 font-medium'>1</span>
                                    <button className='px-4 py-3 text-gray-500 hover:bg-gray-50 transition-colors'>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                        </svg>
                                    </button>
                                </div>

                                <button className='flex-grow bg-gray-900 text-white py-3 px-6 rounded-xl hover:bg-gray-800 transition-all duration-200 hover:shadow-lg font-medium flex items-center justify-center gap-2'>
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    Add to Cart
                                </button>

                                <Link href={product.shopeUrl} className='flex-shrink-0'>
                                    <button className='w-full p-3 bg-white text-orange-500 border border-orange-500 rounded-xl hover:bg-orange-50 transition-all duration-200 hover:shadow-md flex items-center justify-center gap-2'>
                                        <Image
                                            src={ShopeFod}
                                            alt="Shopee"
                                            width={20}
                                            height={20}
                                            className="object-contain"
                                        />
                                        <span className='text-sm font-semibold'>Beli Sekarang</span>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detail Section */}
                <div className='mt-16 pt-8 border-t border-gray-200'>
                    <h3 className='text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2'>
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                        </svg>
                        Product Details
                    </h3>
                    <div className='prose prose-lg max-w-none text-gray-600 bg-white p-8 rounded-3xl shadow-sm' dangerouslySetInnerHTML={{ __html: product.content }} />
                </div>
            </div>
        </section>
    )
}
