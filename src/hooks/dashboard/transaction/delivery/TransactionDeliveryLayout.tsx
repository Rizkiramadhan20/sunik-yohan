"use client"

import React from 'react'

import { formatCurrency } from '@/utils/format/currency'

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

import { LayoutDashboard, FileText, Info, DollarSign, Package, Truck, MapPin, Clock, ShoppingBag } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

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

import TransactionPendingSkeleton from '@/hooks/dashboard/transaction/pending/TransactionPendingSkelaton'

import { useManagementTransactionDelivery } from './utils/UseManagementTransactionDelivery'

export default function TransactionLayout() {
    const { transactions, loading, updateTransactionStatus, deliveryStages } = useManagementTransactionDelivery();

    return (
        <section>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border border-gray-100 p-4 rounded-2xl gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 pb-4">
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-primary sm:w-8 sm:h-8"
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
                        <h1 className="text-3xl font-bold tracking-tight">Transaction Delivery</h1>
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
                                <BreadcrumbLink href="/dashboard/transaction/transaction" className="flex items-center gap-1 capitalize">
                                    <FileText className="h-4 w-4" />
                                    Transaction
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="flex items-center gap-1 capitalize">
                                    <Info className="h-4 w-4" />
                                    Transaction Delivery
                                </BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>

            {loading ? (
                <TransactionPendingSkeleton />
            ) : transactions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 px-4">
                    <div className="w-64 h-64 mb-6">
                        <svg
                            viewBox="0 0 200 200"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-full h-full text-gray-300"
                        >
                            <path
                                d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 140C122.091 140 140 122.091 140 100C140 77.9086 122.091 60 100 60C77.9086 60 60 77.9086 60 100C60 122.091 77.9086 140 100 140Z"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 100V100.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 60V60.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M100 140V140.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M60 100H60.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M140 100H140.01"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Tidak Ada Transaksi Pengiriman</h3>
                    <p className="text-gray-500 text-center max-w-md">
                        Saat ini tidak ada transaksi pengiriman untuk ditampilkan. Transaksi baru akan muncul di sini ketika dibuat.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                    {transactions.map((transaction) => (
                        <Card key={transaction.transactionId} className="w-full hover:shadow-lg transition-shadow">
                            <CardHeader>
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <CardTitle className="text-base sm:text-lg">Transaction #{transaction.transactionId}</CardTitle>
                                    <div className="flex gap-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${transaction.deliveryStatus?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                            transaction.deliveryStatus?.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                                transaction.deliveryStatus?.status === 'delivering' ? 'bg-purple-100 text-purple-800' :
                                                    'bg-green-100 text-green-800'
                                            }`}>
                                            {transaction.deliveryStatus?.status || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4 sm:space-y-6">
                                    {/* Customer Information */}
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="relative aspect-square w-12 sm:w-16 rounded-full overflow-hidden">
                                            <Image
                                                src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                                alt={transaction.userInfo.displayName}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-sm sm:text-base">{transaction.userInfo.displayName}</h3>
                                            <p className="text-xs sm:text-sm text-gray-500">{transaction.userInfo.email}</p>
                                        </div>
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-2">
                                        <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                                            <DollarSign className="h-4 w-4" />
                                            Order Summary
                                        </h4>
                                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg space-y-2">
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span>Items Total</span>
                                                <span>{formatCurrency(transaction.totalAmount - transaction.shippingCost)}</span>
                                            </div>
                                            <div className="flex justify-between text-xs sm:text-sm">
                                                <span>Shipping Cost</span>
                                                <span>{formatCurrency(transaction.shippingCost)}</span>
                                            </div>
                                            <div className="border-t pt-2 flex justify-between text-xs sm:text-sm">
                                                <span className="font-medium">Total</span>
                                                <span className="font-medium">{formatCurrency(transaction.totalAmount)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Additional Information */}
                                    <div className="space-y-2 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                        <h4 className="font-medium flex items-center gap-2 text-sm sm:text-base">
                                            <Info className="h-4 w-4" />
                                            Delivery Status
                                        </h4>

                                        <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                            <Select
                                                value={transaction.deliveryStatus?.status || 'pending'}
                                                onValueChange={(value) => {
                                                    if (transaction.docId) {
                                                        updateTransactionStatus(transaction.docId, value);
                                                    }
                                                }}
                                                disabled={transaction.deliveryStatus?.status === 'completed'}
                                            >
                                                <SelectTrigger className={`w-full sm:w-[120px] ${transaction.deliveryStatus?.status === 'completed' ? 'cursor-not-allowed' : ''}`}>
                                                    <SelectValue placeholder="Status" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {deliveryStages.map((stage) => (
                                                        <SelectItem key={stage.id} value={stage.id}>
                                                            {stage.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="border-t pt-4">
                                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <ShoppingBag className="h-4 w-4" />
                                                        <span className="text-xs sm:text-sm">Order Items</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-[95vw] sm:max-w-3xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Order Items</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4 sm:space-y-6">
                                                        <div className="grid gap-3 sm:gap-4">
                                                            {transaction.items.map((item, index) => (
                                                                <div key={index} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100/50 transition-colors">
                                                                    <div className="relative aspect-square w-full sm:w-24 rounded-lg overflow-hidden border border-gray-200">
                                                                        <Image
                                                                            src={item.thumbnail}
                                                                            alt={item.title}
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                    </div>
                                                                    <div className="flex-1 space-y-2">
                                                                        <div>
                                                                            <h4 className="font-semibold text-base sm:text-lg">{item.title}</h4>
                                                                            <p className="text-xs sm:text-sm text-gray-500">
                                                                                Quantity: {item.quantity}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex flex-col gap-1">
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-xs sm:text-sm text-gray-600">Price per item</span>
                                                                                <span className="text-xs sm:text-sm font-medium">{formatCurrency(item.price * 1000)}</span>
                                                                            </div>
                                                                            <div className="flex justify-between items-center">
                                                                                <span className="text-xs sm:text-sm text-gray-600">Subtotal</span>
                                                                                <span className="text-xs sm:text-sm font-semibold">{formatCurrency(item.price * item.quantity * 1000)}</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="border-t pt-4 mt-4">
                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                                        <div className="p-2 bg-blue-50 rounded-lg">
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600 sm:w-5 sm:h-5">
                                                                                <path d="M20 7L12 3L4 7M20 7L12 11M20 7V17L12 21M12 11L4 7M12 11V21M4 7V17L12 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="font-semibold text-sm sm:text-lg">Total Items</span>
                                                                    </div>
                                                                    <span className="font-semibold text-sm sm:text-lg bg-blue-50 text-blue-600 px-3 sm:px-4 py-1 rounded-full">{transaction.items.reduce((total, item) => total + item.quantity, 0)} items</span>
                                                                </div>
                                                                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                                        <div className="p-2 bg-purple-50 rounded-lg">
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600 sm:w-5 sm:h-5">
                                                                                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="font-semibold text-sm sm:text-lg">Subtotal</span>
                                                                    </div>
                                                                    <span className="font-semibold text-sm sm:text-lg bg-purple-50 text-purple-600 px-3 sm:px-4 py-1 rounded-full">{formatCurrency(transaction.items.reduce((total, item) => total + (item.price * item.quantity * 1000), 0))}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                                        <div className="p-2 bg-green-50 rounded-lg">
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600 sm:w-5 sm:h-5">
                                                                                <path d="M5 8H19M5 8C3.89543 8 3 7.10457 3 6V6C3 4.89543 3.89543 4 5 4H19C20.1046 4 21 4.89543 21 6V6C21 7.10457 20.1046 8 19 8M5 8V18C5 19.1046 5.89543 20 7 20H17C18.1046 20 19 19.1046 19 18V8M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="font-semibold text-sm sm:text-lg">Shipping Cost</span>
                                                                    </div>
                                                                    <span className="font-semibold text-sm sm:text-lg bg-green-50 text-green-600 px-3 sm:px-4 py-1 rounded-full">{formatCurrency(transaction.shippingCost)}</span>
                                                                </div>
                                                                <div className="flex justify-between items-center p-3 sm:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                    <div className="flex items-center gap-2 sm:gap-3">
                                                                        <div className="p-2 bg-orange-50 rounded-lg">
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600 sm:w-5 sm:h-5">
                                                                                <path d="M12 8C13.1046 8 14 7.10457 14 6C14 4.89543 13.1046 4 12 4C10.8954 4 10 4.89543 10 6C10 7.10457 10.8954 8 12 8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M12 20C13.1046 20 14 19.1046 14 18C14 16.8954 13.1046 16 12 16C10.8954 16 10 16.8954 10 18C10 19.1046 10.8954 20 12 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                        </div>
                                                                        <span className="font-semibold text-sm sm:text-lg">Total Amount</span>
                                                                    </div>
                                                                    <span className="font-semibold text-sm sm:text-lg bg-orange-50 text-orange-600 px-3 sm:px-4 py-1 rounded-full">{formatCurrency(transaction.items.reduce((total, item) => total + (item.price * item.quantity * 1000), 0) + transaction.shippingCost)}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center mb-2 justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <MapPin className="h-4 w-4" />
                                                        <span className="text-xs sm:text-sm">Shipping</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Shipping Information</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="bg-gray-50 rounded-lg space-y-4">
                                                            {/* Recipient Details Section */}
                                                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-blue-50 rounded-lg">
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-blue-600">
                                                                            <path d="M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                    <h4 className="font-semibold text-base">Recipient Details</h4>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                                                            <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <p className="text-sm font-medium">{transaction.shippingInfo.firstName}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                                                            <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <p className="text-sm text-gray-600">{transaction.shippingInfo.email}</p>
                                                                    </div>
                                                                    <div className="flex items-center gap-2">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                                                            <path d="M3 5.5C3 14.0604 12 21 12 21C12 21 21 14.0604 21 5.5C21 4.11929 20.4142 2.80504 19.364 1.80397C18.3137 0.802903 16.9115 0.199997 15.45 0.199997C14.0885 0.199997 12.6863 0.802903 11.636 1.80397C10.5858 2.80504 10 4.11929 10 5.5C10 6.88071 10.5858 8.19496 11.636 9.19603C12.6863 10.1971 14.0885 10.8 15.45 10.8C16.9115 10.8 18.3137 10.1971 19.364 9.19603C20.4142 8.19496 21 6.88071 21 5.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            <path d="M15.45 7.5C16.3044 7.5 17.1237 7.15759 17.7306 6.55065C18.3376 5.94371 18.68 5.12456 18.68 4.27C18.68 3.41544 18.3376 2.59629 17.7306 1.98935C17.1237 1.38241 16.3044 1.04 15.45 1.04C14.5954 1.04 13.7763 1.38241 13.1694 1.98935C12.5624 2.59629 12.22 3.41544 12.22 4.27C12.22 5.12456 12.5624 5.94371 13.1694 6.55065C13.7763 7.15759 14.5954 7.5 15.45 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <p className="text-sm text-gray-600">{transaction.shippingInfo.phone}</p>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Address Section */}
                                                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-green-50 rounded-lg">
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
                                                                            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                    <h4 className="font-semibold text-base">Address</h4>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-start gap-2">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500 mt-1">
                                                                            <path d="M3 12L5 10M5 10L12 3L19 10M5 10V20C5 20.5523 5.44772 21 6 21H9M19 10L21 12M19 10V20C19 20.5523 18.5523 21 18 21H15M9 21C9.55228 21 10 20.5523 10 20V16C10 15.4477 10.4477 15 11 15H13C13.5523 15 14 15.4477 14 16V20C14 20.5523 14.4477 21 15 21M9 21H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <div>
                                                                            <p className="text-sm font-medium">{transaction.shippingInfo.streetName}</p>
                                                                            <p className="text-sm text-gray-600">
                                                                                {transaction.shippingInfo.city}, {transaction.shippingInfo.province} {transaction.shippingInfo.postalCode}
                                                                            </p>
                                                                            <p className="text-sm text-gray-600">
                                                                                RT: {transaction.shippingInfo.rt} / RW: {transaction.shippingInfo.rw}
                                                                            </p>
                                                                            {transaction.shippingInfo.landmark && (
                                                                                <p className="text-sm text-gray-600">
                                                                                    Landmark: {transaction.shippingInfo.landmark}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            {/* Additional Information Section */}
                                                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-purple-50 rounded-lg">
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-purple-600">
                                                                            <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                    <h4 className="font-semibold text-base">Additional Information</h4>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <div className="flex items-center gap-2">
                                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                                                            <path d="M9 20L17 20M9 4H17M9 12H17M5 20V4M5 20H3M5 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                        <p className="text-sm">
                                                                            Address Type: <span className="font-medium capitalize">{transaction.shippingInfo.addressType}</span>
                                                                        </p>
                                                                    </div>
                                                                    {transaction.shippingInfo.district && (
                                                                        <div className="flex items-center gap-2">
                                                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-500">
                                                                                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M12 8V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                                <path d="M8 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                            </svg>
                                                                            <p className="text-sm">
                                                                                Coordinates: <span className="font-medium">{transaction.shippingInfo.district}</span>
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Location Map Section */}
                                                            <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all">
                                                                <div className="flex items-center gap-2 mb-3">
                                                                    <div className="p-2 bg-orange-50 rounded-lg">
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-orange-600">
                                                                            <path d="M9 20L17 20M9 4H17M9 12H17M5 20V4M5 20H3M5 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                                        </svg>
                                                                    </div>
                                                                    <h4 className="font-semibold text-base">Location Map</h4>
                                                                </div>
                                                                <div className="w-full h-[300px] rounded-lg overflow-hidden border border-gray-200">
                                                                    {transaction.shippingInfo.district && (
                                                                        <iframe
                                                                            title="Location Map"
                                                                            width="100%"
                                                                            height="100%"
                                                                            frameBorder="0"
                                                                            src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(transaction.shippingInfo.district.split(',')[1]) - 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) - 0.002}%2C${parseFloat(transaction.shippingInfo.district.split(',')[1]) + 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) + 0.002}&layer=mapnik&marker=${transaction.shippingInfo.district.split(',')[0]},${transaction.shippingInfo.district.split(',')[1]}`}
                                                                            allowFullScreen
                                                                        />
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogContent>
                                            </Dialog>

                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <button className="flex items-center justify-center gap-1 sm:gap-2 p-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                                                        <Truck className="h-4 w-4" />
                                                        <span className="text-xs sm:text-sm">Delivery</span>
                                                    </button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                                                    <DialogHeader>
                                                        <DialogTitle>Delivery Status</DialogTitle>
                                                    </DialogHeader>
                                                    <div className="space-y-4">
                                                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                                                                <div>
                                                                    <h4 className="font-medium text-sm sm:text-base">Current Status</h4>
                                                                    <p className="text-xs sm:text-sm text-gray-600">{transaction.deliveryStatus?.status || 'pending'}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium text-sm sm:text-base">Estimated Delivery</h4>
                                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                                        {new Date(transaction.deliveryStatus?.estimatedDelivery || '').toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Status-specific content */}
                                                            {transaction.deliveryStatus?.status === 'pending' && (
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-2 text-yellow-600">
                                                                        <Clock className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                        <p className="font-medium text-sm sm:text-base">Waiting for Processing</p>
                                                                    </div>
                                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                                        Your order has been received and is waiting to be processed. We'll update you once we start preparing your order.
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {transaction.deliveryStatus?.status === 'processing' && (
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-2 text-blue-600">
                                                                        <Package className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                        <p className="font-medium text-sm sm:text-base">Order is Being Prepared</p>
                                                                    </div>
                                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                                        Our team is currently preparing your order. This includes quality checks and packaging.
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {transaction.deliveryStatus?.status === 'delivering' && (
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-2 text-purple-600">
                                                                        <Truck className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                        <p className="font-medium text-sm sm:text-base">On the Way</p>
                                                                    </div>
                                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                                        Your order is out for delivery. Our delivery partner will contact you when they arrive.
                                                                    </p>
                                                                </div>
                                                            )}

                                                            {transaction.deliveryStatus?.status === 'completed' && (
                                                                <div className="space-y-3">
                                                                    <div className="flex items-center gap-2 text-green-600">
                                                                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />
                                                                        <p className="font-medium text-sm sm:text-base">Order Delivered</p>
                                                                    </div>
                                                                    <p className="text-xs sm:text-sm text-gray-600">
                                                                        Your order has been successfully delivered. Thank you for shopping with us!
                                                                    </p>
                                                                </div>
                                                            )}

                                                            <div className="mt-6 space-y-3">
                                                                <h4 className="font-medium text-sm sm:text-base">Delivery History</h4>
                                                                <div className="space-y-3">
                                                                    {transaction.deliveryStatus?.history.map((status, index) => {
                                                                        const isLastItem = index === transaction.deliveryStatus?.history.length - 1;
                                                                        const statusColor =
                                                                            status.status === 'pending' ? 'text-yellow-600' :
                                                                                status.status === 'processing' ? 'text-blue-600' :
                                                                                    status.status === 'delivering' ? 'text-purple-600' :
                                                                                        'text-green-600';

                                                                        const statusIcon =
                                                                            status.status === 'pending' ? <Clock className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                                                                status.status === 'processing' ? <Package className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                                                                    status.status === 'delivering' ? <Truck className="h-4 w-4 sm:h-5 sm:w-5" /> :
                                                                                        <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5" />;

                                                                        return (
                                                                            <div key={index} className="relative">
                                                                                {!isLastItem && (
                                                                                    <div className="absolute left-[10px] top-[30px] bottom-0 w-[2px] bg-gray-200" />
                                                                                )}
                                                                                <div className="flex items-start gap-3 p-3 bg-white rounded-lg border">
                                                                                    <div className={`flex-shrink-0 ${statusColor}`}>
                                                                                        {statusIcon}
                                                                                    </div>
                                                                                    <div className="flex-1">
                                                                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                                                                                            <div className="flex items-center gap-2">
                                                                                                <p className={`font-medium text-sm sm:text-base ${statusColor}`}>
                                                                                                    {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                                                                                                </p>
                                                                                                {isLastItem && (
                                                                                                    <span className="px-2 py-0.5 text-xs bg-green-100 text-green-800 rounded-full">
                                                                                                        Latest
                                                                                                    </span>
                                                                                                )}
                                                                                            </div>
                                                                                            <p className="text-xs text-gray-500">
                                                                                                {new Date(status.timestamp).toLocaleString('id-ID', {
                                                                                                    year: 'numeric',
                                                                                                    month: 'short',
                                                                                                    day: 'numeric',
                                                                                                    hour: '2-digit',
                                                                                                    minute: '2-digit'
                                                                                                })}
                                                                                            </p>
                                                                                        </div>
                                                                                        <p className="text-xs sm:text-sm text-gray-600 mt-1">{status.description}</p>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        );
                                                                    })}
                                                                </div>
                                                            </div>
                                                        </div>
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
