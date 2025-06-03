import React from 'react';

import { fetchHomeContents } from '@/components/content/home/utils/FetchHome';

import HomeContent from '@/components/content/home/Home';

import HomeSkeleton from '@/components/content/home/HomeSkeleton';

export default async function Home() {
  try {
    const homeData = await fetchHomeContents();
    return <HomeContent homeData={homeData} />;
  } catch (error) {
    console.error('Error fetching home data:', error);
    return (
      <HomeSkeleton />
    );
  }
}