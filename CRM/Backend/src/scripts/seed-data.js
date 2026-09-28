import { FIELD_TYPE, OBJECT_STATUS, ON_DELETE, ROLE, FIELD_ACCESS } from '../config/constants.js';

const pick = (value, label, color) => ({ value, label: label || value, color: color || 'slate' });

export const CITIES = ['Hyderabad', 'Bangalore', 'Chennai', 'Pune', 'Delhi', 'Mumbai', 'Kolkata', 'Ahmedabad'];

export const FIRST_NAMES = [
  'Ravi', 'Sneha', 'Arjun', 'Priya', 'Karan', 'Ananya', 'Vikram', 'Meera', 'Rohit', 'Divya',
  'Aditya', 'Kavya', 'Nikhil', 'Pooja', 'Sanjay', 'Ishita', 'Rahul', 'Neha', 'Manish', 'Swathi',
  'Harish', 'Lakshmi', 'Suresh', 'Deepika', 'Varun', 'Anjali', 'Kiran', 'Shreya', 'Abhishek', 'Ritu',
];

export const LAST_NAMES = [
  'Kumar', 'Reddy', 'Das', 'Sharma', 'Mehta', 'Iyer', 'Nair', 'Rao', 'Gupta', 'Patel',
  'Chowdhury', 'Verma', 'Singh', 'Joshi', 'Naidu', 'Pillai', 'Bose', 'Menon', 'Malhotra', 'Shetty',
];

export const COMPANY_PREFIX = [
  'Hitech', 'Sunrise', 'Bluewave', 'Prime', 'Vertex', 'Nova', 'Orbit', 'Silverline', 'Greenfield',
  'Apex', 'Zenith', 'Cyber', 'Global', 'Metro', 'Crystal',
];
export const COMPANY_SUFFIX = ['Solutions', 'Technologies', 'Industries', 'Systems', 'Enterprises', 'Labs', 'Traders'];

export const ROLES = [
  { roleId: 'role_admin', name: 'Platform Admin', description: 'Full control over metadata, indexes, roles and records', isSystem: true },
  { roleId: 'role_sales', name: 'Sales Manager', description: 'Owns the sales pipeline: customers, orders, invoices, leads', isSystem: false },
  { roleId: 'role_hr', name: 'HR Manager', description: 'Owns employee data; read-only elsewhere', isSystem: false },
  { roleId: 'role_employee', name: 'Employee', description: 'Read-mostly access; may log activities', isSystem: false },
  { roleId: 'role_system', name: 'System Daemon', description: 'Background actor: indexing, jobs, cache', isSystem: true },
];

export const USERS = [
  { userId: 'u_admin', name: 'Admin User', role: ROLE.PLATFORM_ADMIN, roleId: 'role_admin', avatarInitials: 'AU', title: 'Platform Administrator' },
  { userId: 'u_sales', name: 'Sales Manager', role: ROLE.BUSINESS_USER, roleId: 'role_sales', avatarInitials: 'SM', title: 'Regional Sales Head' },
  { userId: 'u_hr', name: 'HR Manager', role: ROLE.BUSINESS_USER, roleId: 'role_hr', avatarInitials: 'HM', title: 'People Operations' },
  { userId: 'u_employee', name: 'Employee', role: ROLE.BUSINESS_USER, roleId: 'role_employee', avatarInitials: 'EM', title: 'Associate' },
  { userId: 'u_system', name: 'System Daemon', role: ROLE.SYSTEM, roleId: 'role_system', avatarInitials: 'SD', title: 'Background Worker' },
];

const ALL = (read, create, update, del) => ({ read, create, update, delete: del });

/**
 * Permission matrices. Note that the admin's power comes from a `"*"` entry —
 * there is no role-name check anywhere in the codebase.
 */
export const PERMISSIONS = {
  role_admin: {
    objects: { '*': ALL(true, true, true, true) },
    fields: { '*': { '*': FIELD_ACCESS.WRITE } },
  },
  role_sales: {
    objects: {
      '*': ALL(true, false, false, false),
      customer: ALL(true, true, true, true),
      sales_order: ALL(true, true, true, true),
      invoice: ALL(true, true, true, false),
      lead: ALL(true, true, true, true),
      activity: ALL(true, true, true, true),
      account: ALL(true, true, true, false),
      product: ALL(true, false, false, false),
      employee: ALL(true, false, false, false),
    },
    fields: {
      '*': { '*': FIELD_ACCESS.WRITE },
      employee: { '*': FIELD_ACCESS.READ, f5: FIELD_ACCESS.HIDDEN },
    },
  },
  role_hr: {
    objects: {
      '*': ALL(true, false, false, false),
      employee: ALL(true, true, true, true),
      activity: ALL(true, true, true, false),
    },
    fields: { '*': { '*': FIELD_ACCESS.WRITE } },
  },
  role_employee: {
    objects: {
      '*': ALL(true, false, false, false),
      activity: ALL(true, true, true, false),
    },
    fields: {
      '*': { '*': FIELD_ACCESS.READ },
      activity: { '*': FIELD_ACCESS.WRITE },
      employee: { '*': FIELD_ACCESS.READ, f5: FIELD_ACCESS.HIDDEN },
    },
  },
  role_system: {
    objects: { '*': ALL(true, false, true, false) },
    fields: { '*': { '*': FIELD_ACCESS.READ } },
  },
};

const T = FIELD_TYPE;

/**
 * Object blueprints. `fields` are FieldFactory inputs; the seed assigns
 * f1..fn in order, so the fieldIds referenced by lookups below are stable.
 */
export const OBJECTS = [
  {
    objectId: 'account',
    label: 'Account',
    pluralLabel: 'Accounts',
    description: 'Parent companies that customers belong to',
    icon: 'building-2',
    color: 'emerald',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Account Name', type: T.TEXT, required: true, unique: true, searchable: true, sortable: true, filterable: true },
      { label: 'Industry', type: T.PICKLIST, filterable: true, options: ['Technology', 'Manufacturing', 'Retail', 'Healthcare', 'Finance', 'Education'].map((v) => pick(v)) },
      { label: 'Annual Revenue', type: T.CURRENCY, sortable: true, filterable: true, validation: { min: 0, max: null, minLength: null, maxLength: null, regex: null, message: null } },
      { label: 'Website', type: T.URL, filterable: false },
      { label: 'Account Owner', type: T.TEXT, filterable: false },
    ],
  },
  {
    objectId: 'customer',
    label: 'Customer',
    pluralLabel: 'Customers',
    description: 'Stores customer related information',
    icon: 'users',
    color: 'indigo',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Customer Name', type: T.TEXT, required: true, searchable: true, sortable: true, filterable: true, helpText: 'Full name as it appears on invoices' },
      { label: 'Email', type: T.EMAIL, required: true, unique: true, searchable: true, filterable: true },
      { label: 'Phone', type: T.PHONE, filterable: true, validation: { min: null, max: null, minLength: 10, maxLength: 14, regex: null, message: null } },
      { label: 'City', type: T.PICKLIST, searchable: true, filterable: true, options: CITIES.map((c) => pick(c)) },
      {
        label: 'Customer Type',
        type: T.PICKLIST,
        filterable: true,
        options: [pick('Individual', 'Individual', 'sky'), pick('Business', 'Business', 'violet'), pick('Enterprise', 'Enterprise', 'amber')],
      },
      {
        label: 'Status',
        type: T.PICKLIST,
        filterable: true,
        options: [pick('ACTIVE', 'Active', 'emerald'), pick('INACTIVE', 'Inactive', 'rose'), pick('PROSPECT', 'Prospect', 'amber')],
      },
      { label: 'Created Date', type: T.DATE, sortable: true, filterable: true },
      { label: 'Address', type: T.TEXTAREA, filterable: false },
      { label: 'Account', type: T.LOOKUP, filterable: true, lookup: { objectId: 'account', displayFieldId: 'f1', onDelete: ON_DELETE.SET_NULL } },
    ],
  },
  {
    objectId: 'product',
    label: 'Product',
    pluralLabel: 'Products',
    description: 'Catalogue of sellable products',
    icon: 'package',
    color: 'amber',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Product Name', type: T.TEXT, required: true, searchable: true, sortable: true, filterable: true },
      { label: 'SKU', type: T.TEXT, required: true, unique: true, searchable: true, filterable: true },
      { label: 'Category', type: T.PICKLIST, filterable: true, options: ['Hardware', 'Software', 'Services', 'Subscription', 'Accessories'].map((v) => pick(v)) },
      { label: 'Unit Price', type: T.CURRENCY, sortable: true, filterable: true },
      { label: 'In Stock', type: T.BOOLEAN, filterable: true },
      { label: 'Launch Date', type: T.DATE, sortable: true, filterable: true },
    ],
  },
  {
    objectId: 'sales_order',
    label: 'Sales Order',
    pluralLabel: 'Sales Orders',
    description: 'Orders placed by customers',
    icon: 'shopping-cart',
    color: 'sky',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Order Number', type: T.TEXT, required: true, unique: true, searchable: true, sortable: true, filterable: true },
      { label: 'Order Date', type: T.DATE, required: true, sortable: true, filterable: true },
      { label: 'Amount', type: T.CURRENCY, required: true, sortable: true, filterable: true, validation: { min: 0, max: null, minLength: null, maxLength: null, regex: null, message: null } },
      {
        label: 'Status',
        type: T.PICKLIST,
        filterable: true,
        options: [pick('DRAFT', 'Draft', 'slate'), pick('CONFIRMED', 'Confirmed', 'sky'), pick('SHIPPED', 'Shipped', 'violet'), pick('DELIVERED', 'Delivered', 'emerald'), pick('CANCELLED', 'Cancelled', 'rose')],
      },
      { label: 'Customer', type: T.LOOKUP, required: true, filterable: true, lookup: { objectId: 'customer', displayFieldId: 'f1', onDelete: ON_DELETE.RESTRICT } },
      { label: 'Product', type: T.LOOKUP, filterable: true, lookup: { objectId: 'product', displayFieldId: 'f1', onDelete: ON_DELETE.SET_NULL } },
    ],
  },
  {
    objectId: 'invoice',
    label: 'Invoice',
    pluralLabel: 'Invoices',
    description: 'Invoices raised against sales orders',
    icon: 'file-text',
    color: 'violet',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Invoice Number', type: T.TEXT, required: true, unique: true, searchable: true, sortable: true, filterable: true },
      { label: 'Amount', type: T.CURRENCY, required: true, sortable: true, filterable: true },
      { label: 'Due Date', type: T.DATE, sortable: true, filterable: true },
      {
        label: 'Status',
        type: T.PICKLIST,
        filterable: true,
        options: [pick('DRAFT', 'Draft', 'slate'), pick('SENT', 'Sent', 'sky'), pick('PAID', 'Paid', 'emerald'), pick('OVERDUE', 'Overdue', 'rose')],
      },
      { label: 'Customer', type: T.LOOKUP, required: true, filterable: true, lookup: { objectId: 'customer', displayFieldId: 'f1', onDelete: ON_DELETE.RESTRICT } },
      { label: 'Sales Order', type: T.LOOKUP, filterable: true, lookup: { objectId: 'sales_order', displayFieldId: 'f1', onDelete: ON_DELETE.SET_NULL } },
    ],
  },
  {
    objectId: 'lead',
    label: 'Lead',
    pluralLabel: 'Leads',
    description: 'Unqualified prospects entering the pipeline',
    icon: 'target',
    color: 'rose',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Lead Name', type: T.TEXT, required: true, searchable: true, sortable: true, filterable: true },
      { label: 'Email', type: T.EMAIL, searchable: true, filterable: true },
      { label: 'Phone', type: T.PHONE, filterable: false },
      { label: 'Source', type: T.PICKLIST, filterable: true, options: ['Website', 'Referral', 'Campaign', 'Cold Call', 'Event', 'Partner'].map((v) => pick(v)) },
      {
        label: 'Status',
        type: T.PICKLIST,
        filterable: true,
        options: [pick('NEW', 'New', 'sky'), pick('CONTACTED', 'Contacted', 'amber'), pick('QUALIFIED', 'Qualified', 'emerald'), pick('LOST', 'Lost', 'rose')],
      },
      { label: 'Score', type: T.NUMBER, sortable: true, filterable: true, validation: { min: 0, max: 100, minLength: null, maxLength: null, regex: null, message: 'Score must be between 0 and 100' } },
      { label: 'City', type: T.PICKLIST, filterable: true, options: CITIES.map((c) => pick(c)) },
    ],
  },
  {
    objectId: 'activity',
    label: 'Activity',
    pluralLabel: 'Activities',
    description: 'Calls, emails, meetings and tasks logged against customers',
    icon: 'activity',
    color: 'emerald',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Subject', type: T.TEXT, required: true, searchable: true, sortable: true, filterable: true },
      {
        label: 'Type',
        type: T.PICKLIST,
        filterable: true,
        options: [pick('CALL', 'Call', 'sky'), pick('EMAIL', 'Email', 'violet'), pick('MEETING', 'Meeting', 'amber'), pick('TASK', 'Task', 'emerald')],
      },
      { label: 'Due Date', type: T.DATETIME, sortable: true, filterable: true },
      { label: 'Completed', type: T.BOOLEAN, filterable: true },
      { label: 'Customer', type: T.LOOKUP, filterable: true, lookup: { objectId: 'customer', displayFieldId: 'f1', onDelete: ON_DELETE.CASCADE } },
      { label: 'Notes', type: T.TEXTAREA, filterable: false },
    ],
  },
  {
    objectId: 'employee',
    label: 'Employee',
    pluralLabel: 'Employees',
    description: 'Internal staff directory',
    icon: 'user',
    color: 'indigo',
    status: OBJECT_STATUS.PUBLISHED,
    fields: [
      { label: 'Employee Name', type: T.TEXT, required: true, searchable: true, sortable: true, filterable: true },
      { label: 'Email', type: T.EMAIL, required: true, unique: true, searchable: true, filterable: true },
      { label: 'Department', type: T.PICKLIST, filterable: true, options: ['Engineering', 'Sales', 'Marketing', 'Finance', 'Human Resources', 'Support'].map((v) => pick(v)) },
      { label: 'Designation', type: T.TEXT, filterable: false },
      { label: 'Salary', type: T.CURRENCY, sortable: true, filterable: true },
      { label: 'Joining Date', type: T.DATE, sortable: true, filterable: true },
      { label: 'City', type: T.PICKLIST, filterable: true, options: CITIES.map((c) => pick(c)) },
    ],
  },
  {
    objectId: 'campaign',
    label: 'Campaign',
    pluralLabel: 'Campaigns',
    description: 'Marketing campaigns — still being designed',
    icon: 'megaphone',
    color: 'amber',
    status: OBJECT_STATUS.DRAFT,
    fields: [
      { label: 'Campaign Name', type: T.TEXT, required: true, searchable: true, filterable: true },
      { label: 'Channel', type: T.PICKLIST, filterable: true, options: ['Email', 'Social', 'Search', 'Events'].map((v) => pick(v)) },
      { label: 'Budget', type: T.CURRENCY, filterable: true },
      { label: 'Start Date', type: T.DATE, filterable: true },
    ],
  },
  {
    objectId: 'support_ticket',
    label: 'Support Ticket',
    pluralLabel: 'Support Tickets',
    description: 'Retired — replaced by the external helpdesk',
    icon: 'life-buoy',
    color: 'rose',
    status: OBJECT_STATUS.ARCHIVED,
    fields: [
      { label: 'Ticket Number', type: T.TEXT, required: true, unique: true, searchable: true, filterable: true },
      { label: 'Subject', type: T.TEXT, searchable: true, filterable: true },
      { label: 'Priority', type: T.PICKLIST, filterable: true, options: ['Low', 'Medium', 'High', 'Critical'].map((v) => pick(v)) },
      { label: 'Resolved', type: T.BOOLEAN, filterable: true },
    ],
  },
];

export const RECORD_VOLUMES = {
  account: 300,
  customer: 4000,
  product: 1200,
  sales_order: 3500,
  invoice: 2800,
  lead: 5000,
  activity: 7000,
  employee: 400,
  support_ticket: 120,
};
