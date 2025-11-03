import React, { useState, useEffect } from 'react';


export default function MemberForm({ initial = {}, onCancel, onSave }) {
const [form, setForm] = useState({
name: '',
contact: '',
joinDate: '',
nextPayment: '',
monthlyAmount: '',
...initial,
});


useEffect(() => setForm((f) => ({ ...f, ...initial })), [initial]);


function change(e) {
const { name, value } = e.target;
setForm((s) => ({ ...s, [name]: value }));
}


function submit(e) {
e.preventDefault();
onSave(form);
}


return (
<form className="gt-form" onSubmit={submit}>
<label>
Name
<input name="name" value={form.name} onChange={change} required />
</label>
<label>
Contact
<input name="contact" value={form.contact} onChange={change} required />
</label>
<label>
Join Date
<input type="date" name="joinDate" value={form.joinDate} onChange={change} />
</label>
<label>
Next Payment Date
<input type="date" name="nextPayment" value={form.nextPayment} onChange={change} />
</label>
<label>
Monthly Amount
<input type="number" name="monthlyAmount" value={form.monthlyAmount} onChange={change} />
</label>


<div className="gt-form-actions">
<button type="button" className="outline" onClick={onCancel}>Cancel</button>
<button type="submit" className="primary">Save</button>
</div>
</form>
);
}