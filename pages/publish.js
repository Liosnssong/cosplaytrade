import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Publish() {
  const router = useRouter();
  const [form, setForm] = useState({ 
    title: '', 
    price: '', 
    category: 'Clothing', 
    location: 'Richmond', 
    contact_info: '', 
    description: '' 
  });

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) {
      alert('Error connecting to database');
    } else {
      alert('Success! Posted.');
      router.push('/');
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #eee', borderRadius: '15px' }}>
      <h2 style={{ color: '#db2777' }}>Post New Item</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input placeholder="Item Name (e.g. RE9 Prop)" required style={{ padding: '10px' }} onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="Price (CAD $)" type="number" style={{ padding: '10px' }} onChange={e => setForm({...form, price: e.target.value})} />
        <select style={{ padding: '10px' }} onChange={e => setForm({...form, category: e.target.value})}>
          <option value="Clothing">Clothing / 服装</option>
          <option value="Prop">Prop / 道具</option>
          <option value="Wig">Wig / 假发</option>
          <option value="Other">Other / 其他</option>
        </select>
        <select style={{ padding: '10px' }} onChange={e => setForm({...form, location: e.target.value})}>
          <option>Richmond</option><option>Burnaby</option><option>Vancouver DT</option>
          <option>Coquitlam</option><option>Surrey</option><option>Metrotown</option>
        </select>
        <input placeholder="WeChat / Discord" required style={{ padding: '10px' }} onChange={e => setForm({...form, contact_info: e.target.value})} />
        <textarea placeholder="Description (size, condition...)" style={{ padding: '10px', height: '80px' }} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit" style={{ background: '#db2777', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>Submit / 发布</button>
      </form>
    </div>
  );
}
