import { NextResponse } from 'next/server';
import db from '@/lib/db';

// GET all tours
export async function GET() {
  try {
    const [rows] = await db.query('SELECT * FROM tours ORDER BY created_at DESC');
    return NextResponse.json(rows);
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to fetch tours' }, { status: 500 });
  }
}

// POST new tour
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      slug, duration_days, price_usd, difficulty, 
      group_min, group_max, image_url, 
      name_en, name_ru, name_ky,
      desc_en, desc_ru, desc_ky,
      includes_en
    } = body;

    const [result] = await db.query(
      `INSERT INTO tours (
        slug, duration_days, price_usd, difficulty, 
        group_min, group_max, image_url, 
        name_en, name_ru, name_ky,
        desc_en, desc_ru, desc_ky,
        includes_en
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        slug, duration_days, price_usd, difficulty, 
        group_min, group_max, image_url, 
        name_en, name_ru, name_ky,
        desc_en, desc_ru, desc_ky,
        JSON.stringify(includes_en || [])
      ]
    );

    return NextResponse.json({ message: 'Tour created successfully', id: (result as any).insertId });
  } catch (error) {
    console.error('DB Error:', error);
    return NextResponse.json({ error: 'Failed to create tour' }, { status: 500 });
  }
}
