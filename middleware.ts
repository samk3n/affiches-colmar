import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let response = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => {
                        request.cookies.set(name, value)
                    })
                    response = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        response.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Protect /admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
        const role = user?.app_metadata?.role;

        // Rule A: Login page logic
        if (request.nextUrl.pathname === '/admin/login') {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin/dashboard', request.url))
            }
            // Allow access to login page
            return response
        }

        // Rule B & C: Protect dashboard and other admin routes
        if (role !== 'admin') {
            // If customer, redirect to Home
            if (user) {
                return NextResponse.redirect(new URL('/', request.url))
            }
            // If anon, redirect to admin login
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return response
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}
