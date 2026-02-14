import { create } from 'zustand';

export type TransactionType = 'delivery' | 'bonus' | 'penalty' | 'withdrawal' | 'points_earned';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  points?: number;
  description: string;
  date: Date;
}

interface WalletState {
  balance: number;
  points: number;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
}

const mockTransactions: Transaction[] = [
  {
    id: 'tx-1',
    type: 'delivery',
    amount: 45,
    points: 150,
    description: 'Entrega Express - El Alto',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'tx-2',
    type: 'bonus',
    amount: 50,
    points: 200,
    description: 'Bono: 10 entregas en un día',
    date: new Date(Date.now() - 24 * 60 * 60 * 1000),
  },
  {
    id: 'tx-3',
    type: 'delivery',
    amount: 25,
    points: 75,
    description: 'Entrega Normal - San Miguel',
    date: new Date(Date.now() - 26 * 60 * 60 * 1000),
  },
  {
    id: 'tx-4',
    type: 'penalty',
    amount: -10,
    description: 'Penalidad: Entrega tardía',
    date: new Date(Date.now() - 48 * 60 * 60 * 1000),
  },
  {
    id: 'tx-5',
    type: 'delivery',
    amount: 55,
    points: 200,
    description: 'Entrega Nocturna - Sopocachi',
    date: new Date(Date.now() - 72 * 60 * 60 * 1000),
  },
  {
    id: 'tx-6',
    type: 'withdrawal',
    amount: -200,
    description: 'Retiro a cuenta bancaria',
    date: new Date(Date.now() - 96 * 60 * 60 * 1000),
  },
];

export const useWalletStore = create<WalletState>((set) => ({
  balance: 485,
  points: 2450,
  transactions: mockTransactions,
  addTransaction: (transaction) => {
    const newTx: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
      date: new Date(),
    };
    set((state) => ({
      transactions: [newTx, ...state.transactions],
      balance: state.balance + transaction.amount,
      points: state.points + (transaction.points || 0),
    }));
  },
}));
