import { NextResponse } from 'next/server';
import { mockTickets } from '@/lib/tickets';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(mockTickets);
}

export async function POST(request: Request) {
  const body = await request.json();
  return NextResponse.json({ message: 'Ticket created', data: body }, { status: 201 });
}
