def calculate_risk(
    ml_probability,
    header_features,
    url_features,
    ip_features
):

    ml_score = round(
        ml_probability * 60
    )

    evidence_score = 0
    evidence = []

    if header_features["spf_fail"]:
        evidence_score += 10
        evidence.append({
            "signal": "SPF",
            "result": "Fail",
            "score": 10
        })

    if header_features["dkim_fail"]:
        evidence_score += 10
        evidence.append({
            "signal": "DKIM",
            "result": "Fail",
            "score": 10
        })

    if header_features["dmarc_fail"]:
        evidence_score += 10
        evidence.append({
            "signal": "DMARC",
            "result": "Fail",
            "score": 10
        })

    if header_features["reply_to_mismatch"]:
        evidence_score += 10
        evidence.append({
            "signal": "Reply-To",
            "result": "Mismatch",
            "score": 10
        })

    if url_features["ip_based_url"]:
        evidence_score += 10
        evidence.append({
            "signal": "URL",
            "result": "IP-based URL",
            "score": 10
        })

    if url_features["at_symbol_url"]:
        evidence_score += 5
        evidence.append({
            "signal": "URL",
            "result": "@ symbol",
            "score": 5
        })

    final_score = min(
        ml_score + evidence_score,
        100
    )

    if final_score >= 70:
        threat_type = "High Risk"

    elif final_score >= 40:
        threat_type = "Medium Risk"

    else:
        threat_type = "Low Risk"

    return {
        "riskScore": final_score,
        "threatType": threat_type,
        "mlScore": ml_score,
        "forensicScore": evidence_score,
        "evidence": evidence
    }


