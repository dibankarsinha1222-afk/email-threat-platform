def create_feature_vector(
    header_features,
    url_features,
    ip_features
):
    """
    Combine security features into
    one numerical feature vector.
    """

    vector = [
        # Header features
        header_features["spf_fail"],
        header_features["dkim_fail"],
        header_features["dmarc_fail"],
        header_features["reply_to_mismatch"],

        # URL features
        url_features["url_count"],
        url_features["ip_based_url"],
        url_features["avg_url_length"],
        url_features["max_url_length"],
        url_features["avg_url_dots"],
        url_features["at_symbol_url"],
        url_features["https_url"],

        # IP / infrastructure features
        ip_features["public_ip_count"],
        ip_features["private_ip_count"],
        ip_features["relay_count"],
        ip_features["unique_ip_count"]
    ]

    return vector


# ==========================================
# Test
# ==========================================

header_features = {
    "spf_fail": 1,
    "dkim_fail": 1,
    "dmarc_fail": 1,
    "reply_to_mismatch": 1
}

url_features = {
    "url_count": 1,
    "ip_based_url": 1,
    "avg_url_length": 30,
    "max_url_length": 30,
    "avg_url_dots": 2,
    "at_symbol_url": 0,
    "https_url": 0
}

ip_features = {
    "public_ip_count": 2,
    "private_ip_count": 0,
    "relay_count": 2,
    "unique_ip_count": 2
}


vector = create_feature_vector(
    header_features,
    url_features,
    ip_features
)

print("Feature Vector:")
print(vector)

print("\nNumber of features:")
print(len(vector))