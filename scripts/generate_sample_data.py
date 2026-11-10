"""Synthetic test data generator for offline and local testing.

Generates realistic CSV datasets and text transcripts in samples/ directory.
Usage:
    python scripts/generate_sample_data.py
"""

import csv
import json
from pathlib import Path
import random

SAMPLE_DIR = Path(__file__).resolve().parent.parent / "samples"


def generate_ecommerce_csv():
    output_path = SAMPLE_DIR / "data" / "ecommerce_orders.csv"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    categories = ["Electronics", "Apparel", "Home Goods", "Books", "Beauty"]
    payment_methods = ["Credit Card", "PayPal", "Apple Pay", "Wire Transfer"]
    statuses = ["Delivered", "Delivered", "Delivered", "Cancelled", "Refunded"]

    random.seed(42)
    rows = []
    header = ["order_id", "customer_id", "category", "order_value_usd", "items_count", "payment_method", "order_status", "delivery_days"]

    for i in range(1, 201):
        cat = random.choice(categories)
        val = round(random.uniform(15.0, 450.0), 2)
        items = random.randint(1, 6)
        pay = random.choice(payment_methods)
        stat = random.choice(statuses)
        delivery = random.randint(1, 10) if stat == "Delivered" else None

        rows.append([f"ORD-{i:04d}", f"CUST-{random.randint(100, 300)}", cat, val, items, pay, stat, delivery])

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerow(header)
        writer.writerows(rows)

    print(f"✓ Generated {len(rows)} orders in: {output_path}")


def generate_incident_transcript():
    output_path = SAMPLE_DIR / "transcripts" / "incident_retrospective.txt"
    output_path.parent.mkdir(parents=True, exist_ok=True)

    content = """INCIDENT RETROSPECTIVE: API GATEWAY OUTAGE (INC-8821)
Date: 2026-10-15 | Duration: 42 minutes | Severity: P1

Elena: Database connection pool was exhausted at 14:02 UTC following the marketing email blast.
Devon: Automatic pod scaling kicked in but max database connections capped the replicas.
Siddharth: We applied hotfix config increasing PostgreSQL max_connections from 200 to 800 at 14:35 UTC.
Elena: Latency returned to p95 < 80ms by 14:44 UTC. No data corruption detected.
Aisha: We need automated load shedding and circuit breakers in the gateway before Black Friday.
Devon: I will write a Terraform change adding PgBouncer connection pooling layer.
Siddharth: Action item on me to update the runbook with the new connection tuning metrics.
Aisha: Schedule drill for next Tuesday to test PgBouncer under 10k req/sec simulated load.
"""

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"✓ Generated incident retrospective in: {output_path}")


def main():
    print("Generating sample data assets...")
    generate_ecommerce_csv()
    generate_incident_transcript()
    print("Done!")


if __name__ == "__main__":
    main()
