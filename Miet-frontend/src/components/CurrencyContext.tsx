'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

export type Currency = 'INR' | 'USD';

interface CurrencyContextType {
    currency: Currency;
    setCurrency: (currency: Currency) => void;
    convertPrice: (price: string | number | undefined) => { value: string | number; symbol: string } | null;
    formatPrice: (price: string | number | undefined) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

const USD_RATE = 83;

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
    const [currency, setCurrencyState] = useState<Currency>('INR');

    // Persist currency preference
    useEffect(() => {
        const savedCurrency = localStorage.getItem('miet_currency') as Currency;
        if (savedCurrency && (savedCurrency === 'INR' || savedCurrency === 'USD')) {
            setCurrencyState(savedCurrency);
        }
    }, []);

    const setCurrency = useCallback((newCurrency: Currency) => {
        setCurrencyState(newCurrency);
        localStorage.setItem('miet_currency', newCurrency);
    }, []);

    const convertPrice = useCallback((price: string | number | undefined) => {
        if (price === undefined || price === null || price === '') return null;

        // Convert to string and handle "Free" cases
        const priceStr = String(price).toLowerCase();
        if (priceStr.includes('free') || priceStr === '0') {
            return { value: 0, symbol: currency === 'INR' ? '₹' : '$' };
        }

        // Clean price string: remove currency symbols, commas, and whitespace
        const cleanPriceStr = String(price).replace(/[₹$€£,]/g, '').trim();
        const numericPrice = Number(cleanPriceStr);

        if (isNaN(numericPrice)) return null;
        if (numericPrice === 0) return { value: 0, symbol: currency === 'INR' ? '₹' : '$' };

        if (currency === 'INR') {
            return { value: numericPrice, symbol: '₹' };
        } else {
            const usdValue = (numericPrice / USD_RATE).toFixed(2);
            return { value: usdValue, symbol: '$' };
        }
    }, [currency]);

    const formatPrice = useCallback((price: string | number | undefined) => {
        const converted = convertPrice(price);
        if (!converted) {
            if (price === undefined || price === null) return '';
            return String(price);
        }
        if (converted.value === 0) return 'Free';

        // For INR, we might want to round or format with commas, but to stay safe we just return symbol + value
        // For USD, it's already fixed to 2 decimals
        return `${converted.symbol}${converted.value}`;
    }, [convertPrice]);

    return (
        <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice }}>
            {children}
        </CurrencyContext.Provider>
    );
};

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (context === undefined) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};
