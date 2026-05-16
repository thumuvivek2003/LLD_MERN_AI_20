import { create } from 'zustand';

export const useTemplateStore = create((set) => ({
  templates: [],
  selectedTemplate: null,
  loading: false,
  error: null,

  setTemplates: (templates) => set({ templates }),
  setSelected: (selectedTemplate) => set({ selectedTemplate }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
