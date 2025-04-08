import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {tenantSettingsSchema, TenantSettingsFormData} from '@/utils/validation';
import {fetchTenantSettings, updateTenantSettings} from '@/utils/api';



const TenantSettingsForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TenantSettingsFormData>({
    resolver: zodResolver(tenantSettingsSchema),
  });

  useEffect(() => {
    fetchTenantSettings().then((data) => {
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as keyof TenantSettingsFormData, value);
        });
      }
    });
  }, [setValue]);
  
  const onSubmit = async (data: TenantSettingsFormData) => {
    try {
      await updateTenantSettings(data);
      alert("Settings updated successfully!");
    } catch {
      alert("Failed to update settings.");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="settings-form">
      <h2>Tenant Settings</h2>

      <label>Business Name</label>
      <input {...register('businessName')} />
      {errors.businessName && <p>{errors.businessName.message}</p>}

      <label>Address</label>
      <textarea {...register('address')} />
      {errors.address && <p>{errors.address.message}</p>}

      <label>GSTIN</label>
      <input {...register('gstin')} />
      {errors.gstin && <p>{errors.gstin.message}</p>}

      <label>Phone</label>
      <input {...register('phone')} />
      {errors.phone && <p>{errors.phone.message}</p>}

      <label>UPI ID (for QR)</label>
      <input {...register('upiId')} />

      <label>Terms & Conditions</label>
      <textarea {...register('terms')} />

      <button type="submit" disabled={isSubmitting}>
        Save Settings
      </button>
    </form>
  );
};

export default TenantSettingsForm;
