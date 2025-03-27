import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export const Orderconfirm = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Fetch order details from localStorage
      const storedOrderDetails = localStorage.getItem("orderDetails");
      if (storedOrderDetails) {
        setOrderDetails(JSON.parse(storedOrderDetails));
      } else {
        router.push("/"); // Redirect to homepage if no order details found
      }
    }
  }, [router]);

  if (!orderDetails) return <p>Loading...</p>;
console.log(orderDetails,'lll')
  return (
    <div>
      <h2>Order Confirmation</h2>
      <p><strong>Message:</strong> {orderDetails.orders?.message || "Order placed successfully"}</p>
      
      <h3>Order Details</h3>
      <p><strong>Order ID:</strong> {orderDetails.orders?.order?._id}</p>
      {/* <p><strong>User ID:</strong> {orderDetails.orders?.order?.userId}</p> */}
      {/* <p><strong>Status:</strong> {orderDetails.orders?.order?.status}</p> */}
      <p><strong>Total Amount:</strong> ₹{orderDetails.orders?.order?.totalPrice}</p>
      <p><strong>Shipping Address:</strong> {orderDetails.orders.shippingAddress.address}</p>
      <p><strong>name:</strong> {orderDetails.orders.shippingAddress.fullName}</p>
      <p><strong>phone:</strong> {orderDetails.orders.shippingAddress.phone}</p>
      <p><strong>Email:</strong> {orderDetails.orders.shippingAddress.email}</p>
      <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>

      <h3>Items:</h3>
      <ul>
        {orderDetails.orders?.order?.items?.map((item, index) => (
          <li key={index}>
            <p><strong>Product ID:</strong> {item.productId?._id || "N/A"}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
            <p><strong>Name:</strong> {item.productId.name}</p>
            <p><strong>Quantity:</strong> {item.quantity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
