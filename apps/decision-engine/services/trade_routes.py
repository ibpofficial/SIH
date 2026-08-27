"""
Trade Routes Engine for SIH26006
Distance matrix, transit metrics, and freight differentials for bulk cargo imports into East Coast India.
Countries: Australia, United States, Mozambique, Russia, Indonesia -> India East Coast (Paradip, Vizag, Gangavaram, Dhamra, Haldia).
"""

from typing import Dict, Any, Optional

# Port Coordinates & Key Attributes
EAST_COAST_INDIA_PORTS = {
    "Paradip": {"code": "INPRT", "maxDraftM": 14.5, "maxLengthM": 230.0, "handlingCapacityMtPerDay": 25000},
    "Visakhapatnam": {"code": "INVTZ", "maxDraftM": 16.5, "maxLengthM": 280.0, "handlingCapacityMtPerDay": 30000},
    "Vizag": {"code": "INVTZ", "maxDraftM": 16.5, "maxLengthM": 280.0, "handlingCapacityMtPerDay": 30000},
    "Gangavaram": {"code": "INGGV", "maxDraftM": 19.5, "maxLengthM": 320.0, "handlingCapacityMtPerDay": 45000},
    "Dhamra": {"code": "INDHM", "maxDraftM": 17.5, "maxLengthM": 290.0, "handlingCapacityMtPerDay": 35000},
    "Haldia": {"code": "INHAL", "maxDraftM": 8.5, "maxLengthM": 190.0, "handlingCapacityMtPerDay": 12000},
    "Krishnapatnam": {"code": "INKRP", "maxDraftM": 18.0, "maxLengthM": 300.0, "handlingCapacityMtPerDay": 38000},
}

# Major Origin Ports & Countries for SAIL Steel Bulk Procurement (Coal/Iron Ore)
ORIGIN_PORTS = {
    "Gladstone AU": {"country": "Australia", "code": "AUGLA", "commodity": "Coking Coal", "distance_to_paradip_nm": 4850},
    "Port Hedland AU": {"country": "Australia", "code": "AUPHE", "commodity": "Iron Ore", "distance_to_paradip_nm": 3400},
    "Newcastle AU": {"country": "Australia", "code": "AUNCL", "commodity": "Coking Coal", "distance_to_paradip_nm": 5100},
    "US Gulf (New Orleans)": {"country": "United States", "code": "USMSY", "commodity": "Coking Coal", "distance_to_paradip_nm": 11800},
    "Baltimore / Norfolk US": {"country": "United States", "code": "USORF", "commodity": "Metallurgical Coal", "distance_to_paradip_nm": 10900},
    "Maputo MZ": {"country": "Mozambique", "code": "MZMPM", "commodity": "Coking Coal", "distance_to_paradip_nm": 4200},
    "Nacala MZ": {"country": "Mozambique", "code": "MZMNC", "commodity": "Thermal/Coking Coal", "distance_to_paradip_nm": 3750},
    "Vostochny RU": {"country": "Russia", "code": "RUVOS", "commodity": "Coking Coal", "distance_to_paradip_nm": 4900},
    "Novorossiysk RU": {"country": "Russia", "code": "RUNOV", "commodity": "PCI Coal / Iron Ore", "distance_to_paradip_nm": 5600},
    "Samarinda ID": {"country": "Indonesia", "code": "IDSRD", "commodity": "Thermal Coal", "distance_to_paradip_nm": 2100},
    "Tanjung Pemancingan ID": {"country": "Indonesia", "code": "IDTJP", "commodity": "Thermal/PCI Coal", "distance_to_paradip_nm": 1950},
}

# Default speed for laden bulk carriers (knots)
DEFAULT_LADEN_SPEED_KNOTS = 13.0

def get_route_details(origin_port_name: str, dest_port_name: str) -> Dict[str, Any]:
    """
    Look up nautical distance, calculate transit time, and freight rate scale factor
    for origin-destination port pairs.
    """
    # Soft matching for origin port
    origin_meta = None
    for key, data in ORIGIN_PORTS.items():
        if key.lower() in origin_port_name.lower() or origin_port_name.lower() in key.lower():
            origin_meta = data
            break

    if not origin_meta:
        # Infer country from port name string if explicit key not matched
        country = "Australia"
        dist_nm = 4500
        if "us" in origin_port_name.lower() or "united states" in origin_port_name.lower() or "gulf" in origin_port_name.lower():
            country = "United States"
            dist_nm = 11500
        elif "mozambique" in origin_port_name.lower() or "maputo" in origin_port_name.lower() or "nacala" in origin_port_name.lower():
            country = "Mozambique"
            dist_nm = 4000
        elif "russia" in origin_port_name.lower() or "vostochny" in origin_port_name.lower() or "novorossiysk" in origin_port_name.lower():
            country = "Russia"
            dist_nm = 5200
        elif "indonesia" in origin_port_name.lower() or "samarinda" in origin_port_name.lower() or "tanjung" in origin_port_name.lower():
            country = "Indonesia"
            dist_nm = 2000

        origin_meta = {
            "country": country,
            "code": "UNK",
            "commodity": "Bulk Cargo",
            "distance_to_paradip_nm": dist_nm
        }

    distance_nm = origin_meta["distance_to_paradip_nm"]

    # Adjust distance based on destination port relative to Paradip benchmark
    if "haldia" in dest_port_name.lower():
        distance_nm += 220
    elif "vizag" in dest_port_name.lower() or "visakhapatnam" in dest_port_name.lower():
        distance_nm -= 150
    elif "gangavaram" in dest_port_name.lower():
        distance_nm -= 160
    elif "krishnapatnam" in dest_port_name.lower():
        distance_nm -= 320

    distance_nm = max(500, distance_nm)
    transit_hours = distance_nm / DEFAULT_LADEN_SPEED_KNOTS
    transit_days = round(transit_hours / 24.0, 1)

    # Freight rate differential multiplier normalized against benchmark 4500 nm route
    rate_differential_multiplier = round(distance_nm / 4500.0, 3)

    return {
        "originPortName": origin_port_name,
        "destinationPortName": dest_port_name,
        "originCountry": origin_meta["country"],
        "distanceNauticalMiles": distance_nm,
        "ladenSpeedKnots": DEFAULT_LADEN_SPEED_KNOTS,
        "transitDays": transit_days,
        "rateDifferentialMultiplier": rate_differential_multiplier
    }
