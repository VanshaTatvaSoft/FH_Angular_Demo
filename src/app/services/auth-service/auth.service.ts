import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private email: string = '';

  constructor() {}

  // --- EMAIL HANDLERS ---

  setEmail(email: string) {
    this.email = email;
  }
  getEmail(): string {
    return this.email;
  }
  clearEmail() {
    this.email = '';
  }
  normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  // Validate email format
  isValid(email: string): boolean {
    return !!email && /^\S+@\S+\.\S+$/.test(email);
  }

  // Mask email for display
  maskEmail(email: string): string {
    if (!this.isValid(email)) return email;
    const [name, domain] = email.split('@');
    if (name.length < 3) return `***@${domain}`;
    return `${name.slice(0, 2)}***@${domain}`;
  }

  // Normalize email (lowercase, trim)
  normalize(email: string): string {
    return email.trim().toLowerCase();
  }
  // --- USERNAME HANDLERS ---

  isValidUserName(userName: string): boolean {
    // Example rules: 3-20 chars, only letters, digits, underscores, no spaces
    return typeof userName === 'string'
      && /^[A-Za-z0-9_]{3,20}$/.test(userName);
  }
  getUserNameErrors(userName: string): string[] {
    const errors: string[] = [];
    if (typeof userName !== 'string' || !userName.trim()) {
      errors.push('Username is required.');
      return errors;
    }
    const trimmed = userName.trim();
    if (trimmed.length < 3) errors.push('At least 3 characters required.');
    if (trimmed.length > 20) errors.push('No more than 20 characters allowed.');
    if (/\s/.test(trimmed)) errors.push('No spaces allowed.');
    if (!/^[A-Za-z0-9_]+$/.test(trimmed)) errors.push('Only letters, digits, and underscores allowed.');
    return errors;
  }
  normalizeUserName(userName: string): string {
    return userName.trim();
  }

  // --- PASSWORD HANDLERS ---

  isValidPassword(password: string): boolean {
    return this.getPasswordErrors(password).length === 0;
  }
  getPasswordErrors(password: string): string[] {
    const errors: string[] = [];
    if (typeof password !== 'string' || !password.trim()) {
      errors.push('Password is required.');
      return errors;
    }
    const trimmed = password.trim();
    if (trimmed.length < 8) errors.push('At least 8 characters required.');
    if (/\s/.test(trimmed)) errors.push('No spaces allowed.');
    if (!/[A-Z]/.test(trimmed)) errors.push('At least one uppercase letter required.');
    if (!/[a-z]/.test(trimmed)) errors.push('At least one lowercase letter required.');
    if (!/\d/.test(trimmed)) errors.push('At least one digit required.');
    if (!/[@!#&*\$]/.test(trimmed)) errors.push('At least one special character (@!#&*$) required.');
    // Disallowed special chars
    const specialCharRegex = /[^A-Za-z0-9@!#&*\$]/g;
    const found = trimmed.match(specialCharRegex);
    if (found) {
      const unique = Array.from(new Set(found));
      unique.forEach(char => {
        errors.push(`The character "${char}" is not allowed.`);
      });
    }
    return errors;
  }

}
