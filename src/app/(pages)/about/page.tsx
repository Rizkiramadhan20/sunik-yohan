import React, { Fragment } from 'react';

import { fetchAboutContents, fetchTestimonialsContents, fetchAppsContents } from "@/hooks/(pages)/about/utils/FetchAbout"

import About from '@/hooks/(pages)/about/About';

import AboutSkeleton from '@/hooks/(pages)/about/AboutSkelaton';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us | Sunik Yohan',
    description: 'Learn more about Sunik Yohan, our mission, and our journey',
    keywords: 'about, company, Sunik Yohan, mission, vision',
    openGraph: {
        title: 'About Us | Sunik Yohan',
        description: 'Learn more about Sunik Yohan, our mission, and our journey',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/about.png', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'About Sunik Yohan',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'About Us | Sunik Yohan',
        description: 'Learn more about Sunik Yohan, our mission, and our journey',
        images: ['/public/about.png'], // Same image as OpenGraph
    },
};

export default async function Page() {
    try {
        const aboutData = await fetchAboutContents();
        const testimonialsData = await fetchTestimonialsContents();
        const appsData = await fetchAppsContents();

        return <Fragment>
            <About aboutData={aboutData} testimonialsData={testimonialsData} appsData={appsData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching products data:', error);
        return (
            <AboutSkeleton />
        );
    }
}