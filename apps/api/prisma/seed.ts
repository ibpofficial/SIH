import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting FreightIQ database seeding for Prompt 2 (SQLite)...');

  // Clear existing data
  await prisma.auditLog.deleteMany();
  await prisma.dataImportJob.deleteMany();
  await prisma.freightRate.deleteMany();
  await prisma.procurementRequest.deleteMany();
  await prisma.vessel.deleteMany();
  await prisma.vesselType.deleteMany();
  await prisma.cargo.deleteMany();
  await prisma.port.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // 1. Seed Organizations
  console.log('Seeding organizations...');
  const sailOrg = await prisma.organization.create({
    data: {
      name: 'Steel Authority of India Ltd (SAIL)',
      code: 'SAIL-IN',
      type: 'CHARTERER'
    }
  });

  const ntpcOrg = await prisma.organization.create({
    data: {
      name: 'NTPC Limited',
      code: 'NTPC-IN',
      type: 'CHARTERER'
    }
  });

  const oldendorffOrg = await prisma.organization.create({
    data: {
      name: 'Oldendorff Carriers',
      code: 'OLD-DE',
      type: 'SHIPOWNER'
    }
  });

  const adaniOrg = await prisma.organization.create({
    data: {
      name: 'Adani Ports & SEZ',
      code: 'APSEZ-IN',
      type: 'PORT_AUTHORITY'
    }
  });

  const tataOrg = await prisma.organization.create({
    data: {
      name: 'Tata Steel International',
      code: 'TATA-IN',
      type: 'TRADER'
    }
  });

  // 2. Seed Users
  console.log('Seeding demo users across RBAC roles...');
  const defaultPasswordHash = await bcrypt.hash('Password123!', 10);

  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@freightiq.io',
      passwordHash: defaultPasswordHash,
      fullName: 'Alex Vance (Chief Administrator)',
      role: 'ADMIN',
      organizationId: sailOrg.id
    }
  });

  const managerUser = await prisma.user.create({
    data: {
      email: 'manager@freightiq.io',
      passwordHash: defaultPasswordHash,
      fullName: 'Vikram Sharma (Head of Procurement)',
      role: 'PROCUREMENT_MANAGER',
      organizationId: sailOrg.id
    }
  });

  const analystUser = await prisma.user.create({
    data: {
      email: 'analyst@freightiq.io',
      passwordHash: defaultPasswordHash,
      fullName: 'Priya Patel (Freight Market Analyst)',
      role: 'ANALYST',
      organizationId: sailOrg.id
    }
  });

  const viewerUser = await prisma.user.create({
    data: {
      email: 'viewer@freightiq.io',
      passwordHash: defaultPasswordHash,
      fullName: 'Rahul Verma (Auditor Observer)',
      role: 'VIEWER',
      organizationId: sailOrg.id
    }
  });

  // 3. Seed Vessel Types
  console.log('Seeding dry-bulk vessel types...');
  const handysize = await prisma.vesselType.create({
    data: {
      code: 'HANDY',
      name: 'Handysize Bulk Carrier',
      capacityMinMt: 15000,
      capacityMaxMt: 35000,
      draftM: 10.2,
      lengthM: 170.0,
      beamM: 27.0,
      avgSpeedKnots: 14.0,
      operatingCostPerDay: 12500.00
    }
  });

  const handymax = await prisma.vesselType.create({
    data: {
      code: 'HANDYMAX',
      name: 'Handymax Bulk Carrier',
      capacityMinMt: 35000,
      capacityMaxMt: 50000,
      draftM: 11.5,
      lengthM: 190.0,
      beamM: 30.0,
      avgSpeedKnots: 14.2,
      operatingCostPerDay: 15000.00
    }
  });

  const supramax = await prisma.vesselType.create({
    data: {
      code: 'SUPRA',
      name: 'Supramax / Ultramax',
      capacityMinMt: 50000,
      capacityMaxMt: 65000,
      draftM: 12.8,
      lengthM: 200.0,
      beamM: 32.2,
      avgSpeedKnots: 14.5,
      operatingCostPerDay: 18500.00
    }
  });

  const panamax = await prisma.vesselType.create({
    data: {
      code: 'PANAMAX',
      name: 'Kamsarmax / Panamax',
      capacityMinMt: 65000,
      capacityMaxMt: 85000,
      draftM: 14.2,
      lengthM: 225.0,
      beamM: 32.3,
      avgSpeedKnots: 14.5,
      operatingCostPerDay: 22000.00
    }
  });

  const capesize = await prisma.vesselType.create({
    data: {
      code: 'CAPE',
      name: 'Capesize Heavy Bulk',
      capacityMinMt: 120000,
      capacityMaxMt: 200000,
      draftM: 18.5,
      lengthM: 295.0,
      beamM: 45.0,
      avgSpeedKnots: 15.0,
      operatingCostPerDay: 35000.00
    }
  });

  // 4. Seed East Coast Indian Ports & International Loading Hubs
  console.log("Seeding East Coast Indian ports and global loading hubs...");
  const paradip = await prisma.port.create({
    data: {
      name: 'Paradip Port',
      code: 'INPRT1',
      country: 'India (East Coast)',
      latitude: 20.2644,
      longitude: 86.6703,
      maxDraftM: 14.5,
      maxLengthM: 260.0,
      handlingCapacityMtPerDay: 45000.0,
      storageCapacityMt: 1500000.0,
      avgTurnaroundDays: 2.8
    }
  });

  const vizag = await prisma.port.create({
    data: {
      name: 'Visakhapatnam Port',
      code: 'INVTZ1',
      country: 'India (East Coast)',
      latitude: 17.6868,
      longitude: 83.2185,
      maxDraftM: 16.5,
      maxLengthM: 280.0,
      handlingCapacityMtPerDay: 50000.0,
      storageCapacityMt: 1800000.0,
      avgTurnaroundDays: 2.5
    }
  });

  const haldia = await prisma.port.create({
    data: {
      name: 'Kolkata / Haldia Dock Complex',
      code: 'INCCU1',
      country: 'India (East Coast)',
      latitude: 22.0258,
      longitude: 88.0583,
      maxDraftM: 7.8, // Riverine shallow draft constraint!
      maxLengthM: 190.0,
      handlingCapacityMtPerDay: 20000.0,
      storageCapacityMt: 800000.0,
      avgTurnaroundDays: 4.5
    }
  });

  const gangavaram = await prisma.port.create({
    data: {
      name: 'Gangavaram Port',
      code: 'INGGV1',
      country: 'India (East Coast)',
      latitude: 17.6258,
      longitude: 83.2389,
      maxDraftM: 19.5,
      maxLengthM: 320.0,
      handlingCapacityMtPerDay: 75000.0,
      storageCapacityMt: 2500000.0,
      avgTurnaroundDays: 1.9
    }
  });

  const kakinada = await prisma.port.create({
    data: {
      name: 'Kakinada Deep Water Port',
      code: 'INKAK1',
      country: 'India (East Coast)',
      latitude: 16.9800,
      longitude: 82.2800,
      maxDraftM: 12.0,
      maxLengthM: 220.0,
      handlingCapacityMtPerDay: 30000.0,
      storageCapacityMt: 1000000.0,
      avgTurnaroundDays: 3.0
    }
  });

  const krishnapatnam = await prisma.port.create({
    data: {
      name: 'Krishnapatnam Port',
      code: 'INKRI1',
      country: 'India (East Coast)',
      latitude: 14.2500,
      longitude: 80.1333,
      maxDraftM: 18.0,
      maxLengthM: 300.0,
      handlingCapacityMtPerDay: 65000.0,
      storageCapacityMt: 2200000.0,
      avgTurnaroundDays: 2.1
    }
  });

  const dhamra = await prisma.port.create({
    data: {
      name: 'Dhamra Port',
      code: 'INDHM1',
      country: 'India (East Coast)',
      latitude: 20.8000,
      longitude: 86.9667,
      maxDraftM: 18.0,
      maxLengthM: 310.0,
      handlingCapacityMtPerDay: 70000.0,
      storageCapacityMt: 2000000.0,
      avgTurnaroundDays: 2.0
    }
  });

  const ennore = await prisma.port.create({
    data: {
      name: 'Kamarajar (Ennore) Port',
      code: 'INENR1',
      country: 'India (East Coast)',
      latitude: 13.2667,
      longitude: 80.3333,
      maxDraftM: 16.0,
      maxLengthM: 280.0,
      handlingCapacityMtPerDay: 55000.0,
      storageCapacityMt: 1600000.0,
      avgTurnaroundDays: 2.4
    }
  });

  const newcastle = await prisma.port.create({
    data: {
      name: 'Port of Newcastle',
      code: 'AUNEW1',
      country: 'Australia',
      latitude: -32.9267,
      longitude: 151.7833,
      maxDraftM: 15.2,
      maxLengthM: 300.0,
      handlingCapacityMtPerDay: 90000.0,
      storageCapacityMt: 3500000.0,
      avgTurnaroundDays: 1.5
    }
  });

  const portHedland = await prisma.port.create({
    data: {
      name: 'Port Hedland',
      code: 'AUPHE1',
      country: 'Australia',
      latitude: -20.3107,
      longitude: 118.5753,
      maxDraftM: 19.8,
      maxLengthM: 340.0,
      handlingCapacityMtPerDay: 120000.0,
      storageCapacityMt: 5000000.0,
      avgTurnaroundDays: 1.2
    }
  });

  const richardsBay = await prisma.port.create({
    data: {
      name: 'Richards Bay Coal Terminal',
      code: 'ZARCB1',
      country: 'South Africa',
      latitude: -28.8000,
      longitude: 32.0833,
      maxDraftM: 17.5,
      maxLengthM: 310.0,
      handlingCapacityMtPerDay: 85000.0,
      storageCapacityMt: 3000000.0,
      avgTurnaroundDays: 2.0
    }
  });

  // 5. Seed Vessels
  console.log('Seeding vessels...');
  await prisma.vessel.createMany({
    data: [
      {
        name: 'MV Paradip Pioneer',
        imoNumber: '9485731',
        vesselTypeId: panamax.id,
        capacityMt: 76500.0,
        draftM: 14.1,
        speedKnots: 14.4,
        status: 'AVAILABLE'
      },
      {
        name: 'MV Odisha Glory',
        imoNumber: '9624819',
        vesselTypeId: capesize.id,
        capacityMt: 180000.0,
        draftM: 18.2,
        speedKnots: 15.1,
        status: 'CHARTERED'
      },
      {
        name: 'MV Iron Sentinel',
        imoNumber: '9310472',
        vesselTypeId: supramax.id,
        capacityMt: 58200.0,
        draftM: 12.6,
        speedKnots: 14.3,
        status: 'AVAILABLE'
      },
      {
        name: 'MV Baltic Trader',
        imoNumber: '9783921',
        vesselTypeId: handymax.id,
        capacityMt: 45000.0,
        draftM: 11.2,
        speedKnots: 14.0,
        status: 'IN_TRANSIT'
      }
    ]
  });

  // 6. Seed Time-Series Freight Rates (Historical data for ML models)
  console.log('Seeding rich time-series freight rates for ML training...');
  const baseRoutes = [
    { origin: newcastle.id, dest: paradip.id, vesselType: panamax.id, cargo: 'Coking Coal', baseRate: 18.75 },
    { origin: portHedland.id, dest: gangavaram.id, vesselType: capesize.id, cargo: 'Iron Ore', baseRate: 11.20 },
    { origin: richardsBay.id, dest: vizag.id, vesselType: supramax.id, cargo: 'Thermal Coal', baseRate: 15.40 },
    { origin: newcastle.id, dest: haldia.id, vesselType: handymax.id, cargo: 'Coking Coal', baseRate: 22.10 }
  ];

  const now = new Date();
  for (let dayOffset = 180; dayOffset >= 0; dayOffset -= 3) {
    const rateDate = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);
    for (const r of baseRoutes) {
      const trend = (180 - dayOffset) * 0.02; // upward trend
      const seasonality = Math.sin(dayOffset / 15) * 1.8;
      const noise = (Math.random() - 0.5) * 0.8;
      const rateUsdPerMt = parseFloat((r.baseRate + trend + seasonality + noise).toFixed(2));

      await prisma.freightRate.create({
        data: {
          originPortId: r.origin,
          destinationPortId: r.dest,
          vesselTypeId: r.vesselType,
          cargoType: r.cargo,
          rateUsdPerMt,
          rateDate
        }
      });
    }
  }

  // 7. Seed Sample Procurement Requests (Including Pre-seeded Hero Demo)
  console.log('Seeding procurement requests and Hero Demo scenario...');
  const heroReq = await prisma.procurementRequest.create({
    data: {
      organizationId: sailOrg.id,
      commodity: 'Australian Blast Furnace Coking Coal (Hero Demo)',
      quantityMt: 200000.0,
      originPortId: newcastle.id,
      destinationPortId: paradip.id,
      requiredDeliveryDate: new Date('2026-12-15T00:00:00Z'),
      budgetInrCrore: 185.0,
      status: 'OPTIMIZED',
      notes: 'Hero Demo Plan: Q4 Strategic Blend procurement for SAIL Rourkela & Durgapur Steel Plants.'
    }
  });

  const req1 = await prisma.procurementRequest.create({
    data: {
      organizationId: sailOrg.id,
      commodity: 'Australian Coking Coal',
      quantityMt: 150000.0,
      originPortId: newcastle.id,
      destinationPortId: paradip.id,
      requiredDeliveryDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
      budgetInrCrore: 145.5,
      status: 'DRAFT',
      notes: 'Q3 Blast Furnace blend requirement for Rourkela & Durgapur Steel Plants.'
    }
  });

  const req2 = await prisma.procurementRequest.create({
    data: {
      organizationId: ntpcOrg.id,
      commodity: 'Thermal Power Coal (5500 GAR)',
      quantityMt: 75000.0,
      originPortId: richardsBay.id,
      destinationPortId: vizag.id,
      requiredDeliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      budgetInrCrore: 62.0,
      status: 'DRAFT',
      notes: 'Emergency reserve procurement for Simhadri Super Thermal Station.'
    }
  });

  // 8. Seed Audit Log Entry
  console.log('Seeding initial audit logs...');
  await prisma.auditLog.create({
    data: {
      userId: managerUser.id,
      action: 'PROCUREMENT_REQUEST_CREATED',
      entityType: 'ProcurementRequest',
      entityId: req1.id,
      changesAfter: JSON.stringify({ commodity: 'Australian Coking Coal', quantityMt: 150000, budget: 145.5 }),
      timestamp: new Date()
    }
  });

  // 9. Seed Sample Import Job
  console.log('Seeding historical data import job...');
  await prisma.dataImportJob.create({
    data: {
      filename: 'Q2_Historical_Freight_Rates_BDI.csv',
      entityType: 'FREIGHT_RATE',
      status: 'COMMITTED',
      rowCount: 120,
      validRowCount: 120,
      errorCount: 0,
      warningCount: 0,
      uploadedById: analystUser.id,
      organizationId: sailOrg.id,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    }
  });

  console.log('✅ FreightIQ Database Seeding Complete (SQLite)!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
