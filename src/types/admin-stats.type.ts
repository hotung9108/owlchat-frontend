// ── Message ─────────────────────────────────────
export type MessagesStatsItem = {
  date: string;
  messages: number;
};

export type MessagesStatsResponse = {
  data: MessagesStatsItem[];
};

export type MessagesTotalResponse = {
  messages: number;
};

// ── Reports ─────────────────────────────────────
export type MessageReportsItem = {
  date: string;
  reports: number;
};

export type MessageReportsStatsResponse = {
  data: MessageReportsItem[];
};

export type MessageReportsTotalResponse = {
  reports: number;
};

// ── Friendship ──────────────────────────────────
export type SocialGrowthItem = {
  date: string;
  friends: number;
  requests: number;
  blocks: number;
};

export type SocialGrowthResponse = {
  data: SocialGrowthItem[];
};

// ── Users ───────────────────────────────────────
export type UsersStatsItem = {
  date: string;
  users: number;
};

export type UsersStatsResponse = {
  data: UsersStatsItem[];
};

export type UsersGrowthItem = {
  date: string;
  newUsers: number;
};

export type UsersGrowthResponse = {
  data: UsersGrowthItem[];
};

export type UsersGrowthTodayResponse = {
  newUsers: number;
};

export type UsersGenderItem = {
  name: string;
  value: number;
};

export type UsersGenderDistributionResponse = {
  data: UsersGenderItem[];
};

export type UsersTotalResponse = {
  users: number;
};