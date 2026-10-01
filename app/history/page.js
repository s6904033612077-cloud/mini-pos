'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function HistoryPage() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    const { data, error } = await supabase.from('sales').select('*').order('sold_at', { ascending: false });
    if (error) alert('ดึงข้อมูลล้มเหลว: ' + error.message);
    else setSales(data || []);
  }

  const grandTotal = sales.reduce((sum, item) => sum + Number(item.total_price), 0);

  return (
    <div>
      <h2>ประวัติการขาย</h2>
      <div className="card" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
        <h3 style={{ margin: 0, color: '#065f46' }}>ยอดขายสะสมรวมทั้งหมด: {grandTotal.toLocaleString()} บาท</h3>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>วัน-เวลา</th>
              <th>ชื่อสินค้า</th>
              <th>จำนวน</th>
              <th>ยอดขายรวม</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(s => (
              <tr key={s.id}>
                <td>{new Date(s.sold_at).toLocaleString('th-TH')}</td>
                <td>{s.product_name}</td>
                <td>{s.quantity}</td>
                <td>{s.total_price} บาท</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
