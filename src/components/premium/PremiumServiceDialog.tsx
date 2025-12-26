import React, { useState } from 'react';
import { Button } from '../ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ShoppingCart, Eye, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { PremiumService } from './PremiumServiceCard';

interface PremiumServiceDialogProps {
    service: PremiumService | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PremiumServiceDialog({ service, open, onOpenChange }: PremiumServiceDialogProps) {
    const [purchasing, setPurchasing] = useState(false);
    const { isAuth, user, login } = useAuth();

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(price);
    };

    const handlePurchase = async () => {
        if (!service) return;

        setPurchasing(true);

        try {
            const response = await fetch('/api/v1/premium/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    id: service.id
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('สั่งซื้อสำเร็จ!', {
                    description: `ได้รับสินค้าแล้ว ตรวจสอบข้อมูลในบัญชีของคุณ`
                });

                // Update user balance in context
                if (user && data.data?.user?.balance !== undefined) {
                    const updatedUser = {
                        ...user,
                        balance: parseFloat(data.data.user.balance)
                    };
                    const token = localStorage.getItem('auth_token');
                    if (token) {
                        await login(token, updatedUser);
                    }
                }

                // Close dialog
                onOpenChange(false);

            } else {
                toast.error('สั่งซื้อล้มเหลว', {
                    description: data.message || 'เกิดข้อผิดพลาดในการสั่งซื้อ'
                });
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('เกิดข้อผิดพลาดในการสั่งซื้อ', {
                description: 'กรุณาลองใหม่อีกครั้ง'
            });
        } finally {
            setPurchasing(false);
        }
    };

    if (!service) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[80vh]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {service.name}
                    </DialogTitle>
                    <DialogDescription>
                        รายละเอียดสินค้าและบริการ
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="max-h-[60vh] pr-4">
                    <div className="space-y-4">
                        {/* Product Image */}
                        <div className="flex justify-center">
                            <img
                                src="/image-product-app-p.png"
                                className='w-full object-cover rounded-lg'
                                alt="product image"
                            />
                        </div>

                        {/* Price and Stock */}
                        <div className="flex items-center justify-between p-4 border rounded-md">
                            <div>
                                <p className="text-sm">ราคา</p>
                                <p className="text-2xl font-bold">
                                    {formatPrice(service.price)}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">สถานะสินค้า</p>
                                <Badge
                                    variant={service.stock && service.stock > 0 ? "default" : "secondary"}
                                    className='text-xs'
                                >
                                    {service.stock && service.stock > 0 ? 'มีสินค้า' : 'หมด'}
                                </Badge>
                            </div>
                        </div>

                        {/* User Balance Info */}
                        {isAuth && user && (
                            <div className="p-4 border rounded-md">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium">ยอดเงินคงเหลือ</p>
                                        <p className="text-lg font-bold">
                                            {formatPrice(user.balance || 0)}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600">หลังซื้อ</p>
                                        <p className={`text-lg font-bold ${(user.balance || 0) >= service.price ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatPrice((user.balance || 0) - service.price)}
                                        </p>
                                    </div>
                                </div>
                                {(user.balance || 0) < service.price && (
                                    <p className="text-xs text-red-600 mt-2">
                                        ยอดเงินคงเหลือไม่เพียงพอสำหรับการซื้อสินค้านี้
                                    </p>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        {service.description && (
                            <div>
                                <h4 className="font-medium mb-2">รายละเอียดสินค้า</h4>
                                <div
                                    className="prose prose-sm max-w-none text-muted-foreground text-sm p-2 border rounded-md"
                                    dangerouslySetInnerHTML={{
                                        __html: service.description
                                    }}
                                />
                            </div>
                        )}

                        {/* Service Info */}
                        <div className="grid grid-cols-2 gap-4 rounded-lg">
                            <div>
                                <p className="text-sm font-medium text-gray-600">รหัสสินค้า</p>
                                <p className="font-mono text-sm">{service.id}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-600">ประเภท</p>
                                <p className="text-sm">แอพพรีเมี่ยม</p>
                            </div>
                        </div>
                    </div>
                </ScrollArea>

                <div className="flex gap-2 pt-4">
                    {isAuth ? (
                        <>
                            <Button
                                className='flex-1 cursor-pointer'
                                disabled={
                                    !service.stock ||
                                    service.stock <= 0 ||
                                    purchasing ||
                                    Boolean(user && (user.balance || 0) < service.price)
                                }
                                onClick={handlePurchase}
                            >
                                <ShoppingCart className="w-4 h-4 mr-2" />
                                {purchasing ? 'กำลังสั่งซื้อ...' : 'ซื้อเลย'}
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button variant={'default'} disabled>
                                <LogIn className="w-4 h-4 mr-2" />
                                ต้องการซื้อสินค้า กรุณาเข้าสู่ระบบ
                            </Button>
                        </>
                    )}

                    <Button
                        variant="outline"
                        className='flex-1 cursor-pointer'
                        onClick={() => onOpenChange(false)}
                        disabled={purchasing}
                    >
                        <Eye className="w-4 h-4 mr-2" />
                        ปิด
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
