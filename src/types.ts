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

  }

  export interface EditCustomerFormProps {
    customer: Customer
    onClose: () => void;
    onUpdate: (updatedCustomer: Customer) => void; // ✅ Add this

  }
 // ✅ Handle form submission
 export interface FormData {
  name: string;
  email: string;
}
