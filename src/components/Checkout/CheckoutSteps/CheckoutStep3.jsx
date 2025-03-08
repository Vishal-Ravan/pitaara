export const CheckoutStep3 = ({ orderDetails }) => {
  return (
    <div className="checkout-purchase checkout-form">
      <h4>Thank You for Your Purchase!</h4>
      <p>
        Your order has been successfully placed. You can track your order details below.
      </p>
      <ul className="checkout-purchase__list">
        <li><span>Order Number:</span> {orderDetails?.orderId || "N/A"}</li>
        <li><span>Order Status:</span> {orderDetails?.status || "Pending"}</li>
        <li><span>Total Amount:</span> ₹{orderDetails?.amount || "0"}</li>
        <li><span>Reserved for:</span> {orderDetails?.reservedFor || "N/A"}</li>
        <li><span>Expected Loading Date:</span> {orderDetails?.expectedLoadingDate || "N/A"}</li>
      </ul>
      <a href="#" className="checkout-purchase__link">
        Print Invoice
      </a>
    </div>
  );
};
