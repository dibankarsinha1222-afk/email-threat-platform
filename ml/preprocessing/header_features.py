def create_header_features(
    spf,
    dkim,
    dmarc,
    sender,
    reply_to
):
    """
    Convert email security information
    into numerical ML features.
    """

    # SPF
    spf_fail = 1 if spf.lower() == "fail" else 0

    # DKIM
    dkim_fail = 1 if dkim.lower() == "fail" else 0

    # DMARC
    dmarc_fail = 1 if dmarc.lower() == "fail" else 0

    # Reply-To mismatch
    reply_to_mismatch = (
        1
        if sender.lower() != reply_to.lower()
        else 0
    )

    return {
        "spf_fail": spf_fail,
        "dkim_fail": dkim_fail,
        "dmarc_fail": dmarc_fail,
        "reply_to_mismatch": reply_to_mismatch
    }


# ==========================================
# Test
# ==========================================

features = create_header_features(
    spf="Fail",
    dkim="Fail",
    dmarc="Fail",
    sender="security@example.com",
    reply_to="support@fake-example.com"
)

print("Header Features:")
print(features)