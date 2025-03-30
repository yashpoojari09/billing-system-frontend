export interface Customer {
    id: string;
    name: string;
    email: string;
    [key: string]: unknown;
  }
  
  export interface CustomersTableProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  }

  export interface EditCustomerFormProps {
    customer: { id: string; name: string; email: string };
    onClose: () => void;
    onUpdate: (updatedCustomer: { id: string; name: string; email: string }) => void; // ✅ Add this

  }
