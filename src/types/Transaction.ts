interface TransactionData {
    transactionId: string;
    userId: string;
    userInfo: {
        displayName: string;
        email: string;
        photoURL?: string;
    };
    items: any[];
    totalAmount: number;
    shippingInfo: {
        firstName: string;
        email: string;
        streetName: string;
        landmark: string;
        province: string;
        city: string;
        postalCode: string;
        phone: string;
        district?: string; // Format: "latitude,longitude" e.g. "-6.5741124,106.6320672"
        rt: string;
        rw: string;
        addressType: string;
    };
    paymentInfo: {
        method: string;
        proof: string;
        status: string;
    };
    message?: string;
    orderDate: string;
    expirationTime: string;
    status: string;
    deliveryStatus: {
        status: string;
        history: Array<{
            status: string;
            timestamp: string;
            description: string;
        }>;
        estimatedDelivery: string;
    };
    shippingCost: number;
}