import React from 'react'
import Link from 'next/link'

export default function page() {
    return (
        <main className='min-h-screen'>
            <section className='flex justify-center'>
                <div className='w-full max-w-5xl min-h-screen  border-x p-3'>

                    <div>
                        <h1 className="text-lg font-medium">บริการร้านค้าของเรา</h1>
                        <p className="text-muted-foreground text-xs">
                            บริการร้านค้าของเราทั้งหมด
                        </p>
                    </div>
                    <div className='mt-5 grid grid-cols-2 md:grid-cols-2 gap-3'>

                        <Link href={'/social'}>
                            <div className='w-full border flex justify-center items-center select-none cursor-pointer p-3 h-[150px] rounded-md hover:bg-zinc-50'>
                                <div className='text-center'>
                                    <h3 className='font-medium'>
                                        บริการปั้มโซเชียลมีเดีย
                                    </h3>
                                    <p className='text-muted-foreground text-xs'>
                                        Social Media
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link href={'/premium'}>
                            <div className='w-full border flex justify-center items-center select-none cursor-pointer p-3 h-[150px] rounded-md hover:bg-zinc-50'>
                                <div className='text-center'>
                                    <h3 className='font-medium'>
                                        บริการแอพพรีเมี่ยม
                                    </h3>
                                    <p className='text-muted-foreground text-xs'>
                                        Premium App
                                    </p>
                                </div>
                            </div>
                        </Link>

                        <Link href={'/topupgame'}>
                            <div className='w-full border flex justify-center items-center select-none cursor-pointer p-3 h-[150px] rounded-md hover:bg-zinc-50'>
                                <div className='text-center'>
                                    <h3 className='font-medium'>
                                        บริการเติมเงินเกม
                                    </h3>
                                    <p className='text-muted-foreground text-xs'>
                                        Topup Game
                                    </p>
                                </div>
                            </div>
                        </Link>

                    </div>

                </div>
            </section>
        </main>
    )
}