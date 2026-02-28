import { NextResponse } from "next/server";

// Stripe checkout removed — orders are placed via WhatsApp
export async function POST() {
    return NextResponse.json({ message: "Not in use" }, { status: 410 });
}
