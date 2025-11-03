import React from 'react';
import { Link, useNavigate } from 'react-router-dom';


export default function Navbar() {
const navigate = useNavigate();
const token = localStorage.getItem('gt_token');


function handleLogout() {
localStorage.removeItem('gt_token');
localStorage.removeItem('gt_admin');
navigate('/login');
}


return (
<nav className="gt-nav">
<div className="gt-nav-left">
<Link to="/" className="brand">GymTrack</Link>
</div>
<div className="gt-nav-right">
<Link to="/members">Members</Link>
<Link to="/payments">Payments</Link>
<Link to="/activities">Activities</Link>
{token ? (
<button className="outline" onClick={handleLogout}>Logout</button>
) : (
<Link to="/login">Login</Link>
)}
</div>
</nav>
);
}