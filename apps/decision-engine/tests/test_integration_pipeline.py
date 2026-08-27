import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_full_pipeline_australia_paradip_panamax_integration():
    payload = {
        "procurementRequestId": "req-integration-test-001",
        "commodity": "Australian Blast Furnace Coking Coal",
        "quantityMt": 180000,
        "originPortName": "Newcastle Port",
        "originDraftM": 15.2,
        "originLengthM": 250.0,
        "destinationPortName": "Paradip Port",
        "destinationDraftM": 14.5,
        "destinationLengthM": 230.0,
        "destinationHandlingMtPerDay": 45000.0,
        "requiredDeliveryDate": "2026-10-15",
        "budgetInrCrore": 165.0
    }
    
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    
    report = response.json()
    assert report["procurementRequestId"] == "req-integration-test-001"
    
    # Verify Forecast Section
    assert len(report["forecast"]["forecastPoints"]) > 0
    assert report["forecast"]["forecastPoints"][0]["predictedRate"] > 0
    assert len(report["forecast"]["modelMetrics"]) == 4
    
    # Verify Constraints Section
    assert len(report["vesselRecommendations"]) > 0
    assert len(report["rejectedVessels"]) > 0
    
    # Verify Strategy Section
    assert len(report["contractStrategies"]) >= 3
    recommended_strats = [s for s in report["contractStrategies"] if s["isRecommended"]]
    assert len(recommended_strats) == 1
    
    # Verify Risk Section
    assert 0 <= report["riskAnalysis"]["compositeRiskScore"] <= 100
    assert len(report["riskAnalysis"]["activeAlerts"]) > 0
    
    # Verify Idle Repositioning Section
    assert len(report["idleOptions"]) >= 3
