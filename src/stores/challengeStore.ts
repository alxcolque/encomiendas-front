import { create } from 'zustand';

export type DeliveryType = 'normal' | 'express' | 'night' | 'combo';
export type ChallengeStatus = 'available' | 'accepted' | 'in_progress' | 'completed';

export interface Challenge {
  id: string;
  type: DeliveryType;
  origin: string;
  destination: string;
  reward: number;
  points: number;
  distance: string;
  zone: string;
  urgency: 'low' | 'medium' | 'high';
  expiresAt: Date;
  status: ChallengeStatus;
  packages: number;
}

interface ChallengeState {
  availableChallenges: Challenge[];
  activeChallenge: Challenge | null;
  completedChallenges: Challenge[];
  acceptChallenge: (id: string) => void;
  completeChallenge: () => void;
  addChallenge: (challenge: Challenge) => void;
}

const mockChallenges: Challenge[] = [
  {
    id: 'ch-1',
    type: 'express',
    origin: 'Oficina Central - La Paz',
    destination: 'El Alto - Villa Adela',
    reward: 45,
    points: 150,
    distance: '12 km',
    zone: 'Zona Norte',
    urgency: 'high',
    expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    status: 'available',
    packages: 3,
  },
  {
    id: 'ch-2',
    type: 'normal',
    origin: 'Oficina Miraflores',
    destination: 'San Miguel',
    reward: 25,
    points: 75,
    distance: '5 km',
    zone: 'Zona Sur',
    urgency: 'low',
    expiresAt: new Date(Date.now() + 120 * 60 * 1000),
    status: 'available',
    packages: 1,
  },
  {
    id: 'ch-3',
    type: 'night',
    origin: 'Centro - Comercial',
    destination: 'Sopocachi',
    reward: 55,
    points: 200,
    distance: '8 km',
    zone: 'Centro',
    urgency: 'medium',
    expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    status: 'available',
    packages: 5,
  },
  {
    id: 'ch-4',
    type: 'combo',
    origin: 'Multi-punto',
    destination: 'Zona Sur Completa',
    reward: 120,
    points: 400,
    distance: '25 km',
    zone: 'Multi-zona',
    urgency: 'high',
    expiresAt: new Date(Date.now() + 45 * 60 * 1000),
    status: 'available',
    packages: 8,
  },
];

export const useChallengeStore = create<ChallengeState>((set, get) => ({
  availableChallenges: mockChallenges,
  activeChallenge: null,
  completedChallenges: [],
  acceptChallenge: (id: string) => {
    const challenge = get().availableChallenges.find((c) => c.id === id);
    if (challenge) {
      set((state) => ({
        availableChallenges: state.availableChallenges.filter((c) => c.id !== id),
        activeChallenge: { ...challenge, status: 'in_progress' },
      }));
    }
  },
  completeChallenge: () => {
    const active = get().activeChallenge;
    if (active) {
      set((state) => ({
        activeChallenge: null,
        completedChallenges: [...state.completedChallenges, { ...active, status: 'completed' }],
      }));
    }
  },
  addChallenge: (challenge: Challenge) => {
    set((state) => ({
      availableChallenges: [challenge, ...state.availableChallenges],
    }));
  },
}));
