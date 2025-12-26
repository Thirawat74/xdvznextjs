import React from 'react';
import { Badge } from '../ui/badge';

export interface PremiumService {
    name: string;
    id: number;
    description: string | null;
    price: number;
    stock: number;
}

interface PremiumServiceCardProps {
    service: PremiumService;
    onClick: (service: PremiumService) => void;
}

export function PremiumServiceCard({ service, onClick }: PremiumServiceCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    return (
        <div
            className='group relative overflow-hidden border p-2 cursor-pointer rounded-md'
            onClick={() => onClick(service)}
        >
            <img
                src="/image-product-app-p.png"
                className='w-full object-cover rounded-md'
                alt="product image"
            />
            <div className='mt-2'>
                <h5 className='text-sm font-medium line-clamp-1'>
                    {service.name}
                </h5>
                <div className='flex items-center justify-between mt-1'>
                    <p className='text-sm font-semibold'>
                        {formatPrice(service.price)}
                    </p>
                    <Badge variant={service.stock > 0 ? "default" : "secondary"} className='text-xs'>
                        {service.stock > 0 ? 'มีสินค้า' : 'หมด'}
                    </Badge>
                </div>
            </div>
        </div>
    );
}
