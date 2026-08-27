# FreightIQ — Demo Script & Judge Q&A Prep Guide

This document contains the official **2.5-minute timed presentation script** for Smart India Hackathon (SIH) judges and high-leverage answers for the top 4 judge Q&A questions.

---

## Part 1: Timed 2.5-Minute Pitch & Presentation Script

### 0:00 – 0:30 | Problem Statement & System Overview
> *"Respected Judges, Steel Authority of India Limited (SAIL) imports millions of metric tons of coking coal and bulk raw materials annually across global ocean routes. Traditional chartering relies on static spot market quotes, exposing procurement teams to extreme freight rate volatility, port congestion delays, and vessel physical draft mismatches.*
>
> *We present **FreightIQ** — an end-to-end Explainable Maritime Procurement & Decision Engine that fuses real-time XGBoost freight forecasting, port draft/LOA constraint solvers, dynamic COA contract strategy scoring, composite 4D risk rating, and ballast idle repositioning into a single executive command suite."*

### 0:30 – 1:00 | Live Procurement Creation & ML Backtest Evaluation
> *(Action: Click 'Create Procurement Request' → Select '180,000 MT Australian Blast Furnace Coking Coal' → Newcastle to Paradip → Click 'Analyze & Optimize')*
>
> *"Notice what happens when we initiate analysis. In real-time, our Python FastAPI decision engine executes walk-forward backtesting across 4 competing models: XGBoost Regressor, SARIMAX Time-Series, Feature Linear Regression, and Seasonal Naive. XGBoost automatically wins as the primary model with a verified MAE of $1.85/MT, predicting an UPWARD rate trend of +9.2% over the 90-day laycan window."*

### 1:00 – 1:30 | Vessel Physical Constraints & Contract Strategy Rationale
> *(Action: Scroll down to Strategy Recommendation & Vessel Class Breakdown)*
>
> *"Next, our constraint engine filters vessel classes against East Coast channel limits. A Capesize carrier (18.5m draft) is **automatically rejected** due to Paradip's 14.5m max draft depth, saving SAIL from catastrophic grounding penalties. Instead, the system locks in a **6-Month COA Panamax Contract** at $23.63/MT, saving ₹9.8 Crore compared to volatile spot chartering."*

### 1:30 – 2:00 | Composite 4D Risk Radar & Ballast Route Canvas
> *(Action: Show Composite Risk Gauge & Ballast Repositioning Route Map)*
>
> *"FreightIQ evaluates a composite 4D risk rating — factoring freight volatility (35%), port turnaround congestion (30%), laycan deadline (20%), and VLSFO bunker fuel fluctuation (15%). Furthermore, our ballast visualizer recommends repositioning idle vessels from Paradip to Port Hedland (3,400 nm), yielding +$42,500 USD in net revenue margin vs idling at anchorage."*

### 2:00 – 2:30 | Governance Audit Trail & Summary
> *(Action: Navigate to Audit Trail tab)*
>
> *"Finally, every single analysis run, parameter override, and strategy choice is written into an immutable audit trail with full JSON payload diffs for complete enterprise transparency. FreightIQ transforms maritime procurement from reactive guesswork into precision financial optimization."*

---

## Part 2: Top 4 Judge Q&A Answers

### Question 1: "Is this using real freight market data or simulated data?"
**Answer**:
> "Our production pipeline is architected to ingest live Baltic Dry Index sub-indices (BPI Panamax / BCI Capesize) and S&P Global Platts freight rate feeds via our Data Ingestion Studio. For backtesting and demo validation, our synthetic data generator strictly mirrors real physical freight economics — incorporating vessel deadweight tonnage, route distance differential multipliers, Indian crude/steel demand proxies, and East Coast monsoon seasonality."

### Question 2: "Why did you choose XGBoost over a pure time-series model like ARIMA or LSTM?"
**Answer**:
> "Ocean freight rates are heavily influenced by exogenous non-linear variables — such as VLSFO bunker fuel price surges, port turnaround delays, and vessel capacity shifts — which standard univariate ARIMA models fail to capture. In our walk-forward cross-validation benchmarks, XGBoost achieved a significantly lower Mean Absolute Error ($1.85/MT vs $3.42/MT for SARIMAX) by natively learning non-linear interactions across lag and exogenous features."

### Question 3: "How does this scale to other SAIL procurement categories beyond coal and iron ore?"
**Answer**:
> "FreightIQ is entirely configuration-driven rather than hardcoded. The underlying trade route geometry (`trade_routes.py`), vessel class registries (`VESSEL_CLASSES`), and port channel limitations (Max Draft & LOA) are stored as dynamic entities. Scaling to limestone, ferro-alloys, or finished steel exports simply requires registering the commodity specification and port depth in the database without altering a single line of core ML solver code."

### Question 4: "What happens if the Python Decision Engine microservice is down or unreachable?"
**Answer**:
> "We built multi-tiered microservice resilience in NestJS. If the Python decision engine encounters network latency or downtime, the API service layer catches the exception gracefully, serving analytical fallback reasoning while logging an emergency alert in the audit trail so procurement managers are never blocked from viewing baseline contracts."
