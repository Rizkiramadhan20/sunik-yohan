import React, { Fragment } from 'react';

import { fetchBlogData } from "@/components/content/blog/utils/FetchBlog"

import Blog from '@/hooks/(pages)/blog/BlogLayout';

import BlogSkeleton from '@/hooks/(pages)/blog/BlogSkeleton';

import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Blog | Sunik Yohan',
    description: 'Read our latest articles and insights at Sunik Yohan',
    keywords: 'blog, articles, insights, Sunik Yohan',
    openGraph: {
        title: 'Blog | Sunik Yohan',
        description: 'Read our latest articles and insights at Sunik Yohan',
        type: 'website',
        locale: 'id_ID',
        siteName: 'Sunik Yohan',
        images: [
            {
                url: '/public/blog.png', // Make sure to add this image to your public folder
                width: 1200,
                height: 630,
                alt: 'Sunik Yohan Blog',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Blog | Sunik Yohan',
        description: 'Read our latest articles and insights at Sunik Yohan',
        images: ['/public/blog.png'], // Same image as OpenGraph
    },
};

export default async function Page() {
    try {
        const blogData = await fetchBlogData();

        return <Fragment>
            <Blog blogData={blogData} />
        </Fragment>;
    } catch (error) {
        console.error('Error fetching blog data:', error);
        return (
            <BlogSkeleton />
        );
    }
}