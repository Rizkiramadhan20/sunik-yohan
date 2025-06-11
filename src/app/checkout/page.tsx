'use client';

import { useAuth } from "@/utils/context/AuthContext";
import { useCart } from "@/utils/context/CartContext";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postalCode: string;
    phone: string;
    cardNumber: string;
    expiry: string;
    cvv: string;
}

export default function Checkout() {
    const { user } = useAuth();
    const { items, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: user?.displayName?.split(' ')[0] || '',
        lastName: user?.displayName?.split(' ')[1] || '',
        email: user?.email || '',
        address: '',
        city: '',
        postalCode: '',
        phone: '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        if (!user) {
            router.push('/signin');
        }
    }, [user, router]);

    if (!user) {
        return null;
    }

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
            return total + (price * item.quantity);
        }, 0);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'postalCode', 'phone', 'cardNumber', 'expiry', 'cvv'];
        const emptyFields = requiredFields.filter(field => !formData[field as keyof FormData]);

        if (emptyFields.length > 0) {
            toast.error(`Please fill in all required fields: ${emptyFields.join(', ')}`);
            return false;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            toast.error('Please enter a valid email address');
            return false;
        }

        // Basic phone validation
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
            toast.error('Please enter a valid phone number');
            return false;
        }

        // Basic card validation
        const cardRegex = /^\d{16}$/;
        if (!cardRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
            toast.error('Please enter a valid 16-digit card number');
            return false;
        }

        // Basic expiry validation
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        if (!expiryRegex.test(formData.expiry)) {
            toast.error('Please enter a valid expiry date (MM/YY)');
            return false;
        }

        // Basic CVV validation
        const cvvRegex = /^\d{3,4}$/;
        if (!cvvRegex.test(formData.cvv)) {
            toast.error('Please enter a valid CVV (3 or 4 digits)');
            return false;
        }

        return true;
    };

    const handleCheckout = async () => {
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            // Here you would typically make an API call to your backend
            // to process the order and payment
            const orderData = {
                userId: user.uid,
                items,
                totalAmount: calculateTotal(),
                shippingInfo: {
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    phone: formData.phone
                },
                paymentInfo: {
                    cardNumber: formData.cardNumber.replace(/\s/g, ''),
                    expiry: formData.expiry,
                    cvv: formData.cvv
                },
                orderDate: new Date().toISOString()
            };

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Clear the cart after successful order
            clearCart();

            toast.success('Order placed successfully!');
            router.push('/dashboard/orders');
        } catch (error) {
            console.error('Checkout error:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 mt-24">
            <h1 className="text-2xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Order Summary */}
                <div>
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                        <div className="space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <Image
                                            src={item.thumbnail}
                                            alt={item.title}
                                            fill
                                            className="object-cover rounded-md"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium">{item.title}</h3>
                                        <p className="text-[#FF204E] font-semibold">{item.price}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t mt-4 pt-4">
                            <div className="flex justify-between items-center">
                                <span className="font-medium">Total Items:</span>
                                <span>{totalItems}</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <span className="font-medium">Total Amount:</span>
                                <span className="text-[#FF204E] font-bold">${calculateTotal().toFixed(2)}</span>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Shipping Information */}
                <div>
                    <Card className="p-6">
                        <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={formData.city}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="postalCode">Postal Code</Label>
                                    <Input
                                        id="postalCode"
                                        value={formData.postalCode}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </form>
                    </Card>

                    {/* Payment Information */}
                    <Card className="p-6 mt-6">
                        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                            <div className="space-y-2">
                                <Label htmlFor="cardNumber">Card Number</Label>
                                <Input
                                    id="cardNumber"
                                    placeholder="1234 5678 9012 3456"
                                    value={formData.cardNumber}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="expiry">Expiry Date</Label>
                                    <Input
                                        id="expiry"
                                        placeholder="MM/YY"
                                        value={formData.expiry}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cvv">CVV</Label>
                                    <Input
                                        id="cvv"
                                        placeholder="123"
                                        value={formData.cvv}
                                        onChange={handleInputChange}
                                        required
                                    />
                                </div>
                            </div>
                        </form>
                    </Card>

                    <Button
                        className="w-full mt-6 bg-[#FF204E] text-white hover:bg-[#e61e4d]"
                        onClick={handleCheckout}
                        disabled={isLoading || items.length === 0}
                    >
                        {isLoading ? 'Processing...' : 'Place Order'}
                    </Button>
                </div>
            </div>
        </div>
    );
} 