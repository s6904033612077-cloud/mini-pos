'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function SellPage() {
  const [products, setProducts] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('name');
    setProducts(data || []);
  }

  const selectedProduct = products.find(p => p.id === selectedId);
  const totalPrice = selectedProduct ? selectedProduct.price * quantity : 0;

  async function handleSell(e) {
    e.preventDefault();
    if (!selectedProduct) return alert('กรุณาเลือกสินค้า');
    if (quantity <= 0) return alert('จำนวนต้องมากกว่า 0');
    if (selectedProduct.stock < quantity) return alert('สินค้าในสต๊อกมีไม่พอ!');

    // 1. บันทึกประวัติการขาย
    const { error: saleError } = await supabase.from('sales').insert([{
      product_id: selectedProduct.id,
      product_name: selectedProduct.name,
      quantity: Number(quantity),
      total_price: totalPrice
    }]);

    if (saleError) return alert('บันทึกการขายล้มเหลว: ' + saleError.message);

    // 2. หักสต๊อกสินค้า
    const { error: updateError } = await supabase.from('products').update({
      stock: selectedProduct.stock - Number(quantity)
    }).eq('id', selectedProduct.id);

    if (updateError) alert('หักสต๊อกล้มเหลว: ' + updateError.message);
    else {
      alert('ทำรายการขายสำเร็จ!');
      setSelectedId('');
      setQuantity(1);
      fetchProducts();
    }
  }

  return (
    <div>
      <h2>ขายสินค้า</h2>
      <div className="card">
        <form onSubmit={handleSell}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>เลือกสินค้า:</label>
            <select value={selectedId} onChange={e => setSelectedId(e.target.value)} style={{ width: '100%' }} required>
              <option value="">-- เลือกรายการสินค้า --</option>
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} (เหลือ: {p.stock} {p.unit}) - {p.price} บาท
                </option>
              ))}
            </select>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>จำนวนที่ขาย:</label>
            <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ width: '100%' }} required />
          </div>

          <div style={{ background: '#f1f5f9', padding: '1rem', borderRadius: '4px', marginBottom: '1rem' }}>
            <h3>ราคารวมทั้งหมด: <span style={{ color: '#2563eb' }}>{totalPrice}</span> บาท</h3>
          </div>

          <button type="submit" style={{ width: '100%', padding: '0.75rem', fontSize: '1.1rem' }}>ยืนยันการขาย</button>
        </form>
      </div>
    </div>
  );
}
