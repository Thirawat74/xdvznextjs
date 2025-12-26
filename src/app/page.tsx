import React from 'react'
import ImageSlider from '@/components/home/ImageSlider'
import NotifyMessage from '@/components/home/NotifyMessage'
import ServicePremium from '@/components/home/ServicePremium'
import ServiceTopUpGame from '@/components/home/ServiceTopUpGame'
import ServicePupSocial from '@/components/home/ServicePupSocial'

export default function page() {
  return (
    <main className='min-h-screen'>
      <ImageSlider />
      <NotifyMessage />
      <ServicePremium />
      <ServiceTopUpGame />
      <ServicePupSocial />
    </main>
  )
}