import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Di Next.js 16+, file ini bisa bernama proxy.ts atau middleware.ts (jika legacy).
// Posisi file WAJIB berada di root sejajar dengan package.json (di dalam folder /fe), 
// JANGAN dimasukkan ke dalam folder /app atau /src.

export function proxy(request: NextRequest) {
    // 1. Baca isi Cookie browser yang dikirimkan oleh klien ke server Next.js Edge
    const token = request.cookies.get('token')?.value;

    const url = request.nextUrl.clone();
    const path = url.pathname;

    // Daftar path yang membutuhkan autentikasi
    const protectedAuthPaths = ['/account', '/checkout', '/wishlist'];
    const isProtectedPath = protectedAuthPaths.some(p => path.startsWith(p));

    // Daftar path admin
    const isAdminPath = path.startsWith('/admin');

    // 2. Jika user mencoba akses protected path TAPI token tidak ada di Cookie, tolak!
    if (isProtectedPath && !token) {
        url.pathname = '/login';
        url.searchParams.set('redirect', path);
        return NextResponse.redirect(url);
    }

    if (isAdminPath && !token) {
        url.pathname = '/login';
        url.searchParams.set('redirect', path);
        return NextResponse.redirect(url);
    }

    // 3. Jika user sudah login (punya token) tapi mencoba buka /login atau /register lagi
    const authPaths = ['/login', '/register'];
    const isAuthPath = authPaths.some(p => path.startsWith(p));

    if (isAuthPath && token) {
        url.pathname = '/account'; // Redirect ke dashboard user
        return NextResponse.redirect(url);
    }

    // Jika kondisi aman, lanjutkan request ke handler komponen page
    return NextResponse.next();
}

export const config = {
    // Hanya jalankan middleware ini pada path halaman, JANGAN jalankan pada file statis atau API
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
