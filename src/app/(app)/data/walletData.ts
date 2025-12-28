import { CreditCard, QrCode, Smartphone, Wallet } from "lucide-react";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  ref: string;
  amount: number;
  type: "credit" | "debit";
  status: "Completed" | "Pending" | "Failed";
}

export interface PaymentMethod {
  id: string;
  type: "Visa" | "Mastercard" | "Bank";
  last4: string;
  expiry?: string;
  label?: string;
}

export interface TopUpMethod {
  id: string;
  label: string;
  sub: string;
  icon: any; // Lucide icon
}

export const mockTransactions: Transaction[] = [
  {
    id: "1",
    date: "Oct 24, 2023",
    description: "Top-up Balance",
    ref: "#TR-883920",
    amount: 250.0,
    type: "credit",
    status: "Completed",
  },
  {
    id: "2",
    date: "Oct 22, 2023",
    description: "Purchase: Midnight Oud",
    ref: "#TR-883112",
    amount: 120.0,
    type: "debit",
    status: "Completed",
  },
  {
    id: "3",
    date: "Oct 20, 2023",
    description: "Withdrawal to Bank",
    ref: "#TR-882001",
    amount: 50.0,
    type: "debit",
    status: "Pending",
  },
  {
    id: "4",
    date: "Oct 18, 2023",
    description: "Purchase: Velvet Rose",
    ref: "#TR-881554",
    amount: 210.0,
    type: "debit",
    status: "Failed",
  },
  {
    id: "5",
    date: "Oct 15, 2023",
    description: "Top-up Balance",
    ref: "#TR-881223",
    amount: 100.0,
    type: "credit",
    status: "Completed",
  },
];

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    type: "Visa",
    last4: "4242",
    expiry: "12/25",
  },
  {
    id: "2",
    type: "Mastercard",
    last4: "8839",
    expiry: "09/24",
  },
  {
    id: "3",
    type: "Bank",
    last4: "9921",
    label: "Chase Checking",
  },
];

export const topUpMethods: TopUpMethod[] = [
  {
    id: "visa",
    label: "Visa ending in 4242",
    sub: "Expires 12/25",
    icon: CreditCard,
  },
  { id: "apple", label: "Apple Pay", sub: "Connected", icon: Smartphone },
  { id: "instapay", label: "Insta Pay", sub: "Instant Transfer", icon: QrCode },
  { id: "vodafone", label: "Vodafone Cash", sub: "e-Wallet", icon: Wallet },
];
