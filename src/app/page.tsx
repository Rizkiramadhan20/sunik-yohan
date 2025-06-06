import React, { Fragment } from 'react';

import { fetchHomeData } from '@/components/content/home/utils/FetchHome';

import { fetchServicesData } from "@/components/content/services/utils/FetchServices"

import Home from '@/components/content/home/Home';

import Services from '@/components/content/services/Services';

import Menu from "@/components/content/menu/Menu"

import Daily from '@/components/content/daily/Daily';

import HomeSkeleton from '@/components/content/home/HomeSkeleton';

export default async function Page() {
  try {
    const homeData = await fetchHomeData();
    const serviceData = await fetchServicesData();
    return <Fragment>
      <Home homeData={homeData} />
      <Services serviceData={serviceData} />
      <Menu />
      <Daily />
    </Fragment>;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <HomeSkeleton />
    );
  }
}