import React from 'react'
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"

export default function ImageSlider() {
    return (
        <section className='flex justify-center border-b'>
            <div className='w-full max-w-5xl border-x px-3 py-3'>
                <Carousel>
                    <CarouselContent>
                        <CarouselItem>
                            <div>
                                <img src="/bannerginlystore2.png" className='w-full rounded-md' alt="" />
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div>
                                <img src="/bannerginlystore2.png" className='w-full rounded-md' alt="" />
                            </div>
                        </CarouselItem>
                        <CarouselItem>
                            <div>
                                <img src="/bannerginlystore2.png" className='w-full rounded-md' alt="" />
                            </div>
                        </CarouselItem>
                    </CarouselContent>
                    <div className='hidden md:block'>
                        <CarouselPrevious />
                        <CarouselNext />
                    </div>
                </Carousel>
            </div>
        </section>
    )
}