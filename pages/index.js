import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function CosplayTrade() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); 
  const [form, setForm] = useState({ title: '', price: '', category: 'Clothing', location: 'Richmond', contact_info: '', description: '' });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function handlePublish(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) alert('发布失败，请检查数据库'); else { alert('发布成功！'); setView('list'); fetchPosts(); }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#db2777', textAlign: 'center' }}>Cosplaytrade Van</h1>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setView('list')} style={{ flex: 1, padding: '12px', background: view === 'list' ? '#db2777' : '#eee', color: view === 'list' ? 'white' : 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>看帖子</button>
        <button onClick={() => setView('publish')} style={{ flex: 1, padding: '12px', background: view === 'publish' ? '#db2777' : '#eee', color: view === 'publish' ? 'white' : 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>我要发帖</button>
      </div>
      {view === 'list' ? (
        <div>
          {posts.length === 0 ? <p style={{textAlign:'center', color:'#999'}}>还没有帖子哦</p> : posts.map(post => (
            <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '10px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
              <h3 style={{margin:'0'}}> {post.title} - <span style={{color:'red'}}>${post.price}</span></h3>
              <p style={{fontSize:'12px', color:'#666'}}>📍 {post.location} | {post.category}</p>
              <p style={{margin:'10px 0'}}>{post.description}</p>
              <div style={{background:'#f5f5f5', padding:'10px', borderRadius:'5px', fontSize:'14px', fontWeight:'bold'}}>联系卖家: {post.contact_info}</div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input placeholder="宝贝名称" required style={{ padding: '12px' }} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="价格 (CAD)" type="number" style={{ padding: '12px' }} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="微信号 / Discord" required style={{ padding: '12px' }} onChange={e => setForm({...form, contact_info: e.target.value})} />
          <textarea placeholder="描述一下成色..." style={{ padding: '12px', height: '100px' }} onChange={e => setForm({...form, description: e.target.value})} />
          <button type="submit" style={{ padding: '15px', background: '#db2777', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' }}>确认发布</button>
        </form>
      )}
    </div>
  );
}
