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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        <div>
          <label className="block text-sm font-medium text-gray-200">Business Name</label>
          <input
            {...register('businessName')}
            className="mt-3 block w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] rounded px-3 py-2 text-white bg-dark"
          />
          {errors.businessName && <p className="text-sm text-red-500">{errors.businessName.message}</p>}
        </div>

        <div>
        <label className="block text-sm font-medium text-gray-200">Address</label>
          <textarea
            {...register('address')}
            className="mt-3 block w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] rounded px-3 py-2 text-white bg-dark"
          />
          {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">GSTIN</label>
          <input
            {...register('gstin')}
            className="mt-3 block w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] rounded px-3 py-2 text-white bg-dark"
          />
          {errors.gstin && <p className="text-sm text-red-500">{errors.gstin.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200">Phone</label>
          <input
            {...register('phone')}
            className="mt-3 block w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] rounded px-3 py-2 text-white bg-dark"
          />
          {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-200">Invoice Template (HTML)</label>
  <textarea
    {...register('invoiceTemplate')}
    rows={10}
    placeholder="Paste your Handlebars-compatible HTML template here"
    className="mt-3 block w-full shadow-[0_0px_9px_-3px_#ffffff,0_4px_6px_-4px_#0000001a] rounded px-3 py-2 text-white bg-dark font-mono text-sm"
  />
  {errors.invoiceTemplate && (
    <p className="text-sm text-red-500">{errors.invoiceTemplate.message}</p>
  )}
</div>


        <div className="pt-4 flex items-center space-x-4">
          <Button type="submit"
            disabled={isSubmitting}
            className="bg-[#001e38] hover:bg-[#00335c] text-dark font-semibold py-2 px-6 rounded shadow"
          >
            {isSubmitting ? 'Saving...' : 'Save Settings'}
          </Button>
          <Button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-dark font-semibold py-2 px-6 rounded "
            onClick={() => window.history.back()} // or use router.push('/dashboard') if using next/router
          >
            Cancel
          </Button>
        </div>
      </form>
  );
}
export default TenantSettingsForm;
