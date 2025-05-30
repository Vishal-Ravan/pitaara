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

  const invoiceDate = new Date().toLocaleDateString();
  let grandTotal = 0;

 const isDelhi = (orderDetails.shippingAddress?.state || "").trim().toLowerCase() === "Haryana";


  return (
    <div style={styles.container}>
      <div ref={invoiceRef} style={styles.invoiceBox}>
        <div style={styles.header}>
          <div style={styles.leftHeader}>
            <p><strong>Invoice Date:</strong> {invoiceDate}</p>
            <p><strong>Invoice No:</strong> {invoiceNumber}</p>
          </div>
          <img src="/assets/img/logo.png" alt="Logo" style={styles.logo} />
          <div style={styles.rightHeader}>
            <h3 style={styles.heading}>Seller Details</h3>
            <p><strong>GST Number:</strong> 06AIXPG7784J1ZD</p>
            <p><strong>Contact:</strong> +91-9220557803</p>
            <p><strong>Email:</strong> info@pittara.co.in</p>
            <p><strong>Website:</strong> www.pittara.co.in</p>
          </div>
        </div>

        <h2 style={styles.title}>Order Confirmation</h2>

        <p style={styles.boldText}>
          Status: <span style={{ fontWeight: "normal" }}>{orderDetails.orders?.message || "Order placed successfully"}</span>
        </p>
        <p><strong>Order ID:</strong> {orderDetails.orderId}</p>
        <p><strong>Payment Method:</strong> {orderDetails.paymentMethod}</p>

        {/* Addresses */}
        <div style={styles.addressWrapper}>
          <div style={styles.addressBox}>
            <h3 style={styles.heading}>Shipping Address</h3>
            {Object.entries(orderDetails.shippingAddress)
              .filter(([key]) => key !== "_id")
              .map(([key, value]) => (
                <p key={key}><strong>{capitalize(key)}:</strong> {value}</p>
              ))}
          </div>

          <div style={styles.addressBox}>
            <h3 style={styles.heading}>Billing Address</h3>
            {Object.entries(orderDetails.billingAddress)
              .filter(([key]) => key !== "_id")
              .map(([key, value]) => (
                <p key={key}><strong>{capitalize(key)}:</strong> {value}</p>
              ))}
          </div>
        </div>

        {/* Items Table */}
        <h3 style={{ fontSize: "22px", marginTop: "20px" }}>Items</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={styles.table}>
            <thead>
              <tr style={{ backgroundColor: "#eee" }}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Product Name</th>
                <th style={styles.th}>HSN Code</th>
                <th style={styles.th}>Price (₹)</th>
                <th style={styles.th}>Quantity</th>
                <th style={styles.th}>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.cartData.filter(Boolean).map((item, index) => {
                const totalPrice = item.quantity * item.price;
                grandTotal += totalPrice;
                return (
                  <tr key={index}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}>{item.name}</td>
                    <td style={styles.td}>7117</td>
                    <td style={styles.td}>₹{item.price}</td>
                    <td style={styles.td}>{item.quantity}</td>
                    <td style={styles.td}>₹{totalPrice.toFixed(2)}</td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: "right", fontWeight: "bold" }}>Subtotal</td>
                <td style={styles.td}>₹{grandTotal.toFixed(2)}</td>
              </tr>
              {isDelhi ? (
                <>
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: "right", fontWeight: "bold" }}>SGST (1.5%)</td>
                    <td style={styles.td}>₹{(grandTotal * 0.015).toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td colSpan="5" style={{ ...styles.td, textAlign: "right", fontWeight: "bold" }}>CGST (1.5%)</td>
                    <td style={styles.td}>₹{(grandTotal * 0.015).toFixed(2)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td colSpan="5" style={{ ...styles.td, textAlign: "right", fontWeight: "bold" }}>IGST (3%)</td>
                  <td style={styles.td}>₹{(grandTotal * 0.03).toFixed(2)}</td>
                </tr>
              )}
              <tr>
                <td colSpan="5" style={{ ...styles.td, textAlign: "right", fontWeight: "bold" }}>Total (Incl.Tax)</td>
                <td style={{ ...styles.td, fontWeight: "bold" }}>₹{isDelhi ? (grandTotal * 1.03).toFixed(2) : (grandTotal * 1.03).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <div></div>
          <div style={{ textAlign: "right" }}>
            <p><strong>Thank you for shopping with us!</strong></p>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <button style={buttonStyle("#007bff")} onClick={handlePrint}>Print Invoice</button>
        <button style={buttonStyle("#28a745")} onClick={handlePrint}>Download Invoice</button>
      </div>
    </div>
  );
};

// Helper Functions & Styles
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const buttonStyle = (bgColor) => ({
  backgroundColor: bgColor,
  color: "white",
  fontSize: "16px",
  padding: "10px 16px",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  margin: "5px",
});

const styles = {
  container: {
    maxWidth: "960px",
    margin: "auto",
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  invoiceBox: {
    backgroundColor: "#fff",
    padding: "20px",
  },
  header: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "40px",
  },
  leftHeader: {
    flex: 1,
    minWidth: "200px",
  },
  rightHeader: {
    flex: 1,
    minWidth: "200px",
  },
  logo: {
    width: "200px",
    maxWidth: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    margin: "20px 0",
  },
  boldText: {
    fontSize: "18px",
    fontWeight: "bold",
  },
  addressWrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
    marginTop: "20px",
    flexWrap: "wrap",
  },
  addressBox: {
    flex: "1 1 300px",
    padding: "15px",
    border: "1px solid #ddd",
    borderRadius: "10px",
    backgroundColor: "#f9f9f9",
  },
  heading: {
    fontSize: "20px",
    marginBottom: "10px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
  th: {
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "12px",
    textAlign: "left",
  },
  td: {
    border: "1px solid #ccc",
    padding: "10px",
    fontSize: "12px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: "50px",
  },
};
