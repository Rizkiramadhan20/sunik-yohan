'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { doc, getDoc } from 'firebase/firestore';

import { db as transactionDb } from '@/utils/firebase/transaction';

import { Card } from '@/components/ui/card';

import Image from 'next/image';

import { formatCurrency } from '@/utils/format/currency';

import { CountdownTimer } from '@/hooks/(pages)/transaction/CountdownTimer';

import TransactionSkelaton from "@/hooks/(pages)/transaction/TransactionSkelaton"

import TransactionEror from "@/hooks/(pages)/transaction/TransactionEror"

import HeroTransaction from "@/hooks/(pages)/transaction/HeroTransaction"

export default function TransactionPage() {
    const params = useParams();
    const [transaction, setTransaction] = useState<TransactionData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransaction = async () => {
            try {
                const transactionDocRef = doc(transactionDb, 'transaction', params.id as string);
                const transactionDoc = await getDoc(transactionDocRef);

                if (transactionDoc.exists()) {
                    setTransaction(transactionDoc.data() as TransactionData);
                } else {
                    setError('Transaction not found');
                }
            } catch (err) {
                console.error('Error fetching transaction:', err);
                setError('Failed to load transaction');
            } finally {
                setLoading(false);
            }
        };

        fetchTransaction();
    }, [params.id]);

    if (loading) {
        return (
            <TransactionSkelaton />
        );
    }

    if (error || !transaction) {
        return (
            <TransactionEror />
        );
    }

    return (
        <>
            <HeroTransaction />

            <section className="min-h-screen bg-gray-50 py-6 sm:py-12">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8">
                        {/* User Information */}
                        <div>
                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">User Information</h2>
                                <div className="flex items-center gap-4 sm:gap-6">
                                    <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden">
                                        <Image
                                            src={transaction.userInfo.photoURL || '/default-avatar.png'}
                                            alt={transaction.userInfo.displayName}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1 sm:space-y-2">
                                        <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{transaction.userInfo.displayName}</h3>
                                        <p className="text-sm sm:text-base text-gray-600">{transaction.userInfo.email}</p>
                                    </div>
                                </div>
                            </Card>

                            {/* Transaction Details */}
                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Transaction Details</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Transaction ID</span>
                                        <span className="font-medium">{transaction.transactionId}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Order Date</span>
                                        <span className="font-medium">
                                            {new Date(transaction.orderDate).toLocaleString('id-ID')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Status</span>
                                        <div className="flex items-center gap-2">
                                            <span className={`font-medium ${transaction.status === 'pending' ? 'text-yellow-600' :
                                                transaction.status === 'success' ? 'text-green-600' :
                                                    'text-red-600'
                                                }`}>
                                                {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                                            </span>
                                            <div className="relative group">
                                                <svg
                                                    className="w-5 h-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <div className="absolute right-0 top-full mt-2 w-64 p-4 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                                    <div className="text-sm">
                                                        <p className="font-medium text-gray-800 mb-2">Status Information</p>
                                                        <p className="text-gray-600">
                                                            {transaction.status === 'pending' ? 'Order is waiting for payment confirmation' :
                                                                transaction.status === 'success' ? 'Order has been confirmed and is being processed' :
                                                                    'Order has been cancelled or failed'}
                                                        </p>
                                                        {transaction.status === 'pending' && (
                                                            <p className="text-yellow-600 mt-2 text-xs">
                                                                Please complete your payment before the timer expires
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Time Remaining</span>
                                        <CountdownTimer endTime={transaction.expirationTime} />
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Shipping Information</h2>
                                <div className="space-y-3 sm:space-y-4">
                                    <div>
                                        <span className="text-gray-600">Name</span>
                                        <p className="font-medium">{transaction.shippingInfo.firstName}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Email</span>
                                        <p className="font-medium">{transaction.shippingInfo.email}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Phone</span>
                                        <p className="font-medium">{transaction.shippingInfo.phone}</p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">Address</span>
                                        <p className="font-medium">
                                            {transaction.shippingInfo.streetName}, {transaction.shippingInfo.landmark}
                                        </p>
                                        <p className="font-medium">
                                            {transaction.shippingInfo.city}, {transaction.shippingInfo.province} {transaction.shippingInfo.postalCode}
                                        </p>
                                    </div>
                                    {transaction.shippingInfo.district && (
                                        <div>
                                            <span className="text-gray-600">Location</span>
                                            <div className="w-full h-[200px] rounded-xl overflow-hidden border border-gray-200 mt-2">
                                                <iframe
                                                    title="Location Map"
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${parseFloat(transaction.shippingInfo.district.split(',')[1]) - 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) - 0.002}%2C${parseFloat(transaction.shippingInfo.district.split(',')[1]) + 0.01}%2C${parseFloat(transaction.shippingInfo.district.split(',')[0]) + 0.002}&layer=mapnik&marker=${transaction.shippingInfo.district.split(',')[0]},${transaction.shippingInfo.district.split(',')[1]}`}
                                                    allowFullScreen
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Order Summary */}
                        <div>
                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl mb-4 sm:mb-8">
                                <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">Order Summary</h2>
                                <div className="space-y-4 sm:space-y-6">
                                    {transaction.items.map((item) => (
                                        <div key={item.id} className="flex gap-4 sm:gap-6 items-center">
                                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 text-base sm:text-lg">{item.title}</h3>
                                                <p className="text-[#FF204E] font-semibold text-base sm:text-lg mt-1">{item.price}</p>
                                                <p className="text-xs sm:text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 mt-6 sm:mt-8 pt-4 sm:pt-6">
                                    <div className="flex justify-between items-center">
                                        <span className="font-medium text-gray-800 text-base sm:text-lg">Total Amount:</span>
                                        <span className="text-[#FF204E] font-bold text-lg sm:text-xl">
                                            {formatCurrency(transaction.totalAmount)}
                                        </span>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-4 sm:p-8 bg-white shadow-sm border-0 rounded-2xl">
                                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Payment Information</h2>
                                    <div className="relative group">
                                        <svg
                                            className="w-5 h-5 text-gray-400 cursor-help hover:text-gray-600 transition-colors"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                        <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10">
                                            <div className="text-sm">
                                                <p className="font-medium text-gray-800 mb-2">Next Steps After Order</p>
                                                <ul className="list-disc list-inside space-y-2 text-gray-600">
                                                    <li>Click this button to send order details to our WhatsApp</li>
                                                    <li>Our team will verify your payment and order details</li>
                                                    <li>Once confirmed, we will process your order</li>
                                                    <li>You will receive shipping updates via WhatsApp</li>
                                                    <li>Track your order status on our website</li>
                                                </ul>
                                                <p className="text-yellow-600 mt-2 text-xs">
                                                    Please keep your transaction ID for order tracking
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Payment Method</span>
                                        <span className="font-medium capitalize">{transaction.paymentInfo.method}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Payment Status</span>
                                        <span className={`font-medium ${transaction.paymentInfo.status === 'success' ? 'text-green-600' :
                                            transaction.paymentInfo.status === 'pending' ? 'text-yellow-600' :
                                                'text-red-600'
                                            }`}>
                                            {transaction.paymentInfo.status.charAt(0).toUpperCase() + transaction.paymentInfo.status.slice(1)}
                                        </span>
                                    </div>
                                    {transaction.paymentInfo.proof && (
                                        <div>
                                            <span className="text-gray-600 block mb-2">Payment Proof</span>
                                            <div className="relative w-full h-48 rounded-xl overflow-hidden">
                                                <Image
                                                    src={transaction.paymentInfo.proof}
                                                    alt="Payment proof"
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* WhatsApp Button */}
                                    <div className="mt-4 sm:mt-6">
                                        <button
                                            onClick={() => {
                                                // Format order details for WhatsApp with modern emoji and formatting
                                                const orderDetails = `
🛍️ *NEW ORDER RECEIVED* 🛍️
━━━━━━━━━━━━━━━━━━━━━━━━

📦 *Order Information*
━━━━━━━━━━━━━━━━━━━━━━━━
• ID: \`${transaction.transactionId}\`
• Date: ${new Date(transaction.orderDate).toLocaleString('id-ID')}
• Status: ${transaction.status.toUpperCase()}

👤 *Customer Details*
━━━━━━━━━━━━━━━━━━━━━━━━
• Name: ${transaction.userInfo.displayName}
• Email: ${transaction.userInfo.email}

📍 *Shipping Address*
━━━━━━━━━━━━━━━━━━━━━━━━
${transaction.shippingInfo.firstName}
${transaction.shippingInfo.streetName}
${transaction.shippingInfo.landmark}
${transaction.shippingInfo.city}, ${transaction.shippingInfo.province} ${transaction.shippingInfo.postalCode}
📱 Phone: ${transaction.shippingInfo.phone}

🛒 *Order Items*
━━━━━━━━━━━━━━━━━━━━━━━━
${transaction.items.map(item => `• ${item.title}
  └ ${item.quantity}x - ${item.price}`).join('\n')}

💰 *Payment Summary*
━━━━━━━━━━━━━━━━━━━━━━━━
• Method: ${transaction.paymentInfo.method.toUpperCase()}
• Status: ${transaction.paymentInfo.status.toUpperCase()}
• Total: ${formatCurrency(transaction.totalAmount)}

📝 *Additional Notes*
━━━━━━━━━━━━━━━━━━━━━━━━
${transaction.message || 'No additional notes'}

📱 *Track Your Order*
━━━━━━━━━━━━━━━━━━━━━━━━
To track your order status, please visit:
https://sunikyohan.my.id/
Enter your Transaction ID: \`${transaction.transactionId}\`

━━━━━━━━━━━━━━━━━━━━━━━━
Thank you for your order! 🎉`;

                                                // Encode the message for WhatsApp URL
                                                const encodedMessage = encodeURIComponent(orderDetails.trim());

                                                // Open WhatsApp with pre-filled message
                                                window.open(`https://wa.me/6281398632939?text=${encodedMessage}`, '_blank');
                                            }}
                                            className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl transition-colors duration-200 cursor-pointer text-sm sm:text-base"
                                        >
                                            <svg
                                                className="w-6 h-6"
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                            </svg>
                                            Send Order Details via WhatsApp
                                        </button>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
} 