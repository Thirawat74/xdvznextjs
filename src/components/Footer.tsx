import React from 'react'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className='flex justify-center border-t'>
            <div className='w-full max-w-5xl border-x'>
                <div className='p-3'>
                    <Link href={'/'}>
                        <h2 className='gg text-base font-semibold'>
                            Ginly <span className='text-transparent bg-clip-text bg-linear-to-tr from-blue-700 to-blue-300'>Store</span>
                        </h2>
                    </Link>
                    <p className='text-xs text-muted-foreground'>
                        บริการปั้มโซเชียลมิเดีย สินค้าแต่ละค่าย แอพพรีเมี่ยม เติมเงินเกม ครบทุกค่าย
                    </p>
                </div>
                <div className='border-t block sm:flex items-center justify-between p-3'>
                    <p className='text-xs text-muted-foreground text-center sm:text-left'>
                        ลิขสิทธิ์ © {new Date().getFullYear()} Ginly Store สงวนลิขสิทธิ์ทุกประการ
                    </p>
                    <div className='flex items-center space-x-2 mt-3 sm:mt-0 justify-center sm:justify-start'>
                        <p className='text-xs text-muted-foreground hover:underline'>
                            <Link href={'/privacy-policy'}>
                                นโยบายความเป็นส่วนตัว
                            </Link>
                        </p>
                        <p className='text-xs text-muted-foreground hover:underline'>
                            <Link href={'/terms-of-service'}>
                                เงื่อนไข
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    )
}