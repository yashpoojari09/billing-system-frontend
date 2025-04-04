export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    [key: string]: unknown;
  }
  
  export interface CustomersTableProps {
    customers: Customer[];
    setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
    onCustomerUpdated: (updatedCustomer: Customer) => void; // ✅ Callback to update list
    isLoading: boolean
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
  phone: string;
}

export interface PageProps {
  params: {tenantId: string;};
}
/// customer

export interface TaxRuleProps { 
  id: string; 
  taxRate: number; 
  region: string }

  // Invoice type inputs
 export  interface CustomerInvoice {
    id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface Product {
    id: string;
    name: string;
    price: number;
  }
  
  export interface InvoiceItem {
    productId: string;
    quantity: number;
  }
  
 export interface InvoiceData {
    customerId: string;
    items: InvoiceItem[];
  }
  // invoice type inputs
  export interface InvoiceRequest {
    name: string;
    email: string;
    phone: string;
    products: InvoiceProduct[];
  }
  export interface InvoiceProduct {
    productId: string;
    quantity: number;
  }