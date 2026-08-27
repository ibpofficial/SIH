"""
Freight Market Baselines and Reference Parameters for SIH26006
Decision Support Engine for Ministry of Steel / SAIL Bulk Shipping Chartering
"""

from typing import Dict, Any

# Baltic Dry Index (BDI) Sub-Indices Reference Ranges & Base Rates (USD/MT)
# Research reference points: Baltic Handysize Index (BHSI), Baltic Supramax Index (BSI),
# Baltic Panamax Index (BPI), Baltic Capesize Index (BCI)
VESSEL_BASE_RATES_USD_PER_MT: Dict[str, Dict[str, float]] = {
    "HANDY": {
        "min_usd_mt": 22.0,
        "max_usd_mt": 35.0,
        "default_base_usd_mt": 26.50,
        "bdi_subindex": "BHSI",
        "typical_dwt": 28000
    },
    "HANDYMAX": {
        "min_usd_mt": 20.0,
        "max_usd_mt": 32.0,
        "default_base_usd_mt": 24.00,
        "bdi_subindex": "BSI",
        "typical_dwt": 45000
    },
    "SUPRA": {
        "min_usd_mt": 18.0,
        "max_usd_mt": 28.0,
        "default_base_usd_mt": 21.50,
        "bdi_subindex": "BSI",
        "typical_dwt": 58000
    },
    "PANAMAX": {
        "min_usd_mt": 14.0,
        "max_usd_mt": 24.0,
        "default_base_usd_mt": 18.75,
        "bdi_subindex": "BPI",
        "typical_dwt": 76500
    },
    "CAPE": {
        "min_usd_mt": 10.0,
        "max_usd_mt": 18.0,
        "default_base_usd_mt": 13.50,
        "bdi_subindex": "BCI",
        "typical_dwt": 180000
    }
}

# Bunker Fuel (VLSFO - Very Low Sulphur Fuel Oil) Market Parameters (USD/MT)
BUNKER_FUEL_BASELINE: Dict[str, float] = {
    "base_price_usd_per_mt": 620.0,
    "annual_volatility_std": 38.5,
    "consumption_at_sea_mt_per_day": 28.0,
    "consumption_at_anchor_mt_per_day": 3.5
}

# Indian Steel Sector Macro Demand Parameters
DEMAND_INDEX_BASELINE: Dict[str, float] = {
    "base_index": 100.0,
    "annual_growth_rate": 0.075, # 7.5% annual steel demand growth proxy
    "volatility_std": 2.5
}

# Seasonal Impact Parameters (East Coast India Monsoon: June - September)
SEASONAL_MONSOON_CONFIG: Dict[str, Any] = {
    "monsoon_months": [6, 7, 8, 9],
    "port_throughput_reduction_factor": 0.82, # ~18% slowdown in handling rates due to rain/swells
    "freight_rate_premium_pct": 4.5 # ~4.5% premium for laycan flexibility during monsoon
}
