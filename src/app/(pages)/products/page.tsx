import React, { Fragment } from 'react';

import { fetchProductsData } from "@/components/content/products/utils/FetchProducts"

import { fetchBannerData } from "@/hooks/(pages)/banner/utils/FetchBanner"

import Product from '@/hooks/(pages)/products/ProductsLayout';

import ProductSkeleton from '@/hooks/(pages)/products/ProductsSkeleton';

export default async function Page() {
    try {
        const productsData = await fetchProductsData();
        const bannerData = await fetchBannerData();

        return <Fragment>
            <Product productsData={productsData} bannerData={bannerData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching home data:', error);
        return (
            <ProductSkeleton />
        );
    }
}