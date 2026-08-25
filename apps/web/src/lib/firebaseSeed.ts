import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  limit
} from 'firebase/firestore';
import { db } from './firebase';

export async function seedFirestoreIfEmpty() {
  try {
    const portsCol = collection(db, 'ports');
    const snap = await getDocs(query(portsCol, limit(1)));
    if (!snap.empty) {
      console.log('Firestore already seeded.');
      return;
    }

    console.log('Seeding Firestore with FreightIQ maritime datasets...');

    // 1. Seed Organizations
    const orgId = 'sail-org-id';
    await setDoc(doc(db, 'organizations', orgId), {
      id: orgId,
      name: 'Steel Authority of India Ltd (SAIL)',
      type: 'CHARTERER',
      country: 'India',
      createdAt: new Date().toISOString()
    });

    // 2. Seed Users
    const userId = 'demo-manager-id';
    await setDoc(doc(db, 'users', userId), {
      id: userId,
      email: 'manager@freightiq.io',
      displayName: 'Vikram Sharma (Head of Procurement)',
      role: 'PROCUREMENT_MANAGER',
      orgId: orgId,
      organizationName: 'Steel Authority of India Ltd (SAIL)',
      hasCompletedOnboarding: false,
      createdAt: new Date().toISOString()
    });

    // 3. Seed East Coast Indian Ports
    const portsData = [
      { id: 'port-paradip', name: 'Paradip Port', code: 'INPRT', type: 'DESTINATION', state: 'Odisha', maxDraftM: 14.5, maxLoaM: 230, berthCapacityTpd: 25000, orgId },
      { id: 'port-vizag', name: 'Visakhapatnam Port', code: 'INVTZ', type: 'DESTINATION', state: 'Andhra Pradesh', maxDraftM: 16.5, maxLoaM: 280, berthCapacityTpd: 35000, orgId },
      { id: 'port-haldia', name: 'Kolkata / Haldia Dock', code: 'INHAL', type: 'DESTINATION', state: 'West Bengal', maxDraftM: 7.8, maxLoaM: 180, berthCapacityTpd: 12000, orgId },
      { id: 'port-gangavaram', name: 'Gangavaram Port', code: 'INGGV', type: 'DESTINATION', state: 'Andhra Pradesh', maxDraftM: 19.5, maxLoaM: 300, berthCapacityTpd: 45000, orgId },
      { id: 'port-krishnapatnam', name: 'Krishnapatnam Port', code: 'INKRP', type: 'DESTINATION', state: 'Andhra Pradesh', maxDraftM: 18.0, maxLoaM: 290, berthCapacityTpd: 40000, orgId },
      { id: 'port-dhamra', name: 'Dhamra Port', code: 'INDHM', type: 'DESTINATION', state: 'Odisha', maxDraftM: 18.0, maxLoaM: 290, berthCapacityTpd: 40000, orgId },
      { id: 'port-newcastle', name: 'Newcastle Coal Terminal', code: 'AUNEW', type: 'ORIGIN', state: 'NSW, Australia', maxDraftM: 15.2, maxLoaM: 250, berthCapacityTpd: 50000, orgId },
      { id: 'port-haypoint', name: 'Hay Point Terminal', code: 'AUHPT', type: 'ORIGIN', state: 'QLD, Australia', maxDraftM: 16.0, maxLoaM: 270, berthCapacityTpd: 60000, orgId }
    ];

    for (const p of portsData) {
      await setDoc(doc(db, 'ports', p.id), p);
    }

    // 4. Seed Vessel Types
    const vesselTypesData = [
      { id: 'vt-handysize', name: 'Handysize Carrier', code: 'HANDY', minDwt: 15000, maxDwt: 35000, draftM: 9.5, lengthM: 160, orgId },
      { id: 'vt-supramax', name: 'Supramax Carrier', code: 'SUPRA', minDwt: 50000, maxDwt: 60000, draftM: 12.2, lengthM: 190, orgId },
      { id: 'vt-panamax', name: 'Panamax Carrier', code: 'PANAMAX', minDwt: 65000, maxDwt: 85000, draftM: 14.2, lengthM: 225, orgId },
      { id: 'vt-capesize', name: 'Capesize Carrier', code: 'CAPE', minDwt: 120000, maxDwt: 200000, draftM: 18.5, lengthM: 290, orgId }
    ];

    for (const vt of vesselTypesData) {
      await setDoc(doc(db, 'vesselTypes', vt.id), vt);
    }

    // 5. Seed Hero Demo Procurement Request
    const heroReqId = 'req-hero-coking-coal';
    await setDoc(doc(db, 'procurementRequests', heroReqId), {
      id: heroReqId,
      commodity: 'Australian Blast Furnace Coking Coal (Hero Demo)',
      quantityMt: 200000,
      originPortId: 'port-newcastle',
      originPortName: 'Newcastle Coal Terminal (AU)',
      destinationPortId: 'port-paradip',
      destinationPortName: 'Paradip Port (IN)',
      requiredDeliveryDate: '2026-12-15',
      budgetInrCrore: 185.0,
      status: 'OPTIMIZED',
      notes: 'Pre-seeded Hero Demo Scenario — 200,000 MT Newcastle to Paradip shipment for SAIL blast furnace.',
      orgId: orgId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),

      // Denormalized Summary
      latestRecommendation: 'Fix 6-Month COA Contract for Panamax Carrier (saves $1.85M vs Spot)',
      latestRiskScore: 55.6
    });

    console.log('Firestore seed completed successfully.');
  } catch (err) {
    console.error('Failed to seed Firestore:', err);
  }
}
