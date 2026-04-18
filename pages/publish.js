import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/router';

export default function Publish() {
  const router = useRouter();
  const [form, setForm] = useState({ title: '', price: '', category: '服装', location: 'Richmond', contact_info: '', description: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) {
      alert('发布失败，请检查数据库连接');
    } else {
      alert('恭喜！发布成功');
      router.push('/');
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', fontFamily: 'sans-serif', border: '1px solid #eee', borderRadius: '15px' }}>
      <h2 style={{ color: '#db2777' }}>发布新宝贝</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <input placeholder="物品名称 (如: RE9 道具手枪)" required style={{ padding: '10px' }} onChange={e => setForm({...form, title: e.target.value})} />
        <input placeholder="价格 (CAD $)" type="number" style={{ padding: '10px' }} onChange={e => setForm({...form, price: e.target.value})} />
        <select style={{ padding: '10px' }} onChange={e => setForm({...form, category: e.target.value})}>
          <option>服装</option><option>道具</option><option>假发</option><option>其他</option>
        </select>
        <select style={{ padding: '10px' }} onChange={e => setForm({...form, location: e.target.value})}>
          <option>Richmond</option><option>Burnaby</option><option>Vancouver DT</option>
          <option>Coquitlam</option><option>Surrey</option><option>Metrotown面交</option>
        </select>
        <input placeholder="微信号 / Discord" required style={{ padding: '10px' }} onChange={e => setForm({...form, contact_info: e.target.value})} />
        <textarea placeholder="描述成色、码数等..." style={{ padding: '10px', height: '80px' }} onChange={e => setForm({...form, description: e.target.value})} />
        <button type="submit" style={{ background: '#db2777', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>立即发布</button>
      </form>
    </div>
  );
}
