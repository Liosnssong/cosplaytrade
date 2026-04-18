import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// 直接在这里定义连接，防止外部文件读取失败
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CosplayTrade() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'publish'
  const [form, setForm] = useState({ title: '', price: '', category: 'Clothing', location: 'Richmond', contact_info: '', description: '' });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function handlePublish(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) alert('Error!'); else { alert('Success!'); setView('list'); fetchPosts(); }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#db2777', textAlign: 'center' }}>Cosplaytrade</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setView('list')} style={{ flex: 1, padding: '10px', background: view === 'list' ? '#db2777' : '#eee', color: view === 'list' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>看帖子</button>
        <button onClick={() => setView('publish')} style={{ flex: 1, padding: '10px', background: view === 'publish' ? '#db2777' : '#eee', color: view === 'publish' ? 'white' : 'black', border: 'none', borderRadius: '5px' }}>发帖子</button>
      </div>

      {view === 'list' ? (
        <div>
          {posts.map(post => (
            <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '10px', marginBottom: '10px' }}>
              <h3>{post.title} - <span style={{ color: 'red' }}>${post.price}</span></h3>
              <p style={{ fontSize: '13px', color: '#666' }}>📍 {post.location} | {post.category}</p>
              <p>{post.description}</p>
              <div style={{ background: '#f5f5f5', padding: '8px', borderRadius: '5px', fontSize: '14px' }}>联系: {post.contact_info}</div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Item Name" required style={{ padding: '10px' }} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="Price (CAD)" type="number" style={{ padding: '10px' }} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="WeChat / Discord" required style={{ padding: '10px' }} onChange={e => setForm({...form, contact_info: e.target.value})} />
          <textarea placeholder="Description" style={{ padding: '10px' }} onChange={e => setForm({...form, description: e.target.value})} />
          <button type="submit" style={{ padding: '15px', background: '#db2777', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold' }}>提交发布</button>
        </form>
      )}
    </div>
  );
}
