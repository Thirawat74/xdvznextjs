import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const API_KEY_ADS4U = process.env.API_KEY_ADS4U || 'apikey';
const API_URL_ADS4U = "https://ads4u.co/api/v2";

export async function GET(request: NextRequest) {
    try {
        const response = await axios.get(`${API_URL_ADS4U}`, {
            params: {
                key: API_KEY_ADS4U,
                action: "services",
            }
        });

        if (response.data && Array.isArray(response.data)) {
            const allServices = response.data;

            // Filter out services with "test" in their name
            const filteredServices = allServices.filter((service: any) =>
                !service.name || !service.name.toLowerCase().includes('test')
            );

            // Format services
            const formattedServices = filteredServices.map((service: any) => ({
                service: service.service || service.id || 0,
                name: service.name || '',
                type: service.type || 'Default',
                category: service.category || 'General',
                rate: service.rate || '0.00',
                min: service.min || '1',
                max: service.max || '1000',
                refill: service.refill || false,
                cancel: service.cancel || true
            }));

            return NextResponse.json({
                success: true,
                services: formattedServices,
                count: formattedServices.length
            });
        }

        return NextResponse.json({
            success: false,
            services: [],
            count: 0
        });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({
            success: false,
            error: 'Internal server error',
            services: [],
            count: 0
        }, { status: 500 });
    }
}