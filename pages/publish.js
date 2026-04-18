import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';
export default function Publish() {
const router = useRouter();
const [form, setForm] = useState({ title: '', price: '', category: '服装
', location: '', contact_info: '', description: '' });
async function handleSubmit(e) {
e.preventDefault();
const { error } = await supabase.from('posts').insert([form]);
if (error) alert('发布失败');
else { alert('发布成功!'); router.push('/'); }
}
return (
<div style={{ maxWidth: '500px', margin: '40px auto', padding: '20px',
border: '1px solid #eee', borderRadius: '15px' }}>
<h2>发布新贴</h2>
<form onSubmit={handleSubmit} style={{ display: 'flex',
flexDirection: 'column', gap: '15px' }}>
<input placeholder="物品名称" required onChange={e =>

setForm({...form, title: e.target.value})} />
<input placeholder="价格 (CAD)" type="number" onChange={e =>
setForm({...form, price: e.target.value})} />
<select onChange={e => setForm({...form, category:
e.target.value})}>

<option>服装</option><option>道具</option><option>假发</option>
</select>
<input placeholder="交易地点 (如 Richmond)" onChange={e =>
setForm({...form, location: e.target.value})} />
<input placeholder="微信/Discord" required onChange={e =>
setForm({...form, contact_info: e.target.value})} />
<textarea placeholder="详细描述..." onChange={e =>
setForm({...form, description: e.target.value})} />
<button type="submit" style={{ background: '#db2777', color:
'white', padding: '12px', border: 'none', borderRadius: '8px' }}>提交发布
</button>
</form>
</div>
);
}
