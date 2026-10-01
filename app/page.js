'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ sku: '', name: '', price: '', stock: '', unit: 'ชิ้น' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (error) alert('ดึงข้อมูลล้มเหลว: ' + error.message);
    else setProducts(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (editingId) {
      const { error } = await supabase.from('products').update({
        sku: form.sku, name: form.name, price: Number(form.price), stock: Number(form.stock), unit: form.unit
      }).eq('id', editingId);
      if (error) alert('แก้ไขล้มเหลว: ' + error.message);
      else { setEditingId(null); fetchProducts(); resetForm(); }
    } else {
      const { error } = await supabase.from('products').insert([{
        sku: form.sku, name: form.name, price: Number(form.price), stock: Number(form.stock), unit: form.unit
      }]);
      if (error) alert('เพิ่มล้มเหลว: ' + error.message);
      else { fetchProducts(); resetForm(); }
    }
  }

  function resetForm() {
    setForm({ sku: '', name: '', price: '', stock: '', unit: 'ชิ้น' });
  }

  function handleEdit(p) {
    setEditingId(p.id);
    setForm({ sku: p.sku, name: p.name, price: p.price, stock: p.stock, unit: p.unit });
  }

  async function handleDelete(id) {
    if (!confirm('ยืนยันที่จะลบสินค้านี้?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) alert('ลบล้มเหลว: ' + error.message);
    else fetchProducts();
  }

  return (
    <div>
      <h2>จัดการสินค้า</h2>
      <div className="card">
        <h3>{editingId ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid-form">
            <input placeholder="SKU" value={form.sku} onChange={e => setForm({...form, sku: e.target.value})} required />
            <input placeholder="ชื่อสินค้า" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input type="number" placeholder="ราคา" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <input type="number" placeholder="สต๊อก" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} required />
            <input placeholder="หน่วย" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} required />
          </div>
          <button type="submit">{editingId ? 'อัปเดต' : 'เพิ่มสินค้า'}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); resetForm(); }} style={{ marginLeft: '0.5rem', backgroundColor: '#64748b' }}>ยกเลิก</button>}
        </form>
      </div>

      <div className="card">
        <h3>รายการสินค้าทั้งหมด</h3>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>ชื่อสินค้า</th>
              <th>ราคา</th>
              <th>คงเหลือ</th>
              <th>หน่วย</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.unit}</td>
                <td>
                  <button onClick={() => handleEdit(p)} style={{ marginRight: '0.5rem' }}>แก้ไข</button>
                  <button className="btn-danger" onClick={() => handleDelete(p.id)}>ลบ</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
