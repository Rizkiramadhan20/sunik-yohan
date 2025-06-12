import Image from "next/image";

import { Label } from "@/components/ui/label";

type PaymentMethod = 'qris' | 'bca';

import qris from "@/base/assets/qris.jpg"

import bca from "@/base/assets/bca.png"

interface PaymentOptionsProps {
    paymentMethod: PaymentMethod;
    onPaymentMethodChange: (method: PaymentMethod) => void;
    total: number;
}

export default function PaymentOptions({ paymentMethod, onPaymentMethodChange, total }: PaymentOptionsProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-4">
                <Label className="text-gray-700">Select Payment Method</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'qris'
                            ? 'border-[#FF204E] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => onPaymentMethodChange('qris')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <Image
                                    src={qris}
                                    alt="QRIS"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">QRIS</h3>
                                <p className="text-sm text-gray-500">Pay with any e-wallet</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 ${paymentMethod === 'bca'
                            ? 'border-[#FF204E] bg-red-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}
                        onClick={() => onPaymentMethodChange('bca')}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
                                <Image
                                    src={bca}
                                    alt="BCA"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-800">Bank BCA</h3>
                                <p className="text-sm text-gray-500">Transfer to BCA account</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {paymentMethod === 'qris' && (
                <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-800">QRIS Payment</h3>
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-64 h-64 bg-white p-4 rounded-xl">
                            <Image
                                src="/qris-code.png"
                                alt="QRIS Code"
                                width={256}
                                height={256}
                                className="w-full h-full object-contain"
                            />
                        </div>
                        <p className="text-sm text-gray-500 text-center">
                            Scan QR code above using your preferred e-wallet app
                        </p>
                        <div className="text-center">
                            <p className="font-medium text-gray-800">Total Amount</p>
                            <p className="text-2xl font-bold text-[#FF204E]">${total.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}

            {paymentMethod === 'bca' && (
                <div className="space-y-4 p-6 bg-gray-50 rounded-xl">
                    <h3 className="font-medium text-gray-800">BCA Transfer</h3>
                    <div className="space-y-4">
                        <div className="p-4 bg-white rounded-xl">
                            <p className="text-sm text-gray-500">Account Number</p>
                            <p className="text-lg font-medium text-gray-800">1234567890</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                            <p className="text-sm text-gray-500">Account Name</p>
                            <p className="text-lg font-medium text-gray-800">PT. Sunik Yohan</p>
                        </div>
                        <div className="p-4 bg-white rounded-xl">
                            <p className="text-sm text-gray-500">Total Amount</p>
                            <p className="text-2xl font-bold text-[#FF204E]">${total.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-500">
                            Please transfer the exact amount to complete your order
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
} 