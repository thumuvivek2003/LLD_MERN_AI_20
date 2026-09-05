// core/constants/privacy.constants.js — mirrors the backend contract exactly.
export const PRIVACY = Object.freeze({
  EVERYONE: 'EVERYONE',
  CONTACTS_EXCEPT: 'CONTACTS_EXCEPT',
  ONLY_SHARE_WITH: 'ONLY_SHARE_WITH',
});

export const PRIVACY_OPTIONS = [
  { value: PRIVACY.EVERYONE, title: 'Everyone', subtitle: 'Everyone on WhatsApp', icon: '🌐' },
  { value: PRIVACY.CONTACTS_EXCEPT, title: 'My contacts except…', subtitle: 'Exclude people from seeing', icon: '🚫' },
  { value: PRIVACY.ONLY_SHARE_WITH, title: 'Only share with…', subtitle: 'Only select people can see', icon: '✅' },
];

// Short label used on the composer chip ("Status (Contacts)" style).
export const PRIVACY_SHORT = {
  [PRIVACY.EVERYONE]: 'Everyone',
  [PRIVACY.CONTACTS_EXCEPT]: 'Contacts',
  [PRIVACY.ONLY_SHARE_WITH]: 'Selected',
};
