import { NextRequest, NextResponse } from 'next/server';

// Shared-secret admin gate for owner-only test/training routes.
// Fail-closed: when ADMIN_API_TOKEN is unset the route is disabled (403),
// never exposing a token or key. Returns a NextResponse to short-circuit,
// or null when the caller is authorized and the handler should proceed.
export function requireAdmin(request: NextRequest): NextResponse | null {
  const expected = process.env.ADMIN_API_TOKEN;
  if (!expected) {
    return NextResponse.json({ status: 'disabled' }, { status: 403 }); // fail closed
  }
  const provided = request.headers.get('x-admin-token');
  if (provided !== expected) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }
  return null; // authorized -> proceed
}
