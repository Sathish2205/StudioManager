/**
 * Roles & Permissions Constants
 * Centralized RBAC configuration for PhotoStudioPro
 */

// ── Available Roles ──
export const ROLES = [
  'Owner/Admin',
  'Manager',
  'Photographer',
  'Videographer',
  'Photo Editor',
  'Album Designer',
  'Accountant',
  'Assistant',
]

export const ROLE_OPTIONS = ROLES.map((r) => ({ label: r, value: r }))

// ── Permission Strings ──
export const PERMISSIONS = {
  // Events
  EVENTS_VIEW: 'events.view',
  EVENTS_CREATE: 'events.create',
  EVENTS_EDIT: 'events.edit',

  // Editing & Deliverables
  EDITING_VIEW: 'editing.view',
  EDITING_UPDATE: 'editing.update',
  EDITING_ASSIGN: 'editing.assign',

  // Deliverables
  DELIVERABLES_VIEW: 'deliverables.view',
  DELIVERABLES_UPDATE: 'deliverables.update',

  // Finance
  FINANCE_VIEW: 'finance.view',
  FINANCE_CREATE: 'finance.create',
  FINANCE_RECORD_PAYMENT: 'finance.record_payment',

  // Employees
  EMPLOYEES_VIEW: 'employees.view',
  EMPLOYEES_CREATE: 'employees.create',
  EMPLOYEES_EDIT: 'employees.edit',

  // Attendance
  ATTENDANCE_VIEW: 'attendance.view',
  ATTENDANCE_MANAGE: 'attendance.manage',

  // CRM
  CRM_VIEW: 'crm.view',
  CRM_CREATE: 'crm.create',
  CRM_EDIT: 'crm.edit',

  // Calendar
  CALENDAR_VIEW: 'calendar.view',

  // Workflow
  WORKFLOW_VIEW: 'workflow.view',
  WORKFLOW_MANAGE: 'workflow.manage',

  // Packages
  PACKAGES_VIEW: 'packages.view',
  PACKAGES_CREATE: 'packages.create',

  // Contracts
  CONTRACTS_VIEW: 'contracts.view',
  CONTRACTS_CREATE: 'contracts.create',

  // Equipment
  EQUIPMENT_VIEW: 'equipment.view',
  EQUIPMENT_MANAGE: 'equipment.manage',

  // Helpdesk
  HELPDESK_VIEW: 'helpdesk.view',
  HELPDESK_MANAGE: 'helpdesk.manage',

  // Client Requests
  REQUESTS_VIEW: 'requests.view',
  REQUESTS_MANAGE: 'requests.manage',

  // User/Account management
  ACCOUNTS_CREATE: 'accounts.create',
  ACCOUNTS_MANAGE: 'accounts.manage',
}

// ── Default Role → Permissions Mapping ──
// Used as fallback when backend doesn't return permissions
export const DEFAULT_ROLE_PERMISSIONS = {
  'Owner/Admin': Object.values(PERMISSIONS), // Full access
  'owner': Object.values(PERMISSIONS),
  'admin': Object.values(PERMISSIONS),
  'Owner': Object.values(PERMISSIONS),
  'Admin': Object.values(PERMISSIONS),

  'Manager': [
    PERMISSIONS.EVENTS_VIEW, PERMISSIONS.EVENTS_CREATE, PERMISSIONS.EVENTS_EDIT,
    PERMISSIONS.EDITING_VIEW, PERMISSIONS.EDITING_UPDATE, PERMISSIONS.EDITING_ASSIGN,
    PERMISSIONS.DELIVERABLES_VIEW, PERMISSIONS.DELIVERABLES_UPDATE,
    PERMISSIONS.FINANCE_VIEW, PERMISSIONS.FINANCE_CREATE, PERMISSIONS.FINANCE_RECORD_PAYMENT,
    PERMISSIONS.EMPLOYEES_VIEW, PERMISSIONS.EMPLOYEES_CREATE, PERMISSIONS.EMPLOYEES_EDIT,
    PERMISSIONS.ATTENDANCE_VIEW, PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.CRM_VIEW, PERMISSIONS.CRM_CREATE, PERMISSIONS.CRM_EDIT,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.WORKFLOW_VIEW, PERMISSIONS.WORKFLOW_MANAGE,
    PERMISSIONS.PACKAGES_VIEW, PERMISSIONS.PACKAGES_CREATE,
    PERMISSIONS.CONTRACTS_VIEW, PERMISSIONS.CONTRACTS_CREATE,
    PERMISSIONS.EQUIPMENT_VIEW, PERMISSIONS.EQUIPMENT_MANAGE,
    PERMISSIONS.HELPDESK_VIEW, PERMISSIONS.HELPDESK_MANAGE,
    PERMISSIONS.REQUESTS_VIEW, PERMISSIONS.REQUESTS_MANAGE,
    PERMISSIONS.ACCOUNTS_CREATE, PERMISSIONS.ACCOUNTS_MANAGE,
  ],
  'manager': [
    PERMISSIONS.EVENTS_VIEW, PERMISSIONS.EVENTS_CREATE, PERMISSIONS.EVENTS_EDIT,
    PERMISSIONS.EDITING_VIEW, PERMISSIONS.EDITING_UPDATE, PERMISSIONS.EDITING_ASSIGN,
    PERMISSIONS.DELIVERABLES_VIEW, PERMISSIONS.DELIVERABLES_UPDATE,
    PERMISSIONS.FINANCE_VIEW, PERMISSIONS.FINANCE_CREATE, PERMISSIONS.FINANCE_RECORD_PAYMENT,
    PERMISSIONS.EMPLOYEES_VIEW, PERMISSIONS.EMPLOYEES_CREATE, PERMISSIONS.EMPLOYEES_EDIT,
    PERMISSIONS.ATTENDANCE_VIEW, PERMISSIONS.ATTENDANCE_MANAGE,
    PERMISSIONS.CRM_VIEW, PERMISSIONS.CRM_CREATE, PERMISSIONS.CRM_EDIT,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.WORKFLOW_VIEW, PERMISSIONS.WORKFLOW_MANAGE,
    PERMISSIONS.PACKAGES_VIEW, PERMISSIONS.PACKAGES_CREATE,
    PERMISSIONS.CONTRACTS_VIEW, PERMISSIONS.CONTRACTS_CREATE,
    PERMISSIONS.EQUIPMENT_VIEW, PERMISSIONS.EQUIPMENT_MANAGE,
    PERMISSIONS.HELPDESK_VIEW, PERMISSIONS.HELPDESK_MANAGE,
    PERMISSIONS.REQUESTS_VIEW, PERMISSIONS.REQUESTS_MANAGE,
    PERMISSIONS.ACCOUNTS_CREATE, PERMISSIONS.ACCOUNTS_MANAGE,
  ],

  'Photographer': [
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EDITING_VIEW,
    PERMISSIONS.DELIVERABLES_VIEW,
    PERMISSIONS.EQUIPMENT_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.HELPDESK_VIEW,
    PERMISSIONS.REQUESTS_VIEW,
  ],

  'Videographer': [
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EDITING_VIEW,
    PERMISSIONS.DELIVERABLES_VIEW,
    PERMISSIONS.EQUIPMENT_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.HELPDESK_VIEW,
    PERMISSIONS.REQUESTS_VIEW,
  ],

  'Photo Editor': [
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.EDITING_VIEW, PERMISSIONS.EDITING_UPDATE,
    PERMISSIONS.DELIVERABLES_VIEW, PERMISSIONS.DELIVERABLES_UPDATE,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.HELPDESK_VIEW,
  ],

  'Album Designer': [
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.EDITING_VIEW, PERMISSIONS.EDITING_UPDATE,
    PERMISSIONS.DELIVERABLES_VIEW, PERMISSIONS.DELIVERABLES_UPDATE,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.HELPDESK_VIEW,
  ],

  'Accountant': [
    PERMISSIONS.FINANCE_VIEW, PERMISSIONS.FINANCE_CREATE, PERMISSIONS.FINANCE_RECORD_PAYMENT,
    PERMISSIONS.PACKAGES_VIEW,
    PERMISSIONS.CONTRACTS_VIEW,
    PERMISSIONS.EMPLOYEES_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.HELPDESK_VIEW,
  ],

  'Assistant': [
    PERMISSIONS.EVENTS_VIEW,
    PERMISSIONS.CALENDAR_VIEW,
    PERMISSIONS.CRM_VIEW,
    PERMISSIONS.WORKFLOW_VIEW,
    PERMISSIONS.EDITING_VIEW,
    PERMISSIONS.DELIVERABLES_VIEW,
    PERMISSIONS.ATTENDANCE_VIEW,
    PERMISSIONS.EQUIPMENT_VIEW,
    PERMISSIONS.HELPDESK_VIEW,
    PERMISSIONS.REQUESTS_VIEW,
  ],
}

// ── Sidebar Navigation → Permission Mapping ──
// Maps each sidebar nav item id to the permission required to view it
export const NAV_PERMISSIONS = {
  'home': null, // Everyone can see dashboard
  'events': PERMISSIONS.EVENTS_VIEW,
  'calendar': PERMISSIONS.CALENDAR_VIEW,
  'workflow': PERMISSIONS.WORKFLOW_VIEW,
  'crm': PERMISSIONS.CRM_VIEW,
  'requests': PERMISSIONS.REQUESTS_VIEW,
  'finance': PERMISSIONS.FINANCE_VIEW,
  'packages': PERMISSIONS.PACKAGES_VIEW,
  'employees': PERMISSIONS.EMPLOYEES_VIEW,
  'crew': PERMISSIONS.EMPLOYEES_VIEW,
  'equipment': PERMISSIONS.EQUIPMENT_VIEW,
  'tasks': PERMISSIONS.EDITING_VIEW,
  'contracts': PERMISSIONS.CONTRACTS_VIEW,
  'helpdesk': PERMISSIONS.HELPDESK_VIEW,
}

// ── Route Tab → Permission Mapping ──
// Maps each App.jsx tab/route to the permission required
export const ROUTE_PERMISSIONS = {
  'home': null,
  'events': PERMISSIONS.EVENTS_VIEW,
  'add-event': PERMISSIONS.EVENTS_CREATE,
  'invoice': PERMISSIONS.FINANCE_VIEW,
  'calendar': PERMISSIONS.CALENDAR_VIEW,
  'workflow': PERMISSIONS.WORKFLOW_VIEW,
  'crm': PERMISSIONS.CRM_VIEW,
  'tasks': PERMISSIONS.EDITING_VIEW,
  'finance': PERMISSIONS.FINANCE_VIEW,
  'packages': PERMISSIONS.PACKAGES_VIEW,
  'create-quotation': PERMISSIONS.FINANCE_CREATE,
  'quotation-detail': PERMISSIONS.FINANCE_VIEW,
  'invoice-detail': PERMISSIONS.FINANCE_VIEW,
  'contracts': PERMISSIONS.CONTRACTS_VIEW,
  'crew': PERMISSIONS.EMPLOYEES_VIEW,
  'employees': PERMISSIONS.EMPLOYEES_VIEW,
  'equipment': PERMISSIONS.EQUIPMENT_VIEW,
  'helpdesk': PERMISSIONS.HELPDESK_VIEW,
  'requests': PERMISSIONS.REQUESTS_VIEW,
}

/**
 * Check if a role is Owner or Admin.
 */
export function isOwnerOrAdmin(role) {
  if (!role) return false
  const r = String(role).toLowerCase()
  return r === 'owner' || r === 'admin' || r === 'owner/admin' || r.includes('owner') || r.includes('admin')
}

/**
 * Get permissions for a given role name.
 * First checks backend-provided permissions, falls back to defaults.
 */
export function getPermissionsForRole(roleName, backendPermissions) {
  if (backendPermissions && backendPermissions.length > 0) {
    return backendPermissions
  }
  if (isOwnerOrAdmin(roleName)) {
    return Object.values(PERMISSIONS)
  }
  const keys = Object.keys(DEFAULT_ROLE_PERMISSIONS)
  const match = keys.find(k => k.toLowerCase() === String(roleName || '').toLowerCase())
  return match ? DEFAULT_ROLE_PERMISSIONS[match] : []
}

/**
 * Roles that can create other accounts.
 * Used for privilege escalation prevention.
 */
export const ACCOUNT_CREATOR_ROLES = ['Owner/Admin', 'owner', 'admin', 'Manager', 'manager']

/**
 * Get the roles that a given role is allowed to assign.
 * Prevents privilege escalation.
 */
export function getAssignableRoles(currentUserRole) {
  if (isOwnerOrAdmin(currentUserRole)) {
    return ROLES // Can assign any role
  }
  if (String(currentUserRole || '').toLowerCase().includes('manager')) {
    // Manager cannot create Owner/Admin accounts
    return ROLES.filter((r) => r !== 'Owner/Admin')
  }
  return [] // Other roles cannot assign
}
