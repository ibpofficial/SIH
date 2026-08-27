from typing import List, Dict, Any

def evaluate_contract_strategies(
    cargo_quantity_mt: float,
    current_spot_rate: float,
    forecasted_rate_90d: float,
    trend_direction: str,
    trend_magnitude_pct: float = 9.2,
    volatility_score: float = 45.0,
    turnaround_days: float = 3.0
) -> List[Dict[str, Any]]:
    """
    Contract Strategy Comparator evaluating Spot vs 3-Month vs 6-Month COA contracts.
    Dynamic f-string reasoning generation and multi-factor recommendation scoring.
    """
    rate_delta_pct = round(((forecasted_rate_90d - current_spot_rate) / max(0.1, current_spot_rate)) * 100, 1)
    mag_pct = abs(trend_magnitude_pct if trend_magnitude_pct > 0 else rate_delta_pct)

    # 1. Spot Charter Now
    spot_rate = current_spot_rate
    spot_cost = round(spot_rate * cargo_quantity_mt, 2)
    spot_exposure = min(100, int(65 + volatility_score * 0.35))

    # 2. Short-Term 3-Month Multi-Voyage Contract
    short_premium = 0.02 if trend_direction == 'UPWARD' else (-0.02 if trend_direction == 'DOWNWARD' else 0.0)
    short_rate = round(current_spot_rate * (1.0 + short_premium), 2)
    short_cost = round(short_rate * cargo_quantity_mt, 2)
    short_exposure = min(100, int(35 + volatility_score * 0.20))

    # 3. Mid-Term 6-Month Multi-Voyage Contract (COA)
    mid_premium = 0.04 if trend_direction == 'UPWARD' else (-0.05 if trend_direction == 'DOWNWARD' else -0.01)
    mid_rate = round(current_spot_rate * (1.0 + mid_premium), 2)
    mid_cost = round(mid_rate * cargo_quantity_mt, 2)
    mid_exposure = min(100, int(15 + volatility_score * 0.10))

    # Multi-Factor Strategy Scoring Engine
    # Evaluates score for 6M COA vs 3M Charter vs Spot based on trend magnitude, direction, volatility, and cargo size
    score_6m = 50.0
    score_3m = 50.0
    score_spot = 30.0

    if trend_direction == 'UPWARD':
        score_6m += (mag_pct * 3.5) + (volatility_score * 0.2)
        score_3m += (mag_pct * 1.5)
        score_spot -= (mag_pct * 2.0) + (volatility_score * 0.3)
    elif trend_direction == 'DOWNWARD':
        score_6m -= (mag_pct * 2.5)
        score_3m += (mag_pct * 3.0)
        score_spot += (mag_pct * 1.5)
    else: # STABLE
        score_3m += 25.0
        score_6m += 10.0

    # Cargo scale adjustment: Larger bulk (>100,000 MT) favors long-term COA rate lock
    if cargo_quantity_mt >= 100000:
        score_6m += 15.0
    elif cargo_quantity_mt < 45000:
        score_spot += 10.0

    # Select best strategy
    if score_6m >= score_3m and score_6m >= score_spot:
        recommendation_flag = "MID_TERM_6M"
    elif score_3m >= score_6m and score_3m >= score_spot:
        recommendation_flag = "SHORT_TERM_3M"
    else:
        recommendation_flag = "SPOT"

    # Dynamic f-string Reasoning Generation
    sign_str = "+" if rate_delta_pct >= 0 else ""
    if trend_direction == 'UPWARD':
        reasoning_6m = (
            f"Analytical engines predict freight rates trending UPWARDS by {sign_str}{mag_pct:.1f}% over 90 days "
            f"(forecasted spot ${forecasted_rate_90d:.2f}/MT vs current ${current_spot_rate:.2f}/MT). "
            f"Locking in a 6-month multi-voyage COA at ${mid_rate:.2f}/MT protects against spot market rate spikes "
            f"and provides rate stability across full bulk import volume."
        )
        reasoning_3m = (
            f"Provides 90-day rate lock at ${short_rate:.2f}/MT, but leaves remaining laycans exposed to forecasted "
            f"+{mag_pct:.1f}% upward rate pressure in subsequent quarters."
        )
        reasoning_spot = (
            f"Single spot charter exposes charterer to high market volatility (Volatility Score: {volatility_score:.0f}/100) "
            f"and potential demurrage delays ({turnaround_days:.1f} days turnaround)."
        )
    elif trend_direction == 'DOWNWARD':
        reasoning_6m = (
            f"Rates are expected to soften by -{mag_pct:.1f}% over 90 days. Locking a 6-month COA now would fix rates "
            f"above future market levels. Short-term or spot charter is preferred."
        )
        reasoning_3m = (
            f"Optimal balance: fixes immediate volume at ${short_rate:.2f}/MT while maintaining flexibility "
            f"to capture anticipated soft spot rates (-{mag_pct:.1f}%) in future laycan windows."
        )
        reasoning_spot = (
            f"Spot rate ${spot_rate:.2f}/MT allows capturing falling freight rates, though operational delays "
            f"at discharge port ({turnaround_days:.1f} days) require close laycan management."
        )
    else: # STABLE
        reasoning_6m = (
            f"Freight rates remain stable around ${current_spot_rate:.2f}/MT (forecast delta {sign_str}{mag_pct:.1f}%). "
            f"6-Month COA secures vessel availability for contract steel production schedules."
        )
        reasoning_3m = (
            f"Recommended strategy for stable markets: 3-Month charter fixes rate at ${short_rate:.2f}/MT "
            f"with low volatility risk (Score: {volatility_score:.0f}/100)."
        )
        reasoning_spot = (
            f"Spot charter (${spot_rate:.2f}/MT) offers maximum flexibility for single laycan requirements."
        )

    return [
        {
            "strategyType": "MID_TERM_6M",
            "title": "6-Month Multi-Voyage COA Contract",
            "rateUsdPerMt": mid_rate,
            "estimatedTotalCostUsd": mid_cost,
            "voyagesCount": max(3, int(round(cargo_quantity_mt / 40000))),
            "volatilityExposureScore": mid_exposure,
            "isRecommended": (recommendation_flag == "MID_TERM_6M"),
            "reasoning": reasoning_6m
        },
        {
            "strategyType": "SHORT_TERM_3M",
            "title": "3-Month Short-Term Charter",
            "rateUsdPerMt": short_rate,
            "estimatedTotalCostUsd": short_cost,
            "voyagesCount": max(2, int(round(cargo_quantity_mt / 60000))),
            "volatilityExposureScore": short_exposure,
            "isRecommended": (recommendation_flag == "SHORT_TERM_3M"),
            "reasoning": reasoning_3m
        },
        {
            "strategyType": "SPOT",
            "title": "Single Voyage Spot Charter",
            "rateUsdPerMt": spot_rate,
            "estimatedTotalCostUsd": spot_cost,
            "voyagesCount": 1,
            "volatilityExposureScore": spot_exposure,
            "isRecommended": (recommendation_flag == "SPOT"),
            "reasoning": reasoning_spot
        }
    ]
