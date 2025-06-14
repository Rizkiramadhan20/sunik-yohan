"use client"

import React from 'react'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, FileText, Info, ExternalLink, Trash2 } from "lucide-react"

import { CreateModal } from './modal/CreateModal'

import { EditModal } from './modal/EditModal'

import { db } from '@/utils/firebase/Firebase'

import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'

import imagekit from '@/utils/imagekit/imagekit'

import { Card, CardDescription, CardTitle } from "@/components/ui/card"

import { Button } from "@/components/ui/button"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { toast } from "sonner"

import AboutSkeleton from './AppsSkeleton'

import { AppsProps } from "@/hooks/dashboard/pages/apps/types/about"

export default function AboutLayout() {
    const [items, setItems] = React.useState<AppsProps[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const fetchItems = async () => {
        try {
            const q = query(
                collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_APPS as string),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const fetchedItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as AppsProps[];
            setItems(fetchedItems);
        } catch (error) {
            console.error("Error fetching items:", error);
            toast.error("Failed to fetch items");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchItems();
    }, []);

    const handleImageUpload = async (file: File) => {
        try {
            const reader = new FileReader();

            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });

            const base64 = await base64Promise;
            const result = await imagekit.upload({
                file: base64,
                fileName: `apps-${Date.now()}`,
                folder: "/apps",
            });

            return result.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleCreate = async (data: {
        title: string;
        text: string;
        description: string;
        image: File;
        button: {
            label: string;
            href: string;
        }
    }) => {
        try {
            // Upload image to ImageKit
            const imageUrl = await handleImageUpload(data.image);

            // Save data to Firestore
            const docRef = await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_APPS as string), {
                title: data.title,
                text: data.text,
                description: data.description,
                imageUrl: imageUrl,
                button: data.button,
                createdAt: new Date().toISOString()
            });
            console.log("Document written with ID: ", docRef.id);
            toast.success("Item created successfully");

            // Refresh the items list
            await fetchItems();
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Failed to create item");
        }
    };

    const handleUpdate = async (data: {
        id: string;
        title: string;
        text: string;
        description: string;
        image?: File;
        button: {
            label: string;
            href: string;
        }
    }) => {
        try {
            let imageUrl = items.find(item => item.id === data.id)?.imageUrl;

            // If new image is provided, upload it
            if (data.image) {
                imageUrl = await handleImageUpload(data.image);
            }

            // Update data in Firestore
            await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_APPS as string, data.id), {
                title: data.title,
                text: data.text,
                description: data.description,
                imageUrl: imageUrl,
                button: data.button,
            });

            toast.success("Item updated successfully");
            await fetchItems();
        } catch (error) {
            console.error("Error updating item:", error);
            toast.error("Failed to update item");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_APPS as string, id));
            toast.success("Item deleted successfully");
            await fetchItems();
        } catch (error) {
            console.error("Error deleting item:", error);
            toast.error("Failed to delete item");
        } finally {
            setDeleteDialogOpen(false);
            setItemToDelete(null);
            setIsDeleting(false);
        }
    };

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <svg
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary"
                        >
                            <path
                                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 16V12"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M12 8H12.01"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight">Apps</h1>
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
                                    <Info className="h-4 w-4" />
                                    apps
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <CreateModal onSubmit={handleCreate} />
            </div>

            {isLoading ? (
                <AboutSkeleton />
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No items found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by creating a new item using the button above.
                    </p>
                </div>
            ) : (
                <div className="mt-6 space-y-6">
                    {items.map((item) => (
                        <Card key={item.id} className="overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300">
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="aspect-video relative group overflow-hidden">
                                    <img
                                        src={item.imageUrl}
                                        alt={item.title}
                                        className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2">
                                        <EditModal item={item} onSubmit={handleUpdate} />
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            className="bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                                            onClick={() => {
                                                setItemToDelete(item.id);
                                                setDeleteDialogOpen(true);
                                            }}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-between p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-white to-gray-50">
                                    <div className="space-y-3 sm:space-y-4">
                                        <CardTitle className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                                            {item.title}
                                        </CardTitle>
                                        <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                                            {item.text}
                                        </div>
                                        <CardDescription className="text-sm sm:text-base text-gray-600 leading-relaxed">
                                            {item.description}
                                        </CardDescription>
                                    </div>
                                    <Button
                                        asChild
                                        variant="outline"
                                        className="w-full mt-4 sm:mt-6 border-2 border-gray-200 hover:border-primary hover:bg-primary/5 transition-all duration-300"
                                    >
                                        <a href={item.button.href} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 py-4 sm:py-6">
                                            <span className="font-medium">{item.button.label}</span>
                                            <ExternalLink className="h-4 w-4" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => itemToDelete && handleDelete(itemToDelete)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 text-white"
                            disabled={isDeleting}
                        >
                            {isDeleting ? (
                                <div className="flex items-center gap-2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Deleting...
                                </div>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </section>
    )
}
