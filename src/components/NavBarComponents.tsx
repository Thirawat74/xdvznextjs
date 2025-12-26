"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Separator } from "@/components/ui/separator"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, User, CreditCard, Star, TrendingUp, Users, UserPlus, Mail, MessageSquare, MoreHorizontal, FileText, Wrench, Code, Home, ShoppingBag, Package, ChevronDown, Settings, LogOut, Menu, X } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogTrigger,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from '@/context/AuthContext'
import SignInAndSignUp from './signinandsignup/SignInAndSignUp'
import SearchNav from './SearchNav'

export default function NavBarComponents() {
    const { isAuth, user, logout } = useAuth()
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className='border-b bg-white flex justify-center px-3 py-3 md:py-5 sticky top-0 z-50'>
            <div className='w-full max-w-5xl flex justify-between items-center'>

                <div>
                    <Link href={'/'}>
                        <h2 className='gg text-sm md:text-base font-semibold'>
                            Ginly <span className='text-transparent bg-clip-text bg-linear-to-tr from-blue-700 to-blue-300'>Store</span>
                        </h2>
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className='hidden md:block'>
                    <ul className='flex'>
                        <li>
                            <SearchNav />
                        </li>
                        <li>
                            <Button variant={'ghost'}>
                                <Link href={'/'} className="flex items-center">
                                    <Home className="mr-2 h-4 w-4" />
                                    หน้าหลัก
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <Button variant={'ghost'}>
                                <Link href={'/store'} className="flex items-center">
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    ร้านค้า
                                </Link>
                            </Button>
                        </li>
                        <li>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'ghost'} className='cursor-pointer'>
                                        บริการ <ChevronDown className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuGroup>
                                        <DropdownMenuItem asChild>
                                            <Link href='/premium'>
                                                <Star className="mr-2 h-4 w-4" />
                                                แอพพรีเมี่ยม
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href='/topupgame'>
                                                <CreditCard className="mr-2 h-4 w-4" />
                                                เติมเกม
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href='/social'>
                                                <TrendingUp className="mr-2 h-4 w-4" />
                                                ปั้มโซเชียล
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuGroup>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <FileText className="mr-2 h-4 w-4" />
                                        โค้ดสั่งซื้อ
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <Wrench className="mr-2 h-4 w-4" />
                                        เครื่องมือ
                                    </DropdownMenuItem>
                                    <DropdownMenuItem disabled>
                                        <Code className="mr-2 h-4 w-4" />
                                        Open API
                                        <DropdownMenuShortcut>Closed</DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </li>
                        <li>
                            <Button variant={'ghost'}>
                                <Link href={'/topup'} className="flex items-center">
                                    <CreditCard className="mr-2 h-4 w-4" />
                                    เติมเงิน
                                </Link>
                            </Button>
                        </li>
                    </ul>
                </div>

                {/* Mobile Menu Button */}
                <div className='md:hidden'>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setMobileMenuOpen(true)}
                        className="p-2"
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                </div>
                {/* Desktop User Menu */}
                <div className='hidden md:block'>
                    {isAuth ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" className="cursor-pointer flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    <p className='text-xs max-w-[70px] line-clamp-1'>{user?.username}</p>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Link href="/account" className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                โปรไฟล์
                                            </Link>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>
                                                    <Link href={'/account/setting'} className="flex items-center">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        ตั้งค่า
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href={'/account/setting/security'} className="flex items-center">
                                                        <Wrench className="mr-2 h-4 w-4" />
                                                        ความปลอดภัย
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuGroup>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Link href="/account" className="flex items-center">
                                                <User className="mr-2 h-4 w-4" />
                                                ประวัติการทำรายการ
                                            </Link>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>
                                                    <Link href={'/account/history/premium'} className="flex items-center">
                                                        <Settings className="mr-2 h-4 w-4" />
                                                        แอพพรีเมี่ยม
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href={'/account/history/topup'} className="flex items-center">
                                                        <CreditCard className="mr-2 h-4 w-4" />
                                                        เติมเกม
                                                    </Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Link href={'/account/history/social'} className="flex items-center">
                                                        <TrendingUp className="mr-2 h-4 w-4" />
                                                        ปั้มโซเชียล
                                                    </Link>
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                    </DropdownMenuSub>
                                </DropdownMenuGroup>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                    onClick={logout}
                                    className="text-red-600 focus:text-red-600"
                                >
                                    <LogOut className="mr-2 h-4 w-4" />
                                    ออกจากระบบ
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <SignInAndSignUp />
                    )}
                </div>


                {/* Mobile Menu Dialog */}
                <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <DialogContent className='h-[50vh] overflow-y-auto'>
                        <DialogHeader>
                            <DialogTitle className="flex items-center justify-between">
                                เมนู
                            </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-3">
                            {/* Search */}
                            <div>
                                <SearchNav />
                            </div>

                            <Separator />

                            {/* Navigation Links */}
                            <div className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                                        <Home className="mr-3 h-5 w-5" />
                                        หน้าหลัก
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/store" onClick={() => setMobileMenuOpen(false)}>
                                        <ShoppingBag className="mr-3 h-5 w-5" />
                                        ร้านค้า
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/premium" onClick={() => setMobileMenuOpen(false)}>
                                        <Star className="mr-3 h-5 w-5" />
                                        แอพพรีเมี่ยม
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/topupgame" onClick={() => setMobileMenuOpen(false)}>
                                        <CreditCard className="mr-3 h-5 w-5" />
                                        เติมเกม
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/social" onClick={() => setMobileMenuOpen(false)}>
                                        <TrendingUp className="mr-3 h-5 w-5" />
                                        ปั้มโซเชียล
                                    </Link>
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" asChild>
                                    <Link href="/topup" onClick={() => setMobileMenuOpen(false)}>
                                        <CreditCard className="mr-3 h-5 w-5" />
                                        เติมเงิน
                                    </Link>
                                </Button>
                            </div>

                            <Separator />

                            {/* User Menu (if authenticated) */}
                            {isAuth ? (
                                <div className="space-y-2">
                                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                                        <p className="text-sm font-medium">สวัสดี, {user?.username}</p>
                                    </div>

                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/account" onClick={() => setMobileMenuOpen(false)}>
                                            <User className="mr-3 h-5 w-5" />
                                            โปรไฟล์
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/account/history/premium" onClick={() => setMobileMenuOpen(false)}>
                                            <Settings className="mr-3 h-5 w-5" />
                                            ประวัติแอพพรีเมี่ยม
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/account/history/topup" onClick={() => setMobileMenuOpen(false)}>
                                            <CreditCard className="mr-3 h-5 w-5" />
                                            ประวัติเติมเกม
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/account/history/social" onClick={() => setMobileMenuOpen(false)}>
                                            <TrendingUp className="mr-3 h-5 w-5" />
                                            ประวัติปั้มโซเชียล
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/account/setting" onClick={() => setMobileMenuOpen(false)}>
                                            <Settings className="mr-3 h-5 w-5" />
                                            ตั้งค่า
                                        </Link>
                                    </Button>

                                    <Button variant="ghost" className="w-full justify-start" asChild>
                                        <Link href="/account/setting/security" onClick={() => setMobileMenuOpen(false)}>
                                            <Wrench className="mr-3 h-5 w-5" />
                                            ความปลอดภัย
                                        </Link>
                                    </Button>

                                    <Separator />

                                    <Button
                                        variant="ghost"
                                        className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => {
                                            logout();
                                            setMobileMenuOpen(false);
                                        }}
                                    >
                                        <LogOut className="mr-3 h-5 w-5" />
                                        ออกจากระบบ
                                    </Button>
                                </div>
                            ) : (
                                <>
                                    <SignInAndSignUp />
                                </>
                            )}

                            {/* Additional Menu Items */}
                            <div className="space-y-2">
                                <Button variant="ghost" className="w-full justify-start" disabled>
                                    <FileText className="mr-3 h-5 w-5" />
                                    โค้ดสั่งซื้อ
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" disabled>
                                    <Wrench className="mr-3 h-5 w-5" />
                                    เครื่องมือ
                                </Button>

                                <Button variant="ghost" className="w-full justify-start" disabled>
                                    <Code className="mr-3 h-5 w-5" />
                                    Open API (ปิด)
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </nav>
    )
}