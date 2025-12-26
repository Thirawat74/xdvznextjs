import React from 'react';
import { Badge } from '../ui/badge';

export interface TopupGame {
    name: string;
    key: string;
    items: {
        name: string;
        sku: string;
        price: string;
    }[];
    inputs: {
        key: string;
        title: string;
        type: string;
        placeholder: string;
        options?: {
            label: string;
            value: string;
        }[];
    }[];
}

interface TopupGameCardProps {
    game: TopupGame;
    onClick: (game: TopupGame) => void;
}

export function TopupGameCard({ game, onClick }: TopupGameCardProps) {
    // Get the minimum price from items
    const minPrice = Math.min(...game.items.map(item => parseFloat(item.price) || 0));
    const maxPrice = Math.max(...game.items.map(item => parseFloat(item.price) || 0));

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    return (
        <div
            className='group relative overflow-hidden border p-3 cursor-pointer rounded-md hover:bg-gray-50 transition-colors'
            onClick={() => onClick(game)}
        >
            <div className='flex items-start gap-3'>
                <img
                    src={'/image-product-g.png'}
                    className='w-10 h-10 border p-1 rounded-md shrink-0'
                    alt={game.name}
                />

                <div className='flex-1 min-w-0'>
                    <h4 className='font-medium text-sm line-clamp-2 mb-1'>
                        {game.name}
                    </h4>

                    <div className='flex flex-wrap items-center gap-2 text-xs text-muted-foreground'>
                        <Badge variant="outline" className='text-black rounded-md'>
                            {game.items.length} แพ็คเกจ
                        </Badge>

                        {minPrice === maxPrice ? (
                            <Badge variant="secondary" className='text-xs'>
                                ฿ {minPrice.toFixed(2)}
                            </Badge>
                        ) : (
                            <Badge variant="secondary" className='text-xs'>
                                ฿ {minPrice.toFixed(2)} - ฿ {maxPrice.toFixed(2)}
                            </Badge>
                        )}
                    </div>

                    {game.inputs.length > 0 && (
                        <p className='text-xs text-muted-foreground mt-1'>
                            ต้องใส่: {game.inputs.map(input => input.title).join(', ')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
