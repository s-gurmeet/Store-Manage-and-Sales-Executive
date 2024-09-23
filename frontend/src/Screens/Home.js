import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom';
import { FaBars, FaSignOutAlt, FaBox } from 'react-icons/fa';

function Home() {
  const navigate = useNavigate();
  const storedToken = localStorage.getItem("user_token");
  const user_type = localStorage.getItem("user_type");
  console.log("user_type==", user_type)
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    if (!storedToken) {
      navigate("/");
    }
  }, [storedToken, navigate]);

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      {sidebarOpen && (
        <div style={{
          width: '250px',
          backgroundColor: '#2c3e50',
          color: 'white',
          padding: '20px',
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
          height: '100vh',
          position: 'fixed', // Make sidebar fixed
          overflowY: 'auto' // Allow scrolling if content overflows
        }}>
          <h2>Sidebar</h2>
          <hr />
          <ul style={{ listStyleType: 'none', padding: 0 }}>
            {user_type === "ADMIN" ? (
              <>
                <li style={{ margin: '15px 0' }}>
                  <Link to={`./user`} style={{
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'border-bottom 0.3s ease'
                  }}>
                    User
                  </Link>
                  <hr />
                </li>
                <li style={{ margin: '15px 0' }}>
                  <Link to={`./order`} style={{
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'border-bottom 0.3s ease'
                  }}>
                    Order
                  </Link>
                  <hr />
                </li>
                <li style={{ margin: '15px 0' }}>
                  <Link to={`./product`} style={{
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'border-bottom 0.3s ease'
                  }}>
                    Product
                  </Link>
                  <hr />
                </li>
              </>
            ) : user_type === "SALES EXECUTIVE" ? (
              <>
                <li style={{ margin: '15px 0' }}>
                  <Link to={`./order`} style={{
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'border-bottom 0.3s ease'
                  }}>
                    Order
                  </Link>
                  <hr />
                </li>
                <li style={{ margin: '15px 0' }}>
                  <Link to={`./product`} style={{
                    color: 'white',
                    textDecoration: 'none',
                    borderBottom: '2px solid transparent',
                    transition: 'border-bottom 0.3s ease'
                  }}>
                    Product
                  </Link>
                  <hr />
                </li>
              </>
            ) : (
              <li style={{ margin: '15px 0' }}>
                <Link to={`./order`} style={{
                  color: 'white',
                  textDecoration: 'none',
                  borderBottom: '2px solid transparent',
                  transition: 'border-bottom 0.3s ease'
                }}>
                  Order
                </Link>
                <hr />
              </li>
            )}
          </ul>
          <style>
            {`
              a:hover {
                border-bottom: 2px solid white; // Underline on hover
              }
            `}
          </style>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: sidebarOpen ? '250px' : '0', transition: 'margin 0.3s' }}>
        {/* Header */}
        <header style={{
          backgroundColor: 'white',
          color: '#3498db',
          padding: '20px',
          textAlign: 'center',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          borderBottom: '2px solid #3498db',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'fixed',
          top: 0,
          left: sidebarOpen ? 250 : 0, // Adjust based on sidebar open/closed
          right: 0,
          width: sidebarOpen ? `calc(100% - 250px)` : '100%', // Adjust width based on sidebar state
          zIndex: 1000
        }}>
          <button onClick={toggleSidebar} style={{
            background: 'transparent',
            border: 'none',
            color: '#3498db',
            cursor: 'pointer',
            fontSize: '18px'
          }}>
            <FaBars style={{ marginRight: '5px' }} />
          </button>
          <div>
            <button style={{
              background: 'transparent',
              border: 'none',
              color: '#3498db',
              cursor: 'pointer',
              fontSize: '18px',
              marginRight: '10px'
            }} onClick={() => {
              navigate("/"); // Navigate to the login page
              localStorage.clear(); // Clear the local storage
              window.location.reload();
            }}>
              <FaSignOutAlt style={{ marginRight: '5px', color: "red" }} /> Logout
            </button>
            <button onClick={() => navigate("/order")} style={{
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              padding: '5px 10px', // Smaller padding for smaller button
              borderRadius: '5px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}>
              <FaBox style={{ marginRight: '5px' }} /> Orders
            </button>
          </div>
        </header>

        {/* Main Area with Outlet */}
        <main style={{
          flex: 1,
          padding: '20px',
          backgroundColor: '#ecf0f1',
          marginTop: '80px', // Space for the fixed header
          overflowY: 'auto', // Allow scrolling in the main area
          overflow: "scroll"
        }}>
          <Outlet /> {/* This is where nested routes will render */}
        </main>

        {/* Footer */}
        <footer style={{
          backgroundColor: 'white',
          color: '#2c3e50',
          textAlign: 'center',
          padding: '15px 0',
          bottom: 0,
          left: 250, // Adjust to match sidebar width
          right: 0,
          boxShadow: '2px 0 5px rgba(0, 0, 0, 0.2)',
        }}>
          <p style={{
            margin: 0,
            fontSize: '14px',
          }}>Footer © 2024</p>
        </footer>
      </div>
    </div>
  );
}

export default Home;
