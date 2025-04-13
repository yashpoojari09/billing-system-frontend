"use client";

import React from 'react';
import TenantSettingsForm from './TenantSettingsForm';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const SettingsPage = () => {
    const router = useRouter();
  
    // ✅ Check for accessToken on page load
    useEffect(() => {
      const token = localStorage.getItem("accessToken");
  
      if (!token) {
        // ❌ If no token, redirect to login
        router.push("/");
      }
    }, [router]);
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
    <h1 className="text-2xl font-bold mb-6 text-center">Invoice Settings</h1>
    <div className="bg-dark p-4 rounded-lg shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] w-full">
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <TenantSettingsForm />
    </div>
    </div>
    </div>
  );
};

export default SettingsPage;
