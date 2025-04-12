import React from 'react';
import { Link } from 'react-router-dom';
import { FaSignInAlt } from 'react-icons/fa';

const Home = () => {
  React.useEffect(() => {
    document.body.style.margin = 0;
    document.body.style.padding = 0;
    document.body.style.overflow = 'hidden';
    document.documentElement.style.height = '100%';
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom right, #f0f4f8, #e5efff)',
        fontFamily: "'Segoe UI', sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: '#000',
          width: '100%',
          padding: '1rem 0',
          textAlign: 'center',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 10,
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            padding: '0.5rem 1.5rem',
            borderRadius: '1rem',
            display: 'inline-block',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
          }}
        >
          <h1
            style={{
              margin: 0,
              color: '#000',
              fontSize: '1.8rem',
              fontWeight: 'bold',
            }}
          >
            IOT BASED WATER DISPENSER
          </h1>
        </div>
      </div>

      {/* Background circles */}
      <div
        style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          backgroundColor: '#dbeafe',
          borderRadius: '50%',
          top: '-150px',
          left: '-150px',
          zIndex: 0,
          opacity: 0.3,
        }}
      ></div>
      <div
        style={{
          position: 'absolute',
          width: '450px',
          height: '450px',
          backgroundColor: '#c7d2fe',
          borderRadius: '50%',
          bottom: '-150px',
          right: '-150px',
          zIndex: 0,
          opacity: 0.3,
        }}
      ></div>

      {/* Main Content */}
      <div
        style={{
          position: 'relative',
          top: '100px', // Moves content below the header
          height: 'calc(100% - 120px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 2,
        }}
      >
        {/* Image */}
        <div
          style={{
            width: '160px',
            height: '160px',
            borderRadius: '50%',
            background: '#ffffff',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: '1.2rem',
          }}
        >
          <img
            src="https://img.freepik.com/premium-vector/hand-free-sanitizer-wall-mounted-soap-automatic-dispenser-automated-contactless-restroom-equipment-with-sensors-touch-less-hand-sanitizer-blue-color-soap-dispenser-vector-illustration_288189-646.jpg?w=740"
            alt="Dispenser"
            style={{ width: '100px', height: '100px', objectFit: 'contain' }}
          />
        </div>

        {/* Welcome text */}
        <h2
          style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#2563eb',
            marginBottom: '1rem',
          }}
        >
          Welcome User!
        </h2>

        {/* Sign In Button */}
        <Link
          to="/signin"
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            fontWeight: '600',
            borderRadius: '999px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            textDecoration: 'none',
            boxShadow: '0 6px 20px rgba(59,130,246,0.3)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = '#1d4ed8')
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = '#3b82f6')
          }
        >
          <FaSignInAlt /> Sign In
        </Link>
      </div>
    </div>
  );
};

export default Home;
