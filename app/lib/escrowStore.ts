"use client";

import { create } from "zustand";
import type { Escrow, EscrowMilestone, EscrowTransaction } from "./escrowTypes";

type EscrowStore = {
  escrows: Escrow[];
  getEscrow: (id: string) => Escrow | undefined;
  addEscrow: (escrow: Escrow) => void;
  updateMilestoneStatus: (
    escrowId: string,
    milestoneId: string,
    status: EscrowMilestone["status"]
  ) => void;
  addTransaction: (escrowId: string, transaction: Omit<EscrowTransaction, "id">) => void;
};

const sampleEscrows: Escrow[] = [
  {
    id: "esc-001",
    title: "E-Commerce Platform Development",
    description:
      "Full-stack development of a modern e-commerce platform with React, Node.js, and Stellar payment integration.",
    state: "IN_PROGRESS",
    client: {
      address: "GBXGHABC123DEF456GHIJKL789MNO",
      name: "Acme Corporation",
      role: "CLIENT",
    },
    freelancer: {
      address: "GCFGHIJKL789MNO012PQR345STU",
      name: "John Developer",
      role: "FREELANCER",
    },
    totalAmount: 15000,
    releasedAmount: 5000,
    currency: "USDC",
    milestones: [
      {
        id: "ms-1",
        title: "Project Setup & Architecture",
        description: "Initialize project, set up CI/CD, and design system architecture.",
        amount: 3000,
        status: "APPROVED",
        dueDate: "2026-06-15",
        completedAt: "2026-06-12T14:30:00Z",
      },
      {
        id: "ms-2",
        title: "Frontend Development",
        description: "Build responsive UI with React, Tailwind CSS, and component library.",
        amount: 5000,
        status: "IN_PROGRESS",
        dueDate: "2026-07-15",
      },
      {
        id: "ms-3",
        title: "Backend API & Integration",
        description: "Develop REST API, database setup, and Stellar payment integration.",
        amount: 5000,
        status: "PENDING",
        dueDate: "2026-08-15",
      },
      {
        id: "ms-4",
        title: "Testing & Deployment",
        description: "Write tests, perform QA, and deploy to production.",
        amount: 2000,
        status: "PENDING",
        dueDate: "2026-09-01",
      },
    ],
    transactions: [
      {
        id: "tx-1",
        type: "CREATED",
        timestamp: "2026-06-01T10:00:00Z",
        note: "Escrow created for e-commerce platform project",
      },
      {
        id: "tx-2",
        type: "FUNDED",
        amount: 15000,
        from: "GBXGHABC123DEF456GHIJKL789MNO",
        timestamp: "2026-06-01T10:05:00Z",
        txHash: "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0",
      },
      {
        id: "tx-3",
        type: "MILESTONE_APPROVED",
        amount: 3000,
        from: "GBXGHABC123DEF456GHIJKL789MNO",
        to: "GCFGHIJKL789MNO012PQR345STU",
        timestamp: "2026-06-12T14:30:00Z",
        note: "Milestone 1 approved: Project Setup & Architecture",
      },
      {
        id: "tx-4",
        type: "PARTIAL_RELEASE",
        amount: 3000,
        from: "GBXGHABC123DEF456GHIJKL789MNO",
        to: "GCFGHIJKL789MNO012PQR345STU",
        timestamp: "2026-06-12T14:35:00Z",
        txHash: "b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1",
      },
    ],
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-06-12T14:35:00Z",
    deadline: "2026-09-01",
  },
  {
    id: "esc-002",
    title: "Mobile App UI/UX Design",
    description:
      "Complete UI/UX design for a fintech mobile application including wireframes, prototypes, and design system.",
    state: "SUBMITTED",
    client: {
      address: "GDEF456GHIJKL789MNO012PQR345",
      name: "Global Tech Solutions",
      role: "CLIENT",
    },
    freelancer: {
      address: "GHIJKL789MNO012PQR345STU678",
      name: "Sarah Designer",
      role: "FREELANCER",
    },
    totalAmount: 8000,
    releasedAmount: 0,
    currency: "USDC",
    milestones: [
      {
        id: "ms-5",
        title: "Research & Wireframes",
        description: "User research, competitor analysis, and low-fidelity wireframes.",
        amount: 2000,
        status: "APPROVED",
        dueDate: "2026-06-20",
        completedAt: "2026-06-18T16:00:00Z",
      },
      {
        id: "ms-6",
        title: "High-Fidelity Mockups",
        description: "Complete high-fidelity designs for all screens.",
        amount: 3000,
        status: "SUBMITTED",
        dueDate: "2026-07-10",
      },
      {
        id: "ms-7",
        title: "Prototype & Handoff",
        description: "Interactive prototype and developer handoff documentation.",
        amount: 3000,
        status: "PENDING",
        dueDate: "2026-07-25",
      },
    ],
    transactions: [
      {
        id: "tx-5",
        type: "CREATED",
        timestamp: "2026-06-10T09:00:00Z",
        note: "Escrow created for mobile app design project",
      },
      {
        id: "tx-6",
        type: "FUNDED",
        amount: 8000,
        from: "GDEF456GHIJKL789MNO012PQR345",
        timestamp: "2026-06-10T09:05:00Z",
        txHash: "c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2",
      },
      {
        id: "tx-7",
        type: "MILESTONE_APPROVED",
        amount: 2000,
        from: "GDEF456GHIJKL789MNO012PQR345",
        to: "GHIJKL789MNO012PQR345STU678",
        timestamp: "2026-06-18T16:00:00Z",
        note: "Milestone 1 approved: Research & Wireframes",
      },
      {
        id: "tx-8",
        type: "MILESTONE_SUBMITTED",
        timestamp: "2026-06-28T11:00:00Z",
        note: "Milestone 2 submitted: High-Fidelity Mockups",
      },
    ],
    createdAt: "2026-06-10T09:00:00Z",
    updatedAt: "2026-06-28T11:00:00Z",
    deadline: "2026-07-25",
  },
  {
    id: "esc-003",
    title: "Smart Contract Audit",
    description:
      "Security audit of Soroban smart contracts for the StellFlow payment protocol.",
    state: "DISPUTED",
    client: {
      address: "GJKL789MNO012PQR345STU678VWX",
      name: "Blockchain Labs",
      role: "CLIENT",
    },
    freelancer: {
      address: "GLMN012PQR345STU678VWX901YZ",
      name: "Alex Security",
      role: "FREELANCER",
    },
    totalAmount: 12000,
    releasedAmount: 4000,
    currency: "USDC",
    milestones: [
      {
        id: "ms-8",
        title: "Initial Review",
        description: "First pass review of all smart contracts.",
        amount: 4000,
        status: "APPROVED",
        dueDate: "2026-06-10",
        completedAt: "2026-06-08T10:00:00Z",
      },
      {
        id: "ms-9",
        title: "Deep Analysis",
        description: "Detailed security analysis and vulnerability assessment.",
        amount: 5000,
        status: "SUBMITTED",
        dueDate: "2026-06-25",
      },
      {
        id: "ms-10",
        title: "Final Report",
        description: "Comprehensive audit report with recommendations.",
        amount: 3000,
        status: "PENDING",
        dueDate: "2026-07-05",
      },
    ],
    transactions: [
      {
        id: "tx-9",
        type: "CREATED",
        timestamp: "2026-06-01T08:00:00Z",
        note: "Escrow created for smart contract audit",
      },
      {
        id: "tx-10",
        type: "FUNDED",
        amount: 12000,
        from: "GJKL789MNO012PQR345STU678VWX",
        timestamp: "2026-06-01T08:05:00Z",
        txHash: "d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3",
      },
      {
        id: "tx-11",
        type: "PARTIAL_RELEASE",
        amount: 4000,
        from: "GJKL789MNO012PQR345STU678VWX",
        to: "GLMN012PQR345STU678VWX901YZ",
        timestamp: "2026-06-08T10:05:00Z",
        txHash: "e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4",
      },
      {
        id: "tx-12",
        type: "DISPUTE_OPENED",
        timestamp: "2026-06-26T09:00:00Z",
        note: "Client disputed milestone 2 deliverables",
      },
    ],
    createdAt: "2026-06-01T08:00:00Z",
    updatedAt: "2026-06-26T09:00:00Z",
    deadline: "2026-07-05",
  },
];

export const useEscrowStore = create<EscrowStore>((set, get) => ({
  escrows: sampleEscrows,

  getEscrow: (id) => get().escrows.find((esc) => esc.id === id),

  addEscrow: (escrow) =>
    set((state) => ({
      escrows: [...state.escrows, escrow],
    })),

  updateMilestoneStatus: (escrowId, milestoneId, status) =>
    set((state) => ({
      escrows: state.escrows.map((escrow) => {
        if (escrow.id !== escrowId) return escrow;

        const updatedMilestones = escrow.milestones.map((ms) =>
          ms.id === milestoneId
            ? {
                ...ms,
                status,
                completedAt:
                  status === "APPROVED" ? new Date().toISOString() : ms.completedAt,
              }
            : ms
        );

        return {
          ...escrow,
          milestones: updatedMilestones,
          updatedAt: new Date().toISOString(),
        };
      }),
    })),

  addTransaction: (escrowId, transaction) =>
    set((state) => ({
      escrows: state.escrows.map((escrow) =>
        escrow.id === escrowId
          ? {
              ...escrow,
              transactions: [
                ...escrow.transactions,
                { ...transaction, id: `tx-${Date.now()}` },
              ],
              updatedAt: new Date().toISOString(),
            }
          : escrow
      ),
    })),
}));
