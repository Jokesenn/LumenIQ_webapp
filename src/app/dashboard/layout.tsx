"use client"

import { useState } from 'react';
import { Sidebar } from '@/components/dashboard/sidebar';
import { DashboardHeader } from '@/components/dashboard/header';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[var(--bg-secondary)]">
            <Sidebar collapsed={collapsed} />

            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <DashboardHeader
                    collapsed={collapsed}
                    setCollapsed={setCollapsed}
                />
                <main className="flex-1 p-8 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
