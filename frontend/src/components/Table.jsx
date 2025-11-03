import React from 'react';


export default function Table({ columns, data, actions }) {
return (
<table className="gt-table">
<thead>
<tr>
{columns.map((c) => (
<th key={c.key}>{c.title}</th>
))}
{actions && <th>Actions</th>}
</tr>
</thead>
<tbody>
{data.map((row, idx) => (
<tr key={row.id || idx} className={idx % 2 === 0 ? 'even' : 'odd'}>
{columns.map((c) => (
<td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>
))}
{actions && <td className="gt-actions">{actions(row)}</td>}
</tr>
))}
</tbody>
</table>
);
}