import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await db.query(`
      SELECT b.*, t.name_en as tour_name 
      FROM bookings b 
      LEFT JOIN tours t ON b.tour_id = t.id 
      ORDER BY b.created_at DESC
    `);
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, status } = await request.json();
    await db.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    return NextResponse.json({ message: 'Status updated' });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}
