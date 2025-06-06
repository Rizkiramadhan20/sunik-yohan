import React from 'react'

import Image from 'next/image'

import image1 from "@/base/assets/menu1.png"

import { Card, CardContent, CardFooter } from "@/components/ui/card"

export default function Menu() {
    return (
        <section>
            <div className="container px-4">
                <div className='flex flex-col sm:flex-row justify-between mb-10 sm:mb-20'>
                    <div className='flex flex-col gap-2 mb-6 sm:mb-0'>
                        <span className='text-sm sm:text-base md:text-lg text-[#FF204E] leading-relaxed font-medium'>OUR MENU</span>
                        <h3 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#333333] mt-2 sm:mt-3 mb-4 sm:mb-6 max-w-xl'>Menu That Always Makes You Fall In Love</h3>
                    </div>

                    <div>
                        {/* Navigation Arrows */}
                        <div className="flex items-center gap-4">
                            <button className="bg-gray-200 text-gray-600 rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md">&lt;</button>
                            <button className="bg-[#FF204E] text-white rounded-full w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shadow-md">&gt;</button>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row">
                    {/* Menu Categories */}
                    <div className="w-full lg:w-1/4 border-b lg:border-b-0 lg:border-r border-gray-300 pb-4 lg:pb-0 lg:pr-10 mb-6 lg:mb-0">
                        <ul className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible gap-2 lg:gap-3">
                            <li className="flex items-center p-2 lg:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                <span className="mr-2 lg:mr-3 text-xl">🍔</span>
                                <span className="font-medium text-gray-700">Burger</span>
                            </li>

                            <li className="flex items-center p-2 lg:p-3 rounded-lg bg-[#FF204E] text-white relative cursor-pointer whitespace-nowrap">
                                <div className="absolute top-0 -left-4 w-1 h-full bg-[#FF204E] rounded-r-full hidden lg:block"></div>
                                <span className="mr-2 lg:mr-3 text-xl">🍕</span>
                                <span className="font-medium">Pizza</span>
                            </li>

                            <li className="flex items-center p-2 lg:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                <span className="mr-2 lg:mr-3 text-xl">🧁</span>
                                <span className="font-medium text-gray-700">Cupcake</span>
                            </li>

                            <li className="flex items-center p-2 lg:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                <span className="mr-2 lg:mr-3 text-xl">🍜</span>
                                <span className="font-medium text-gray-700">Ramen</span>
                            </li>

                            <li className="flex items-center p-2 lg:p-3 rounded-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer whitespace-nowrap">
                                <span className="mr-2 lg:mr-3 text-xl">🍦</span>
                                <span className="font-medium text-gray-700">Ice Cream</span>
                            </li>
                        </ul>
                    </div>

                    {/* Food Items */}
                    <div className="w-full lg:w-3/4">
                        <div className="flex gap-4 overflow-x-auto pb-4">
                            <Card className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 overflow-hidden">
                                <div className="aspect-[4/3] relative">
                                    <Image src={image1} alt="Italian Pizza" className="object-cover" fill />
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="text-lg sm:text-xl font-bold text-[#333333]">Italian Pizza</h4>
                                    <p className="text-base sm:text-lg text-[#FF204E] font-semibold">$7.49</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <button className="text-[#FF204E] font-medium flex items-center">
                                        Order Now <span className="ml-1">&gt;</span>
                                    </button>
                                </CardFooter>
                            </Card>

                            <Card className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 overflow-hidden">
                                <div className="aspect-[4/3] relative">
                                    <Image src={image1} alt="Italian Pizza" className="object-cover" fill />
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="text-lg sm:text-xl font-bold text-[#333333]">Italian Pizza</h4>
                                    <p className="text-base sm:text-lg text-[#FF204E] font-semibold">$7.49</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <button className="text-[#FF204E] font-medium flex items-center">
                                        Order Now <span className="ml-1">&gt;</span>
                                    </button>
                                </CardFooter>
                            </Card>

                            <Card className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 overflow-hidden">
                                <div className="aspect-[4/3] relative">
                                    <Image src={image1} alt="Italian Pizza" className="object-cover" fill />
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="text-lg sm:text-xl font-bold text-[#333333]">Italian Pizza</h4>
                                    <p className="text-base sm:text-lg text-[#FF204E] font-semibold">$7.49</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <button className="text-[#FF204E] font-medium flex items-center">
                                        Order Now <span className="ml-1">&gt;</span>
                                    </button>
                                </CardFooter>
                            </Card>

                            <Card className="w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] flex-shrink-0 overflow-hidden">
                                <div className="aspect-[4/3] relative">
                                    <Image src={image1} alt="Italian Pizza" className="object-cover" fill />
                                </div>
                                <CardContent className="p-4">
                                    <h4 className="text-lg sm:text-xl font-bold text-[#333333]">Italian Pizza</h4>
                                    <p className="text-base sm:text-lg text-[#FF204E] font-semibold">$7.49</p>
                                </CardContent>
                                <CardFooter className="p-4 pt-0">
                                    <button className="text-[#FF204E] font-medium flex items-center">
                                        Order Now <span className="ml-1">&gt;</span>
                                    </button>
                                </CardFooter>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
