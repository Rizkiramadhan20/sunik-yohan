import React, { Fragment } from 'react';

import { fetchHomeContents } from '@/components/content/home/utils/FetchHome';

import { fetchAboutContents } from "@/components/content/about/utils/FetchAbout"

import Home from '@/components/content/home/Home';

import About from "@/components/content/about/About"

import HomeSkeleton from '@/components/content/home/HomeSkeleton';

import Daily from '@/components/content/daily/Daily';

import Services from '@/components/content/services/Services';

export default async function Page() {
  try {
    const homeData = await fetchHomeContents();
    const aboutContentData = await fetchAboutContents();
    return <Fragment>
      <Home homeData={homeData} />
      <About aboutContentData={aboutContentData} />
      <Services />
      <Daily />
    </Fragment>;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <HomeSkeleton />
    );
  }
}