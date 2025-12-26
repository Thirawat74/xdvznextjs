"use client";

import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { SocialService } from './SocialServiceCard';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'sonner';

interface SocialServiceDialogProps {
    service: SocialService | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function SocialServiceDialog({ service, open, onOpenChange }: SocialServiceDialogProps) {
    const { user, isAuth } = useAuth();
    const [purchasing, setPurchasing] = useState(false);
    const [formData, setFormData] = useState({
        link: '',
        quantity: '',
        runs: '',
        interval: ''
    });

    // Check authentication when dialog opens
    React.useEffect(() => {
        if (open && !isAuth) {
            onOpenChange(false);
            toast.error('กรุณาเข้าสู่ระบบก่อนสั่งซื้อบริการ');
        }
    }, [open, isAuth, onOpenChange]);

    const resetForm = () => {
        setFormData({
            link: '',
            quantity: '',
            runs: '',
            interval: ''
        });
    };

    const handleClose = () => {
        onOpenChange(false);
        resetForm();
    };

    const handlePurchase = async () => {
        if (!service) return;

        // Validate form
        if (!formData.link.trim()) {
            toast.error('กรุณาป้อนลิงก์');
            return;
        }

        if (!formData.quantity || parseInt(formData.quantity) < parseInt(service.min)) {
            toast.error(`จำนวนขั้นต่ำคือ ${service.min}`);
            return;
        }

        if (parseInt(formData.quantity) > parseInt(service.max)) {
            toast.error(`จำนวนสูงสุดคือ ${service.max}`);
            return;
        }

        // Calculate price
        const quantity = parseInt(formData.quantity);
        const rate = parseFloat(service.rate);
        const price = (rate * quantity) / 1000;

        // Check balance
        const userBalance = user?.balance || 0;
        if (userBalance < price) {
            toast.error('ยอดเงินคงเหลือไม่เพียงพอ');
            return;
        }

        setPurchasing(true);

        try {
            const response = await fetch('/api/v1/social/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
                },
                body: JSON.stringify({
                    service: service.service,
                    link: formData.link.trim(),
                    quantity: quantity,
                    runs: formData.runs ? parseInt(formData.runs) : undefined,
                    interval: formData.interval ? parseInt(formData.interval) : undefined
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('สั่งซื้อสำเร็จ!');
                // Update user balance in context if needed
                if (data.data?.user?.balance) {
                    // You might want to update the auth context here
                }
                handleClose();
            } else {
                toast.error(data.message || 'การสั่งซื้อล้มเหลว');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('เกิดข้อผิดพลาดในการสั่งซื้อ');
        } finally {
            setPurchasing(false);
        }
    };

    const calculatePrice = () => {
        if (!service || !formData.quantity) return 0;
        const quantity = parseInt(formData.quantity) || 0;
        const rate = parseFloat(service.rate) || 0;
        return (rate * quantity) / 1000;
    };

    const getCategoryIcon = (category: string) => {
        const categoryLower = category.toLowerCase();
        if (categoryLower.includes('instagram')) return '/icons/instagram.png';
        if (categoryLower.includes('facebook')) return '/icons/facebook.png';
        if (categoryLower.includes('tiktok')) return '/icons/tiktok.png';
        if (categoryLower.includes('twitter')) return '/icons/twitter.png';
        if (categoryLower.includes('youtube')) return '/icons/youtube.png';
        if (categoryLower.includes('linkedin')) return '/icons/LinkedIn.png';
        if (categoryLower.includes('telegram')) return '/icons/telegram.png';
        return '/icons/shopee.png';
    };

    if (!service || !isAuth) return null;

    const price = calculatePrice();
    const userBalance = user?.balance || 0;
    const canAfford = userBalance >= price;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <img
                            src={getCategoryIcon(service.category)}
                            className="w-6 h-6 border rounded"
                            alt={service.category}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/icons/shopee.png';
                            }}
                        />
                        สั่งซื้อบริการ
                    </DialogTitle>
                    <DialogDescription>
                        {service.name}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Service Info */}
                    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">ราคาต่อ 1,000</span>
                            <span className="text-sm font-bold">฿{parseFloat(service.rate).toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">ขั้นต่ำ</span>
                            <span className="text-sm">{service.min}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm">สูงสุด</span>
                            <span className="text-sm">{service.max}</span>
                        </div>
                        <div className="flex gap-2">
                            {service.refill && <Badge variant="secondary" className="text-xs">Refill</Badge>}
                            {service.cancel && <Badge variant="outline" className="text-xs">Cancel</Badge>}
                        </div>
                    </div>

                    <Separator />

                    {/* Order Form */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="link">ลิงก์ *</Label>
                            <Input
                                id="link"
                                type="url"
                                placeholder="https://..."
                                value={formData.link}
                                onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="quantity">จำนวน *</Label>
                            <Input
                                id="quantity"
                                type="number"
                                placeholder={`ขั้นต่ำ ${service.min}`}
                                min={service.min}
                                max={service.max}
                                value={formData.quantity}
                                onChange={(e) => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                                required
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="runs">Runs (ไม่บังคับ)</Label>
                                <Input
                                    id="runs"
                                    type="number"
                                    placeholder="1"
                                    min="1"
                                    value={formData.runs}
                                    onChange={(e) => setFormData(prev => ({ ...prev, runs: e.target.value }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="interval">Interval (ไม่บังคับ)</Label>
                                <Input
                                    id="interval"
                                    type="number"
                                    placeholder="นาที"
                                    min="1"
                                    value={formData.interval}
                                    onChange={(e) => setFormData(prev => ({ ...prev, interval: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Price Summary */}
                    {formData.quantity && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">ราคารวม</span>
                                <span className="text-lg font-bold text-blue-600">฿{price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center mt-1">
                                <span className="text-xs text-muted-foreground">ยอดคงเหลือหลังสั่งซื้อ</span>
                                <span className={`text-xs font-medium ${canAfford ? 'text-green-600' : 'text-red-600'}`}>
                                    ฿{(userBalance - price).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Balance Warning */}
                    {!canAfford && price > 0 && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                                ยอดเงินคงเหลือไม่เพียงพอ (คงเหลือ: ฿{userBalance.toFixed(2)})
                            </p>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={handleClose} disabled={purchasing}>
                        ยกเลิก
                    </Button>
                    <Button
                        onClick={handlePurchase}
                        disabled={purchasing || !canAfford || !formData.link || !formData.quantity}
                    >
                        {purchasing ? 'กำลังสั่งซื้อ...' : 'สั่งซื้อ'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
