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

//inventory 
export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  taxId?: string | null;
  
};

/// customer


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
    price: number;
    totalPrice: number;
    taxRate?: number;

  }
  

 export interface InvoiceData {
    customerId: string;
    items: InvoiceItem[];
  }
  // invoice type inputs
  export interface  InvoiceRequest {
    name: string;
    email: string;
    phone: string;
    products: InvoiceProduct[];
  }
  export interface InvoiceProduct {
    productId: string;
    quantity: number;
  }

  export interface InvoicePreviewData {
    createdAt: string; // ISO string
    invoiceNumber: string;
    customer: {
      name: string;
      email: string;
      phone: string;
    };
    items: InvoiceItemPreview[];
    totalPrice: number;
    totalTax: number;
    grandTotal: number;
  }
  export interface InvoiceItemPreview {
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
  }

  // src/types/index.ts

export interface CustomerInvoice {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  tax?: {
    id: string;
    taxRate: number;
  };
}

export interface InvoiceItem {
  productId: string;
  quantity: number;
  price: number;
  totalPrice: number;
  taxRate?: number;         
  taxAmount?: number;  
}

export interface CustomerSearchProps {
  onCustomerSelect: (customer: CustomerInvoice) => void;
}

export interface InvoiceItemListProps {
  products: Product[];
  onItemsChange: (items: InvoiceItem[]) => void;
}

export interface InvoiceSummaryProps {
  items: InvoiceItem[];
  products: Product[];
}
