import { NextResponse } from "next/server";

// Stripe webhook removed — checkout is handled via WhatsApp
export async function POST() {
    return NextResponse.json({ message: "Not in use" }, { status: 410 });
}
