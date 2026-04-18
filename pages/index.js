import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

export default function CosplayTrade() {
  const [posts, setPosts] = useState([]);
  const [view, setView] = useState('list'); 
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ title: '', price: '', category: 'Clothing', location: 'Richmond', contact_info: '', description: '', image_url: '' });

  useEffect(() => { fetchPosts(); }, []);

  async function fetchPosts() {
    const { data } = await supabase.from('posts').select('*').order('created_at', { ascending: false });
    setPosts(data || []);
  }

  // 新增：处理图片上传逻辑
  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}_${file.name}`;
    const { data, error } = await supabase.storage.from('images').upload(fileName, file);
    
    if (error) {
      alert('图片上传失败');
    } else {
      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      setForm({ ...form, image_url: urlData.publicUrl });
      alert('图片上传成功！');
    }
    setUploading(false);
  }

  async function handlePublish(e) {
    e.preventDefault();
    const { error } = await supabase.from('posts').insert([form]);
    if (error) alert('发布失败'); else { alert('发布成功！'); setView('list'); fetchPosts(); }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#db2777', textAlign: 'center' }}>Cosplaytrade Van</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setView('list')} style={{ flex: 1, padding: '12px', background: view === 'list' ? '#db2777' : '#eee', color: view === 'list' ? 'white' : 'black', border: 'none', borderRadius: '8px' }}>看帖子</button>
        <button onClick={() => setView('publish')} style={{ flex: 1, padding: '12px', background: view === 'publish' ? '#db2777' : '#eee', color: view === 'publish' ? 'white' : 'black', border: 'none', borderRadius: '8px' }}>我要发帖</button>
      </div>

      {view === 'list' ? (
        <div>
          {posts.map(post => (
            <div key={post.id} style={{ border: '1px solid #eee', padding: '15px', borderRadius: '12px', marginBottom: '10px' }}>
              {post.image_url && <img src={post.image_url} style={{ width: '100%', borderRadius: '8px', marginBottom: '10px' }} />}
              <h3 style={{margin:'0'}}> {post.title} - <span style={{color:'red'}}>${post.price}</span></h3>
              <p style={{fontSize:'12px', color:'#666'}}>📍 {post.location}</p>
              <p>{post.description}</p>
              <div style={{background:'#f5f5f5', padding:'10px', borderRadius:'5px'}}>联系: {post.contact_info}</div>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handlePublish} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label style={{ fontSize: '14px', fontWeight: 'bold' }}>第一步：上传照片</label>
          <input type="file" accept="image/*" onChange={uploadImage} />
          {uploading && <p style={{color: 'orange'}}>正在上传...</p>}
          {form.image_url && <p style={{color: 'green'}}>✅ 已就绪</p>}
          
          <hr />
          <input placeholder="宝贝名称" required style={{ padding: '12px' }} onChange={e => setForm({...form, title: e.target.value})} />
          <input placeholder="价格 (CAD)" type="number" style={{ padding: '12px' }} onChange={e => setForm({...form, price: e.target.value})} />
          <input placeholder="微信号 / Discord" required style={{ padding: '12px' }} onChange={e => setForm({...form, contact_info: e.target.value})} />
          <textarea placeholder="描述一下成色..." style={{ padding: '12px', height: '100px' }} onChange={e => setForm({...form, description: e.target.value})} />
          <button type="submit" disabled={uploading} style={{ padding: '15px', background: '#db2777', color: 'white', border: 'none', borderRadius: '8px', opacity: uploading ? 0.5 : 1 }}>确认发布</button>
        </form>
      )}
    </div>
  );
}
