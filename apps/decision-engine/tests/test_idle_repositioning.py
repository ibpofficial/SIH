import pytest
from services.idle_repositioning import evaluate_idle_repositioning

def test_idle_repositioning_options():
    idle_options = evaluate_idle_repositioning(
        origin_port_name="Newcastle Port",
        dest_port_name="Paradip Port",
        vessel_category="Panamax"
    )
    
    assert idle_options is not None
    assert len(idle_options) >= 3
    
    for opt in idle_options:
        assert "actionType" in opt
        assert "optionTitle" in opt
        assert "estimatedCostUsd" in opt
        assert "recommendedAction" in opt
