"use client"

import React, { useState, useEffect } from 'react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "@/components/ui/input"

import { Label } from "@/components/ui/label"

import { Button } from "@/components/ui/button"

import { useForm } from "react-hook-form"

import { zodResolver } from "@hookform/resolvers/zod"

import * as z from "zod"

import { toast } from "sonner"

import dynamic from 'next/dynamic'

import { Loader2, MapPin, Home, Building2, Trash2, Edit2, Star } from "lucide-react"

import { useAuth } from "@/utils/context/AuthContext"
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore"
import { db } from "@/utils/firebase/Firebase"

// Dynamically import the map component to avoid SSR issues
const MapWithSearch = dynamic(() => import('@/components/MapWithSearch'), {
    ssr: false,
    loading: () => (
        <div className="h-[400px] w-full bg-gray-100 rounded-lg flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
    )
})

// Form validation schema
const addressSchema = z.object({
    fullName: z.string().min(3, "Nama harus minimal 3 karakter"),
    phone: z.string().min(10, "Nomor telepon harus minimal 10 digit"),
    streetName: z.string().min(10, "Nama jalan harus minimal 10 karakter"),
    landmark: z.string().min(3, "Patokan harus minimal 3 karakter"),
    addressType: z.enum(["home", "office"], {
        required_error: "Tipe alamat harus dipilih",
    }),
    province: z.string().min(1, "Provinsi harus dipilih"),
    city: z.string().min(1, "Kota harus dipilih"),
    postalCode: z.string().min(5, "Kode pos harus minimal 5 digit"),
})

type AddressFormData = z.infer<typeof addressSchema>

interface LocationData {
    lat: number;
    lng: number;
    address: string;
    province: string;
    city: string;
    postalCode: string;
}

interface SavedAddress {
    fullName: string;
    phone: string;
    streetName: string;
    landmark: string;
    addressType: "home" | "office";
    province: string;
    city: string;
    postalCode: string;
    location: LocationData;
    createdAt: string;
    isPrimary?: boolean;
}

export default function AddressPage() {
    const { user } = useAuth();
    const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMapLoading, setIsMapLoading] = useState(true);
    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
        reset
    } = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            fullName: "",
            phone: "",
            streetName: "",
            landmark: "",
            addressType: "home",
            province: "",
            city: "",
            postalCode: "",
        }
    });

    useEffect(() => {
        const fetchAddresses = async () => {
            if (!user) return;

            try {
                const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();

                if (userData?.addresses) {
                    setSavedAddresses(userData.addresses);
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
                toast.error("Gagal memuat alamat");
            } finally {
                setIsLoading(false);
            }
        };

        fetchAddresses();
    }, [user]);

    const handleLocationSelect = (location: LocationData) => {
        setSelectedLocation(location);
        setValue("province", location.province);
        setValue("city", location.city);
        setValue("postalCode", location.postalCode);
    };

    const resetForm = () => {
        setSelectedLocation(null);
        reset();
    };

    const handleSetPrimaryAddress = async (index: number) => {
        if (!user) return;

        try {
            const updatedAddresses = savedAddresses.map((address, i) => ({
                ...address,
                isPrimary: i === index
            }));

            const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
            await updateDoc(userDocRef, {
                addresses: updatedAddresses
            });

            setSavedAddresses(updatedAddresses);
            toast.success("Alamat utama berhasil diubah");
        } catch (error) {
            console.error("Error setting primary address:", error);
            toast.error("Gagal mengubah alamat utama");
        }
    };

    const onSubmit = async (data: AddressFormData) => {
        if (!selectedLocation) {
            toast.error("Silakan pilih lokasi di peta");
            return;
        }

        if (!user) {
            toast.error("Anda harus login terlebih dahulu");
            return;
        }

        setIsSubmitting(true);
        try {
            const addressData = {
                ...data,
                location: selectedLocation,
                createdAt: new Date().toISOString(),
                isPrimary: savedAddresses.length === 0 // Set as primary if it's the first address
            };

            // Update the user's document in Firestore
            const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
            await updateDoc(userDocRef, {
                addresses: arrayUnion(addressData)
            });

            // Update local state
            setSavedAddresses(prev => [...prev, addressData]);

            toast.success("Alamat berhasil disimpan");
            resetForm();
        } catch (error) {
            toast.error("Gagal menyimpan alamat");
            console.error("Error saving address:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteAddress = async (index: number) => {
        if (!user) return;

        try {
            const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
            const updatedAddresses = savedAddresses.filter((_, i) => i !== index);

            await updateDoc(userDocRef, {
                addresses: updatedAddresses
            });

            setSavedAddresses(updatedAddresses);
            toast.success("Alamat berhasil dihapus");
        } catch (error) {
            console.error("Error deleting address:", error);
            toast.error("Gagal menghapus alamat");
        }
    };

    const handleEditAddress = (address: SavedAddress) => {
        setValue("fullName", address.fullName);
        setValue("phone", address.phone);
        setValue("streetName", address.streetName);
        setValue("landmark", address.landmark);
        setValue("addressType", address.addressType);
        setValue("province", address.province);
        setValue("city", address.city);
        setValue("postalCode", address.postalCode);
        setSelectedLocation(address.location);
    };

    // Sort addresses to show primary address first
    const sortedAddresses = [...savedAddresses].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return 0;
    });

    return (
        <section>
            <div className="space-y-8">
                {savedAddresses.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Alamat Tersimpan</CardTitle>
                            <CardDescription>
                                Daftar alamat yang telah Anda simpan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {sortedAddresses.map((address, index) => (
                                    <div key={index} className="border rounded-lg p-4 space-y-2">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {address.addressType === "home" ? (
                                                    <Home className="h-5 w-5 text-blue-500" />
                                                ) : (
                                                    <Building2 className="h-5 w-5 text-blue-500" />
                                                )}
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-medium">{address.fullName}</h3>
                                                        {address.isPrimary && (
                                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                                <Star className="h-3 w-3 mr-1" />
                                                                Alamat Utama
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">{address.phone}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                {!address.isPrimary && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        onClick={() => handleSetPrimaryAddress(index)}
                                                        title="Jadikan Alamat Utama"
                                                    >
                                                        <Star className="h-4 w-4 text-yellow-500" />
                                                    </Button>
                                                )}
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleEditAddress(address)}
                                                >
                                                    <Edit2 className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDeleteAddress(index)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                                            <div className="text-sm">
                                                <p>{address.streetName}</p>
                                                <p>{address.landmark}</p>
                                                <p>{address.city}, {address.province} {address.postalCode}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle>Alamat Pengiriman</CardTitle>
                        <CardDescription>
                            Tambahkan atau edit alamat pengiriman Anda
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Nama Lengkap</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="Masukkan nama lengkap"
                                        {...register("fullName")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.fullName && (
                                        <p className="text-sm text-red-500">{errors.fullName.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Nomor Telepon</Label>
                                    <Input
                                        id="phone"
                                        placeholder="Masukkan nomor telepon"
                                        {...register("phone")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.phone && (
                                        <p className="text-sm text-red-500">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Pilih Lokasi</Label>
                                <div className="h-[400px] w-full rounded-lg overflow-hidden relative">
                                    <MapWithSearch onLocationSelect={handleLocationSelect} />
                                    {isMapLoading && (
                                        <div className="absolute inset-0 bg-gray-100/50 flex items-center justify-center">
                                            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                        </div>
                                    )}
                                </div>
                                {!selectedLocation && (
                                    <p className="text-sm text-red-500">Silakan pilih lokasi di peta</p>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="province">Provinsi</Label>
                                    <Input
                                        id="province"
                                        placeholder="Masukkan provinsi"
                                        {...register("province")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.province && (
                                        <p className="text-sm text-red-500">{errors.province.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">Kota/Kabupaten</Label>
                                    <Input
                                        id="city"
                                        placeholder="Masukkan kota/kabupaten"
                                        {...register("city")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.city && (
                                        <p className="text-sm text-red-500">{errors.city.message}</p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Kode Pos</Label>
                                    <Input
                                        id="postalCode"
                                        placeholder="Masukkan kode pos"
                                        {...register("postalCode")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.postalCode && (
                                        <p className="text-sm text-red-500">{errors.postalCode.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                                <div className="space-y-2">
                                    <Label htmlFor="streetName">Nama Jalan</Label>
                                    <textarea
                                        id="streetName"
                                        className="w-full min-h-[100px] p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                        placeholder="Masukkan nama jalan,gedung,no rumah"
                                        {...register("streetName")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.streetName && (
                                        <p className="text-sm text-red-500">{errors.streetName.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="landmark">Patokan</Label>
                                    <Input
                                        id="landmark"
                                        placeholder="Contoh: Sebelah warung makan, Depan minimarket, dll"
                                        {...register("landmark")}
                                        disabled={isSubmitting}
                                    />
                                    {errors.landmark && (
                                        <p className="text-sm text-red-500">{errors.landmark.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label>Tipe Alamat</Label>
                                    <div className="flex gap-4">
                                        <Button
                                            type="button"
                                            variant={watch("addressType") === "home" ? "default" : "outline"}
                                            onClick={() => setValue("addressType", "home")}
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            Rumah
                                        </Button>
                                        <Button
                                            type="button"
                                            variant={watch("addressType") === "office" ? "default" : "outline"}
                                            onClick={() => setValue("addressType", "office")}
                                            disabled={isSubmitting}
                                            className="flex-1"
                                        >
                                            Kantor
                                        </Button>
                                    </div>
                                    {errors.addressType && (
                                        <p className="text-sm text-red-500">{errors.addressType.message}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end space-x-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={resetForm}
                                    disabled={isSubmitting}
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Menyimpan...
                                        </>
                                    ) : (
                                        "Simpan Alamat"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
