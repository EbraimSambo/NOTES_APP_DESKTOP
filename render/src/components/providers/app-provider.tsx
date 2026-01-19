'use client';
import { ReactNode } from "react";
import { Provider } from "jotai";

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    return (
        <Provider>
            {children}
        </Provider>
    );
}