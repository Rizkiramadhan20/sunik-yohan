import React from 'react'

import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Dashboard | Products Categories',
    description: 'Dashboard',
}

import CategoriesLayout from "@/hooks/dashboard/products/categories/CategoriesLayout"

export default function About() {
    return (
        <CategoriesLayout />
    )
}
