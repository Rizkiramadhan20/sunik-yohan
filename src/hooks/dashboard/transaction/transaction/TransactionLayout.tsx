"use client"

import React, { useEffect, useState } from 'react'

import { collection, onSnapshot, updateDoc, doc, getDoc } from 'firebase/firestore'

import { db as transactionDb } from '@/utils/firebase/transaction'

import { db as productDb } from '@/utils/firebase/Firebase'

import { formatPrice } from '@/base/helper/price'

import { toast } from 'sonner'

import { FaPrint } from "react-icons/fa"

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, FileText, Info } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Skeleton } from "@/components/ui/skeleton"

import Image from 'next/image'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import ShippingInfo from '@/hooks/dashboard/transaction/transaction/modal/ShippingInfo'

import OrderModal from '@/hooks/dashboard/transaction/transaction/modal/OrderModal'

import { usePrinter } from '@/hooks/dashboard/transaction/transaction/lib/Printer'

import { ExtendedTransactionData } from "@/types/Transaction"

export default function TransactionLayout() {
    const [transactions, setTransactions] = useState<ExtendedTransactionData[]>([])
    const [loading, setLoading] = useState(true)
    const { handlePrint, getButtonText } = usePrinter()

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string), (querySnapshot) => {
            const transactionData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                docId: doc.id
            })) as ExtendedTransactionData[];

            const sortedTransactions = transactionData.sort((a, b) =>
                new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
            );

            setTransactions(sortedTransactions);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateTransactionStatus = async (docId: string, newStatus: string) => {
        try {
            const transactionRef = doc(transactionDb, process.env.NEXT_PUBLIC_COLLECTIONS_TRANSACTION as string, docId);
            const transactionDoc = await getDoc(transactionRef);
            const transactionData = transactionDoc.data();

            // Update transaction status
            await updateDoc(transactionRef, {
                paymentInfo: {
                    ...transactionData?.paymentInfo,
                    status: newStatus
                }
            });

            // If status is accepted, update product stock
            if (newStatus === 'accepted' && transactionData) {
                // Update stock for each item in the transaction
                for (const item of transactionData.items) {
                    const productRef = doc(productDb, process.env.NEXT_PUBLIC_COLLECTIONS_PRODUCTS as string, item.id);
                    const productDoc = await getDoc(productRef);

                    if (productDoc.exists()) {
                        const productData = productDoc.data();
                        const currentStock = parseInt(productData.stock) || 0;
                        const newStock = Math.max(0, currentStock - item.quantity);

                        await updateDoc(productRef, {
                            stock: newStock.toString(),
                            sold: (parseInt(productData.sold) || 0) + item.quantity
                        });
                    }
                }
            }

            // Show success notification
            toast.success('Status transaksi berhasil diperbarui', {
                description: `Status diubah menjadi ${newStatus === 'pending' ? 'Menunggu' :
                    newStatus === 'accepted' ? 'Diterima' : 'Ditolak'}`
            });
        } catch (error) {
            console.error('Error updating transaction status:', error);
            // Show error notification
            toast.error('Gagal memperbarui status transaksi', {
                description: 'Terjadi kesalahan saat memperbarui status'
            });
        }
    };

    return (
        <section className="print:bg-white">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4 print:hidden">
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
                                d="M21 7L12 16L3 7"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3 17L12 8L21 17"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <h1 className="text-3xl font-bold tracking-tight">Transaksi</h1>
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
                                    halaman
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Info className="h-4 w-4" />
                                    Transaksi
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                <button
                    onClick={() => handlePrint()}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                >
                    <FaPrint /> {getButtonText()}
                </button>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 gap-4 mt-6">
                    {[1, 2, 3].map((i) => (
                        <Card key={i} className="w-full">
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4" />
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6 print:grid-cols-1 print:gap-6">
                    {transactions.map((transaction) => (
                        <Card key={transaction.transactionId} className="w-full hover:shadow-lg transition-shadow print:shadow-none print:border print:border-gray-200">
                            <CardHeader className="print:border-b print:border-gray-200">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Transaksi #{transaction.transactionId}</CardTitle>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium print:bg-transparent print:text-black ${transaction.paymentInfo?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                        transaction.paymentInfo?.status === 'accepted' ? 'bg-green-100 text-green-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {transaction.paymentInfo?.status === 'pending' ? 'Menunggu' :
                                            transaction.paymentInfo?.status === 'accepted' ? 'Berhasil' :
                                                'Gagal'}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Customer Information */}
                                    <div className="flex items-start gap-4 print:border-b print:border-gray-200 print:pb-4">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden print:w-20 print:h-20">
                                            <Image
                                                src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                                alt={transaction.userInfo.displayName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{transaction.userInfo.displayName}</h3>
                                            <p className="text-sm text-gray-500 print:text-gray-700">{transaction.userInfo.email}</p>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-2 print:border-b print:border-gray-200 print:pb-4">
                                        <h4 className="font-medium">Ringkasan Pesanan</h4>
                                        <div className="p-3 bg-gray-50 rounded-lg space-y-2 print:bg-transparent print:p-0">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Total Item</span>
                                                <span className="text-sm">{formatPrice((transaction.totalAmount - transaction.shippingCost).toString())}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Biaya Pengiriman</span>
                                                <span className="text-sm">{formatPrice(transaction.shippingCost.toString())}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between print:border-gray-200">
                                                <span className="font-medium">Total</span>
                                                <span className="font-medium">{formatPrice(transaction.totalAmount.toString())}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Transaction Status */}
                                    <div className="space-y-2 print:border-b print:border-gray-200 print:pb-4">
                                        <h4 className="font-medium">Status Transaksi</h4>
                                        <div className="p-3 bg-gray-50 rounded-lg print:bg-transparent print:p-0">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium">Status:</span>
                                                <Select
                                                    value={transaction.paymentInfo?.status || 'pending'}
                                                    onValueChange={(value) => {
                                                        if (transaction.docId) {
                                                            updateTransactionStatus(transaction.docId, value);
                                                        }
                                                    }}
                                                >
                                                    <SelectTrigger className="w-[120px] print:hidden">
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="pending">Menunggu</SelectItem>
                                                        <SelectItem value="accepted">Diterima</SelectItem>
                                                        <SelectItem value="rejected">Ditolak</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <span className="hidden print:inline text-sm">
                                                    {transaction.paymentInfo?.status === 'pending' ? 'Menunggu' :
                                                        transaction.paymentInfo?.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="border-t pt-4 print:hidden">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <OrderModal transaction={{
                                                items: transaction.items.map(item => ({
                                                    thumbnail: item.thumbnail,
                                                    title: item.title,
                                                    quantity: item.quantity,
                                                    price: parseFloat(item.price)
                                                })),
                                                totalAmount: transaction.totalAmount,
                                                shippingCost: transaction.shippingCost
                                            }} />

                                            <ShippingInfo shippingInfo={transaction.shippingInfo} />

                                            <button
                                                onClick={() => handlePrint({
                                                    ...transaction,
                                                    userId: transaction.userInfo.email,
                                                    paymentInfo: {
                                                        method: transaction.paymentInfo?.method || 'shopeepay',
                                                        proof: transaction.paymentInfo?.proof || '',
                                                        status: transaction.paymentInfo?.status || 'pending'
                                                    },
                                                    deliveryStatus: {
                                                        status: transaction.deliveryStatus?.status || 'pending',
                                                        history: transaction.deliveryStatus?.history || [],
                                                        estimatedDelivery: transaction.deliveryStatus?.estimatedDelivery || new Date().toISOString()
                                                    }
                                                })}
                                                className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                                            >
                                                <FaPrint className="h-4 w-4" />
                                                <span className="text-sm">Print</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </section>
    )
}
