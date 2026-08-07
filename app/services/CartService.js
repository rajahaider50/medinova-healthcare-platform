/**
 * MediNova — CartService.
 * Cart persistence + store sync for pharmacy orders.
 */

import * as Storage from "./StorageService.js";
import * as Store from "../state/store.js";
import { STORAGE_KEYS } from "../config/app.config.js";

function read() {
  return Storage.get(STORAGE_KEYS.cart, []);
}

function write(cart) {
  Storage.set(STORAGE_KEYS.cart, cart);
  Store.set("cartCount", cart.reduce((sum, i) => sum + i.qty, 0));
}

export function cart() {
  return read();
}

export function count() {
  return read().reduce((sum, i) => sum + i.qty, 0);
}

export function add(item) {
  const list = read();
  const existing = list.find((i) => i.medicineId === item.medicineId);
  if (existing) existing.qty += item.qty || 1;
  else list.push({ medicineId: item.medicineId, name: item.name, price: item.price, qty: item.qty || 1, prescriptionRequired: !!item.prescriptionRequired, image: item.image || "" });
  write(list);
  return list;
}

export function setQty(medicineId, qty) {
  const list = read();
  const item = list.find((i) => i.medicineId === medicineId);
  if (!item) return list;
  item.qty = Math.max(1, qty);
  write(list);
  return list;
}

export function remove(medicineId) {
  const list = read().filter((i) => i.medicineId !== medicineId);
  write(list);
  return list;
}

export function clear() {
  write([]);
  return [];
}

export function subtotal() {
  return read().reduce((sum, i) => sum + i.price * i.qty, 0);
}

export function hasPrescriptionRequired() {
  return read().some((i) => i.prescriptionRequired);
}

/** Place order from cart. */
export function checkout({ address, city, phone, paymentMethod, coupon = "" }) {
  const items = read();
  if (!items.length) throw new Error("Your cart is empty.");
  return { items, address, city, phone, paymentMethod, coupon };
}

export const cartService = { cart, count, add, setQty, remove, clear, subtotal, hasPrescriptionRequired, checkout };

export const CartService = cartService;

export default cartService;
