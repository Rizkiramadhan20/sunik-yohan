import React, { Fragment } from 'react';

import { fetchGalleryData } from "@/hooks/(pages)/gallery/utils/FetchGallery"

import Gallery from '@/hooks/(pages)/gallery/Gallery';

import GallerySkeleton from '@/hooks/(pages)/gallery/GallerySkeleton';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gallery | Sunik Yohan',
    description: 'Explore our collection of visual works and creative projects at Sunik Yohan',
    keywords: 'gallery, visual works, creative projects, Sunik Yohan',
    openGraph: {
        title: 'Gallery | Sunik Yohan',
        description: 'Explore our collection of visual works and creative projects at Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/gallery.png', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'Sunik Yohan Gallery',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Gallery | Sunik Yohan',
        description: 'Explore our collection of visual works and creative projects at Sunik Yohan',
        images: ['/public/gallery.png'], // Same image as OpenGraph
    },
};

export default async function Page() {
    try {
        const galleryData = await fetchGalleryData();

        return <Fragment>
            <Gallery galleryData={galleryData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching gallery data:', error);
        return (
            <GallerySkeleton />
        );
    }
}