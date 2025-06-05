import React, { Fragment } from 'react';

import { fetchHomeData } from '@/components/content/home/utils/FetchHome';

import { fetchServicesData } from "@/components/content/services/utils/FetchServices"

import Home from '@/components/content/home/Home';

import HomeSkeleton from '@/components/content/home/HomeSkeleton';

import Daily from '@/components/content/daily/Daily';

import Services from '@/components/content/services/Services';

export default async function Page() {
  try {
    const homeData = await fetchHomeData();
    const serviceData = await fetchServicesData();
    return <Fragment>
      <Home homeData={homeData} />
      <Services serviceData={serviceData} />
      <Daily />
    </Fragment>;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <HomeSkeleton />
    );
  }
}