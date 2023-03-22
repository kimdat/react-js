import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutPage = (props) => {
    const navigate = useNavigate();

    React.useEffect(() => {
        localStorage.removeItem('email');
        navigate("/", { replace: true });
    });

    return <div>...Logging out</div>;
}

export default LogoutPage;