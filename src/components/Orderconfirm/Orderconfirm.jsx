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
console.log(orderDetails,'klkl')
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
          <strong>Order ID:</strong> {orderDetails.orderId}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Total Amount:</strong> {orderDetails.totalAmount}
        </p>
        <p style={{ fontSize: "18px" }}>
          <strong>Payment Method:</strong> {orderDetails.paymentMethod}
        </p>

        {/* Address Section */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: "20px", marginTop: "20px" }}>
          {/* Shipping Address */}
          <div style={{ width: "48%", padding: "15px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Shipping Address</h3>
            <p><strong>Name:</strong> {orderDetails.shippingAddress.fullName}</p>
  <p><strong>Phone:</strong> {orderDetails.shippingAddress.phone}</p>
  <p><strong>Email:</strong> {orderDetails.shippingAddress.email}</p>
  <p><strong>Address:</strong> {orderDetails.shippingAddress.address}</p>
  <p><strong>City:</strong> {orderDetails.shippingAddress.city}</p>
  <p><strong>State:</strong> {orderDetails.shippingAddress.state}</p>
  <p><strong>Postal Code:</strong> {orderDetails.shippingAddress.postalCode}</p>
  <p><strong>Country:</strong> {orderDetails.shippingAddress.country}</p>
           
          </div>

          {/* Billing Address */}
          <div style={{ width: "48%", padding: "15px", border: "1px solid #ddd", borderRadius: "10px", backgroundColor: "#f9f9f9" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "10px" }}>Billing Address</h3>
            <p><strong>Name:</strong> {orderDetails.billingAddress.fullName}</p>
  <p><strong>Phone:</strong> {orderDetails.billingAddress.phone}</p>
  <p><strong>Email:</strong> {orderDetails.billingAddress.email}</p>
  <p><strong>Address:</strong> {orderDetails.billingAddress.address}</p>
  <p><strong>City:</strong> {orderDetails.billingAddress.city}</p>
  <p><strong>State:</strong> {orderDetails.billingAddress.state}</p>
  <p><strong>Postal Code:</strong> {orderDetails.billingAddress.postalCode}</p>
  <p><strong>Country:</strong> {orderDetails.billingAddress.country}</p>
          </div>
        </div>

        {/* Items List */}
        <h3 style={{ fontSize: "22px", marginTop: "20px" }}>Items</h3>
        <ul
  style={{
    listStyle: "none",
    padding: "0",
    display: "grid",
    gridTemplateColumns: "1fr 1fr", // Two equal-width columns
    gap: "20px", // space between items
  }}
>
  {orderDetails.cartData.map((item, index) => (
    <li
      key={index}
      style={{
        padding: "15px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        backgroundColor: "#f8f8f8",
      }}
    >
      <p><strong>Product Name:</strong> {item.productId.name}</p>
      <p><strong>Price:</strong> {item.productId.price}</p>
      <p><strong>Category:</strong> {item.productId.category}</p>
      <img
        src={`${process.env.NEXT_PUBLIC_API_BASE_URL}${item.productId.images[0]}`}
        alt={item.productId.name}
        width={80}
        height={80}
        style={{ marginTop: "10px", objectFit: "cover", borderRadius: "4px" }}
      /> 
      
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
