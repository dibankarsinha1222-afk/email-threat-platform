import pandas as pd
import re


# Load dataset
df = pd.read_parquet("dataset/test.parquet")

df["subject"] = df["subject"].fillna("")
df["text"] = df["text"].fillna("")

df["email_content"] = (
    df["subject"] + " " + df["text"]
)


# =================================
# Extract URLs
# =================================

def extract_urls(text):

    pattern = r'https?://[^\s<>"\']+'

    return re.findall(pattern, text)


df["extracted_urls"] = df["email_content"].apply(
    extract_urls
)


# =================================
# URL count
# =================================

df["url_count"] = df["extracted_urls"].apply(
    len
)


# =================================
# IP-based URL
# =================================

def contains_ip_url(urls):

    ip_pattern = r'https?://(?:\d{1,3}\.){3}\d{1,3}'

    for url in urls:

        if re.search(ip_pattern, url):
            return 1

    return 0


df["ip_based_url"] = df["extracted_urls"].apply(
    contains_ip_url
)


# =================================
# Average URL length
# =================================

def average_url_length(urls):

    if len(urls) == 0:
        return 0

    total_length = sum(
        len(url)
        for url in urls
    )

    return total_length / len(urls)


df["avg_url_length"] = df["extracted_urls"].apply(
    average_url_length
)


# =================================
# Maximum URL length
# =================================

def max_url_length(urls):

    if len(urls) == 0:
        return 0

    return max(
        len(url)
        for url in urls
    )


df["max_url_length"] = df["extracted_urls"].apply(
    max_url_length
)


# =================================
# Number of dots
# =================================

def average_url_dots(urls):

    if len(urls) == 0:
        return 0

    total_dots = sum(
        url.count(".")
        for url in urls
    )

    return total_dots / len(urls)


df["avg_url_dots"] = df["extracted_urls"].apply(
    average_url_dots
)


# =================================
# @ symbol
# =================================

def contains_at_symbol(urls):

    for url in urls:

        if "@" in url:
            return 1

    return 0


df["at_symbol_url"] = df["extracted_urls"].apply(
    contains_at_symbol
)


# =================================
# HTTPS
# =================================

def contains_https(urls):

    for url in urls:

        if url.lower().startswith("https://"):
            return 1

    return 0


df["https_url"] = df["extracted_urls"].apply(
    contains_https
)


# =================================
# Display
# =================================

print("\nURL Features:\n")

print(
    df[
        [
            "subject",
            "url_count",
            "ip_based_url",
            "avg_url_length",
            "max_url_length",
            "avg_url_dots",
            "at_symbol_url",
            "https_url",
            "label"
        ]
    ].head(20)
)


print("\nFeature statistics:")

print(
    df[
        [
            "url_count",
            "ip_based_url",
            "avg_url_length",
            "max_url_length",
            "avg_url_dots",
            "at_symbol_url",
            "https_url"
        ]
    ].describe()
)


print("\nFeatures by label:")

print(
    df.groupby("label")[
        [
            "url_count",
            "ip_based_url",
            "avg_url_length",
            "max_url_length",
            "avg_url_dots",
            "at_symbol_url",
            "https_url"
        ]
    ].mean()
)