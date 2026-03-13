'use server'

import { cookies } from 'next/headers'

/**
 * Ini adalah contoh Next.js Server Action untuk menghandle login secara aman.
 * Karena fungsi ini berjalan di server Node.js Next, kita bisa langsung set HTTP-Only Cookie.
 */
export async function loginUser(formData: FormData) {
    const email = formData.get('email')
    const password = formData.get('password')

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8088'

    // Pastikan memanggil backend Golang
    const res = await fetch(`${backendUrl}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
        throw new Error('Login failed! Invalid credentials.')
    }

    // Sesuai respon utils.JsonOK() dari Golang kita sebelumnya: { data: { token: "...", user: {...} } }
    const payload = await res.json()
    const token = payload.data.token

    // SIMPAN TOKEN KE DALAM COOKIE!
    // Proxy.ts kelak akan secara otomatis membaca cookie header bernama 'token' ini
    const cookieStore = await cookies()
    cookieStore.set('token', token, {
        httpOnly: true, // Tidak bisa dibaca xss via document.cookie
        secure: process.env.NODE_ENV === 'production', // True jika dideploy pakai https (Caddy)
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 1 hari (sesuai backend ext: 24h)
    })

    return payload.data.user
}
