import React from 'react'
import { homeProps } from '@/components/content/home/types/home'

export default function Home({ homeData }: { homeData: homeProps[] }) {
    console.log(homeData)

    return (
        <section className='flex flex-col items-center justify-center min-h-screen'>
            <div className="container px-4">
                {
                    homeData.map((Item, idx) => {
                        return (
                            <div key={idx}>
                                <h1>{Item.title}</h1>
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}
