import { useRouter } from "next/router";

const CheckoutStep3 = () => {
  const router = useRouter();
  const { orderId, amount, paymentMethod } = router.query; // Get order details

  return (
    <div>
      <h2>Order Confirmation</h2>
      {orderId ? (
        <div>
          <p><strong>Order ID:</strong> {orderId}</p>
          <p><strong>Payment Method:</strong> {paymentMethod}</p>
          <p><strong>Total Amount:</strong> ₹{amount}</p>
          <p><strong>Status:</strong> Success</p>
        </div>
      ) : (
        <p>No order details available.</p>
      )}
    </div>
  );
};

export default CheckoutStep3;
