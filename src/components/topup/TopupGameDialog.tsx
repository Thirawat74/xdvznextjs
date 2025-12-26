"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import { TopupGame } from './TopupGameCard';

interface TopupGameDialogProps {
    game: TopupGame | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    [key: string]: string;
}

export function TopupGameDialog({ game, open, onOpenChange }: TopupGameDialogProps) {
    const { isAuth, user } = useAuth();
    const [selectedItem, setSelectedItem] = useState<string>('');
    const [formData, setFormData] = useState<FormData>({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (game && open) {
            // Reset form when dialog opens
            setSelectedItem('');
            setFormData({});
        }
    }, [game, open]);

    const handleInputChange = (key: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handlePurchase = async () => {
        if (!isAuth) {
            toast.error('กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ');
            return;
        }

        if (!selectedItem) {
            toast.error('กรุณาเลือกแพ็คเกจ');
            return;
        }

        // Validate required inputs
        const missingInputs = game?.inputs.filter(input =>
            !formData[input.key] || formData[input.key].trim() === ''
        );

        if (missingInputs && missingInputs.length > 0) {
            toast.error(`กรุณากรอกข้อมูล: ${missingInputs.map(input => input.title).join(', ')}`);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/v1/topup/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({
                    product_key: game?.key,
                    item_sku: selectedItem,
                    input: formData
                })
            });

            const data = await response.json();

            if (data.success) {
                toast.success('สั่งซื้อสำเร็จ!');
                onOpenChange(false);
            } else {
                toast.error(data.message || 'การสั่งซื้อล้มเหลว');
            }
        } catch (error) {
            console.error('Purchase error:', error);
            toast.error('เกิดข้อผิดพลาดในการสั่งซื้อ');
        } finally {
            setLoading(false);
        }
    };

    const selectedItemData = game?.items.find(item => item.sku === selectedItem);

    if (!game) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <img
                            src="/image-product-g.png"
                            className="w-6 h-6 rounded"
                            alt={game.name}
                        />
                        {game.name}
                    </DialogTitle>
                    <DialogDescription>
                        เลือกแพ็คเกจและกรอกข้อมูลเพื่อทำการเติมเกม
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Package Selection */}
                    <div className="space-y-2">
                        <Label>เลือกแพ็คเกจ *</Label>
                        <Select value={selectedItem} onValueChange={setSelectedItem}>
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกแพ็คเกจ" />
                            </SelectTrigger>
                            <SelectContent>
                                {game.items.map((item) => (
                                    <SelectItem key={item.sku} value={item.sku}>
                                        <div className="flex justify-between items-center w-full">
                                            <span>{item.name}</span>
                                            <Badge variant="secondary" className="ml-2">
                                                ฿ {parseFloat(item.price).toFixed(2)}
                                            </Badge>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Dynamic Inputs */}
                    {game.inputs.map((input) => (
                        <div key={input.key} className="space-y-2">
                            <Label>{input.title} {input.key === 'uid' ? '*' : ''}</Label>
                            {input.type === 'select' && input.options ? (
                                <Select
                                    value={formData[input.key] || ''}
                                    onValueChange={(value) => handleInputChange(input.key, value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder={input.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {input.options.map((option) => (
                                            <SelectItem key={option.value} value={option.value}>
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <Input
                                    type={input.type === 'number' ? 'number' : 'text'}
                                    placeholder={input.placeholder}
                                    value={formData[input.key] || ''}
                                    onChange={(e) => handleInputChange(input.key, e.target.value)}
                                    required={input.key === 'uid'}
                                />
                            )}
                        </div>
                    ))}

                    <Separator />

                    {/* Balance Check */}
                    {isAuth && user && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex justify-between items-center text-sm">
                                <span>ยอดคงเหลือ:</span>
                                <span className="font-medium">฿ {user.balance?.toFixed(2) || '0.00'}</span>
                            </div>
                            {selectedItemData && (
                                <div className="flex justify-between items-center text-sm mt-1">
                                    <span>ราคา:</span>
                                    <span className="font-medium text-red-600">
                                        -฿ {parseFloat(selectedItemData.price).toFixed(2)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Purchase Button */}
                    <Button
                        onClick={handlePurchase}
                        disabled={!isAuth || loading || !selectedItem}
                        className="w-full"
                    >
                        {loading ? 'กำลังดำเนินการ...' : isAuth ? 'เติมเกม' : 'กรุณาเข้าสู่ระบบ'}
                    </Button>

                    {!isAuth && (
                        <p className="text-xs text-center text-muted-foreground">
                            กรุณาเข้าสู่ระบบก่อนทำการสั่งซื้อ
                        </p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}


