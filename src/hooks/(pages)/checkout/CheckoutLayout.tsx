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

import { doc, getDoc } from "firebase/firestore";

import { db } from "@/utils/firebase/Firebase";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import * as z from "zod";

import HeroCheckout from "@/hooks/(pages)/checkout/HeroCheckout"

import { Steps } from "@/components/ui/steps";

import PaymentOptions from "@/components/payment/PaymentOptions";

// Form validation schema
const checkoutSchema = z.object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    streetName: z.string().min(5, "Street name must be at least 5 characters"),
    landmark: z.string().min(3, "Landmark must be at least 3 characters"),
    province: z.string().min(1, "Province is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(5, "Postal code must be at least 5 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 characters"),
    cardNumber: z.string().optional(),
    expiry: z.string().optional(),
    cvv: z.string().optional(),
    message: z.string().optional(),
    district: z.string().optional()
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

interface SavedAddress {
    fullName: string;
    phone: string;
    streetName: string;
    landmark: string;
    province: string;
    city: string;
    postalCode: string;
    isPrimary?: boolean;
    district?: string;
}

const NoAddressFound = () => {
    const router = useRouter();

    return (
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 mb-6">
            <div className="flex items-center gap-4">
                <svg
                    className="w-8 h-8 text-red-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                </svg>
                <div className="flex-1">
                    <h2 className="text-lg font-semibold text-red-800 mb-1">No Address Found</h2>
                    <p className="text-red-600 text-sm">Please add your address to continue with checkout</p>
                </div>
                <button
                    onClick={() => router.push('/profile/address')}
                    className="px-4 py-2 bg-[#FF204E] text-white rounded-lg hover:bg-[#e61e4d] transition-colors duration-200 text-sm"
                >
                    Add Address
                </button>
            </div>
        </div>
    );
};

// Tambahkan type StepStatus
type StepStatus = "current" | "complete" | "upcoming";

type PaymentMethod = 'qris' | 'bca';

export default function Checkout() {
    const { user } = useAuth();
    const { items, totalItems, clearCart } = useCart();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [hasAddress, setHasAddress] = useState(true);
    const [currentStep, setCurrentStep] = useState<'address' | 'payment'>('address');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('qris');
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const steps: { title: string; description: string; status: StepStatus }[] = [
        {
            title: "Address",
            description: "Shipping information",
            status: currentStep === 'address' ? "current" : "complete"
        },
        {
            title: "Payment",
            description: "Payment details",
            status: currentStep === 'payment' ? "current" : "upcoming"
        }
    ];

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
        watch,
        trigger,
        getValues
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        mode: 'onChange',
        defaultValues: {
            firstName: '',
            email: user?.email || '',
            streetName: '',
            landmark: '',
            province: '',
            city: '',
            postalCode: '',
            phone: '',
            cardNumber: '',
            expiry: '',
            cvv: '',
            message: '',
            district: ''
        }
    });

    useEffect(() => {
        if (!user) {
            router.push('/signin');
            return;
        }

        const fetchUserAddress = async () => {
            try {
                const userDocRef = doc(db, process.env.NEXT_PUBLIC_COLLECTIONS_ACCOUNTS as string, user.uid);
                const userDoc = await getDoc(userDocRef);
                const userData = userDoc.data();

                if (!userData?.addresses || userData.addresses.length === 0) {
                    setHasAddress(false);
                    return;
                }

                const primaryAddress = userData.addresses.find((addr: SavedAddress) => addr.isPrimary);
                if (primaryAddress) {
                    setValue('firstName', primaryAddress.fullName, { shouldValidate: true });
                    setValue('email', user.email || '', { shouldValidate: true });
                    setValue('streetName', primaryAddress.streetName, { shouldValidate: true });
                    setValue('landmark', primaryAddress.landmark, { shouldValidate: true });
                    setValue('province', primaryAddress.province, { shouldValidate: true });
                    setValue('city', primaryAddress.city, { shouldValidate: true });
                    setValue('postalCode', primaryAddress.postalCode, { shouldValidate: true });
                    setValue('phone', primaryAddress.phone, { shouldValidate: true });
                    setValue('district', primaryAddress.district || '', { shouldValidate: true });
                }
            } catch (error) {
                console.error("Error fetching user address:", error);
                toast.error("Failed to load saved address");
            }
        };

        fetchUserAddress();
    }, [user, router, setValue]);

    const calculateTotal = () => {
        return items.reduce((total, item) => {
            const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
            return total + (price * item.quantity);
        }, 0);
    };

    const onSubmit = async (data: CheckoutFormData) => {
        if (!user) {
            toast.error('Please login to continue with checkout');
            router.push('/signin');
            return;
        }

        setIsLoading(true);

        if (!items || items.length === 0) {
            toast.error('Your cart is empty. Please add items to your cart before proceeding.');
            return;
        }

        try {
            const orderData = {
                userId: user.uid,
                items,
                totalAmount: calculateTotal(),
                shippingInfo: {
                    firstName: data.firstName,
                    email: data.email,
                    streetName: data.streetName,
                    landmark: data.landmark,
                    province: data.province,
                    city: data.city,
                    postalCode: data.postalCode,
                    phone: data.phone
                },
                paymentInfo: {
                    cardNumber: data.cardNumber?.replace(/\s/g, '') || '',
                    expiry: data.expiry || '',
                    cvv: data.cvv || ''
                },
                message: data.message,
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

    const handleAddressSubmit = async (data: Partial<CheckoutFormData>) => {
        console.log('Form submission started with data:', data);
        setIsLoading(true);

        try {
            // Log current form state
            const currentValues = getValues();
            console.log('Current form values:', currentValues);
            console.log('Current form errors:', errors);

            // Validate all fields
            const isValid = await trigger();
            console.log('Form validation result:', isValid);

            if (!isValid) {
                console.log('Form validation failed with errors:', errors);
                toast.error('Please fill in all required fields correctly');
                return;
            }

            // Move to payment step
            console.log('Moving to payment step');
            setCurrentStep('payment');
            toast.success('Moving to payment step');

            // Scroll to top smoothly
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } catch (error) {
            console.error('Error in handleAddressSubmit:', error);
            toast.error('Failed to proceed to payment step');
        } finally {
            setIsLoading(false);
        }
    };

    const handlePaymentMethodChange = (method: PaymentMethod) => {
        setPaymentMethod(method);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPaymentProof(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <>
            <HeroCheckout />
            <section className="bg-gray-50 min-h-screen py-12">
                <div className="container px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Order Summary */}
                        <div className="lg:sticky lg:top-8 lg:self-start lg:max-h-[calc(100vh-4rem)] lg:overflow-y-auto">
                            <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
                                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Order Summary</h2>
                                <div className="space-y-6">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex gap-6 items-center">
                                            <div className="relative w-24 h-24 flex-shrink-0 rounded-xl overflow-hidden">
                                                <Image
                                                    src={item.thumbnail}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-medium text-gray-800 text-lg">{item.title}</h3>
                                                <p className="text-[#FF204E] font-semibold text-lg mt-1">{item.price}</p>
                                                <p className="text-sm text-gray-500 mt-1">Quantity: {item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 mt-8 pt-6">
                                    <div className="flex justify-between items-center text-gray-600">
                                        <span className="font-medium">Total Items:</span>
                                        <span>{totalItems}</span>
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="font-medium text-gray-800 text-lg">Total Amount:</span>
                                        <span className="text-[#FF204E] font-bold text-xl">${calculateTotal().toFixed(2)}</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Checkout Steps */}
                        <div>
                            <div className="mb-8">
                                <Steps steps={steps} />
                            </div>
                            {currentStep === 'address' ? (
                                <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-800">Shipping Information</h2>
                                        <Button
                                            variant="outline"
                                            className="text-[#FF204E] border-[#FF204E] hover:bg-[#FF204E] hover:text-white transition-colors duration-200"
                                            onClick={() => router.push('/profile/address')}
                                        >
                                            Edit Address
                                        </Button>
                                    </div>
                                    <form
                                        className="space-y-6"
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            console.log('Form submitted, starting submission process');
                                            const formData = getValues();
                                            console.log('Current form data:', formData);

                                            try {
                                                await handleSubmit(handleAddressSubmit)(e);
                                            } catch (error) {
                                                console.error('Error during form submission:', error);
                                                toast.error('An error occurred during form submission');
                                            }
                                        }}
                                    >
                                        {!hasAddress && <NoAddressFound />}
                                        <div className="space-y-2">
                                            <Label htmlFor="firstName" className="text-gray-700">Full Name</Label>
                                            <Input
                                                id="firstName"
                                                {...register('firstName', { required: true })}
                                                className={`${errors.firstName ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                            />
                                            {errors.firstName && (
                                                <p className="text-red-500 text-sm">{errors.firstName.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-gray-700">Email</Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                {...register('email', { required: true })}
                                                className={`${errors.email ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                            />
                                            {errors.email && (
                                                <p className="text-red-500 text-sm">{errors.email.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="streetName" className="text-gray-700">Street Name</Label>
                                            <Input
                                                id="streetName"
                                                {...register('streetName', { required: true })}
                                                className={`${errors.streetName ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                            />
                                            {errors.streetName && (
                                                <p className="text-red-500 text-sm">{errors.streetName.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="landmark" className="text-gray-700">Landmark</Label>
                                            <Input
                                                id="landmark"
                                                {...register('landmark', { required: true })}
                                                className={`${errors.landmark ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                            />
                                            {errors.landmark && (
                                                <p className="text-red-500 text-sm">{errors.landmark.message}</p>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="province" className="text-gray-700">Province</Label>
                                                <Input
                                                    id="province"
                                                    {...register('province', { required: true })}
                                                    className={`${errors.province ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                                />
                                                {errors.province && (
                                                    <p className="text-red-500 text-sm">{errors.province.message}</p>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="city" className="text-gray-700">City</Label>
                                                <Input
                                                    id="city"
                                                    {...register('city', { required: true })}
                                                    className={`${errors.city ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                                />
                                                {errors.city && (
                                                    <p className="text-red-500 text-sm">{errors.city.message}</p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode" className="text-gray-700">Postal Code</Label>
                                            <Input
                                                id="postalCode"
                                                {...register('postalCode', { required: true })}
                                                className={`${errors.postalCode ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                            />
                                            {errors.postalCode && (
                                                <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label className="text-gray-700">Location</Label>
                                            <div className="w-full h-[200px] rounded-xl overflow-hidden border border-gray-200">
                                                <iframe
                                                    title="Location Map"
                                                    width="100%"
                                                    height="100%"
                                                    frameBorder="0"
                                                    src={`https://www.openstreetmap.org/export/embed.html?bbox=106.62206172943115%2C-6.576112400000001%2C106.64206172943115%2C-6.572112400000001&layer=mapnik&marker=-6.574112400000001,106.63206172943115`}
                                                    allowFullScreen
                                                />
                                            </div>
                                            <input
                                                type="hidden"
                                                {...register('district')}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="phone" className="text-gray-700">Phone Number</Label>
                                            <Input
                                                id="phone"
                                                type="tel"
                                                {...register('phone')}
                                                className={`${errors.phone ? "border-red-500" : ""} bg-gray-50 border-gray-200 rounded-xl h-12`}
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-sm">{errors.phone.message}</p>
                                            )}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="message" className="text-gray-700">Message (Optional)</Label>
                                            <textarea
                                                id="message"
                                                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-[#FF204E] focus:border-transparent transition-all duration-200"
                                                rows={4}
                                                placeholder="Add any special notes or requests..."
                                                {...register('message')}
                                            />
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full mt-8 bg-[#FF204E] text-white hover:bg-[#e61e4d] h-14 rounded-xl text-lg font-medium transition-colors duration-200"
                                            disabled={isLoading || items.length === 0}
                                            onClick={() => {
                                                console.log('Button clicked');
                                                console.log('Form validation state:', isValid);
                                                console.log('Current form errors:', errors);
                                            }}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                'Continue to Payment'
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            ) : (
                                <Card className="p-8 bg-white shadow-sm border-0 rounded-2xl">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl font-semibold text-gray-800">Payment Information</h2>
                                        <Button
                                            variant="outline"
                                            className="text-gray-600 border-gray-300 hover:bg-gray-50"
                                            onClick={() => setCurrentStep('address')}
                                        >
                                            Back to Address
                                        </Button>
                                    </div>
                                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                        <PaymentOptions
                                            paymentMethod={paymentMethod}
                                            onPaymentMethodChange={handlePaymentMethodChange}
                                            total={calculateTotal()}
                                        />

                                        <div className="space-y-4">
                                            <Label className="text-gray-700">Upload Payment Proof</Label>
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-center w-full">
                                                    <label
                                                        htmlFor="payment-proof"
                                                        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100"
                                                    >
                                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                            {previewUrl ? (
                                                                <div className="relative w-full h-full">
                                                                    <Image
                                                                        src={previewUrl}
                                                                        alt="Payment proof preview"
                                                                        fill
                                                                        className="object-contain rounded-xl"
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        onClick={(e) => {
                                                                            e.preventDefault();
                                                                            setPreviewUrl(null);
                                                                            setPaymentProof(null);
                                                                        }}
                                                                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                                                                    >
                                                                        <svg
                                                                            className="w-4 h-4"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            viewBox="0 0 24 24"
                                                                        >
                                                                            <path
                                                                                strokeLinecap="round"
                                                                                strokeLinejoin="round"
                                                                                strokeWidth={2}
                                                                                d="M6 18L18 6M6 6l12 12"
                                                                            />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <svg
                                                                        className="w-8 h-8 mb-4 text-gray-500"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                                                        />
                                                                    </svg>
                                                                    <p className="mb-2 text-sm text-gray-500">
                                                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                                                    </p>
                                                                    <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 2MB)</p>
                                                                </>
                                                            )}
                                                        </div>
                                                        <input
                                                            id="payment-proof"
                                                            type="file"
                                                            className="hidden"
                                                            accept="image/*"
                                                            onChange={handleFileChange}
                                                        />
                                                    </label>
                                                </div>
                                                {paymentProof && (
                                                    <p className="text-sm text-gray-500">
                                                        Selected file: {paymentProof.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        <Button
                                            type="submit"
                                            className="w-full mt-8 bg-[#FF204E] text-white hover:bg-[#e61e4d] h-14 rounded-xl text-lg font-medium transition-colors duration-200"
                                            disabled={isLoading || items.length === 0 || !paymentProof}
                                        >
                                            {isLoading ? (
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    Processing...
                                                </div>
                                            ) : (
                                                'Place Order'
                                            )}
                                        </Button>
                                    </form>
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
} 