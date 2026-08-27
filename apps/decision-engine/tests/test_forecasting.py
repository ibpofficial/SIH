import pytest
from services.forecasting import run_freight_forecast

def test_freight_forecast_structure_and_metrics():
    res = run_freight_forecast(
        base_rate=29.50,
        origin_name="Newcastle Port",
        dest_name="Paradip Port",
        vessel_type_name="Panamax",
        horizon_days=90
    )
    
    assert res is not None
    assert res["route"] == "Newcastle Port → Paradip Port"
    assert len(res["forecastPoints"]) > 0
    assert res["forecastPoints"][0]["predictedRate"] > 0
    assert res["trendDirection"] in ["UPWARD", "DOWNWARD", "STABLE"]
    assert len(res["modelMetrics"]) == 4
    
    model_names = [m["modelName"] for m in res["modelMetrics"]]
    assert any("XGBoost" in name for name in model_names)
    assert any("SARIMAX" in name for name in model_names)

def test_freight_forecast_base_rate_sensitivity():
    low_res = run_freight_forecast(
        base_rate=20.00,
        origin_name="Newcastle Port",
        dest_name="Paradip Port",
        vessel_type_name="Panamax",
        horizon_days=90
    )
    
    high_res = run_freight_forecast(
        base_rate=40.00,
        origin_name="Newcastle Port",
        dest_name="Paradip Port",
        vessel_type_name="Panamax",
        horizon_days=90
    )
    
    assert high_res["forecastPoints"][0]["predictedRate"] > low_res["forecastPoints"][0]["predictedRate"]
