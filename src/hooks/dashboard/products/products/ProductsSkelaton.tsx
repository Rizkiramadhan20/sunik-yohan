import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function ProductsSkelaton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((index) => (
                <Card key={index} className="overflow-hidden">
                    <CardHeader className="p-0">
                        <div className="aspect-[4/3] w-full overflow-hidden relative bg-gray-100">
                            <Skeleton className="h-full w-full" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-4">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/4" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-end gap-2">
                        <Skeleton className="h-9 w-9 rounded-md" />
                        <Skeleton className="h-9 w-9 rounded-md" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
