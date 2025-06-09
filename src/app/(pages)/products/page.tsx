import React, { Fragment } from 'react';

import { fetchProductsData } from "@/components/content/products/utils/FetchProducts"

import Product from '@/hooks/(pages)/products/ProductsLayout';

import ProductSkeleton from '@/hooks/(pages)/products/ProductsSkeleton';

export default async function Page() {
    try {
        const productsData = await fetchProductsData();

        return <Fragment>
            <Product productsData={productsData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return (
            <ProductSkeleton />
        );
    }
}