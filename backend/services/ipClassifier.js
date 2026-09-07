const net = require("net");

function classifyIP(ip) {
    // 1. Validate IP
    const version = net.isIP(ip);

    if (version === 0) {
        return {
            ip,
            valid: false,
            type: "Invalid",
            public: false
        };
    }

    // IPv4
    if (version === 4) {
        const parts = ip.split(".").map(Number);

        // Loopback: 127.0.0.0/8
        if (parts[0] === 127) {
            return {
                ip,
                valid: true,
                type: "Loopback",
                public: false
            };
        }

        // Private: 10.0.0.0/8
        if (parts[0] === 10) {
            return {
                ip,
                valid: true,
                type: "Private",
                public: false
            };
        }

        // Private: 172.16.0.0/12
        if (
            parts[0] === 172 &&
            parts[1] >= 16 &&
            parts[1] <= 31
        ) {
            return {
                ip,
                valid: true,
                type: "Private",
                public: false
            };
        }

        // Private: 192.168.0.0/16
        if (
            parts[0] === 192 &&
            parts[1] === 168
        ) {
            return {
                ip,
                valid: true,
                type: "Private",
                public: false
            };
        }

        // Link-local: 169.254.0.0/16
        if (
            parts[0] === 169 &&
            parts[1] === 254
        ) {
            return {
                ip,
                valid: true,
                type: "Link-local",
                public: false
            };
        }

        // Current network: 0.0.0.0/8
        if (parts[0] === 0) {
            return {
                ip,
                valid: true,
                type: "Special",
                public: false
            };
        }

        // Multicast: 224.0.0.0/4
        if (parts[0] >= 224 && parts[0] <= 239) {
            return {
                ip,
                valid: true,
                type: "Multicast",
                public: false
            };
        }

        // Otherwise treat as globally routable candidate
        return {
            ip,
            valid: true,
            type: "Public IPv4",
            public: true
        };
    }

    // IPv6
    return {
        ip,
        valid: true,
        type: "IPv6",
        public: true
    };
}

module.exports = classifyIP;