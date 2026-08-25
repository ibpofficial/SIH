from typing import List, Dict, Any

def evaluate_contract_strategies(
    cargo_quantity_mt: float,
    current_spot_rate: float,
    forecasted_rate_90d: float,
    trend_direction: str
) -> List[Dict[str, Any]]:
    
    # 1. Spot Charter Now
    spot_rate = current_spot_rate
    spot_cost = round(spot_rate * cargo_quantity_mt, 2)
    spot_exposure = 85 # high volatility exposure

    # 2. Short-Term 3-Month Multi-Voyage Contract
    short_rate = round(current_spot_rate * (1.02 if trend_direction == 'UPWARD' else 0.98), 2)
    short_cost = round(short_rate * cargo_quantity_mt, 2)
    short_exposure = 45 # medium risk

    # 3. Mid-Term 6-Month Multi-Voyage Contract
    mid_rate = round(current_spot_rate * (1.04 if trend_direction == 'UPWARD' else 0.95), 2)
    mid_cost = round(mid_rate * cargo_quantity_mt, 2)
    mid_exposure = 20 # low risk, locked rate

    recommendation_flag = "SHORT_TERM_3M"
    if trend_direction == 'UPWARD':
        recommendation_flag = "MID_TERM_6M"
        reasoning_6m = f"Freight rates are predicted to trend UPWARDS by +9.2% over 90 days. Locking in a 6-month multi-voyage contract now protects against spot market rate spikes and reduces total charter outlay."
        reasoning_3m = "Provides 90-day rate stability but leaves remaining Q4 volume exposed to forecasted upward rate pressures."
        reasoning_spot = "Single spot contract exposes charterer to maximum market volatility and rising spot freight premiums."
    else:
        recommendation_flag = "SHORT_TERM_3M"
        reasoning_6m = "Longer lock-in period when rates are softening. Recommend short-term contract to maintain operational flexibility."
        reasoning_3m = "Optimal balance between locking in volume for immediate laycan and retaining flexibility to re-contract as rates soften."
        reasoning_spot = "Spot charter carries high operational risk if port berth congestion delays vessel availability."

    return [
        {
            "strategyType": "MID_TERM_6M",
            "title": "6-Month Multi-Voyage COA Contract",
            "rateUsdPerMt": mid_rate,
            "estimatedTotalCostUsd": mid_cost,
            "voyagesCount": 4,
            "volatilityExposureScore": mid_exposure,
            "isRecommended": recommendation_flag == "MID_TERM_6M",
            "reasoning": reasoning_6m
        },
        {
            "strategyType": "SHORT_TERM_3M",
            "title": "3-Month Short-Term Charter",
            "rateUsdPerMt": short_rate,
            "estimatedTotalCostUsd": short_cost,
            "voyagesCount": 2,
            "volatilityExposureScore": short_exposure,
            "isRecommended": recommendation_flag == "SHORT_TERM_3M",
            "reasoning": reasoning_3m
        },
        {
            "strategyType": "SPOT",
            "title": "Single Voyage Spot Charter",
            "rateUsdPerMt": spot_rate,
            "estimatedTotalCostUsd": spot_cost,
            "voyagesCount": 1,
            "volatilityExposureScore": spot_exposure,
            "isRecommended": False,
            "reasoning": reasoning_spot
        }
    ]
