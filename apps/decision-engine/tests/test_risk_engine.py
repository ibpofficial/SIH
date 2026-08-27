import pytest
from services.risk_engine import compute_composite_risk

def test_risk_evaluation_bounds_and_alerts():
    risk = compute_composite_risk(
        trend_magnitude_pct=9.2,
        turnaround_days=2.5,
        dest_port_name="Paradip Port",
        required_delivery_days=25,
        bunker_volatility_std=35.0,
        residual_std=0.55
    )
    
    assert risk is not None
    assert 0 <= risk["compositeRiskScore"] <= 100
    assert risk["riskLevel"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]
    assert isinstance(risk["activeAlerts"], list)
    assert len(risk["activeAlerts"]) > 0
