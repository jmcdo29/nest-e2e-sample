export const PersonConstants = {
  baseRoutes: '/person',
  specs: {
    add: 'Person:Add',
    delete: 'Person:Delete',
  },
  templates: {
    new: 'Person:New',
  },
  keys: {
    id: 'PersonID',
  },
} as const;
