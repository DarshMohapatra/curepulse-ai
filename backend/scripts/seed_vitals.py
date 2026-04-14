"""
Seed Script: Generate 30 days of realistic vitals for a patient.

WHY: The forecast endpoint needs 3+ readings to work, but ideally
we want 20-30 data points to show a meaningful trend. This script
creates synthetic vitals that simulate a real patient's data over
a month — with realistic daily variations and a slight upward
trend in BP (simulating a patient whose health is slowly worsening).

HOW TO RUN:
  1. Make sure backend venv is active
  2. Run: python scripts/seed_vitals.py <patient_email>
  3. Example: python scripts/seed_vitals.py darsh@test.com

WHAT IT GENERATES:
  - 30 daily readings spread over the last 30 days
  - BP: starts ~120/80, slowly trends up (+0.5/day) with noise
  - Heart rate: fluctuates around 75 bpm
  - SpO2: fluctuates around 97%
  - Temperature: fluctuates around 98.4°F
  - Blood glucose: starts ~95, slight upward trend
"""

import asyncio
import sys
import os
import random
from datetime import datetime, timedelta, timezone

# Add the parent directory so we can import 'app'
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import AsyncSessionLocal
from app.models.user import User
from app.models.vitals import Vitals
from app.models.timeline import HealthTimeline
from sqlalchemy import select


async def seed_vitals(email: str):
    async with AsyncSessionLocal() as db:
        # Find the user
        result = await db.execute(select(User).where(User.email == email))
        user = result.scalar_one_or_none()

        if not user:
            print(f"User with email '{email}' not found!")
            print("Available users:")
            all_users = await db.execute(select(User))
            for u in all_users.scalars().all():
                print(f"  - {u.email} ({u.full_name}, role: {u.role})")
            return

        print(f"Seeding 30 days of vitals for: {user.full_name} ({user.email})")

        now = datetime.now(timezone.utc)

        for day in range(30, 0, -1):
            # Each reading is 'day' days ago, at a random morning hour
            reading_time = now - timedelta(days=day, hours=random.randint(7, 10),
                                           minutes=random.randint(0, 59))

            # Generate realistic vitals with trends + noise
            # BP: baseline 120/80, trending up 0.5/day (worsening patient)
            bp_sys = int(118 + (30 - day) * 0.5 + random.gauss(0, 4))
            bp_dia = int(78 + (30 - day) * 0.3 + random.gauss(0, 3))

            # Heart rate: stable around 75, normal variation
            hr = int(75 + random.gauss(0, 5))

            # SpO2: stable around 97, very slight decline
            spo2 = round(97.5 - (30 - day) * 0.03 + random.gauss(0, 0.5), 1)
            spo2 = min(100, max(90, spo2))  # clamp to realistic range

            # Temperature: stable around 98.4
            temp = round(98.4 + random.gauss(0, 0.3), 1)

            # Blood glucose: baseline 95, trending up slightly
            glucose = round(93 + (30 - day) * 0.4 + random.gauss(0, 5), 1)

            vitals = Vitals(
                patient_id=user.id,
                recorded_by=user.id,
                bp_systolic=bp_sys,
                bp_diastolic=bp_dia,
                heart_rate=hr,
                spo2=spo2,
                temperature=temp,
                blood_glucose=glucose,
                source="manual",
                notes=f"Seed data - day {30 - day + 1}",
            )
            # Override the auto-generated timestamp
            vitals.recorded_at = reading_time

            db.add(vitals)
            await db.flush()

            # Create matching timeline entry
            summary = f"BP: {bp_sys}/{bp_dia} mmHg, HR: {hr} bpm, SpO2: {spo2}%, Glucose: {glucose} mg/dL"
            timeline = HealthTimeline(
                patient_id=user.id,
                event_type="vitals",
                title="Vitals Recorded",
                summary=summary,
                detail_json={
                    "bp_systolic": bp_sys,
                    "bp_diastolic": bp_dia,
                    "heart_rate": hr,
                    "spo2": spo2,
                    "temperature": temp,
                    "blood_glucose": glucose,
                    "notes": f"Seed data - day {30 - day + 1}",
                },
                related_id=vitals.id,
            )
            timeline.created_at = reading_time
            db.add(timeline)

        await db.commit()
        print("Done! 30 vitals readings + timeline entries created.")
        print("Now try the forecast: GET /api/vitals/{patient_id}/forecast?vital=bp_systolic")


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python scripts/seed_vitals.py <patient_email>")
        print("Example: python scripts/seed_vitals.py darsh@test.com")
        sys.exit(1)

    asyncio.run(seed_vitals(sys.argv[1]))
