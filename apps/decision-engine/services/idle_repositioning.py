from typing import List, Dict, Any

def evaluate_idle_repositioning(
    origin_port_name: str,
    dest_port_name: str,
    vessel_category: str
) -> List[Dict[str, Any]]:
    
    return [
        {
            "optionTitle": f"Reposition Ballast: {dest_port_name} → Port Hedland AU",
            "vesselCategory": vessel_category,
            "actionType": "BALLAST_REPOSITION",
            "estimatedCostUsd": 85000.0,
            "estimatedNetRevenueUsd": 210000.0,
            "recommendedAction": "High demand for Australian Iron Ore. Ballasting south yields +$125,000 net margin vs idling in port."
        },
        {
            "optionTitle": f"Alternate Coastal Employment: {dest_port_name} → Gangavaram",
            "vesselCategory": vessel_category,
            "actionType": "ALT_CARGO_EMPLOYMENT",
            "estimatedCostUsd": 35000.0,
            "estimatedNetRevenueUsd": 95000.0,
            "recommendedAction": "Short coastal coal transshipment trip fills 10-day laycan gap before next long-haul fixture."
        },
        {
            "optionTitle": f"Idle Wait at Anchor ({dest_port_name})",
            "vesselCategory": vessel_category,
            "actionType": "IDLE_WAIT",
            "estimatedCostUsd": 42000.0,
            "estimatedNetRevenueUsd": 0.0,
            "recommendedAction": "Anchorage waiting incurs $4,200/day in auxiliary fuel and port dues with zero revenue return."
        }
    ]
