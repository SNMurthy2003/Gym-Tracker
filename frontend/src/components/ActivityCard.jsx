import React from 'react';


export default function ActivityCard({ activity, onWhatsApp }) {
return (
<div className={`activity-card status-${activity.status || 'info'}`}>
<div className="activity-top">
<strong>{activity.title || activity.type}</strong>
<span className="small">{new Date(activity.timestamp).toLocaleString()}</span>
</div>
<div className="activity-body">{activity.message}</div>
<div className="activity-actions">
<button className="outline" onClick={() => onWhatsApp(activity)}>Send WhatsApp</button>
</div>
</div>
);
}