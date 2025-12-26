import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY_MIDDLE = process.env.API_KEY_MIDDLE || 'apikey';
const API_URL_MIDDLE = "https://www.middle-pay.com";

export async function GET(request: NextRequest) {
    try {
        const response = await axios.get(`${API_URL_MIDDLE}/api/v1/premium/services/list`, {
            headers: {
                'X-API-Key': API_KEY_MIDDLE
            }
        });

        if (response.data && response.data.services && Array.isArray(response.data.services)) {
            // Filter out services with "test" in the name (case insensitive)
            const allServices = response.data.services.filter((service: any) =>
                !service.name || !service.name.toLowerCase().includes('test')
            );

            for (let i = allServices.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [allServices[i], allServices[j]] = [allServices[j], allServices[i]];
            }

            const recommendedServices = allServices.slice(0, 10);

            const formattedResponse = {
                success: true,
                services: recommendedServices.map((service: any) => ({
                    name: service.name || '',
                    id: parseInt(service.id) || 0,
                    description: service.description || null,
                    price: parseFloat(service.price) || 0,
                    stock: parseInt(service.stock) || 0
                })),
                count: recommendedServices.length
            };

            return NextResponse.json(formattedResponse);
        } else {
            return NextResponse.json({
                success: false,
                services: [],
                count: 0
            });
        }
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            success: false,
            services: [],
            count: 0
        }, { status: 500 });
    }
}