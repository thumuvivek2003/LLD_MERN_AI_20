import { create } from 'zustand';
import { Board, Column, Card, Label, Comment } from '../utils/types';
import { DEFAULT_COLUMNS, LABEL_COLORS } from '../utils/constants';

interface BoardState {
  boards: Board[];
  columns: Column[];
  cards: Card[];
  labels: Label[];

  // Board actions
  addBoard: (board: Omit<Board, 'id' | 'createdAt'>) => Board;
  updateBoard: (id: string, data: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  addBoardMember: (boardId: string, member: Board['members'][0]) => void;
  removeBoardMember: (boardId: string, userId: string) => void;

  // Column actions
  addColumn: (boardId: string, title: string) => void;
  updateColumn: (id: string, title: string) => void;
  deleteColumn: (id: string) => void;
  reorderColumns: (boardId: string, columnIds: string[]) => void;

  // Card actions
  addCard: (columnId: string, boardId: string, title: string) => void;
  updateCard: (id: string, data: Partial<Card>) => void;
  deleteCard: (id: string) => void;
  moveCard: (cardId: string, toColumnId: string, position: number) => void;

  // Label actions
  addLabel: (boardId: string, name: string, color: string) => void;
  deleteLabel: (id: string) => void;
  toggleCardLabel: (cardId: string, labelId: string) => void;

  // Card member actions
  toggleCardMember: (cardId: string, userId: string) => void;

  // Comment actions
  addComment: (cardId: string, userId: string, userName: string, content: string, parentId?: string) => void;
}

// Seed data
const seedBoardId = 'board-1';
const seedColumns: Column[] = DEFAULT_COLUMNS.map((title, i) => ({
  id: `col-${i + 1}`, boardId: seedBoardId, title, position: i,
}));

const seedLabels: Label[] = LABEL_COLORS.slice(0, 4).map((c, i) => ({
  id: `label-${i + 1}`, name: c.name, color: c.value, boardId: seedBoardId,
}));

const seedCards: Card[] = [
  { id: 'card-1', columnId: 'col-1', boardId: seedBoardId, title: 'Setup project architecture', description: '', position: 0, labels: [seedLabels[2]], members: ['1'], comments: [], createdAt: new Date().toISOString() },
  { id: 'card-2', columnId: 'col-1', boardId: seedBoardId, title: 'Design database schema', description: '', position: 1, labels: [seedLabels[0]], members: ['2'], comments: [], createdAt: new Date().toISOString() },
  { id: 'card-3', columnId: 'col-2', boardId: seedBoardId, title: 'Implement auth flow', description: '', position: 0, labels: [seedLabels[1]], members: ['1', '2'], comments: [], createdAt: new Date().toISOString() },
  { id: 'card-4', columnId: 'col-3', boardId: seedBoardId, title: 'Code review: API endpoints', description: '', position: 0, labels: [], members: ['2'], comments: [], createdAt: new Date().toISOString() },
  { id: 'card-5', columnId: 'col-4', boardId: seedBoardId, title: 'Deploy staging environment', description: 'Completed successfully', position: 0, labels: [seedLabels[3]], members: ['1'], comments: [], createdAt: new Date().toISOString() },
];

export const useBoardStore = create<BoardState>((set, get) => ({
  boards: [{
    id: seedBoardId, name: 'Project Alpha', description: 'Main development board',
    ownerId: '1', createdAt: new Date().toISOString(),
    members: [
      { userId: '1', userName: 'Admin', role: 'owner', avatarColor: '#2dd4bf' },
      { userId: '2', userName: 'Alex Rivera', role: 'editor', avatarColor: '#f472b6' },
    ],
  }],
  columns: seedColumns,
  cards: seedCards,
  labels: seedLabels,

  addBoard: (data) => {
    const board: Board = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
    const cols = DEFAULT_COLUMNS.map((title, i) => ({
      id: crypto.randomUUID(), boardId: board.id, title, position: i,
    }));
    set((s) => ({ boards: [...s.boards, board], columns: [...s.columns, ...cols] }));
    return board;
  },
  updateBoard: (id, data) => set((s) => ({
    boards: s.boards.map((b) => b.id === id ? { ...b, ...data } : b),
  })),
  deleteBoard: (id) => set((s) => ({
    boards: s.boards.filter((b) => b.id !== id),
    columns: s.columns.filter((c) => c.boardId !== id),
    cards: s.cards.filter((c) => c.boardId !== id),
    labels: s.labels.filter((l) => l.boardId !== id),
  })),
  addBoardMember: (boardId, member) => set((s) => ({
    boards: s.boards.map((b) => b.id === boardId ? { ...b, members: [...b.members, member] } : b),
  })),
  removeBoardMember: (boardId, userId) => set((s) => ({
    boards: s.boards.map((b) => b.id === boardId
      ? { ...b, members: b.members.filter((m) => m.userId !== userId) } : b),
  })),

  addColumn: (boardId, title) => {
    const cols = get().columns.filter((c) => c.boardId === boardId);
    set((s) => ({ columns: [...s.columns, { id: crypto.randomUUID(), boardId, title, position: cols.length }] }));
  },
  updateColumn: (id, title) => set((s) => ({
    columns: s.columns.map((c) => c.id === id ? { ...c, title } : c),
  })),
  deleteColumn: (id) => set((s) => ({
    columns: s.columns.filter((c) => c.id !== id),
    cards: s.cards.filter((c) => c.columnId !== id),
  })),
  reorderColumns: (boardId, columnIds) => set((s) => ({
    columns: s.columns.map((c) => {
      if (c.boardId !== boardId) return c;
      const idx = columnIds.indexOf(c.id);
      return idx >= 0 ? { ...c, position: idx } : c;
    }),
  })),

  addCard: (columnId, boardId, title) => {
    const cards = get().cards.filter((c) => c.columnId === columnId);
    set((s) => ({
      cards: [...s.cards, {
        id: crypto.randomUUID(), columnId, boardId, title, description: '',
        position: cards.length, labels: [], members: [], comments: [],
        createdAt: new Date().toISOString(),
      }],
    }));
  },
  updateCard: (id, data) => set((s) => ({
    cards: s.cards.map((c) => c.id === id ? { ...c, ...data } : c),
  })),
  deleteCard: (id) => set((s) => ({ cards: s.cards.filter((c) => c.id !== id) })),
  moveCard: (cardId, toColumnId, position) => set((s) => {
    const card = s.cards.find((c) => c.id === cardId);
    if (!card) return s;
    const otherCards = s.cards.filter((c) => c.id !== cardId && c.columnId === toColumnId);
    otherCards.sort((a, b) => a.position - b.position);
    otherCards.splice(position, 0, { ...card, columnId: toColumnId });
    const reindexed = otherCards.map((c, i) => ({ ...c, position: i }));
    return {
      cards: s.cards
        .filter((c) => c.columnId !== toColumnId && c.id !== cardId)
        .concat(reindexed),
    };
  }),

  addLabel: (boardId, name, color) => set((s) => ({
    labels: [...s.labels, { id: crypto.randomUUID(), name, color, boardId }],
  })),
  deleteLabel: (id) => set((s) => ({
    labels: s.labels.filter((l) => l.id !== id),
    cards: s.cards.map((c) => ({ ...c, labels: c.labels.filter((l) => l.id !== id) })),
  })),
  toggleCardLabel: (cardId, labelId) => set((s) => ({
    cards: s.cards.map((c) => {
      if (c.id !== cardId) return c;
      const has = c.labels.find((l) => l.id === labelId);
      const label = s.labels.find((l) => l.id === labelId);
      if (!label) return c;
      return {
        ...c,
        labels: has ? c.labels.filter((l) => l.id !== labelId) : [...c.labels, label],
      };
    }),
  })),

  toggleCardMember: (cardId, userId) => set((s) => ({
    cards: s.cards.map((c) => {
      if (c.id !== cardId) return c;
      const has = c.members.includes(userId);
      return { ...c, members: has ? c.members.filter((m) => m !== userId) : [...c.members, userId] };
    }),
  })),

  addComment: (cardId, userId, userName, content, parentId) => set((s) => ({
    cards: s.cards.map((c) => {
      if (c.id !== cardId) return c;
      return {
        ...c,
        comments: [...c.comments, {
          id: crypto.randomUUID(), cardId, userId, userName, content,
          parentId: parentId ?? null, createdAt: new Date().toISOString(),
        }],
      };
    }),
  })),
}));
