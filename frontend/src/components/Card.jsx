import React from 'react';


export default function Card({ title, value, icon, color = 'blue' }) {
return (
<div className={`gt-card gt-card-${color}`} tabIndex={0}>
<div className="gt-card-icon">{icon}</div>
<div className="gt-card-body">
<div className="gt-card-title">{title}</div>
<div className="gt-card-value">{value}</div>
</div>
</div>
);
}