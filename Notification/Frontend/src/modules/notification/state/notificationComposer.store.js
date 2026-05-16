import { create } from 'zustand';

// Composer state shared across the multi-step Send/Send-Group flow.
export const useNotificationComposerStore = create((set) => ({
  mode: 'single', // 'single' | 'group'
  audience: [], // userIds[]
  channels: [],
  templateId: null,
  payload: {},
  custom: { subject: '', body: '' },
  step: 'compose', // 'compose' | 'review'

  setMode: (mode) => set({ mode }),
  setAudience: (audience) => set({ audience }),
  toggleAudience: (userId) =>
    set((s) => {
      const has = s.audience.includes(userId);
      return {
        audience: has ? s.audience.filter((x) => x !== userId) : [...s.audience, userId],
      };
    }),
  setChannels: (channels) => set({ channels }),
  toggleChannel: (ch) =>
    set((s) => ({
      channels: s.channels.includes(ch)
        ? s.channels.filter((c) => c !== ch)
        : [...s.channels, ch],
    })),
  setTemplateId: (templateId) => set({ templateId }),
  setPayload: (payload) => set({ payload }),
  updatePayload: (patch) => set((s) => ({ payload: { ...s.payload, ...patch } })),
  setCustom: (custom) => set({ custom }),
  setStep: (step) => set({ step }),
  reset: () =>
    set({
      audience: [],
      channels: [],
      templateId: null,
      payload: {},
      custom: { subject: '', body: '' },
      step: 'compose',
    }),
}));
