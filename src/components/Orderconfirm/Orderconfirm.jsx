import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";

export const OrderConfirm = () => {
  const router = useRouter();
  const [orderDetails, setOrderDetails] = useState(null);
  const [invoiceNumber, setInvoiceNumber] = useState(1);
  const invoiceRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedOrderDetails = localStorage.getItem("orderDetails");
      if (storedOrderDetails) {
        setOrderDetails(JSON.parse(storedOrderDetails));
      } else {
        router.push("/");
      }

      const lastInvoice = localStorage.getItem("lastInvoiceNumber");
      const nextInvoice = lastInvoice ? parseInt(lastInvoice) + 1 : 1;
      setInvoiceNumber(nextInvoice);
      localStorage.setItem("lastInvoiceNumber", nextInvoice.toString());
    }
  }, [router]);

  const handlePrint = () => {
    const printContent = invoiceRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    document.body.innerHTML = printContent;
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  if (!orderDetails)
    return <p style={{ fontSize: "18px", textAlign: "center" }}>Loading...</p>;
  console.log(orderDetails, "lloooooooooo");
  const invoiceDate = new Date().toLocaleDateString();
  let grandTotal = 0;

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "auto",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        ref={invoiceRef}
        style={{ backgroundColor: "#fff", padding: "20px" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <p>
              <strong>Invoice Date:</strong> {invoiceDate}
            </p>
            <p>
              <strong>Invoice No:</strong> {invoiceNumber}
            </p>
          </div>
          <img src="/assets/img/logo.png" alt="" width={270}/>
          <div style={{ textAlign: "right" }}>
            <h3 style={{ fontSize: "24px" }}>Seller Details</h3>
            <p>
              <strong>GST Number:</strong> 06AIXPG7784J1ZD
            </p>
            <p>
              <strong>Contact:</strong> +91-9220557803
            </p>
            <p>
              <strong>Email:</strong> info@pittara.co.in
            </p>
            <p>
              <strong>Website:</strong> www.pittara.co.in
            </p>
            
          </div>
        </div>

        <h2 style={{ textAlign: "center", fontSize: "24px", margin: "20px 0" }}>
          Order Confirmation
        </h2>

        <p style={{ fontSize: "18px", fontWeight: "bold" }}>
          Message:{" "}
          <span style={{ fontWeight: "normal" }}>
            {orderDetails.orders?.message || "Order placed successfully"}
          </span>
        </p>

        <p>
          <strong>Order ID:</strong> {orderDetails.orderId}
        </p>
        <p>
          <strong>Total Amount:</strong> {orderDetails.totalAmount}
        </p>
        <p>
          <strong>Payment Method:</strong> {orderDetails.paymentMethod}
        </p>

        {/* Address Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          <div
            style={{
              width: "48%",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ fontSize: "24px" }}>Shipping Address</h3>
            {Object.entries(orderDetails.shippingAddress)
              .filter(([key]) => key !== "_id")
              .map(([key, value]) => (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {value}
                </p>
              ))}
          </div>

          <div
            style={{
              width: "48%",
              padding: "15px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              backgroundColor: "#f9f9f9",
            }}
          >
            <h3 style={{ fontSize: "24px" }}>Billing Address</h3>
            {Object.entries(orderDetails.billingAddress)
              .filter(([key]) => key !== "_id") // hide _id field
              .map(([key, value]) => (
                <p key={key}>
                  <strong>{key.charAt(0).toUpperCase() + key.slice(1)}:</strong>{" "}
                  {value}
                </p>
              ))}
          </div>
        </div>

        {/* Items Table */}
        <h3 style={{ fontSize: "22px", marginTop: "20px" }}>Items</h3>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#eee" }}>
              <th style={tableTh}>#</th>
              <th style={tableTh}>Product Name</th>
              <th style={tableTh}>HSN Code</th>
              {/* <th style={tableTh}>Category</th> */}
              <th style={tableTh}>Price (₹)</th>
              <th style={tableTh}>Quantity</th>
              <th style={tableTh}>Total (₹)</th>
            </tr>
          </thead>
          <tbody>
            {orderDetails.cartData.filter(Boolean).map((item, index) => {
              const totalPrice = item.quantity * item.price;
              grandTotal += totalPrice;
              return (
                <tr key={index}>
                  <td style={tableTd}>{index + 1}</td>
                  <td style={tableTd}>{item.name}</td>
                  <td style={tableTd}>7117</td>
                  {/* <td style={tableTd}>{item.category || "N/A"}</td> */}
                  <td style={tableTd}>₹{item.price}</td>
                  <td style={tableTd}>{item.quantity}</td>
                  <td style={tableTd}>₹{totalPrice.toFixed(2)}</td>
                </tr>
              );
            })}

            {/* Totals */}
            <tr>
              <td
                colSpan="5"
                style={{ ...tableTd, textAlign: "right", fontWeight: "bold" }}
              >
                Subtotal
              </td>
              <td style={tableTd}>₹{grandTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td
                colSpan="5"
                style={{ ...tableTd, textAlign: "right", fontWeight: "bold" }}
              >
                GST (3%)
              </td>
              <td style={tableTd}>₹{(grandTotal * 0.03).toFixed(2)}</td>
            </tr>
            <tr>
              <td
                colSpan="5"
                style={{ ...tableTd, textAlign: "right", fontWeight: "bold" }}
              >
                Total (Incl. GST)
              </td>
              <td style={{ ...tableTd, fontWeight: "bold" }}>
                ₹{(grandTotal * 1.03).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Signature Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "50px",
          }}
        >
          <div>
            {/* <p>
              <strong>Signature</strong>
            </p>
            <div
              style={{
                borderTop: "1px solid #000",
                width: "150px",
                marginTop: "20px",
              }}
            ></div> */}
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Thank you for shopping with us!</strong>
            </p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button style={buttonStyle("#007bff")} onClick={handlePrint}>
          Print Invoice
        </button>
        <button style={buttonStyle("#28a745")} onClick={handlePrint}>
          Download Invoice
        </button>
      </div>
    </div>
  );
};

// Button and Table Styling
const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "white",
  fontSize: "18px",
  padding: "10px 20px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
});

const tableTh = {
  border: "1px solid #ccc",
  padding: "10px",
  textAlign: "left",
};

const tableTd = {
  border: "1px solid #ccc",
  padding: "10px",
};
