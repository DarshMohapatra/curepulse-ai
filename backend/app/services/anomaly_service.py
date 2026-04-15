"""
Anomaly Detection Service — the ML brain behind early warning.

TWO DETECTION METHODS:

1. Z-Score (Statistical):
   - Computes mean and std of a patient's historical vitals
   - If a new reading is > 2.5 standard deviations away → anomaly
   - Simple, interpretable, per-vital analysis
   - Example: Patient's avg BP is 125±8. A reading of 185 has Z=7.5 → CRITICAL

2. Isolation Forest (ML - scikit-learn):
   - Unsupervised algorithm that isolates "outliers" in multivariate data
   - Considers ALL vitals together (BP + HR + SpO2 + Temp + Glucose)
   - Catches anomalies that Z-score misses (e.g., HR is normal AND SpO2 is
     normal individually, but the COMBINATION is unusual for this patient)

ENSEMBLE LOGIC:
   - If both methods agree → high confidence alert
   - If only one flags → lower severity alert
   - Severity: critical (|Z| > 3.5), moderate (|Z| > 2.5), info (IF only)

INTERVIEW TALKING POINT:
   "I chose an ensemble approach because no single method catches everything.
   Z-score catches univariate spikes, Isolation Forest catches multivariate
   patterns. Together they reduce both false positives and false negatives."
"""

import numpy as np

# Try importing sklearn — graceful fallback if not installed
try:
    from sklearn.ensemble import IsolationForest
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False

# The vital fields we analyze
VITAL_FIELDS = ["bp_systolic", "bp_diastolic", "heart_rate", "spo2", "temperature", "blood_glucose"]


def compute_zscore_anomalies(historical_vitals, new_vital):
    """
    Z-Score Method: Check each vital independently.

    HOW IT WORKS:
    1. For each vital type (BP, HR, SpO2, etc.):
       - Compute mean and std from ALL historical readings
       - Compute Z = (new_value - mean) / std
       - If |Z| > 2.5 → flag as anomaly

    WHY 2.5?
    - In a normal distribution, only ~1.2% of values fall beyond ±2.5 SD
    - Strict enough to avoid false alarms from normal daily variation
    - But sensitive enough to catch real deterioration

    Returns: list of anomaly dicts for flagged vitals
    """
    anomalies = []

    for field in VITAL_FIELDS:
        # Get all historical values for this vital (skip nulls)
        values = [getattr(v, field) for v in historical_vitals if getattr(v, field) is not None]
        new_value = getattr(new_vital, field)

        if new_value is None or len(values) < 5:
            continue  # Need at least 5 readings for meaningful statistics

        mean = np.mean(values)
        std = np.std(values)

        if std == 0:
            continue  # All values identical — can't compute Z-score

        z_score = (new_value - mean) / std

        if abs(z_score) > 2.5:
            # Determine severity based on how extreme the Z-score is
            if abs(z_score) > 3.5:
                severity = "critical"
            else:
                severity = "moderate"

            # Human-readable direction
            direction = "high" if z_score > 0 else "low"

            anomalies.append({
                "vital": field,
                "value": float(new_value),
                "baseline_mean": round(float(mean), 1),
                "baseline_std": round(float(std), 1),
                "z_score": round(float(z_score), 2),
                "severity": severity,
                "direction": direction,
                "message": f"{field.replace('_', ' ').title()} is unusually {direction} "
                           f"({new_value} vs baseline {round(mean, 1)}±{round(std, 1)})"
            })

    return anomalies


def compute_isolation_forest_anomaly(historical_vitals, new_vital):
    """
    Isolation Forest Method: Check all vitals TOGETHER.

    HOW IT WORKS (the algorithm):
    1. Build random decision trees that try to ISOLATE each data point
    2. Anomalies are EASIER to isolate (fewer splits needed)
    3. Normal points are HARDER to isolate (need many splits)
    4. Score = average path length across all trees
    5. Short path → anomaly, Long path → normal

    WHY ISOLATION FOREST?
    - Works on small datasets (we have 30 readings — enough!)
    - No need to define "normal" boundaries manually
    - Catches MULTIVARIATE anomalies (unusual combinations)
    - Unsupervised — no labeled data needed

    Returns: anomaly dict if flagged, None otherwise
    """
    if not SKLEARN_AVAILABLE:
        return None

    # Build feature matrix from historical data
    # Each row = one reading, each column = one vital
    rows = []
    for v in historical_vitals:
        row = []
        all_none = True
        for field in VITAL_FIELDS:
            val = getattr(v, field)
            if val is not None:
                all_none = False
            row.append(float(val) if val is not None else 0.0)
        if not all_none:
            rows.append(row)

    if len(rows) < 10:
        return None  # Need at least 10 readings for Isolation Forest

    # Build the new reading's feature vector
    new_row = []
    for field in VITAL_FIELDS:
        val = getattr(new_vital, field)
        new_row.append(float(val) if val is not None else 0.0)

    X_train = np.array(rows)
    X_new = np.array([new_row])

    # Train Isolation Forest
    # contamination=0.1 means we expect ~10% of historical data to be anomalous
    # n_estimators=100 = number of trees (more = more accurate but slower)
    clf = IsolationForest(
        n_estimators=100,
        contamination=0.1,
        random_state=42
    )
    clf.fit(X_train)

    # Predict: -1 = anomaly, 1 = normal
    prediction = clf.predict(X_new)[0]
    # Score: lower = more anomalous (range roughly -0.5 to 0.5)
    score = clf.score_samples(X_new)[0]

    if prediction == -1:
        return {
            "method": "isolation_forest",
            "score": round(float(score), 4),
            "prediction": "anomaly",
            "message": "This combination of vitals is unusual compared to patient's history"
        }

    return None


def detect_anomalies(historical_vitals, new_vital):
    """
    Main entry point: runs both methods and combines results.

    Returns: {
        "is_anomaly": bool,
        "severity": "info" | "moderate" | "critical",
        "methods": ["zscore", "isolation_forest"],
        "details": { ... all detection details ... }
    }
    """
    # Run both detection methods
    zscore_results = compute_zscore_anomalies(historical_vitals, new_vital)
    if_result = compute_isolation_forest_anomaly(historical_vitals, new_vital)

    # No anomalies detected by either method
    if not zscore_results and not if_result:
        return None

    # Determine overall severity
    methods = []
    details = {}

    if zscore_results:
        methods.append("zscore")
        details["zscore"] = zscore_results
        # Use the highest severity from Z-score results
        severities = [a["severity"] for a in zscore_results]
        zscore_severity = "critical" if "critical" in severities else "moderate"
    else:
        zscore_severity = None

    if if_result:
        methods.append("isolation_forest")
        details["isolation_forest"] = if_result

    # Ensemble severity logic
    if zscore_severity == "critical":
        overall_severity = "critical"
    elif zscore_severity == "moderate" and if_result:
        # Both methods agree → escalate to critical
        overall_severity = "critical"
    elif zscore_severity == "moderate":
        overall_severity = "moderate"
    elif if_result and not zscore_results:
        # Only IF flagged (subtle multivariate anomaly)
        overall_severity = "info"
    else:
        overall_severity = "info"

    # Build summary message
    flagged_vitals = [a["vital"].replace("_", " ").title() for a in zscore_results] if zscore_results else []
    if if_result:
        flagged_vitals.append("Multivariate pattern")

    return {
        "is_anomaly": True,
        "severity": overall_severity,
        "methods": methods,
        "flagged_vitals": flagged_vitals,
        "message": f"Anomaly detected in: {', '.join(flagged_vitals)}",
        "details": details,
    }
