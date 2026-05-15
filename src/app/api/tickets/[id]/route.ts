import { NextResponse } from 'next/server';
import { mockTickets } from '@/lib/tickets';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const ticket = mockTickets.find((t) => t.id === params.id);
  if (!ticket) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(ticket);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  return NextResponse.json({ message: `Ticket ${params.id} updated`, data: body });
}
