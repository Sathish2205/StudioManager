/**
 * Password & Username Validation Utilities
 * Used in employee account creation and password reset flows
 */

/**
 * Validate password strength.
 * @param {string} password
 * @returns {{ isValid: boolean, strength: 'weak'|'medium'|'strong', errors: string[], score: number }}
 */
export function validatePasswordStrength(password) {
  const errors = []
  let score = 0

  if (!password) {
    return { isValid: false, strength: 'weak', errors: ['Password is required'], score: 0 }
  }

  // Length checks
  if (password.length < 8) {
    errors.push('Minimum 8 characters required')
  } else {
    score += 1
  }

  if (password.length >= 12) {
    score += 1
  }

  // Character class checks
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    errors.push('Include at least one lowercase letter')
  }

  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    errors.push('Include at least one uppercase letter')
  }

  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    errors.push('Include at least one number')
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 1
  } else {
    errors.push('Include at least one special character (!@#$%^&*)')
  }

  let strength = 'weak'
  if (score >= 5) strength = 'strong'
  else if (score >= 3) strength = 'medium'

  const isValid = password.length >= 8 && errors.length === 0

  return { isValid, strength, errors, score }
}

/**
 * Validate username format.
 * Allowed: letters, numbers, dots, underscores, hyphens. No spaces.
 * @param {string} username
 * @returns {{ isValid: boolean, errors: string[] }}
 */
export function validateUsername(username) {
  const errors = []

  if (!username || !username.trim()) {
    return { isValid: false, errors: ['Username is required'] }
  }

  const trimmed = username.trim()

  if (trimmed.length < 3) {
    errors.push('Username must be at least 3 characters')
  }

  if (trimmed.length > 30) {
    errors.push('Username must not exceed 30 characters')
  }

  if (/\s/.test(trimmed)) {
    errors.push('Username must not contain spaces')
  }

  if (!/^[a-zA-Z0-9._@-]+$/.test(trimmed)) {
    errors.push('Username can only contain letters, numbers, dots, underscores, hyphens, and @')
  }

  // Must start with a letter or number
  if (!/^[a-zA-Z0-9]/.test(trimmed)) {
    errors.push('Username must start with a letter or number')
  }

  return { isValid: errors.length === 0, errors }
}

/**
 * Check if password and confirm password match.
 * @param {string} password
 * @param {string} confirmPassword
 * @returns {boolean}
 */
export function passwordsMatch(password, confirmPassword) {
  return password === confirmPassword && password.length > 0
}

/**
 * Get the CSS class for password strength indicator.
 * @param {'weak'|'medium'|'strong'} strength
 * @returns {string}
 */
export function getStrengthClass(strength) {
  switch (strength) {
    case 'strong': return 'pwd-strength--strong'
    case 'medium': return 'pwd-strength--medium'
    case 'weak':
    default: return 'pwd-strength--weak'
  }
}

/**
 * Get display label for password strength.
 * @param {'weak'|'medium'|'strong'} strength
 * @returns {string}
 */
export function getStrengthLabel(strength) {
  switch (strength) {
    case 'strong': return 'Strong'
    case 'medium': return 'Medium'
    case 'weak':
    default: return 'Weak'
  }
}
