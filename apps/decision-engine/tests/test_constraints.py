import pytest
from services.constraints import evaluate_vessel_constraints

def test_capesize_draft_rejection_at_shallow_port():
    res = evaluate_vessel_constraints(
        cargo_quantity_mt=180000,
        origin_draft_m=15.2,
        origin_length_m=250.0,
        dest_draft_m=14.5,
        dest_length_m=230.0,
        dest_handling_mt_per_day=45000.0,
        forecasted_base_rate=30.0,
        origin_port_name="Newcastle Port",
        dest_port_name="Paradip Port"
    )
    
    assert res is not None
    assert len(res["feasible"]) > 0
    assert len(res["rejected"]) > 0
    
    rejected_codes = [v["vesselCode"] for v in res["rejected"]]
    assert "CAPE" in rejected_codes
    
    cape_rejection = next(v for v in res["rejected"] if v["vesselCode"] == "CAPE")
    assert "Draft Violation" in cape_rejection["rejectionReason"] or "draft" in cape_rejection["rejectionReason"].lower()

def test_panamax_feasibility():
    res = evaluate_vessel_constraints(
        cargo_quantity_mt=150000,
        origin_draft_m=15.2,
        origin_length_m=250.0,
        dest_draft_m=14.5,
        dest_length_m=230.0,
        dest_handling_mt_per_day=45000.0,
        forecasted_base_rate=30.0,
        origin_port_name="Newcastle Port",
        dest_port_name="Paradip Port"
    )
    
    recommended_codes = [v["vesselCode"] for v in res["feasible"]]
    assert "PANAMAX" in recommended_codes
