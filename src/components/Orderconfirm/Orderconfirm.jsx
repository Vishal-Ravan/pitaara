import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export const OrderConfirm = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrderDetails = localStorage.getItem("orderDetails");
      if (storedOrderDetails) {
        setOrderDetails(JSON.parse(storedOrderDetails));
      } else {
        router.push("/");
      }
    }
  }, [router]);

  if (!orderDetails) return <p style={{ fontSize: "18px", textAlign: "center" }}>Loading...</p>;

  // Function to handle printing only the invoice section
  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload(); // Reload to restore the page
  };

  return (
    <div style={{ maxWidth: "900px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {/* Invoice Section */}
      <div ref={invoiceRef} style={{ backgroundColor: "#fff", padding: "20px" }}>
        <h2 style={{ textAlign: "center", fontSize: "24px", marginBottom: "20px" }}>Order Confirmation</h2>
        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          Message: <span style={{ fontWeight: "normal" }}>{orderDetails.orders?.message || "Order placed successfully"}</span>
        </p>

        <h3 style={{ fontSize: "22px", marginBottom: "10px" }}>Order Details</h3>
        <p style={{ fontSize: "18px" }}>
          <strong>Order ID:</strong> {orderDetails.orders?.order?._id}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Total Amount:</strong> ₹{orderDetails.orders?.order?.totalPrice}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Payment Method:</strong> {orderDetails.paymentMethod}
        </p>

        {/* Address Section */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "20px" }}>
          {/* Shipping Address */}
          <div style={{ width: "48%", padding: "15px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Shipping Address</h3>
            <p><strong>Name:</strong> {orderDetails.orders.shippingAddress.fullName}</p>
            <p><strong>Phone:</strong> {orderDetails.orders.shippingAddress.phone}</p>
            <p><strong>Email:</strong> {orderDetails.orders.shippingAddress.email}</p>
            <p><strong>Address:</strong> {orderDetails.orders.shippingAddress.address}</p>
          </div>

          {/* Billing Address */}
          <div style={{ width: "48%", padding: "15px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Billing Address</h3>
            <p><strong>Name:</strong> {orderDetails.orders.billingAddress?.fullName || "N/A"}</p>
            <p><strong>Phone:</strong> {orderDetails.orders.billingAddress?.phone || "N/A"}</p>
            <p><strong>Email:</strong> {orderDetails.orders.billingAddress?.email || "N/A"}</p>
            <p><strong>Address:</strong> {orderDetails.orders.billingAddress?.address || "N/A"}</p>
          </div>
        </div>

        {/* Items List */}
        <h3 style={{ fontSize: "22px", marginTop: "20px" }}>Items</h3>
        <ul style={{ listStyle: "none", padding: "0" }}>
          {orderDetails.orders?.order?.items?.map((item, index) => (
            <li key={index} style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
              <p><strong>Product Name:</strong> {item.productId.name}</p>
              <p><strong>Quantity:</strong> {item.quantity}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Print & Download Invoice Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button
          style={{
            backgroundColor: "#007bff",
            color: "white",
            fontSize: "18px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            marginRight: "10px"
          }}
          onClick={handlePrint}
        >
          Print Invoice
        </button>

        <button
          style={{
            backgroundColor: "#28a745",
            color: "white",
            fontSize: "18px",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
          onClick={handlePrint} // Download PDF will also open print preview to save as PDF
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};
