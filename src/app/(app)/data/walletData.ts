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
  link: string; // Lucide icon
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

export const mockPaymentMethods: PaymentMethod[] = [];

export const topUpMethods: TopUpMethod[] = [
  {
    id: "vodafone",
    label: "Vodafone Cash",
    sub: "010XXXXXXXX",
    icon: Wallet,
    link: "http://vf.eg/vfcash?id=mt&qrId=0rWzo7",
  },
  {
    id: "instapay",
    label: "Insta Pay",
    sub: "username@instapay",
    icon: QrCode,
    link: "https://ipn.eg/S/ibrahimali123/instapay/7s3MST",
  },
];
