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
const { data } = await
supabase.from('posts').select('*').order('created_at', { ascending: false
});
setPosts(data || []);
}
const filteredPosts = posts.filter(p =>
p.title.toLowerCase().includes(search.toLowerCase()));
return (
<div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
<header style={{ display: 'flex', justifyContent: 'space-between',
alignItems: 'center' }}>
<h1 style={{ color: '#db2777' }}>Cosplaytrade</h1>
<Link href="/publish"><button style={{ background: '#db2777',
color: '#fff', padding: '10px 20px', borderRadius: '8px', border: 'none',
cursor: 'pointer' }}>发布闲置</button></Link>
</header>
<input
type="text"
placeholder="搜索道具、C服..."
style={{ width: '100%', padding: '12px', borderRadius: '25px',
border: '1px solid #ddd', marginTop: '20px' }}
onChange={(e) => setSearch(e.target.value)}
/>

<div style={{ marginTop: '30px' }}>
{filteredPosts.map(post => (
<div key={post.id} style={{ border: '1px solid #eee', padding:

'15px', borderRadius: '12px', marginBottom: '15px' }}>
<h3>{post.title} - <span style={{ color: '#ef4444'

}}>${post.price}</span></h3>

<p>📍 {post.location} | 类别: {post.category}</p>
<p style={{ color: '#666' }}>{post.description}</p>
<div style={{ background: '#f3f4f6', padding: '10px',
borderRadius: '6px' }}>联系方式: {post.contact_info}</div>

</div>
))}
</div>
</div>
);
}
