import { auth } from "@/auth";
import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    const data = await req.json();

    const {
      item_type,
      tour_id,
      hotel_id,
      transport_id,
      full_name,
      email,
      phone,
      preferred_date,
      guests,
      special_requests
    } = data;

    // Save to DB
    const [result]: any = await pool.query(
      `INSERT INTO bookings 
      (user_id, item_type, tour_id, hotel_id, transport_id, full_name, email, phone, preferred_date, guests, special_requests, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
      [
        session?.user ? (session.user as any).id : null,
        item_type || 'tour',
        tour_id || null,
        hotel_id || null,
        transport_id || null,
        full_name,
        email,
        phone,
        preferred_date,
        guests || 1,
        special_requests || ''
      ]
    );

    return NextResponse.json({ success: true, bookingId: result.insertId });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
