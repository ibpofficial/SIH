import math
from typing import List, Dict, Any

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.trade_routes import get_route_details
from config.freight_baselines import BUNKER_FUEL_BASELINE

VESSEL_CLASSES = [
    {"id": "handy", "code": "HANDY", "name": "Handysize Bulk Carrier", "capacity": 28000, "draft": 10.2, "length": 170.0, "cost_per_day": 12500, "fuel_tpd": 20.0},
    {"id": "handymax", "code": "HANDYMAX", "name": "Handymax Bulk Carrier", "capacity": 45000, "draft": 11.5, "length": 190.0, "cost_per_day": 15000, "fuel_tpd": 24.0},
    {"id": "supra", "code": "SUPRA", "name": "Supramax / Ultramax", "capacity": 58000, "draft": 12.8, "length": 200.0, "cost_per_day": 18500, "fuel_tpd": 26.0},
    {"id": "panamax", "code": "PANAMAX", "name": "Kamsarmax / Panamax", "capacity": 76500, "draft": 14.2, "length": 225.0, "cost_per_day": 22000, "fuel_tpd": 28.0},
    {"id": "cape", "code": "CAPE", "name": "Capesize Heavy Bulk", "capacity": 180000, "draft": 18.5, "length": 295.0, "cost_per_day": 35000, "fuel_tpd": 42.0}
]

def evaluate_vessel_constraints(
    cargo_quantity_mt: float,
    origin_draft_m: float,
    origin_length_m: float,
    dest_draft_m: float,
    dest_length_m: float,
    dest_handling_mt_per_day: float,
    forecasted_base_rate: float,
    origin_port_name: str = "",
    dest_port_name: str = ""
) -> Dict[str, List[Dict[str, Any]]]:
    
    min_permissible_draft = min(origin_draft_m, dest_draft_m)
    min_permissible_length = min(origin_length_m, dest_length_m)

    # Route transit lookup
    transit_days = 14.0
    if origin_port_name and dest_port_name:
        route_meta = get_route_details(origin_port_name, dest_port_name)
        transit_days = route_meta["transitDays"]

    bunker_price = BUNKER_FUEL_BASELINE.get("base_price_usd_per_mt", 620.0)
    anchor_fuel_tpd = BUNKER_FUEL_BASELINE.get("consumption_at_anchor_mt_per_day", 3.5)

    feasible = []
    rejected = []

    for v in VESSEL_CLASSES:
        rejection_reasons = []

        if v['draft'] > min_permissible_draft:
            rejection_reasons.append(
                f"Draft Violation: Vessel draft {v['draft']}m exceeds port max draft constraint {min_permissible_draft}m"
            )

        if v['length'] > min_permissible_length:
            rejection_reasons.append(
                f"LOA Violation: Vessel length {v['length']}m exceeds port max LOA length {min_permissible_length}m"
            )

        voyages_needed = math.ceil(cargo_quantity_mt / v['capacity'])
        turnaround_days = round(math.ceil(cargo_quantity_mt / dest_handling_mt_per_day) + 0.5, 1)

        # Economies of scale factor for bulk vessel categories
        scale_factor = 1.0
        if v['code'] == 'CAPE':
            scale_factor = 0.65
        elif v['code'] == 'PANAMAX':
            scale_factor = 0.85
        elif v['code'] == 'HANDY':
            scale_factor = 1.25

        effective_rate = forecasted_base_rate * scale_factor
        est_cost_usd = round(cargo_quantity_mt * effective_rate + (turnaround_days * v['cost_per_day']), 2)

        # Real Bunker Fuel Cost computation
        sea_fuel_tons = transit_days * v['fuel_tpd']
        port_fuel_tons = turnaround_days * anchor_fuel_tpd
        total_bunker_cost_usd = round((sea_fuel_tons + port_fuel_tons) * bunker_price * voyages_needed, 2)
        cost_per_mt_usd = round(est_cost_usd / cargo_quantity_mt, 2) if cargo_quantity_mt > 0 else 0.0

        record = {
            "vesselTypeId": v['id'],
            "vesselTypeName": v['name'],
            "vesselCode": v['code'],
            "isFeasible": len(rejection_reasons) == 0,
            "draftM": v['draft'],
            "lengthM": v['length'],
            "requiredVoyagesCount": voyages_needed,
            "estimatedTurnaroundDays": turnaround_days,
            "estimatedCostUsd": est_cost_usd,
            "totalBunkerCostUsd": total_bunker_cost_usd,
            "costPerMtUsd": cost_per_mt_usd
        }

        if len(rejection_reasons) == 0:
            feasible.append(record)
        else:
            record["rejectionReason"] = " | ".join(rejection_reasons)
            rejected.append(record)

    # Rank feasible options by total estimated cost
    feasible.sort(key=lambda x: x['estimatedCostUsd'])
    for idx, f in enumerate(feasible):
        f['rank'] = idx + 1

    return {"feasible": feasible, "rejected": rejected}
