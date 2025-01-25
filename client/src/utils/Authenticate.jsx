import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../components';

const Authenticate = ({ children, auth = false }) => {
  const { status } = useSelector((state) => state.user); // Get user data and auth status from Redux store
  const [loading, setLoading] = useState(true); // Local loading state
  const navigate = useNavigate();
  // console.log(status);
  

  useEffect(() => {
    if (status !== auth) {
      setLoading(true);
      if (auth) {
        navigate('/login', { replace: true }); // Redirect to login if authentication is required
      } else {
        navigate('/dashboard', { replace: true }); // Redirect to dashboard if user is logged in but `auth=false`
      }
    }
    setLoading(false);
  }, [auth, status,navigate]);

  if (loading) return <Loading />; // Show a loading indicator while processing

  return children; // Render children if authenticated
};

export default Authenticate;
