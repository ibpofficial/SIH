from typing import List, Dict, Any

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from services.constraints import VESSEL_CLASSES
from config.freight_baselines import BUNKER_FUEL_BASELINE

def get_vessel_daily_rate(vessel_category: str) -> float:
    """Helper to look up cost per day from VESSEL_CLASSES."""
    cat_upper = vessel_category.upper()
    for v in VESSEL_CLASSES:
        if v["code"] in cat_upper or v["id"] in cat_upper or v["name"].upper() in cat_upper:
            return float(v["cost_per_day"])
    return 22000.0  # Default Panamax day rate

def evaluate_idle_repositioning(
    origin_port_name: str,
    dest_port_name: str,
    vessel_category: str
) -> List[Dict[str, Any]]:
    """
    Data-driven Idle & Repositioning Scenario Evaluator.
    Computes ballast repositioning, alternate coastal employment, and port anchorage waiting costs
    from vessel day rates, distance metrics, and bunker consumption.
    """
    day_rate = get_vessel_daily_rate(vessel_category)
    bunker_price = BUNKER_FUEL_BASELINE["base_price_usd_per_mt"]
    sea_fuel_per_day = BUNKER_FUEL_BASELINE["consumption_at_sea_mt_per_day"]
    anchor_fuel_per_day = BUNKER_FUEL_BASELINE["consumption_at_anchor_mt_per_day"]

    # Option 1: Ballast Repositioning to Major Alternate Load Port
    # Determine logical ballast load center based on origin/destination
    if "australia" in origin_port_name.lower() or "hedland" in origin_port_name.lower() or "gladstone" in origin_port_name.lower():
        reposition_target = "Port Hedland AU"
        ballast_dist_nm = 3400
        demand_note = "High demand for Australian Iron Ore/Coking Coal."
    elif "mozambique" in origin_port_name.lower() or "maputo" in origin_port_name.lower():
        reposition_target = "Richards Bay ZA"
        ballast_dist_nm = 2800
        demand_note = "Active export stem for South African / Mozambican coal."
    elif "russia" in origin_port_name.lower():
        reposition_target = "Vostochny RU"
        ballast_dist_nm = 3800
        demand_note = "Solid demand for Russian Far East coal stems."
    elif "indonesia" in origin_port_name.lower():
        reposition_target = "Samarinda ID"
        ballast_dist_nm = 1800
        demand_note = "Frequent thermal coal loading windows in East Kalimantan."
    else:
        reposition_target = "US Gulf (New Orleans)"
        ballast_dist_nm = 11000
        demand_note = "Long-haul metallurgical coal fixtures from US Gulf."

    ballast_days = round((ballast_dist_nm / 13.0) / 24.0, 1)
    ballast_fuel_cost = ballast_days * sea_fuel_per_day * bunker_price
    ballast_charter_cost = ballast_days * day_rate
    ballast_total_cost = round(ballast_fuel_cost + ballast_charter_cost, 2)

    # Net revenue projection for next laden voyage (approx 2.2x ballast cost based on market margin)
    ballast_net_revenue = round(ballast_total_cost * 2.45, 2)
    ballast_net_margin = ballast_net_revenue - ballast_total_cost

    # Option 2: Alternate Coastal / Domestic Short Employment (e.g. 10-day laycan gap)
    coastal_days = 7.5
    coastal_fuel_cost = coastal_days * sea_fuel_per_day * bunker_price * 0.7
    coastal_charter_cost = coastal_days * day_rate * 0.8
    coastal_total_cost = round(coastal_fuel_cost + coastal_charter_cost, 2)
    coastal_net_revenue = round(coastal_total_cost * 2.7, 2)

    # Option 3: Idle Wait at Anchor at Destination Port (10-day laycan gap)
    waiting_days = 10
    anchor_fuel_cost = waiting_days * anchor_fuel_per_day * bunker_price
    port_anchorage_dues = waiting_days * 1500.0  # Daily anchorage & port fees
    idle_total_cost = round(anchor_fuel_cost + port_anchorage_dues + (waiting_days * day_rate * 0.15), 2)
    idle_daily_burn = round(idle_total_cost / waiting_days, 2)

    return [
        {
            "optionTitle": f"Reposition Ballast: {dest_port_name} → {reposition_target}",
            "vesselCategory": vessel_category,
            "actionType": "BALLAST_REPOSITION",
            "estimatedCostUsd": ballast_total_cost,
            "estimatedNetRevenueUsd": ballast_net_revenue,
            "recommendedAction": (
                f"{demand_note} {ballast_days}d ballast voyage yields +${ballast_net_margin:,.0f} net margin "
                f"vs idling in port."
            )
        },
        {
            "optionTitle": f"Alternate Coastal Employment: {dest_port_name} → Coastal India Transshipment",
            "vesselCategory": vessel_category,
            "actionType": "ALT_CARGO_EMPLOYMENT",
            "estimatedCostUsd": coastal_total_cost,
            "estimatedNetRevenueUsd": coastal_net_revenue,
            "recommendedAction": (
                f"Short coastal coal transshipment trip ({coastal_days}d) fills laycan gap before next long-haul fixture."
            )
        },
        {
            "optionTitle": f"Idle Wait at Anchor ({dest_port_name})",
            "vesselCategory": vessel_category,
            "actionType": "IDLE_WAIT",
            "estimatedCostUsd": idle_total_cost,
            "estimatedNetRevenueUsd": 0.0,
            "recommendedAction": (
                f"Anchorage waiting incurs ${idle_daily_burn:,.0f}/day in auxiliary fuel, port dues, and capital drag "
                f"with zero revenue return over {waiting_days} days."
            )
        }
    ]
