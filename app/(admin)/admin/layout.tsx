'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import {
    LayoutDashboard,
    Package,
    ShoppingCart,
    LogOut,
    Menu,
    X,
    User
} from 'lucide-react'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null)
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user || user.app_metadata.role !== 'admin') {
                // Middleware should handle this, but client-side check is good
                setIsAdmin(false)
                if (pathname !== '/admin/login') {
                    router.push('/admin/login')
                }
            } else {
                setIsAdmin(true)
            }
        }
        checkUser()
    }, [pathname, router, supabase.auth])

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/admin/login')
        router.refresh()
    }

    // If on login page, render children without layout
    if (pathname === '/admin/login') {
        return <>{children}</>
    }

    // While checking status, or if denied
    if (isAdmin === null) return null // Or a loading spinner
    if (isAdmin === false) return null

    const navigation = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    ]

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:inset-auto lg:flex lg:flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <span className="text-xl font-bold text-timber">Colmar Admin</span>
                    <button
                        className="lg:hidden text-gray-500"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={24} />
                    </button>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-md transition-colors ${isActive
                                        ? 'bg-timber/10 text-timber'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-timber' : 'text-gray-400'}`} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t">
                    <div className="flex items-center mb-4 px-4">
                        <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <User size={16} />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-gray-700">Admin User</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sign Out
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Topbar (Mobile only mostly) */}
                <header className="lg:hidden bg-white shadow-sm h-16 flex items-center justify-between px-4">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-gray-500 focus:outline-none"
                    >
                        <Menu size={24} />
                    </button>
                    <span className="font-semibold text-gray-900">Dashboard</span>
                    <div className="w-6"></div> {/* Spacer for centering if needed */}
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                    {children}
                </main>
            </div>
        </div>
    )
}
