import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { tenantSettingsSchema, TenantSettingsFormData } from '@/utils/validation';
import { fetchTenantSettings, updateTenantSettings } from '@/utils/api';
import { Button } from '@/components/ui/Button';


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
      console.log("🔍 Loaded settings:", data); // ← Add this
      if (data) {
        Object.entries(data).forEach(([key, value]) => {
          setValue(key as keyof TenantSettingsFormData, value);
          console.log("Form errors:", errors);

        });
      }
    });
  }, [setValue, errors]);

  const onSubmit = async (data: TenantSettingsFormData) => {
    try {
      await updateTenantSettings(data);
      console.log("📝 Submitting settings form:", data);

      alert("Settings updated successfully!");
    } catch {
      alert("Failed to update settings.");
    }
  };
  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded shadow">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <h2 className="text-2xl font-bold text-[#001e38]">Tenant Settings</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700">Business Name</label>
          <input
            {...register('businessName')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-white"
          />
          {errors.businessName && <p className="text-sm text-red-500">{errors.businessName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            {...register('address')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-white"
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">GSTIN</label>
          <input
            {...register('gstin')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-white"
          />
          {errors.gstin && <p className="text-sm text-red-500">{errors.gstin.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            {...register('phone')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-white"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">UPI ID (for QR)</label>
          <input
            {...register('upiId')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Terms & Conditions</label>
          <textarea
            {...register('terms')}
            className="mt-1 block w-full border border-gray-300 rounded px-3 py-2 text-black bg-white"
          />
        </div>

        <div className="pt-4 flex items-center space-x-4">
          <Button type="submit"
            disabled={isSubmitting}
            className="bg-[#001e38] hover:bg-[#00335c] text-white font-semibold py-2 px-6 rounded shadow"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-6 rounded shadow"
            onClick={() => window.history.back()} // or use router.push('/dashboard') if using next/router
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
export default TenantSettingsForm;
