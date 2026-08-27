import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

from services.forecasting import run_freight_forecast
from services.constraints import evaluate_vessel_constraints
from services.strategy import evaluate_contract_strategies
from services.idle_repositioning import evaluate_idle_repositioning
from services.risk_engine import compute_composite_risk

app = FastAPI(
    title="FreightIQ Decision Engine Microservice",
    description="Numerical ML forecasting, port-vessel optimization, and risk assessment engine",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class AnalyzeRequest(BaseModel):
    procurementRequestId: str
    commodity: str
    quantityMt: float
    originPortName: str
    originDraftM: float
    originLengthM: float
    destinationPortName: str
    destinationDraftM: float
    destinationLengthM: float
    destinationHandlingMtPerDay: float
    requiredDeliveryDate: str
    budgetInrCrore: float

class ForecastRequest(BaseModel):
    baseRate: Optional[float] = 18.75
    originPortName: str
    destinationPortName: str
    vesselTypeName: Optional[str] = "Panamax / Kamsarmax"
    horizonDays: Optional[int] = 90

class ConstraintsRequest(BaseModel):
    cargoQuantityMt: float
    originDraftM: float
    originLengthM: float
    destinationDraftM: float
    destinationLengthM: float
    destinationHandlingMtPerDay: float
    forecastedBaseRate: float
    originPortName: Optional[str] = ""
    destinationPortName: Optional[str] = ""

class StrategyRequest(BaseModel):
    cargoQuantityMt: float
    currentSpotRate: float
    forecastedRate90d: float
    trendDirection: str
    trendMagnitudePct: Optional[float] = 9.2
    volatilityScore: Optional[float] = 45.0
    turnaroundDays: Optional[float] = 3.0

class RiskRequest(BaseModel):
    trendMagnitudePct: float
    turnaroundDays: float
    destinationPortName: str
    requiredDeliveryDays: int

class IdleRepositioningRequest(BaseModel):
    originPortName: str
    destinationPortName: str
    vesselCategory: str

@app.get("/")
def health_check():
    return {"status": "HEALTHY", "engine": "FreightIQ Python Decision Engine v2.0.0"}

@app.post("/forecast")
def get_forecast(req: ForecastRequest):
    try:
        return run_freight_forecast(
            base_rate=req.baseRate or 18.75,
            origin_name=req.originPortName,
            dest_name=req.destinationPortName,
            vessel_type_name=req.vesselTypeName or "Panamax / Kamsarmax",
            horizon_days=req.horizonDays or 90
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/constraints")
def get_constraints(req: ConstraintsRequest):
    try:
        return evaluate_vessel_constraints(
            cargo_quantity_mt=req.cargoQuantityMt,
            origin_draft_m=req.originDraftM,
            origin_length_m=req.originLengthM,
            dest_draft_m=req.destinationDraftM,
            dest_length_m=req.destinationLengthM,
            dest_handling_mt_per_day=req.destinationHandlingMtPerDay,
            forecasted_base_rate=req.forecastedBaseRate,
            origin_port_name=req.originPortName or "",
            dest_port_name=req.destinationPortName or ""
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/strategy")
def get_strategy(req: StrategyRequest):
    try:
        return evaluate_contract_strategies(
            cargo_quantity_mt=req.cargoQuantityMt,
            current_spot_rate=req.currentSpotRate,
            forecasted_rate_90d=req.forecastedRate90d,
            trend_direction=req.trendDirection,
            trend_magnitude_pct=req.trendMagnitudePct or 9.2,
            volatility_score=req.volatilityScore or 45.0,
            turnaround_days=req.turnaroundDays or 3.0
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/risk")
def get_risk(req: RiskRequest):
    try:
        return compute_composite_risk(
            trend_magnitude_pct=req.trendMagnitudePct,
            turnaround_days=req.turnaroundDays,
            dest_port_name=req.destinationPortName,
            required_delivery_days=req.requiredDeliveryDays
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/idle-repositioning")
def get_idle_repositioning(req: IdleRepositioningRequest):
    try:
        return evaluate_idle_repositioning(
            origin_port_name=req.originPortName,
            dest_port_name=req.destinationPortName,
            vessel_category=req.vesselCategory
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyze")
def analyze_procurement_request(req: AnalyzeRequest):
    try:
        # Base historical rate anchor based on commodity profile
        base_rate = 18.75
        if "Coal" in req.commodity:
            base_rate = 19.50
        elif "Ore" in req.commodity:
            base_rate = 12.20

        # Stage 1: Run ML Forecast Pipeline with Walk-Forward Backtest Model Selection
        forecast_result = run_freight_forecast(
            base_rate=base_rate,
            origin_name=req.originPortName,
            dest_name=req.destinationPortName,
            vessel_type_name="Panamax / Kamsarmax",
            horizon_days=90
        )

        current_spot = forecast_result["forecastPoints"][0]["predictedRate"]
        forecasted_90d = forecast_result["forecastPoints"][-1]["predictedRate"]
        trend_dir = forecast_result["trendDirection"]
        trend_mag = forecast_result["trendMagnitudePct"]

        # Stage 2: Evaluate East Coast Port & Vessel Constraints with Route Transit Metrics
        constraint_result = evaluate_vessel_constraints(
            cargo_quantity_mt=req.quantityMt,
            origin_draft_m=req.originDraftM,
            origin_length_m=req.originLengthM,
            dest_draft_m=req.destinationDraftM,
            dest_length_m=req.destinationLengthM,
            dest_handling_mt_per_day=req.destinationHandlingMtPerDay,
            forecasted_base_rate=current_spot,
            origin_port_name=req.originPortName,
            dest_port_name=req.destinationPortName
        )

        turnaround = constraint_result["feasible"][0]["estimatedTurnaroundDays"] if constraint_result["feasible"] else 3.0

        # Stage 5: Composite Risk Scoring & Early Warnings
        # Determine laycan delivery window days
        delivery_days = 30
        try:
            rdate = datetime.strptime(req.requiredDeliveryDate, "%Y-%m-%d")
            delivery_days = max(1, (rdate - datetime.now()).days)
        except Exception:
            pass

        risk_result = compute_composite_risk(
            trend_magnitude_pct=trend_mag,
            turnaround_days=turnaround,
            dest_port_name=req.destinationPortName,
            required_delivery_days=delivery_days
        )

        # Stage 3: Market Entry Timing & Dynamic Contract Strategy Comparator
        contract_strategies = evaluate_contract_strategies(
            cargo_quantity_mt=req.quantityMt,
            current_spot_rate=current_spot,
            forecasted_rate_90d=forecasted_90d,
            trend_direction=trend_dir,
            trend_magnitude_pct=trend_mag,
            volatility_score=risk_result["freightVolatilityScore"],
            turnaround_days=turnaround
        )

        # Stage 4: Data-Driven Idle Scenario & Repositioning Options
        best_vessel_code = constraint_result["feasible"][0]["vesselCode"] if constraint_result["feasible"] else "Panamax"
        idle_options = evaluate_idle_repositioning(
            origin_port_name=req.originPortName,
            dest_port_name=req.destinationPortName,
            vessel_category=best_vessel_code
        )

        return {
            "procurementRequestId": req.procurementRequestId,
            "commodity": req.commodity,
            "quantityMt": req.quantityMt,
            "originPortName": req.originPortName,
            "destinationPortName": req.destinationPortName,
            "forecast": forecast_result,
            "vesselRecommendations": constraint_result["feasible"],
            "rejectedVessels": constraint_result["rejected"],
            "contractStrategies": contract_strategies,
            "idleOptions": idle_options,
            "riskAnalysis": risk_result,
            "generatedAt": datetime.now().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("DECISION_ENGINE_PORT", os.getenv("PORT", "8000")))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

