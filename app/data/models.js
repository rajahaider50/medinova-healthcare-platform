/**
 * MediNova — Data models.
 * Validators + factories for each core entity.
 */

import { isString, isNumber, isEmail } from "../utils/is.js";

export const REQUIRED_FIELDS = {
  user: ["name", "email", "password", "role"],
  doctor: ["name", "specialty", "fee"],
  medicine: ["name", "price", "categoryId", "stock"],
  appointment: ["patientId", "doctorId", "date", "time"],
  prescription: ["patientId", "doctorId", "medicines"],
  record: ["patientId", "type", "title"],
  report: ["patientId", "test", "result"],
  order: ["userId", "items"],
  ticket: ["subject", "category", "message"],
  coupon: ["code", "value"],
};

export function validate(entity, kind) {
  const required = REQUIRED_FIELDS[kind] || [];
  const errors = [];
  for (const field of required) {
    const value = entity?.[field];
    if (value === undefined || value === null || value === "") {
      errors.push(`Missing required field: ${field}`);
    }
  }
  return { valid: errors.length === 0, errors };
}

export function validateUser(user) {
  const errors = [];
  if (!isString(user?.name) || user.name.trim().length < 2) errors.push("Name must be at least 2 characters.");
  if (!isEmail(user?.email)) errors.push("A valid email is required.");
  if (!isString(user?.password) || user.password.length < 6) errors.push("Password must be at least 6 characters.");
  if (!["patient", "admin", "doctor"].includes(user?.role)) errors.push("Invalid role.");
  return { valid: errors.length === 0, errors };
}

export function validateAppointment(appt) {
  const errors = [];
  if (!appt?.patientId) errors.push("Patient is required.");
  if (!appt?.doctorId) errors.push("Doctor is required.");
  if (!isString(appt?.date) || !appt.date) errors.push("A valid date is required.");
  if (!isString(appt?.time) || !appt.time) errors.push("A valid time slot is required.");
  if (isNumber(appt?.fee) && appt.fee < 0) errors.push("Fee cannot be negative.");
  return { valid: errors.length === 0, errors };
}

export function validateMedicine(med) {
  const errors = [];
  if (!isString(med?.name) || med.name.trim().length < 2) errors.push("Medicine name is required.");
  if (!isNumber(med?.price) || med.price < 0) errors.push("Price must be a valid non-negative number.");
  if (!med?.categoryId) errors.push("Category is required.");
  if (isNumber(med?.stock) && med.stock < 0) errors.push("Stock cannot be negative.");
  return { valid: errors.length === 0, errors };
}

export function validateOrder(order) {
  const errors = [];
  if (!order?.userId) errors.push("User is required.");
  if (!Array.isArray(order?.items) || order.items.length === 0) errors.push("Order must contain at least one item.");
  return { valid: errors.length === 0, errors };
}

export function makeId(prefix) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export const modelUtils = { validate, validateUser, validateAppointment, validateMedicine, validateOrder, makeId };

export default modelUtils;
