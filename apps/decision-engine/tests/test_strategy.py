import pytest
from services.strategy import evaluate_contract_strategies

def test_upward_trend_recommends_coa_rate_lock():
    strategies = evaluate_contract_strategies(
        cargo_quantity_mt=180000,
        current_spot_rate=29.50,
        forecasted_rate_90d=32.20,
        trend_direction="UPWARD",
        trend_magnitude_pct=9.2,
        volatility_score=45.0,
        turnaround_days=3.0
    )
    
    assert len(strategies) >= 3
    
    recommended = [s for s in strategies if s["isRecommended"]]
    assert len(recommended) == 1
    assert recommended[0]["reasoning"] is not None
    assert len(recommended[0]["reasoning"]) > 10

def test_strategy_cost_outlay_consistency():
    strategies = evaluate_contract_strategies(
        cargo_quantity_mt=180000,
        current_spot_rate=30.00,
        forecasted_rate_90d=31.50,
        trend_direction="UPWARD",
        trend_magnitude_pct=5.0,
        volatility_score=40.0,
        turnaround_days=2.5
    )
    
    for s in strategies:
        assert s["estimatedTotalCostUsd"] > 0
        assert s["rateUsdPerMt"] > 0
