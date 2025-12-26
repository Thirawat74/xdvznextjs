import React from 'react'

export default function page() {
    return (
        <main className='min-h-screen'>
            <section className='flex justify-center'>
                <div className='w-full max-w-5xl border-x min-h-screen'>

                    <div className='p-3 text-base border-b'>
                        <h1 className='font-semibold'>
                            เติมเงินเข้าสู่ระบบ
                        </h1>
                        <p className='text-xs text-muted-foreground'>
                            เติมเงินเพื่อสั่งซื้อสินค้าหรือบริการ
                        </p>
                    </div>

                    <div className='p-3'>
                        <p className='text-sm text-center text-destructive'>
                            ไม่มีต่อ API Payment Gateway
                        </p>
                    </div>

                </div>
            </section>
        </main>
    )
}