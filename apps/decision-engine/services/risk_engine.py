from typing import Dict, Any, List

import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from config.freight_baselines import BUNKER_FUEL_BASELINE

def compute_composite_risk(
    trend_magnitude_pct: float,
    turnaround_days: float,
    dest_port_name: str,
    required_delivery_days: int,
    bunker_volatility_std: float = BUNKER_FUEL_BASELINE["annual_volatility_std"],
    residual_std: float = 0.55
) -> Dict[str, Any]:
    """
    Composite Risk Engine evaluating 4 risk dimensions:
    1. Freight Volatility Risk (35%)
    2. Port Congestion Risk (30%)
    3. Laycan Deadline Tightness (20%)
    4. Market / Bunker Fuel Volatility Risk (15%)
    """
    # 1. Freight Volatility Risk (0-100)
    volatility_score = min(100.0, max(0.0, round(trend_magnitude_pct * 4.5 + 25.0, 1)))

    # 2. Port Congestion Risk (0-100)
    # Turnaround > 2.0 days increases congestion risk score
    congestion_score = min(100.0, max(0.0, round(turnaround_days * 18.0 + 15.0, 1)))

    # 3. Deadline Risk (0-100)
    # Laycan window under 30 days increases deadline tightness risk
    deadline_score = 65.0 if required_delivery_days < 30 else 30.0

    # 4. Dynamic Market / Bunker Fuel Volatility Risk (0-100)
    # Computed from VLSFO price std dev and forecast residual variance (no longer flat 45.0 constant)
    bunker_std_norm = min(1.0, bunker_volatility_std / 60.0)
    residual_norm = min(1.0, residual_std / 2.5)
    market_score = min(100.0, max(10.0, round((bunker_std_norm * 55.0) + (residual_norm * 35.0) + 10.0, 1)))

    # Weighted Composite Score Rationale:
    # 0.35 * Volatility + 0.30 * Congestion + 0.20 * Deadline + 0.15 * Market
    composite = round(
        0.35 * volatility_score +
        0.30 * congestion_score +
        0.20 * deadline_score +
        0.15 * market_score,
        1
    )

    risk_level = "LOW" if composite < 40 else "MODERATE" if composite < 65 else "HIGH" if composite < 85 else "CRITICAL"

    active_alerts = []
    if volatility_score > 60:
        active_alerts.append(f"HIGH FREIGHT VOLATILITY: Forecast indicates rate swing of {trend_magnitude_pct}% over next 90 days.")
    if congestion_score > 55:
        active_alerts.append(f"PORT CONGESTION WARNING: {dest_port_name} turnaround is {turnaround_days} days, exceeding 2.0d baseline.")
    if deadline_score > 50:
        active_alerts.append(f"LAYCAN DEADLINE TIGHTNESS: Delivery window is under {required_delivery_days} days.")
    if market_score > 60:
        active_alerts.append(f"BUNKER FUEL VOLATILITY: High VLSFO market fluctuation (std dev ${bunker_volatility_std:.1f}/MT).")

    return {
        "freightVolatilityScore": volatility_score,
        "portCongestionScore": congestion_score,
        "deadlineRiskScore": deadline_score,
        "marketVolatilityScore": market_score,
        "compositeRiskScore": composite,
        "riskLevel": risk_level,
        "activeAlerts": active_alerts
    }
