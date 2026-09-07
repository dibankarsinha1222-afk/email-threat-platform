def create_ip_features(
    ip_classifications,
    relay_count,
    ip_addresses
):
    """
    Convert IP and relay information
    into numerical features.
    """

    public_ip_count = sum(
        1
        for item in ip_classifications
        if item.get("public") is True
    )

    private_ip_count = sum(
        1
        for item in ip_classifications
        if item.get("type") == "Private"
    )

    return {
        "public_ip_count": public_ip_count,
        "private_ip_count": private_ip_count,
        "relay_count": relay_count,
        "unique_ip_count": len(set(ip_addresses))
    }


# ==========================================
# Test
# ==========================================

test_classifications = [
    {
        "ip": "203.0.113.25",
        "valid": True,
        "type": "Public IPv4",
        "public": True
    },
    {
        "ip": "198.51.100.10",
        "valid": True,
        "type": "Public IPv4",
        "public": True
    }
]

test_ips = [
    "203.0.113.25",
    "198.51.100.10"
]

features = create_ip_features(
    ip_classifications=test_classifications,
    relay_count=2,
    ip_addresses=test_ips
)

print("IP Features:")
print(features)