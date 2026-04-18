import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  async function fetchPosts() {
    const { data, error } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    if (!error) setPosts(data || []);
  }

  const filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ color: '#db2777' }}>Cosplaytrade</h1>
        <Link href="/publish"><button style={{ background: '#db2777', color: 'white', padding: '10px 15px', borderRadius: '8px', border: 'none' }}>发布闲置</button></Link>
      </div>
      
      <input 
        placeholder="🔍 搜索道具、C服..." 
        style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '1px solid #ddd', marginTop: '15px', boxSizing: 'border-box' }}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div style={{ marginTop: '25px' }}>
        {filteredPosts.length === 0 ? <p style={{ color: '#999' }}>暂时没有帖子，快去发布吧！</p> : filteredPosts.map(post => (
          <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '15px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{post.title} - <span style={{ color: '#ef4444' }}>${post.price}</span></h3>
            <p style={{ fontSize: '14px', color: '#666' }}>📍 {post.location} | 分类: {post.category}</p>
            <p style={{ fontSize: '15px' }}>{post.description}</p>
            <div style={{ background: '#f9fafb', padding: '10px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' }}>微信/联系: {post.contact_info}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
