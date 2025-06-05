import React from 'react'

import { ServicesData } from "@/components/content/services/types/services"

import Image from 'next/image'

export default function Services({ serviceData }: { serviceData: ServicesData[] }) {
    return (
        <section className='relative py-12 sm:py-16 lg:py-20 bg-white overflow-hidden'>
            <div className="container relative px-4 sm:px-6">
                {/* Header Section */}
                <div className='max-w-3xl mx-auto text-center mb-16 sm:mb-20 lg:mb-28'>
                    <p className='text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed'>
                        WHAT WE SERVE
                    </p>

                    <h1 className='text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-[#333333] mb-4 sm:mb-6'>
                        Your Favorite Food Delivery Partner
                    </h1>
                </div>

                {/* Services Grid */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8'>
                    {serviceData.map((item, idx) => (
                        <div
                            key={idx}
                            className='group relative bg-white rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-2'
                        >
                            {/* Image Container */}
                            <div className='relative w-full aspect-[4/3] overflow-hidden'>
                                <Image
                                    src={item.imageUrl}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                            </div>

                            {/* Content */}
                            <div className='p-4 sm:p-6'>
                                <h3 className='text-xl sm:text-2xl font-bold text-amber-900 mb-2 sm:mb-3 group-hover:text-amber-600 transition-colors duration-300'>
                                    {item.title}
                                </h3>
                                <p className='text-sm sm:text-base text-gray-600 leading-relaxed'>
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
