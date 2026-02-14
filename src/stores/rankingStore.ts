import { create } from 'zustand';

export type RankTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
export type RankingPeriod = 'daily' | 'weekly' | 'monthly';

export interface RankedDriver {
  id: string;
  name: string;
  avatar: string;
  points: number;
  deliveries: number;
  tier: RankTier;
  position: number;
}

interface RankingState {
  period: RankingPeriod;
  leaderboard: RankedDriver[];
  currentUserRank: RankedDriver | null;
  setPeriod: (period: RankingPeriod) => void;
  nextRewardPoints: number;
}

const mockLeaderboard: RankedDriver[] = [
  {
    id: 'driver-10',
    name: 'Roberto Flash',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=roberto',
    points: 4850,
    deliveries: 156,
    tier: 'diamond',
    position: 1,
  },
  {
    id: 'driver-11',
    name: 'Elena Veloz',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=elena',
    points: 4200,
    deliveries: 142,
    tier: 'platinum',
    position: 2,
  },
  {
    id: 'driver-12',
    name: 'Marco Rápido',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=marco',
    points: 3800,
    deliveries: 128,
    tier: 'platinum',
    position: 3,
  },
  {
    id: 'driver-1',
    name: 'Juan Conductor',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=driver',
    points: 2450,
    deliveries: 89,
    tier: 'gold',
    position: 7,
  },
  {
    id: 'driver-13',
    name: 'Sofia Express',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sofia',
    points: 2100,
    deliveries: 76,
    tier: 'gold',
    position: 8,
  },
  {
    id: 'driver-14',
    name: 'Pedro Ligero',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=pedro',
    points: 1800,
    deliveries: 65,
    tier: 'silver',
    position: 9,
  },
  {
    id: 'driver-15',
    name: 'Luis Nuevo',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=luis',
    points: 950,
    deliveries: 32,
    tier: 'bronze',
    position: 15,
  },
];

export const useRankingStore = create<RankingState>((set) => ({
  period: 'weekly',
  leaderboard: mockLeaderboard,
  currentUserRank: mockLeaderboard.find((d) => d.id === 'driver-1') || null,
  nextRewardPoints: 3000,
  setPeriod: (period: RankingPeriod) => set({ period }),
}));
