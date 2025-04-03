export interface Customer {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown;
  }
  
  export interface CustomersTableProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    onCustomerUpdated: (updatedCustomer: Customer) => void; // ✅ Callback to update list
    isLoading: Boolean
  }

  export interface EditCustomerFormProps {
    customer: Customer
    onClose: () => void;
    onUpdate: (updatedCustomer: Customer) => void; // ✅ Add this

  }
 // ✅ Handle form submission Customer 
 export interface FormData {
  name: string;
  email: string;
}

export interface PageProps {
  params: {tenantId: string;};
}
/// customer

export interface TaxRuleProps { 
  id: string; 
  taxRate: number; 
  region: string }