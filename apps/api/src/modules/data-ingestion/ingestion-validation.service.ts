import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { RowValidationError, IngestionEntityType } from '@freightiq/shared-types';

@Injectable()
export class IngestionValidationService {
  constructor(private prisma: PrismaService) {}

  async validateRows(
    entityType: IngestionEntityType,
    rows: any[]
  ): Promise<{ validRows: any[]; errors: RowValidationError[]; warningCount: number }> {
    const validRows: any[] = [];
    const errors: RowValidationError[] = [];
    let warningCount = 0;

    // Cache existing DB entities for Stage 3 referential checks
    const existingPorts = await this.prisma.port.findMany({ select: { id: true, code: true, name: true } });
    const existingVesselTypes = await this.prisma.vesselType.findMany({ select: { id: true, code: true, name: true } });

    const portMap = new Map<string, string>();
    existingPorts.forEach((p) => {
      portMap.set(p.code.toUpperCase(), p.id);
      portMap.set(p.name.toUpperCase(), p.id);
    });

    const vesselTypeMap = new Map<string, string>();
    existingVesselTypes.forEach((vt) => {
      vesselTypeMap.set(vt.code.toUpperCase(), vt.id);
      vesselTypeMap.set(vt.name.toUpperCase(), vt.id);
    });

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      const rowNum = index + 2; // 1-indexed heading row = line 1
      let rowHasError = false;

      // STAGE 1: SCHEMA VALIDATION
      if (entityType === 'FREIGHT_RATE') {
        const origin = row.origin_port || row.originPort || row.origin;
        const dest = row.destination_port || row.destinationPort || row.destination;
        const vesselType = row.vessel_type || row.vesselType;
        const cargoType = row.cargo_type || row.cargoType || row.cargo;
        const rate = parseFloat(row.rate_usd_per_mt || row.rate);
        const rateDateStr = row.rate_date || row.rateDate || row.date;

        if (!origin || !dest || !vesselType || !cargoType || isNaN(rate) || !rateDateStr) {
          errors.push({
            rowNumber: rowNum,
            stage: 1,
            stageName: 'Schema Validation',
            reason: `Row ${rowNum}: Missing or invalid required fields (origin, destination, vessel_type, cargo_type, rate, rate_date)`
          });
          rowHasError = true;
          continue;
        }

        const rateDate = new Date(rateDateStr);
        if (isNaN(rateDate.getTime())) {
          errors.push({
            rowNumber: rowNum,
            stage: 1,
            stageName: 'Schema Validation',
            column: 'rate_date',
            value: rateDateStr,
            reason: `Row ${rowNum}: Invalid date format '${rateDateStr}'`
          });
          rowHasError = true;
          continue;
        }

        // STAGE 2: BUSINESS RULES
        if (rate <= 0) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'rate_usd_per_mt',
            value: rate,
            reason: `Row ${rowNum}: rate_usd_per_mt = ${rate}, must be greater than 0`
          });
          rowHasError = true;
        }

        if (origin.toString().trim().toUpperCase() === dest.toString().trim().toUpperCase()) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'destination_port',
            value: dest,
            reason: `Row ${rowNum}: Destination port cannot be identical to origin port (${origin})`
          });
          rowHasError = true;
        }

        if (rateDate > new Date()) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'rate_date',
            value: rateDateStr,
            reason: `Row ${rowNum}: Rate date cannot be in the future (${rateDateStr})`
          });
          rowHasError = true;
        }

        // STAGE 3: REFERENTIAL INTEGRITY
        const originPortId = portMap.get(origin.toString().trim().toUpperCase());
        const destPortId = portMap.get(dest.toString().trim().toUpperCase());
        const vTypeId = vesselTypeMap.get(vesselType.toString().trim().toUpperCase());

        if (!originPortId) {
          errors.push({
            rowNumber: rowNum,
            stage: 3,
            stageName: 'Referential Integrity',
            column: 'origin_port',
            value: origin,
            reason: `Row ${rowNum}: Origin port '${origin}' not found in registered ports database`
          });
          rowHasError = true;
        }

        if (!destPortId) {
          errors.push({
            rowNumber: rowNum,
            stage: 3,
            stageName: 'Referential Integrity',
            column: 'destination_port',
            value: dest,
            reason: `Row ${rowNum}: Destination port '${dest}' not found in registered ports database`
          });
          rowHasError = true;
        }

        if (!vTypeId) {
          errors.push({
            rowNumber: rowNum,
            stage: 3,
            stageName: 'Referential Integrity',
            column: 'vessel_type',
            value: vesselType,
            reason: `Row ${rowNum}: Vessel type '${vesselType}' not found in registered vessel categories`
          });
          rowHasError = true;
        }

        if (!rowHasError) {
          validRows.push({
            originPortId,
            destinationPortId: destPortId,
            vesselTypeId: vTypeId,
            cargoType,
            rateUsdPerMt: rate,
            rateDate
          });
        }
      } else if (entityType === 'VESSEL') {
        const name = row.name || row.vessel_name;
        const imo = row.imo_number || row.imoNumber || row.imo;
        const vesselType = row.vessel_type || row.vesselType;
        const capacity = parseFloat(row.capacity_mt || row.capacity);
        const draft = parseFloat(row.draft_m || row.draft);
        const speed = parseFloat(row.speed_knots || row.speed || 14.0);

        if (!name || !imo || !vesselType || isNaN(capacity) || isNaN(draft)) {
          errors.push({
            rowNumber: rowNum,
            stage: 1,
            stageName: 'Schema Validation',
            reason: `Row ${rowNum}: Missing required vessel fields (name, imo_number, vessel_type, capacity_mt, draft_m)`
          });
          continue;
        }

        if (!/^\d{7}$/.test(imo.toString().trim())) {
          errors.push({
            rowNumber: rowNum,
            stage: 1,
            stageName: 'Schema Validation',
            column: 'imo_number',
            value: imo,
            reason: `Row ${rowNum}: IMO number '${imo}' must be exactly 7 numeric digits`
          });
          rowHasError = true;
        }

        if (capacity <= 0) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'capacity_mt',
            value: capacity,
            reason: `Row ${rowNum}: capacity_mt = ${capacity}, must be greater than 0`
          });
          rowHasError = true;
        }

        if (draft <= 0 || draft > 30) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'draft_m',
            value: draft,
            reason: `Row ${rowNum}: draft_m = ${draft}, must be between 0.1m and 30m`
          });
          rowHasError = true;
        }

        const vTypeId = vesselTypeMap.get(vesselType.toString().trim().toUpperCase());
        if (!vTypeId) {
          errors.push({
            rowNumber: rowNum,
            stage: 3,
            stageName: 'Referential Integrity',
            column: 'vessel_type',
            value: vesselType,
            reason: `Row ${rowNum}: Vessel type '${vesselType}' not found in reference database`
          });
          rowHasError = true;
        }

        if (!rowHasError) {
          validRows.push({
            name,
            imoNumber: imo.toString().trim(),
            vesselTypeId: vTypeId,
            capacityMt: capacity,
            draftM: draft,
            speedKnots: speed,
            status: 'AVAILABLE'
          });
        }
      } else if (entityType === 'PORT') {
        const name = row.name || row.port_name;
        const code = row.code || row.unlocode;
        const country = row.country;
        const lat = parseFloat(row.latitude || row.lat);
        const lng = parseFloat(row.longitude || row.lng || row.long);
        const maxDraft = parseFloat(row.max_draft_m || row.maxDraft);
        const maxLength = parseFloat(row.max_length_m || row.maxLength || 250);
        const handlingCap = parseFloat(row.handling_capacity_mt_per_day || row.handlingCap || 40000);
        const storageCap = parseFloat(row.storage_capacity_mt || row.storageCap || 1000000);

        if (!name || !code || !country || isNaN(lat) || isNaN(lng) || isNaN(maxDraft)) {
          errors.push({
            rowNumber: rowNum,
            stage: 1,
            stageName: 'Schema Validation',
            reason: `Row ${rowNum}: Missing required port fields (name, code, country, latitude, longitude, max_draft_m)`
          });
          continue;
        }

        if (maxDraft <= 0) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'max_draft_m',
            value: maxDraft,
            reason: `Row ${rowNum}: max_draft_m = ${maxDraft}, must be > 0`
          });
          rowHasError = true;
        }

        if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            reason: `Row ${rowNum}: Geographic coordinates out of bounds (lat: ${lat}, lng: ${lng})`
          });
          rowHasError = true;
        }

        if (!rowHasError) {
          validRows.push({
            name,
            code: code.toString().trim().toUpperCase(),
            country,
            latitude: lat,
            longitude: lng,
            maxDraftM: maxDraft,
            maxLengthM: maxLength,
            handlingCapacityMtPerDay: handlingCap,
            storageCapacityMt: storageCap,
            avgTurnaroundDays: 2.5
          });
        }
      } else if (entityType === 'CARGO') {
        const commodity = row.commodity;
        const qty = parseFloat(row.quantity_mt || row.quantity);
        const origin = row.origin_port || row.origin;
        const dest = row.destination_port || row.destination;
        const startStr = row.laycan_start_date || row.laycanStart;
        const endStr = row.laycan_end_date || row.laycanEnd;

        if (!commodity || isNaN(qty) || !origin || !dest || !startStr || !endStr) {
          errors.push({
            rowNumber: rowNum,
            stage: 1,
            stageName: 'Schema Validation',
            reason: `Row ${rowNum}: Missing cargo requirement fields (commodity, quantity_mt, origin_port, destination_port, laycan_start_date, laycan_end_date)`
          });
          continue;
        }

        if (qty <= 0) {
          errors.push({
            rowNumber: rowNum,
            stage: 2,
            stageName: 'Business Rules',
            column: 'quantity_mt',
            value: qty,
            reason: `Row ${rowNum}: quantity_mt = ${qty}, must be > 0`
          });
          rowHasError = true;
        }

        const originPortId = portMap.get(origin.toString().trim().toUpperCase());
        const destPortId = portMap.get(dest.toString().trim().toUpperCase());

        if (!originPortId || !destPortId) {
          errors.push({
            rowNumber: rowNum,
            stage: 3,
            stageName: 'Referential Integrity',
            reason: `Row ${rowNum}: Origin or Destination port not found in port database`
          });
          rowHasError = true;
        }

        if (!rowHasError) {
          validRows.push({
            commodity,
            quantityMt: qty,
            originPortId,
            destinationPortId: destPortId,
            laycanStartDate: new Date(startStr),
            laycanEndDate: new Date(endStr)
          });
        }
      }
    }

    return { validRows, errors, warningCount };
  }
}
