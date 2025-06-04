import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Products Sizes',
    description: 'Dashboard',
}

import ProductsSizesLayout from "@/hooks/dashboard/products/sizes/ProductsSizesLayout"

export default function About() {
    return (
        <ProductsSizesLayout />
    )
}
