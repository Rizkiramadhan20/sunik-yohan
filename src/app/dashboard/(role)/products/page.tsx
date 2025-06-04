import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Products',
    description: 'Dashboard',
}

import ProductsLayout from "@/hooks/dashboard/products/products/ProductsLayout"

export default function About() {
    return (
        <ProductsLayout />
    )
}
