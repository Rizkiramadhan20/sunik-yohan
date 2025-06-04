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

import { LayoutDashboard, FileText, Home, Trash2, Pencil } from "lucide-react"

import { CreateModal } from './modal/CreateModal'
import { EditModal } from './modal/EditModal'

import { db } from '@/utils/firebase/Firebase'
import { collection, addDoc, getDocs, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore'
import imagekit from '@/utils/imagekit/imagekit'
import { compressImage } from '@/utils/imagekit/compressImage'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

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
import HomeSkelaton from '@/hooks/dashboard/pages/services/ServicesSkelaton'
import { servicesPropes } from "@/hooks/dashboard/pages/services/types/services"

export default function HomeLayout() {
    const [items, setItems] = React.useState<servicesPropes[]>([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
    const [itemToDelete, setItemToDelete] = React.useState<string | null>(null);
    const [isDeleting, setIsDeleting] = React.useState(false);

    const fetchItems = async () => {
        try {
            const q = query(
                collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const fetchedItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as servicesPropes[];
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
            const compressedFile = await compressImage(file);
            const reader = new FileReader();

            const base64Promise = new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(compressedFile);
            });

            const base64 = await base64Promise;
            const result = await imagekit.upload({
                file: base64,
                fileName: `services-${Date.now()}`,
                folder: "/services",
            });

            return result.url;
        } catch (error) {
            console.error("Error uploading image:", error);
            throw new Error("Failed to upload image");
        }
    };

    const handleCreate = async (data: {
        title: string;
        description: string;
        image: File;
    }) => {
        try {
            // Upload image to ImageKit
            const imageUrl = await handleImageUpload(data.image);

            // Save data to Firestore
            const docRef = await addDoc(collection(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string), {
                title: data.title,
                description: data.description,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            });
            console.log("Document written with ID: ", docRef.id);
            toast.success("Service created successfully");

            // Refresh the items list
            await fetchItems();
        } catch (e) {
            console.error("Error adding document: ", e);
            toast.error("Failed to create service");
        }
    };

    const handleUpdate = async (data: {
        id: string;
        title: string;
        description: string;
        image?: File;
    }) => {
        try {
            let imageUrl = items.find(item => item.id === data.id)?.imageUrl;

            // If new image is provided, upload it
            if (data.image) {
                imageUrl = await handleImageUpload(data.image);
            }

            // Update data in Firestore
            await updateDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string, data.id), {
                title: data.title,
                description: data.description,
                imageUrl: imageUrl,
            });

            toast.success("Service updated successfully");
            await fetchItems();
        } catch (error) {
            console.error("Error updating service:", error);
            toast.error("Failed to update service");
        }
    };

    const handleDelete = async (id: string) => {
        try {
            setIsDeleting(true);
            await deleteDoc(doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_SERVICES as string, id));
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
                                d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M9 22V12H15V22"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Services</h1>
                    </div>

                    <Breadcrumb>
                        <BreadcrumbList className="flex flex-wrap">
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard" className="flex items-center gap-1 capitalize">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span className="hidden sm:inline">dashboard</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/dashboard/pages" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    <span className="hidden sm:inline">pages</span>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Home className="h-4 w-4" />
                                    <span className="hidden sm:inline">services</span>
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <div className="mt-4 sm:mt-0">
                    <CreateModal onSubmit={handleCreate} />
                </div>
            </div>

            {isLoading ? (
                <HomeSkelaton />
            ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                    <div className="rounded-full bg-muted p-3 mb-4">
                        <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold">No services found</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                        Get started by creating a new service using the button above.
                    </p>
                </div>
            ) : (
                <div className="mt-6">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Image</TableHead>
                                <TableHead className="min-w-[150px]">Title</TableHead>
                                <TableHead className="min-w-[200px]">Description</TableHead>
                                <TableHead className="w-[100px] text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="w-[100px]">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                                        />
                                    </TableCell>
                                    <TableCell className="min-w-[150px] font-medium">
                                        <div className="truncate">{item.title}</div>
                                    </TableCell>
                                    <TableCell className="min-w-[200px]">
                                        <div className="line-clamp-2">{item.description}</div>
                                    </TableCell>
                                    <TableCell className="w-[100px] text-right">
                                        <div className="flex justify-end gap-2">
                                            <EditModal item={item} onSubmit={handleUpdate} />
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => {
                                                    setItemToDelete(item.id);
                                                    setDeleteDialogOpen(true);
                                                }}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the service.
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
