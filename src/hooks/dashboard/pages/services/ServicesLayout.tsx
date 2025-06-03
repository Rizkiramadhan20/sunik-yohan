import React from 'react'

import { Button } from "@/components/ui/button"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { Plus, LayoutDashboard, FileText, Settings } from "lucide-react"

export default function ServiceLayout() {
    return (
        <section>
            <div className="flex items-center justify-between border border-gray-100 p-4 rounded-2xl">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <Settings className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold tracking-tight">Services</h1>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 capitalize">
                                    <LayoutDashboard className="h-4 w-4" />
                                    dashboard
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/pages" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    pages
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Settings className="h-4 w-4" />
                                    Services
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <Button className="transition-all duration-200 hover:scale-105">
                    <Plus className="mr-2 h-4 w-4" />
                    Create New
                </Button>
            </div>
        </section>
    )
}
