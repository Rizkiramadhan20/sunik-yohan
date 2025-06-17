'use client';

import React from 'react'

import { Chart } from '@/components/ui/chart'

export default function DashboardLayout() {
    return (
        <section>
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
            <div className="grid gap-6">
                <Chart />
            </div>
        </section>
    )
}
