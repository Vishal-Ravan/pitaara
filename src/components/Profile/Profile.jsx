import { useState, useEffect } from 'react';
import { ProfileAside } from './ProfileAside/ProfileAside';
import { ProfileOrders } from './ProfileOrders/ProfileOrders';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [user, setUser] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const getUserToken = () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    return userData?.token || null;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = getUserToken();
      if (!token) {
        alert("Please log in to proceed with checkout.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // Send token in headers
          },
        });

        const data = await response.json();
        console.log(data.user, 'llll')
        if (response.ok) {
          setUser(data.user);
        } else {
          console.error('Failed to fetch user details:', data.message);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };

    fetchUserDetails();
  }, []);
  useEffect(() => {
    if (activeTab === 'wishList') {
      fetchWishlist();
    }
  }, [activeTab]);

  const fetchWishlist = async () => {
    const token = getUserToken();
    if (!token) {
      alert("Please log in to proceed with checkout.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/wishlist', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist(data.products);
      } else {
        console.error('Failed to fetch wishlist:', data.message);
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  };

  const removeFromWishlist = async (productId) => {
    const token = getUserToken();
    if (!token) {
      alert("Please log in to proceed with checkout.");
      setLoading(false);
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/api/wishlist/remove/${productId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist(wishlist.filter(item => item._id !== productId)); // Remove from UI
      } else {
        console.error('Failed to remove item:', data.message);
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  return (
    <>
      <div className='profile'>
        <div className='wrapper'>
          <div className='profile-content'>
            <ProfileAside />
            <div className='profile-main'>
              <div className='tab-wrap'>
                <ul className='nav-tab-list tabs'>
                  <li
                    onClick={() => setActiveTab('myInfo')}
                    className={activeTab === 'myInfo' ? 'active' : ''}
                  >
                    My info
                  </li>
                  <li
                    onClick={() => setActiveTab('orders')}
                    className={activeTab === 'orders' ? 'active' : ''}
                  >
                    My orders
                  </li>
                  <li
                    onClick={() => setActiveTab('wishList')}
                    className={activeTab === 'wishList' ? 'active' : ''}
                  >
                    Wishlist
                  </li>
                </ul>

                <div className='box-tab-cont'>
                  {activeTab === 'myInfo' && (
                    <div className='tab-cont' id='profile-tab_1'>
                      {user ? (
                        <div className='user-info'>
                          <h3>{user.name}</h3>
                          <h6><strong>Email:</strong> {user.email}</h6>
                        </div>
                      ) : (
                        <p>Loading user details...</p>
                      )}
                    </div>
                  )}

                  {activeTab === 'orders' && <ProfileOrders />}

                  {activeTab === 'wishList' && (
                    <div className='tab-cont' id='profile-tab_3'>

                      {wishlist.length > 0 ? (<>
                        <ul className="wishlist-list product-price">
                          {wishlist.map(item => (<>
                            <li key={item._id} className="wishlist-item">
                              <img src={`http://localhost:5000${item.images[0]}`} alt={item.name} className="wishlist-image" height={100} />
                              <div className="wishlist-details d-flex">
                                <h5>Product Name : {item.name}</h5>
                                <p>Price :{item.price} INR</p>
                                <p>Color :{item.color} </p>
                                <p>Category :{item.category} </p>
                                <p>Quantity :{item.quantity} </p>
                                <p>Stock :{item.stock} </p>
                                <button onClick={() => removeFromWishlist(item._id)} className="btn btn-grey">Remove</button>
                              </div>
                            </li>
                            <br />
                          </>))}
                        </ul>
                      </>) : (
                        <p>No items in wishlist</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <img
          className='promo-video__decor js-img'
          src='/assets/img/promo-video__decor.jpg'
          alt=''
        />
      </div>
    </>
  );
};
