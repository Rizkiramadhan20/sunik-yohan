import React, { Fragment } from 'react';

import { fetchHomeData } from '@/components/content/home/utils/FetchHome';

import { fetchServicesData } from "@/components/content/services/utils/FetchServices"

import { fetchProductsData } from "@/components/content/products/utils/FetchProducts"

import Home from '@/components/content/home/Home';

import Services from '@/components/content/services/Services';

import Products from "@/components/content/products/Products"

import Daily from '@/components/content/daily/Daily';

import HomeSkeleton from '@/components/content/home/HomeSkeleton';

export default async function Page() {
  try {
    const homeData = await fetchHomeData();
    const serviceData = await fetchServicesData();
    const productsData = await fetchProductsData();
    return <Fragment>
      <Home homeData={homeData} />
      <Services serviceData={serviceData} />
      <Products productsData={productsData} />
      <Daily />
    </Fragment>;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <HomeSkeleton />
    );
  }
}