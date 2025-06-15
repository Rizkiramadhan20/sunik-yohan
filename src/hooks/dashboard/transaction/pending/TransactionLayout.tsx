"use client"

import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, updateDoc, doc } from 'firebase/firestore'
import { db } from '@/utils/firebase/transaction'
import { TransactionData } from '@/utils/firebase/transaction'
import { formatCurrency } from '@/utils/format/currency'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { LayoutDashboard, FileText, Info, Calendar, DollarSign, CreditCard, Package, Truck, MapPin, Clock, ShoppingBag, MessageSquare, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from 'next/image'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

// import TransactionSkeleton from './TransactionSkeleton'

export default function TransactionLayout() {
    const [transactions, setTransactions] = useState<TransactionData[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null)

    const updateTransactionStatus = async (docId: string, newStatus: string) => {
        try {
            const transactionRef = doc(db, 'transaction', docId);
            await updateDoc(transactionRef, {
                status: newStatus
            });
        } catch (error) {
            console.error('Error updating transaction status:', error);
        }
    };

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, 'transaction'), (querySnapshot) => {
            const transactionData = querySnapshot.docs.map(doc => ({
                ...doc.data(),
                docId: doc.id // Store the Firestore document ID
            })) as TransactionData[];
            setTransactions(transactionData);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching transactions:', error);
            setLoading(false);
        });

        // Cleanup subscription on unmount
        return () => unsubscribe();
    }, []);

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
                        <h1 className="text-3xl font-bold tracking-tight">Transaction</h1>
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
                                    Transaction
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
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
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                    {transactions.map((transaction) => (
                        <Card key={transaction.transactionId} className="w-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">Transaction #{transaction.transactionId}</CardTitle>
                                    <div className="flex gap-2">
                                        <Select
                                            value={transaction.status}
                                            onValueChange={(value) => {
                                                if (transaction.docId) {
                                                    updateTransactionStatus(transaction.docId, value);
                                                }
                                            }}
                                        >
                                            <SelectTrigger className="w-[120px]">
                                                <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="accepted">Accepted</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.paymentInfo.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            transaction.paymentInfo.status === 'success' ? 'bg-green-100 text-green-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {transaction.paymentInfo.status}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-6">
                                    {/* Customer Information */}
                                    <div className="flex items-start gap-4">
                                        <div className="relative w-16 h-16 rounded-full overflow-hidden">
                                            <Image
                                                src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                                alt={transaction.userInfo.displayName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium">{transaction.userInfo.displayName}</h3>
                                            <p className="text-sm text-gray-500">{transaction.userInfo.email}</p>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <DollarSign className="h-4 w-4" />
                                            Order Summary
                                        </h4>
                                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-sm">Items Total</span>
                                                <span className="text-sm">{formatCurrency(transaction.totalAmount - transaction.shippingCost)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-sm">Shipping Cost</span>
                                                <span className="text-sm">{formatCurrency(transaction.shippingCost)}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between">
                                                <span className="font-medium">Total</span>
                                                <span className="font-medium">{formatCurrency(transaction.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2">
                                            <Info className="h-4 w-4" />
                                            Additional Information
                                        </h4>
                                        <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                                            <p className="text-sm">
                                                <span className="font-medium">Order Date:</span> {new Date(transaction.orderDate).toLocaleString('id-ID')}
                                            </p>
                                            <p className="text-sm">
                                                <span className="font-medium">Expiration Time:</span> {new Date(transaction.expirationTime).toLocaleString('id-ID')}
                                            </p>
                                            {transaction.message && (
                                                <div className="flex items-start gap-2">
                                                    <MessageSquare className="h-4 w-4 mt-1 text-gray-500" />
                                                    <p className="text-sm text-gray-600">{transaction.message}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="border-t pt-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <ShoppingBag className="h-4 w-4" />
                                                        <span className="text-sm">Order Items</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-3xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Order Items</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        {transaction.items.map((item, index) => (
                                                            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                                                                <div className="relative w-20 h-20 rounded-md overflow-hidden">
                                                                    <Image
                                                                        src={item.thumbnail}
                                                                        alt={item.title}
                                                                        fill
                                                                        className="object-cover"
                                                                    />
                                                                </div>
                                                                <div className="flex-1">
                                                                    <h4 className="font-medium">{item.title}</h4>
                                                                    <p className="text-sm text-gray-500">
                                                                        Quantity: {item.quantity}
                                                                    </p>
                                                                    <p className="text-sm font-medium">
                                                                        Price: {formatCurrency(parseInt(item.price))}
                                                                    </p>
                                                                    <p className="text-sm font-medium">
                                                                        Subtotal: {formatCurrency(parseInt(item.price) * item.quantity)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <div className="border-t pt-4 mt-4">
                                                            <div className="flex justify-between items-center">
                                                                <span className="font-medium">Total Items</span>
                                                                <span className="font-medium">{formatCurrency(transaction.totalAmount - transaction.shippingCost)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="text-sm">Shipping</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Shipping Information</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                                                            <div>
                                                                <h4 className="font-medium mb-1">Recipient Details</h4>
                                                                <p className="text-sm">{transaction.shippingInfo.firstName}</p>
                                                                <p className="text-sm text-gray-500">{transaction.shippingInfo.email}</p>
                                                                <p className="text-sm text-gray-500">{transaction.shippingInfo.phone}</p>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium mb-1">Address</h4>
                                                                <p className="text-sm">{transaction.shippingInfo.streetName}</p>
                                                                <p className="text-sm">
                                                                    {transaction.shippingInfo.city}, {transaction.shippingInfo.province} {transaction.shippingInfo.postalCode}
                                                                </p>
                                                                <p className="text-sm text-gray-500">
                                                                    RT: {transaction.shippingInfo.rt} / RW: {transaction.shippingInfo.rw}
                                                                </p>
                                                                {transaction.shippingInfo.landmark && (
                                                                    <p className="text-sm text-gray-500">
                                                                        Landmark: {transaction.shippingInfo.landmark}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-medium mb-1">Additional Information</h4>
                                                                <p className="text-sm">
                                                                    Address Type: <span className="capitalize">{transaction.shippingInfo.addressType}</span>
                                                                </p>
                                                                {transaction.shippingInfo.district && (
                                                                    <p className="text-sm">
                                                                        Coordinates: {transaction.shippingInfo.district}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Truck className="h-4 w-4" />
                                                        <span className="text-sm">Delivery</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Delivery Status</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                            <div className="flex items-center justify-between mb-4">
                                                                <div>
                                                                    <h4 className="font-medium">Current Status</h4>
                                                                    <p className="text-sm text-gray-600">{transaction.deliveryStatus.status}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium">Estimated Delivery</h4>
                                                                    <p className="text-sm text-gray-600">
                                                                        {new Date(transaction.deliveryStatus.estimatedDelivery).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <h4 className="font-medium">Delivery History</h4>
                                                                <div className="space-y-3">
                                                                    {transaction.deliveryStatus.history.map((status, index) => (
                                                                        <div key={index} className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                                                                            <div className="flex-shrink-0">
                                                                                <Clock className="h-5 w-5 text-gray-500" />
                                                                            </div>
                                                                            <div className="flex-1">
                                                                                <div className="flex items-center justify-between">
                                                                                    <p className="font-medium">{status.status}</p>
                                                                                    <p className="text-xs text-gray-500">
                                                                                        {new Date(status.timestamp).toLocaleString('id-ID')}
                                                                                    </p>
                                                                                </div>
                                                                                <p className="text-sm text-gray-600 mt-1">{status.description}</p>
                                                                            </div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center justify-center gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <CreditCard className="h-4 w-4" />
                                                        <span className="text-sm">Payment</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-2xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Payment Information</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-4 bg-gray-50 rounded-lg">
                                                            <div className="space-y-2">
                                                                <p className="text-sm">
                                                                    <span className="font-medium">Payment Method:</span> {transaction.paymentInfo.method}
                                                                </p>
                                                                <p className="text-sm">
                                                                    <span className="font-medium">Status:</span> {transaction.paymentInfo.status}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {transaction.paymentInfo.proof && (
                                                            <div className="space-y-2">
                                                                <h4 className="font-medium">Payment Proof</h4>
                                                                <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                                                                    <Image
                                                                        src={transaction.paymentInfo.proof}
                                                                        alt="Payment Proof"
                                                                        fill
                                                                        className="object-contain"
                                                                    />
                                                                </div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </DialogContent>
                                            </Dialog>
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
