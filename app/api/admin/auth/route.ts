import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const ADMIN_CODE = "97864253";

export async function POST(request: Request) {
  try {
    const { code } = await request.json();

    if (code === ADMIN_CODE) {
      // Create response first
      const response = NextResponse.json({ success: true });
      
      // Use standard settings that work across most environments/iframes
      response.cookies.set('admin_token', 'validated_session_active', {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 4, // 4 hours
        path: '/',
      });

      return response;
    }

    return NextResponse.json({ success: false, error: 'Código inválido' }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Erro interno' }, { status: 500 });
  }
}
