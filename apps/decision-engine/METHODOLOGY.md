# FreightIQ Decision Engine — Technical & Algorithmic Methodology

**Smart India Hackathon 2026 — Problem Statement SIH26006**  
*Decision Support System for Ministry of Steel / SAIL Bulk Cargo Ship Chartering*

---

## Executive Summary

The FreightIQ Decision Engine provides quantitative, data-driven decision support for bulk raw material (coking coal, thermal coal, iron ore, PCI coal) chartering into major East Coast India ports (Paradip, Visakhapatnam, Gangavaram, Dhamra, Haldia). 

Unlike generic procurement tools that rely on static heuristics or opaque fallback numbers, FreightIQ executes a 5-stage analytical pipeline combining numerical machine learning forecasting, port constraint filtering, contract strategy optimization, scenario-based idle repositioning evaluation, and multi-factor composite risk scoring.

---

## Data Inputs & Synthetic Market Engine

For real-time operational deployment, FreightIQ integrates with maritime market feeds (Baltic Dry Index sub-indices: BPI, BSI, BHSI, BCI) and bunker fuel spot tickers (VLSFO USD/MT). In the decision microservice, a route and vessel-aware synthetic time-series generator models realistic freight market dynamics driven by explicit economic parameters:

1. **Vessel Base Rate Ranges**:
   - **Capesize (BCI)**: $10.00 – $18.00 / MT (benchmark: $13.50/MT, ~180,000 DWT)
   - **Panamax / Kamsarmax (BPI)**: $14.00 – $24.00 / MT (benchmark: $18.75/MT, ~76,500 DWT)
   - **Supramax / Ultramax (BSI)**: $18.00 – $28.00 / MT (benchmark: $21.50/MT, ~58,000 DWT)
   - **Handysize (BHSI)**: $22.00 – $35.00 / MT (benchmark: $26.50/MT, ~28,000 DWT)

2. **Exogenous Economic Drivers**:
   - **Indian Steel Demand Growth Proxy**: Linear trend + macro noise representing Indian domestic crude steel expansion (~7.5% annual growth proxy).
   - **Bunker Fuel Price Index (VLSFO USD/MT)**: Modeled via random walk + trend around baseline $620/MT (std dev ~$38.50/MT). Fuel price fluctuations pass through to freight rates with a ~15-20% elasticity factor.
   - **East Coast India Monsoon Seasonality**: During June–September monsoon months, port discharge rates slow (~18% throughput reduction), inducing laycan congestion premiums (~4.5% rate premium).

---

## Stage 1 — Machine Learning Forecasting & Walk-Forward Validation

### Walk-Forward Backtesting Framework
To evaluate predictive accuracy without data leakage, FreightIQ splits historical rates into a **75% Training Set** and a **25% Test Set** using chronological walk-forward validation. Four candidate algorithms are trained and compared dynamically:

| Model Name | Algorithm Description | Primary Feature Set |
| :--- | :--- | :--- |
| **XGBoost Regressor (Primary)** | Gradient Boosted Decision Trees (`xgboost`) | Lags ($t-1, t-7, t-30$), Rolling Stats ($7\text{d}, 30\text{d}$ mean & std), Day-of-Year, Month, Bunker Price, Demand Index |
| **SARIMAX Time-Series** | Holt-Winters / Exponential Smoothing (`statsmodels`) | Univariate rate history with additive trend and estimated smoothing ($\alpha, \beta$) |
| **Feature Linear Regression** | Polynomial Trend Fitting (`scikit-learn`) | Time index trend polynomial + calendar day features |
| **Seasonal Naive Baseline** | 7-Day Moving Average Control | Rolling 7-day historical rate mean |

### Model Selection & Performance Metrics
The system computes real out-of-sample **Mean Absolute Error (MAE)** and **Mean Absolute Percentage Error (MAPE)** on the test set:
$$\text{MAE} = \frac{1}{N}\sum_{t=1}^{N} |y_t - \hat{y}_t|, \quad \text{MAPE} = \frac{1}{N}\sum_{t=1}^{N} \left|\frac{y_t - \hat{y}_t}{y_t}\right| \times 100\%$$

The algorithm with the lowest out-of-sample MAE is tagged `isBest: True` and selected to generate the 90-day forward forecast points.

### Dynamic Confidence Bands
Confidence intervals are derived directly from the backtest residual variance $\sigma_{\text{residual}}$ rather than hardcoded multipliers. Uncertainty expands naturally with forecast horizon $d \in [7, 14, 30, 45, 60, 90]$ days:
$$\text{SE}(d) = \sigma_{\text{residual}} \times \sqrt{1 + 0.04 \cdot d}$$
$$\text{Confidence Band}_{95\%} = \hat{y}_d \pm 1.96 \times \text{SE}(d)$$

### Statistical Significance Trend Test
Trend classification (`UPWARD`, `DOWNWARD`, `STABLE`) uses an Ordinary Least Squares hypothesis test ($p$-value of the regression slope over projected points):
- **`UPWARD`**: $p < 0.05$ and slope $> +0.01$ USD/day
- **`DOWNWARD`**: $p < 0.05$ and slope $< -0.01$ USD/day
- **`STABLE`**: $p \ge 0.05$ (slope statistically indistinguishable from flat)

---

## Stage 2 — Port & Vessel Constraint Engine

Physical vessel feasibility is verified against draft and Length Overall (LOA) limits at both loading and discharge ports:

- **Draft Constraint**: $\text{Vessel Draft} \le \min(\text{Origin Draft}, \text{Destination Draft})$
- **LOA Constraint**: $\text{Vessel LOA} \le \min(\text{Origin LOA}, \text{Destination LOA})$

### Voyage Turnaround & Cost Derivation
Turnaround time is computed dynamically using destination port handling capacity (MT/day):
$$\text{Turnaround Days} = \left\lceil \frac{\text{Cargo Quantity (MT)}}{\text{Port Daily Handling (MT/day)}} \right\rceil + 0.5 \text{ days berth/pilotage delay}$$

Estimated Charter Cost combines freight rate and vessel daily charter hire:
$$\text{Total Cost USD} = (\text{Cargo MT} \times \text{Effective Rate}) + (\text{Turnaround Days} \times \text{Daily Charter Hire})$$

---

## Stage 3 — Contract Strategy Comparator & Dynamic Reasoning

FreightIQ compares three chartering structures:
1. **6-Month Multi-Voyage Contract of Affreightment (COA)** (Mid-Term)
2. **3-Month Short-Term Charter** (Short-Term)
3. **Single Voyage Spot Charter** (Spot)

### Multi-Factor Recommendation Scoring
Recommendation selection (`recommendation_flag`) uses a weighted scoring matrix:
$$\text{Score}_{\text{COA}} = 50 + 3.5(\text{Magnitude}\%) + 0.2(\text{VolatilityScore}) + \mathbf{I}_{\text{Bulk} \ge 100k} \times 15$$
$$\text{Score}_{\text{3M}} = 50 + 1.5(\text{Magnitude}\%) + \mathbf{I}_{\text{Stable}} \times 25$$
$$\text{Score}_{\text{Spot}} = 30 - 2.0(\text{Magnitude}\%) - 0.3(\text{VolatilityScore}) + \mathbf{I}_{\text{Cargo} < 45k} \times 10$$

### Dynamic Reasoning
Reasoning explanations are dynamically synthesized using formatted strings embedding exact forecast magnitudes, spot vs 90d rates, volatility scores, and port turnaround days.

---

## Stage 4 — Data-Driven Idle & Repositioning Scenario Evaluator

When vessels face laycan gaps or port delays, FreightIQ computes net financial outcomes across three operational options:

1. **Ballast Repositioning**: Voyage cost to nearest major export hub (Port Hedland AU, Richards Bay ZA, Vostochny RU, Samarinda ID, US Gulf) based on distance, 13.0 knot laden/ballast speed, daily charter hire, and sea bunker consumption (28 MT/day).
2. **Alternate Coastal Employment**: Short domestic transshipment employment (e.g. East Coast India coastal coal movement) filling a 7–10 day laycan gap.
3. **Idle Wait at Anchor**: Cost calculated from auxiliary bunker consumption at anchor (3.5 MT/day $\times$ VLSFO rate) + daily port anchorage dues (~$1,500/day).

---

## Stage 5 — Composite Risk Scoring & Weight Rationale

The Composite Risk Score ($0 - 100$) integrates four critical maritime risk dimensions:

| Risk Dimension | Weight | Calculation Rationale |
| :--- | :---: | :--- |
| **Freight Volatility Risk** | **35%** | $\min(100, 4.5 \times \text{TrendMagnitude}\% + 25.0)$. Captures exposure to spot market freight rate fluctuations. |
| **Port Congestion Risk** | **30%** | $\min(100, 18.0 \times \text{TurnaroundDays} + 15.0)$. Measures demurrage and berth availability risk at discharge port. |
| **Laycan Deadline Tightness** | **20%** | $65.0$ if laycan window $<30$ days, else $30.0$. Reflects stockout risk for steel plant blast furnace feed. |
| **Market / Bunker Volatility** | **15%** | Derived dynamically from 30-day VLSFO fuel price std dev ($\sigma_{\text{bunker}}$) and ML model residual std dev ($\sigma_{\text{residual}}$). |

$$\text{Composite Risk Score} = 0.35(\text{Volatility}) + 0.30(\text{Congestion}) + 0.20(\text{Deadline}) + 0.15(\text{Market})$$

---

## Key SIH26006 Trade Route Matrix

| Origin Country | Key Loading Ports | Destination | Distance (NM) | Transit Days (13 kts) |
| :--- | :--- | :--- | :---: | :---: |
| **Australia** | Gladstone, Port Hedland, Newcastle | Paradip / Vizag / Gangavaram | 3,400 – 5,100 NM | 10.9 – 16.3 Days |
| **United States** | US Gulf (New Orleans), Norfolk | Paradip / Vizag / Gangavaram | 10,900 – 11,800 NM | 34.9 – 37.8 Days |
| **Mozambique** | Maputo, Nacala | Paradip / Vizag / Gangavaram | 3,750 – 4,200 NM | 12.0 – 13.5 Days |
| **Russia** | Vostochny (Far East), Novorossiysk | Paradip / Vizag / Gangavaram | 4,900 – 5,600 NM | 15.7 – 17.9 Days |
| **Indonesia** | Samarinda, Tanjung Pemancingan | Paradip / Vizag / Gangavaram | 1,950 – 2,100 NM | 6.3 – 6.7 Days |
