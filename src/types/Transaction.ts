// export interface TransactionData {
//     transactionId: string;
//     userId: string;
//     userInfo: {
//         displayName: string;
//         email: string;
//         photoURL?: string;
//     };
//     items: Array<{
//         id: string;
//         title: string;
//         price: string;
//         quantity: number;
//         thumbnail: string;
//     }>;
//     totalAmount: number;
//     shippingInfo: {
//         firstName: string;
//         email: string;
//         streetName: string;
//         landmark: string;
//         province: string;
//         city: string;
//         postalCode: string;
//         phone: string;
//         district?: string;
//     };
//     paymentInfo: {
//         method: string;
//         proof: string;
//         status: string;
//     };
//     message?: string;
//     orderDate: string;
//     expirationTime: string;
//     status: string;
// }

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
        district?: string;
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
}