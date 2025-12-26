import React from 'react'
import { FlickeringGrid } from "@/components/ui/flickering-grid"
import { Bell } from 'lucide-react'

export default function NotifyMessage() {
    return (
        <section className='flex justify-center border-b'>
            <div className='w-full max-w-5xl border-x px-3 py-3 relative'>

                <div className='absolute inset-0 z-0 opacity-50'>
                    <FlickeringGrid
                        className="size-full"
                        squareSize={4}
                        gridGap={2}
                        color="#00bfff"
                        maxOpacity={0.5}
                        flickerChance={0.1}
                    />
                </div>
                <div className='bg-linear-to-tr from-background to-transparent absolute inset-0' />

                <div className='relative flex items-center space-x-3'>
                    <div className='border p-2 rounded-md bg-zinc-50'>
                        <Bell className='size-4' />
                    </div>
                    <p className='text-sm'>
                        บริการสั่งซื้อสินค้าได้ที่เว็บนี้ เพื่อรับสินค้าได้ง่ายขึ้น เว็บปั้มโซเชียลสำหรับสินค้าแต่ละค่าย
                    </p>
                </div>

            </div>
        </section>
    )
}