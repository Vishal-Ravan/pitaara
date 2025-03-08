import { useState, useEffect } from "react";
import { Card } from "./Card/Card";

export const ProfileOrders = () => {
  const [active, setActive] = useState(-1);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      const token = getUserToken();
      if (!token) {
        alert("Please log in to proceed with checkout.");
        setLoading(false);
        return;
      }
      try {
        const response = await fetch("http://localhost:5000/api/orders/user/all", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch orders");
        }

        const data = await response.json();
        console.log("Fetched Orders:", data); // Debugging log
        setOrders(data.orders || []); // Ensure orders exist in response
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleCollapse = (index) => {
    setActive(active === index ? -1 : index);
  };

  return (
    <div className="profile-orders">
      <div className="profile-orders__row profile-orders__row-head">
        <div className="profile-orders__col">Date</div>
        <div className="profile-orders__col">Delivery Address</div>
        <div className="profile-orders__col">Amount</div>
        <div className="profile-orders__col">Status</div>
      </div>

      {loading && <p>Loading orders...</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {!loading && !error && orders.length === 0 && <p>No orders found.</p>}

      {orders.map((order, index) => (
        <Card
          key={order._id || index} // Use a unique key, preferably `_id`
          index={index}
          onCollapse={handleCollapse}
          order={order}
          active={active}
        />
      ))}
    </div>
  );
};
