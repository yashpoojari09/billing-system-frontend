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
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <TenantSettingsForm />
    </div>
  );
};

export default SettingsPage;
