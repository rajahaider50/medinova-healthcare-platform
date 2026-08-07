/**
 * MediNova — Mock: pharmacy orders.
 * Demo data, clearly isolated for mock/demo mode.
 */

export const orders = [
  {
    id: "ORD-2608-0001", userId: "u-1001", userName: "Ayesha Khan",
    items: [{ medicineId: "med-panadol-extra", name: "Panadol Extra", price: 120, qty: 2 }, { medicineId: "med-vitamin-d3-2000iu", name: "Vitamin D3 2000IU", price: 350, qty: 1 }],
    subtotal: 590, discount: 0, deliveryFee: 80, coupon: "", total: 670,
    prescriptionRequired: false, prescriptionId: null,
    status: "shipped", paymentMethod: "card", paymentStatus: "paid",
    address: { line: "House 12, Street 7, F-10/3", city: "Islamabad", phone: "+92 300 1234567" },
    tracking: [{ time: "2026-08-06T10:00:00Z", label: "Order confirmed" }, { time: "2026-08-06T14:00:00Z", label: "Order packed" }, { time: "2026-08-07T09:00:00Z", label: "Shipped" }],
    createdAt: "2026-08-06T10:00:00.000Z", updatedAt: "2026-08-07T09:00:00.000Z",
  },
  {
    id: "ORD-2607-0001", userId: "u-1004", userName: "Hassan Raza",
    items: [{ medicineId: "med-losartan-50", name: "Losartan 50", price: 240, qty: 2 }],
    subtotal: 480, discount: 0, deliveryFee: 80, coupon: "", total: 560,
    prescriptionRequired: true, prescriptionId: "rx-3003",
    status: "delivered", paymentMethod: "cod", paymentStatus: "paid",
    address: { line: "Model Town", city: "Lahore", phone: "+92 333 4455667" },
    tracking: [{ time: "2026-07-20T10:00:00Z", label: "Order confirmed" }, { time: "2026-07-21T08:00:00Z", label: "Delivered" }],
    createdAt: "2026-07-20T10:00:00.000Z", updatedAt: "2026-07-21T08:00:00.000Z",
  },
  {
    id: "ORD-2606-0002", userId: "u-1007", userName: "Sara Malik",
    items: [{ medicineId: "med-replenind-m", name: "Replenind-M", price: 240, qty: 2 }],
    subtotal: 480, discount: 0, deliveryFee: 80, coupon: "", total: 560,
    prescriptionRequired: false, prescriptionId: null,
    status: "pending", paymentMethod: "card", paymentStatus: "unpaid",
    address: { line: "Gulshan-e-Iqbal", city: "Karachi", phone: "+92 321 8899001" },
    tracking: [],
    createdAt: "2026-08-07T06:00:00.000Z", updatedAt: "2026-08-07T06:00:00.000Z",
  },
];

export const coupons = [
  { id: "cpn-01", code: "NOVA10", type: "percent", value: 10, minOrder: 500, active: true, expires: "2026-12-31" },
  { id: "cpn-02", code: "NOVA50", type: "flat", value: 50, minOrder: 1000, active: true, expires: "2026-12-31" },
];

export const orderStatusFlow = ["pending", "confirmed", "processing", "packed", "shipped", "delivered"];

export default { orders, coupons, orderStatusFlow };
