export const OBJECT_STATUS = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED',
};

export const OBJECT_STATUS_LABEL = {
  DRAFT: 'Draft',
  PUBLISHED: 'Published',
  ARCHIVED: 'Archived',
};

export const OBJECT_STATUS_TONE = {
  DRAFT: 'amber',
  PUBLISHED: 'emerald',
  ARCHIVED: 'slate',
};

/** Lifecycle order rendered by the Object Lifecycle stepper. */
export const OBJECT_LIFECYCLE = [
  {
    status: OBJECT_STATUS.DRAFT,
    label: 'Draft',
    description: 'Object is in draft state',
    icon: 'FileText',
  },
  {
    status: OBJECT_STATUS.PUBLISHED,
    label: 'Published',
    description: 'Object is live and available',
    icon: 'Box',
  },
  {
    status: OBJECT_STATUS.ARCHIVED,
    label: 'Archived',
    description: 'Object is archived',
    icon: 'Archive',
  },
];
