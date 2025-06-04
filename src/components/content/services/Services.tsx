import React from 'react'

import { ServicesData } from "@/components/content/services/types/services"

import Image from 'next/image'

import varchar1 from "@/base/assets/image1.png"

import varchar2 from "@/base/assets/image2.png"

export default function Services({ serviceData }: { serviceData: ServicesData[] }) {
    return (
        <section className='relative py-8 md:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100 overflow-hidden'>
            {/* Decorative Images */}
            <div className="absolute top-0 right-0 w-64 h-64 opacity-20 transform rotate-12 scale-110 hover:rotate-45 hover:scale-125 transition-all duration-500">
                <Image
                    src={varchar1}
                    alt="Decorative top right"
                    className="object-contain"
                    fill
                />
            </div>
            <div className="absolute top-0 left-0 w-64 h-64 opacity-20 transform -rotate-12 scale-110 hover:-rotate-45 hover:scale-125 transition-all duration-500">
                <Image
                    src={varchar2}
                    alt="Decorative bottom left"
                    className="object-contain"
                    fill
                />
            </div>

            <div className="container relative px-4">
                {/* Header Section */}
                <div className='max-w-3xl mx-auto text-center mb-16'>
                    <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-rose-600 bg-clip-text text-transparent mb-6'>
                        Explore our Cafe
                    </h1>
                    <p className='text-lg md:text-xl text-gray-600 leading-relaxed'>
                        Discover our carefully crafted menu and cozy atmosphere
                    </p>
                </div>

                {/* Services Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8'>
                    {serviceData.map((item, idx) => (
                        <div
                            key={idx}
                            className='group relative bg-white rounded-2xl overflow-hidden shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 border border-amber-100'
                        >
                            {/* Image Container */}
                            <div className='relative w-full aspect-[4/3] overflow-hidden'>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {/* Overlay gradient */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </div>

                            {/* Content */}
                            <div className='p-6'>
                                <h3 className='text-2xl font-bold text-amber-900 mb-3 group-hover:text-amber-600 transition-colors duration-300'>
                                    {item.title}
                                </h3>
                                <p className='text-gray-600 leading-relaxed text-base'>
                                    {item.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
