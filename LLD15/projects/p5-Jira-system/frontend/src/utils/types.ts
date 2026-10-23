export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  permissions: string[];
  avatarColor: string;
}

export interface Board {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: string;
  members: BoardMember[];
}

export interface BoardMember {
  userId: string;
  userName: string;
  role: 'owner' | 'editor' | 'viewer';
  avatarColor: string;
}

export interface Column {
  id: string;
  boardId: string;
  title: string;
  position: number;
}

export interface Card {
  id: string;
  columnId: string;
  boardId: string;
  title: string;
  description: string;
  position: number;
  labels: Label[];
  members: string[];
  comments: Comment[];
  createdAt: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  boardId: string;
}

export interface Comment {
  id: string;
  cardId: string;
  userId: string;
  userName: string;
  content: string;
  parentId: string | null;
  createdAt: string;
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
}

export const PERMISSIONS = [
  'board:create', 'board:edit', 'board:delete',
  'column:create', 'column:edit', 'column:delete',
  'card:create', 'card:edit', 'card:delete', 'card:move',
  'member:add', 'member:remove',
  'comment:create', 'comment:delete',
  'label:create', 'label:delete',
  'admin:users', 'admin:roles', 'admin:boards',
] as const;
