/**
 * MediNova — Mock: medicines catalog.
 * Demo data, clearly isolated for mock/demo mode.
 */

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function med(o) {
  return {
    id: o.id || "med-" + slug(o.name),
    name: o.name, generic: o.generic || o.name, brand: o.brand || o.name,
    categoryId: o.categoryId, category: o.category, subCategory: o.subCategory || "",
    type: o.type || "Tablet", manufacturer: o.manufacturer || "Nova Pharma",
    composition: o.composition || "", strength: o.strength || "",
    dosage: o.dosage || "", packSize: o.packSize || "1x10",
    price: o.price, discount: o.discount || 0, stock: o.stock != null ? o.stock : 0,
    availability: o.availability != null ? o.availability : o.stock > 0,
    expiry: o.expiry || "2027-12-31", batch: o.batch || "NB-" + Math.floor(1000 + Math.random() * 9000),
    prescriptionRequired: !!o.prescriptionRequired,
    description: o.description || "", uses: o.uses || [], warnings: o.warnings || [],
    sideEffects: o.sideEffects || [], storage: o.storage || "Store below 25°C",
    image: o.image || "", imageUrl: o.image || "", gallery: o.gallery || [],
    keywords: o.keywords || [], status: o.status || "active", featured: !!o.featured,
    rating: o.rating || 4.2, sold: o.sold || 0, createdAt: "2026-02-01T08:00:00.000Z",
  };
}

export const medicines = [
  med({ name: "Panadol Extra", generic: "Paracetamol 500mg + Caffeine 65mg", brand: "GSK", categoryId: "cat-pain", category: "Pain Relief", type: "Tablet", strength: "500mg", price: 120, discount: 10, stock: 420, expiry: "2028-06-30", uses: ["Headache", "Fever", "Body pain"], sideEffects: ["Nausea"], keywords: ["paracetamol", "panadol", "pain", "fever"], rating: 4.8, sold: 1200 }),
  med({ name: "Brufen 400", generic: "Ibuprofen 400mg", brand: "Abbott", categoryId: "cat-pain", category: "Pain Relief", type: "Tablet", strength: "400mg", price: 95, stock: 380, prescriptionRequired: true, uses: ["Pain relief", "Inflammation"], warnings: ["Take with food"], sideEffects: ["Stomach upset"], keywords: ["ibuprofen", "brufen", "pain"], sold: 850 }),
  med({ name: "Augmentin 1g", generic: "Amoxicillin + Clavulanic Acid 875/125mg", brand: "GSK", categoryId: "cat-antibiotics", category: "Antibiotics", type: "Tablet", strength: "1g", price: 310, stock: 150, prescriptionRequired: true, expiry: "2027-05-20", uses: ["Bacterial infections"], sideEffects: ["Diarrhea"], keywords: ["amoxicillin", "antibiotic", "augmentin"], sold: 620 }),
  med({ name: "Azithromycin 500", generic: "Azithromycin 500mg", brand: "Pfizer", categoryId: "cat-antibiotics", category: "Antibiotics", type: "Tablet", strength: "500mg", price: 260, stock: 200, prescriptionRequired: true, uses: ["Respiratory infections"], warnings: ["Complete full course"], sideEffects: ["Nausea", "Diarrhea"], keywords: ["azithromycin", "zithromax"], sold: 540 }),
  med({ name: "Claritin 10mg", generic: "Loratadine 10mg", brand: "Bayer", categoryId: "cat-allergy", category: "Allergy", type: "Tablet", strength: "10mg", price: 180, stock: 265, uses: ["Allergy relief", "Hay fever"], keywords: ["loratadine", "antihistamine", "allergy"], sold: 480 }),
  med({ name: "Zyrtec", generic: "Cetirizine HCl 10mg", brand: "GSK", categoryId: "cat-allergy", category: "Allergy", type: "Tablet", strength: "10mg", price: 150, stock: 190, sideEffects: ["Drowsiness"], keywords: ["cetirizine", "zyrtec"], sold: 390 }),
  med({ name: "Berocca", generic: "Multivitamin + Minerals", brand: "Bayer", categoryId: "cat-vitamins", category: "Vitamins & Supplements", type: "Tablet", strength: "Effervescent", price: 480, discount: 5, stock: 320, uses: ["Energy", "Immune support"], keywords: ["multivitamin", "vitamin b", "energy"], rating: 4.7, sold: 700 }),
  med({ name: "Vitamin D3 2000IU", generic: "Cholecalciferol 2000IU", brand: "Nova Pharma", categoryId: "cat-vitamins", category: "Vitamins & Supplements", type: "Capsule", strength: "2000IU", price: 350, stock: 540, uses: ["Bone health", "Deficiency"], keywords: ["vitamin d", "cholecalciferol"], sold: 950 }),
  med({ name: "Omega-3 Fish Oil", generic: "EPA + DHA 1000mg", brand: "Seven Seas", categoryId: "cat-vitamins", category: "Vitamins & Supplements", type: "Softgel", strength: "1000mg", price: 650, discount: 15, stock: 210, uses: ["Heart health", "Brain health"], keywords: ["omega 3", "fish oil"], sold: 430 }),
  med({ name: "Gaviscon", generic: "Alginic Acid + Antacid", brand: "Reckitt", categoryId: "cat-digestive", category: "Digestive", type: "Suspension", strength: "150ml", price: 220, stock: 175, uses: ["Acidity", "Heartburn", "GERD"], keywords: ["antacid", "acidity", "heartburn"], sold: 510 }),
  med({ name: "Motilium 10", generic: "Domperidone 10mg", brand: "Janssen", categoryId: "cat-digestive", category: "Digestive", type: "Tablet", strength: "10mg", price: 140, stock: 230, prescriptionRequired: true, uses: ["Nausea", "Vomiting"], sideEffects: ["Dry mouth"], keywords: ["domperidone", "motilium", "nausea"], sold: 300 }),
  med({ name: "Atorvastatin 20", generic: "Atorvastatin 20mg", brand: "Pfizer", categoryId: "cat-cardiovascular", category: "Cardiovascular", type: "Tablet", strength: "20mg", price: 280, stock: 410, prescriptionRequired: true, uses: ["Cholesterol control"], warnings: ["Take at night"], keywords: ["atorvastatin", "cholesterol", "lipitor"], sold: 670 }),
  med({ name: "Losartan 50", generic: "Losartan Potassium 50mg", brand: "MSD", categoryId: "cat-cardiovascular", category: "Cardiovascular", type: "Tablet", strength: "50mg", price: 240, stock: 360, prescriptionRequired: true, uses: ["High blood pressure"], keywords: ["losartan", "blood pressure", "hypertension"], sold: 580 }),
  med({ name: "Metformin 500", generic: "Metformin HCl 500mg", brand: "Merck", categoryId: "cat-diabetes", category: "Diabetes", type: "Tablet", strength: "500mg", price: 160, stock: 450, prescriptionRequired: true, uses: ["Type 2 diabetes"], sideEffects: ["Upset stomach"], keywords: ["metformin", "diabetes", "glucophage"], sold: 800 }),
  med({ name: "Glucophage XR 1000", generic: "Metformin XR 1000mg", brand: "Merck", categoryId: "cat-diabetes", category: "Diabetes", type: "Tablet", strength: "1000mg", price: 320, stock: 180, prescriptionRequired: true, uses: ["Type 2 diabetes"], keywords: ["metformin xr"], sold: 340 }),
  med({ name: "Ventolin Inhaler", generic: "Salbutamol 100mcg", brand: "GSK", categoryId: "cat-respiratory", category: "Respiratory", type: "Inhaler", strength: "100mcg/dose", price: 550, stock: 95, prescriptionRequired: true, uses: ["Asthma", "Bronchospasm"], keywords: ["salbutamol", "ventolin", "asthma", "inhaler"], sold: 460 }),
  med({ name: "Seretide 250", generic: "Fluticasone + Salmeterol 250/50", brand: "GSK", categoryId: "cat-respiratory", category: "Respiratory", type: "Inhaler", strength: "250mcg", price: 890, stock: 60, prescriptionRequired: true, uses: ["Asthma", "COPD"], keywords: ["seretide", "inhaler", "asthma"], sold: 220 }),
  med({ name: "Adapalene Gel", generic: "Adapalene 0.1%", brand: "Galderma", categoryId: "cat-skin", category: "Skin Care", type: "Gel", strength: "0.1%", price: 420, stock: 140, prescriptionRequired: true, uses: ["Acne"], warnings: ["Avoid sun exposure"], keywords: ["adapalene", "acne", "differin"], sold: 310 }),
  med({ name: "Hydrocortisone Cream", generic: "Hydrocortisone 1%", brand: "Nova Pharma", categoryId: "cat-skin", category: "Skin Care", type: "Cream", strength: "1%", price: 190, stock: 260, uses: ["Eczema", "Itching"], keywords: ["hydrocortisone", "eczema"], sold: 400 }),
  med({ name: "Nurogel Cream", generic: "Diclofenac Diethylamine 1.16%", brand: "Novartis", categoryId: "cat-pain", category: "Pain Relief", type: "Gel", strength: "1.16%", price: 230, stock: 300, uses: ["Joint pain", "Muscle pain"], keywords: ["diclofenac", "voltaren", "joint pain"], sold: 520 }),
  med({ name: "Neurobion Forte", generic: "B1 + B6 + B12", brand: "Merck", categoryId: "cat-neurology", category: "Neurology", type: "Tablet", strength: "Forte", price: 210, stock: 340, uses: ["Nerve health", "Neuropathy"], keywords: ["vitamin b", "neurobion", "nerve"], sold: 610 }),
  med({ name: "Panadol Joint", generic: "Paracetamol + Glucosamine", brand: "GSK", categoryId: "cat-orthopedic", category: "Orthopedic", type: "Tablet", strength: "665mg", price: 350, stock: 120, uses: ["Osteoarthritis"], keywords: ["glucosamine", "joint", "panadol joint"], sold: 280 }),
  med({ name: "Glucosamine + Chondroitin", generic: "Glucosamine Sulfate 1500mg", brand: "Nova Pharma", categoryId: "cat-orthopedic", category: "Orthopedic", type: "Capsule", strength: "1500mg", price: 780, discount: 10, stock: 165, uses: ["Joint health", "Cartilage"], keywords: ["glucosamine", "chondroitin"], sold: 350 }),
  med({ name: "Tears Naturale", generic: "Hypromellose 0.3%", brand: "Alcon", categoryId: "cat-eye", category: "Eye Care", type: "Drops", strength: "15ml", price: 260, stock: 210, uses: ["Dry eyes"], keywords: ["eye drops", "dry eyes"], sold: 430 }),
  med({ name: "Zaditor Eye Drops", generic: "Ketotifen 0.025%", brand: "Novartis", categoryId: "cat-eye", category: "Eye Care", type: "Drops", strength: "5ml", price: 340, stock: 90, prescriptionRequired: true, uses: ["Allergic eyes"], keywords: ["ketotifen", "eye allergy"], sold: 190 }),
  med({ name: "Otocomb Otic", generic: "Chloramphenicol + Clotrimazole", brand: "Nova Pharma", categoryId: "cat-ear", category: "Ear Care", type: "Drops", strength: "10ml", price: 150, stock: 130, prescriptionRequired: true, uses: ["Ear infection"], keywords: ["ear drops", "ear infection"], sold: 250 }),
  med({ name: "Panadol Children", generic: "Paracetamol 120mg/5ml", brand: "GSK", categoryId: "cat-children", category: "Children's Medicine", type: "Syrup", strength: "120mg/5ml", price: 110, stock: 280, uses: ["Fever in children"], keywords: ["children", "fever", "panadol"], sold: 560 }),
  med({ name: "Otrivin Baby Drops", generic: "Xylometazoline 0.05%", brand: "GSK", categoryId: "cat-children", category: "Children's Medicine", type: "Drops", strength: "0.05%", price: 190, stock: 150, uses: ["Blocked nose"], keywords: ["nasal", "baby", "otrivin"], sold: 330 }),
  med({ name: "Prenatal Plus", generic: "Folic Acid + Iron + DHA", brand: "Nova Pharma", categoryId: "cat-women", category: "Women's Health", type: "Tablet", strength: "30s", price: 520, discount: 8, stock: 240, uses: ["Pregnancy support"], keywords: ["prenatal", "folic acid", "pregnancy"], sold: 470 }),
  med({ name: "Folic Acid 5mg", generic: "Folic Acid 5mg", brand: "Pfizer", categoryId: "cat-women", category: "Women's Health", type: "Tablet", strength: "5mg", price: 90, stock: 410, uses: ["Anemia prevention"], keywords: ["folic acid", "anemia"], sold: 520 }),
  med({ name: "Finasteride 1mg", generic: "Finasteride 1mg", brand: "MSD", categoryId: "cat-men", category: "Men's Health", type: "Tablet", strength: "1mg", price: 640, stock: 100, prescriptionRequired: true, uses: ["Hair loss"], keywords: ["finasteride", "hair loss"], sold: 180 }),
  med({ name: "Multivitamin Men", generic: "Multivitamin for Men", brand: "Centrum", categoryId: "cat-men", category: "Men's Health", type: "Tablet", strength: "60s", price: 890, stock: 130, uses: ["Daily nutrition"], keywords: ["centrum", "men vitamins"], sold: 260 }),
  med({ name: "Betadine 10%", generic: "Povidone Iodine 10%", brand: "Mundipharma", categoryId: "cat-firstaid", category: "First Aid", type: "Solution", strength: "100ml", price: 140, stock: 220, uses: ["Antiseptic"], keywords: ["betadine", "antiseptic", "wound"], sold: 380 }),
  med({ name: "Bandage Roll", generic: "Cotton Gauze Bandage 4 inch", brand: "Nova Care", categoryId: "cat-firstaid", category: "First Aid", type: "Dressing", strength: "4 inch", price: 45, stock: 500, uses: ["Wound dressing"], keywords: ["bandage", "dressing"], sold: 720 }),
  med({ name: "Savlon Antiseptic", generic: "Chlorhexidine + Cetrimide", brand: "Reckitt", categoryId: "cat-firstaid", category: "First Aid", type: "Solution", strength: "250ml", price: 260, stock: 185, uses: ["Disinfection"], keywords: ["savlon", "antiseptic"], sold: 440 }),
  med({ name: "Risek 20", generic: "Omeprazole 20mg", brand: "Getz", categoryId: "cat-digestive", category: "Digestive", type: "Capsule", strength: "20mg", price: 170, stock: 290, prescriptionRequired: true, uses: ["Ulcers", "GERD", "Acidity"], keywords: ["omeprazole", "risek", "ulcer"], sold: 640 }),
  med({ name: "Cardace 2.5", generic: "Ramipril 2.5mg", brand: "Sanofi", categoryId: "cat-cardiovascular", category: "Cardiovascular", type: "Tablet", strength: "2.5mg", price: 210, stock: 160, prescriptionRequired: true, uses: ["Hypertension"], keywords: ["ramipril", "cardace"], sold: 300 }),
  med({ name: "Xylocard 2%", generic: "Lidocaine 2%", brand: "AstraZeneca", categoryId: "cat-pain", category: "Pain Relief", type: "Gel", strength: "2%", price: 300, stock: 75, prescriptionRequired: true, uses: ["Local anesthesia"], keywords: ["lidocaine", "xylocard"], sold: 140 }),
  med({ name: "Replenind-M", generic: "Iron + Folic Acid + B12", brand: "Nova Pharma", categoryId: "cat-vitamins", category: "Vitamins & Supplements", type: "Syrup", strength: "200ml", price: 240, stock: 210, uses: ["Iron deficiency"], keywords: ["iron", "anemia syrup"], sold: 350 }),
  med({ name: "Zincovit", generic: "Multivitamin + Zinc", brand: "Cipla", categoryId: "cat-vitamins", category: "Vitamins & Supplements", type: "Syrup", strength: "200ml", price: 280, stock: 190, uses: ["Immunity", "Kids growth"], keywords: ["zinc", "multivitamin syrup"], sold: 410 }),
];

export default medicines;
