import pytest
from fastapi.testclient import TestClient
import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "HEALTHY"

def test_forecast_endpoint():
    payload = {
        "baseRate": 19.50,
        "originPortName": "Gladstone AU",
        "destinationPortName": "Paradip",
        "vesselTypeName": "Panamax / Kamsarmax",
        "horizonDays": 90
    }
    response = client.post("/forecast", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "forecastPoints" in data
    assert len(data["forecastPoints"]) > 0
    assert data["trendDirection"] in ["UPWARD", "DOWNWARD", "STABLE"]

def test_constraints_endpoint():
    payload = {
        "cargoQuantityMt": 180000,
        "originDraftM": 15.5,
        "originLengthM": 250.0,
        "destinationDraftM": 14.5,
        "destinationLengthM": 230.0,
        "destinationHandlingMtPerDay": 25000,
        "forecastedBaseRate": 19.50,
        "originPortName": "Newcastle AU",
        "destinationPortName": "Paradip IN"
    }
    response = client.post("/constraints", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "feasible" in data
    assert "rejected" in data
    assert len(data["feasible"]) > 0

def test_strategy_endpoint():
    payload = {
        "cargoQuantityMt": 180000,
        "currentSpotRate": 19.50,
        "forecastedRate90d": 21.28,
        "trendDirection": "UPWARD",
        "trendMagnitudePct": 9.2,
        "volatilityScore": 55.0,
        "turnaroundDays": 3.3
    }
    response = client.post("/strategy", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 3
    rec = [s for s in data if s["isRecommended"]]
    assert len(rec) == 1

def test_risk_endpoint():
    payload = {
        "trendMagnitudePct": 9.2,
        "turnaroundDays": 3.3,
        "destinationPortName": "Paradip IN",
        "requiredDeliveryDays": 30
    }
    response = client.post("/risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "compositeRiskScore" in data
    assert "riskLevel" in data
    assert data["riskLevel"] in ["LOW", "MODERATE", "HIGH", "CRITICAL"]

def test_idle_repositioning_endpoint():
    payload = {
        "originPortName": "Newcastle AU",
        "destinationPortName": "Paradip IN",
        "vesselCategory": "Panamax"
    }
    response = client.post("/idle-repositioning", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert isinstance(data, list)
    assert len(data) >= 1

def test_full_analyze_orchestration_endpoint():
    payload = {
        "procurementRequestId": "req-test-123",
        "commodity": "Australian Blast Furnace Coking Coal",
        "quantityMt": 180000,
        "originPortName": "Gladstone AU",
        "originDraftM": 16.0,
        "originLengthM": 260.0,
        "destinationPortName": "Paradip IN",
        "destinationDraftM": 14.5,
        "destinationLengthM": 230.0,
        "destinationHandlingMtPerDay": 25000,
        "requiredDeliveryDate": "2026-10-15",
        "budgetInrCrore": 165.0
    }
    response = client.post("/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    
    assert data["procurementRequestId"] == "req-test-123"
    assert data["commodity"] == "Australian Blast Furnace Coking Coal"
    assert data["quantityMt"] == 180000
    assert "forecast" in data
    assert "vesselRecommendations" in data
    assert "rejectedVessels" in data
    assert "contractStrategies" in data
    assert "idleOptions" in data
    assert "riskAnalysis" in data
    assert "generatedAt" in data
    
    # Assert nested real fields
    assert len(data["forecast"]["forecastPoints"]) > 0
    assert len(data["vesselRecommendations"]) > 0
    assert len(data["contractStrategies"]) == 3
    assert data["riskAnalysis"]["compositeRiskScore"] > 0
