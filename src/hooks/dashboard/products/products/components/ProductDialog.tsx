import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";

interface ProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    initialData?: {
        id?: string;
        title: string;
        slug: string;
        price: string;
        shopeUrl: string;
        thumbnail: string;
        category: string;
        size: string;
        content: string;
    };
    onSubmit: (data: any, imageFile?: File) => void;
    isLoading?: boolean;
}

export function ProductDialog({
    open,
    onOpenChange,
    initialData,
    onSubmit,
    isLoading,
}: ProductDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-4xl max-h-[95vh] md:max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-xl shadow-2xl border-0">
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Edit Product" : "Create New Product"}
                    </DialogTitle>
                </DialogHeader>

                <ProductForm
                    initialData={initialData}
                    onSubmit={onSubmit}
                    isLoading={isLoading}
                />
            </DialogContent>
        </Dialog>
    );
} 