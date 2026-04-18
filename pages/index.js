import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function CosplayTrade() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); 
  const [searchQuery, setSearchQuery] = useState(''); // 搜索状态
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', category: 'Clothing', location: 'Richmond', contact_info: '', description: '', image_url: '', delete_key: '' });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file);
    if (!error) {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      setForm({ ...form, image_url: urlData.publicUrl });
    }
    setUploading(false);
  }

  async function handlePublish(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) alert('发布失败'); else { alert('发布成功！'); setView('list'); fetchPosts(); }
  }

  // 删除帖子的逻辑
  async function handleDelete(id, correctKey) {
    const inputKey = prompt('请输入发帖时设置的删除密码：');
    if (inputKey === correctKey) {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (!error) { alert('帖子已下架！'); fetchPosts(); }
    } else {
      alert('密码错误，无法删除');
    }
  }

  // 搜索过滤
  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#db2777', textAlign: 'center' }}>Cosplaytrade Van</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setView('list')} style={{ flex: 1, padding: '12px', background: view === 'list' ? '#db2777' : '#eee', color: view === 'list' ? 'white' : 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>看帖子</button>
        <button onClick={() => setView('publish')} style={{ flex: 1, padding: '12px', background: view === 'publish' ? '#db2777' : '#eee', color: view === 'publish' ? 'white' : 'black', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>我要发帖</button>
      </div>

      {view === 'list' ? (
        <div>
          {/* 搜索框 */}
          <input 
            placeholder="🔍 搜搜看？(例如：原神, Richmond...)" 
            style={{ width: '100%', padding: '12px', borderRadius: '25px', border: '1px solid #ddd', marginBottom: '20px', boxSizing: 'border-box' }}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {filteredPosts.map(post => (
            <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '15px', position: 'relative' }}>
              {post.image_url && <img src={post.image_url} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />}
              <h3 style={{margin:'0'}}> {post.title} - <span style={{color:'red'}}>${post.price}</span></h3>
              <p style={{fontSize:'12px', color:'#666'}}>📍 {post.location} | {post.category}</p>
              <p>{post.description}</p>
              <div style={{background:'#f5f5f5', padding:'10px', borderRadius:'5px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <span>联系: {post.contact_info}</span>
                <button 
                  onClick={() => handleDelete(post.id, post.delete_key)}
                  style={{ background: 'none', border: '1px solid #ccc', color: '#999', fontSize: '12px', cursor: 'pointer', padding: '2px 5px', borderRadius: '4px' }}
                >
                  删除
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>1. 上传图片</label>
          <input type="file" accept="image/*" onChange={uploadImage} />
          
          <hr />
          <input placeholder="宝贝名称" required style={{ padding: '12px' }} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="价格 (CAD)" type="number" style={{ padding: '12px' }} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="微信号 / Discord" required style={{ padding: '12px' }} onChange={e => setForm({...form, contact_info: e.target.value})} />
          
          {/* 删除密码输入 */}
          <input placeholder="设置删除密码 (用于以后删帖)" required style={{ padding: '12px' }} onChange={e => setForm({...form, delete_key: e.target.value})} />
          
          <textarea placeholder="描述一下成色、尺寸..." style={{ padding: '12px', height: '80px' }} onChange={e => setForm({...form, description: e.target.value})} />
          <button type="submit" disabled={uploading} style={{ padding: '15px', background: '#db2777', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}>确认发布</button>
        </form>
      )}
    </div>
  );
}
