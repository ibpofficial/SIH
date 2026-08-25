from typing import Dict, Any, List

def compute_composite_risk(
    trend_magnitude_pct: float,
    turnaround_days: float,
    dest_port_name: str,
    required_delivery_days: int
) -> Dict[str, Any]:
    
    # 1. Freight Volatility Risk (0-100)
    volatility_score = min(100.0, round(trend_magnitude_pct * 4.5 + 25.0, 1))

    # 2. Port Congestion Risk (0-100)
    # Turnaround > 3.0 days increases congestion risk score
    congestion_score = min(100.0, round(turnaround_days * 18.0 + 15.0, 1))

    # 3. Deadline Risk (0-100)
    # Less than 30 days laycan increases deadline risk
    deadline_score = 65.0 if required_delivery_days < 30 else 30.0

    # 4. Market / Bunker Volatility Risk (0-100)
    market_score = 45.0

    # Weighted Composite Score
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

    return {
        "freightVolatilityScore": volatility_score,
        "portCongestionScore": congestion_score,
        "deadlineRiskScore": deadline_score,
        "marketVolatilityScore": market_score,
        "compositeRiskScore": composite,
        "riskLevel": risk_level,
        "activeAlerts": active_alerts
    }
