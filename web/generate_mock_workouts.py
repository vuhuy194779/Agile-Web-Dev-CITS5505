import random
from datetime import datetime, timedelta
from app import app
from app.models import db, User, Workout

START_DATE = datetime(datetime.now().year, 3, 1)
END_DATE = datetime.now()

SPORTS = [
    ('Swimming', (0.5, 3.0), (20, 60), (110, 160)),
    ('Cycling', (10, 60), (30, 120), (100, 150)),
    ('Running', (2, 12), (10, 60), (120, 170)),
]

USER_ID = 1

def random_time(duration_min, duration_max):
    minutes = random.randint(duration_min, duration_max)
    seconds = random.randint(0, 59)
    return minutes * 60 + seconds

def random_workout(date, user_id, sport, dist_range, time_range, hr_range):
    distance = round(random.uniform(*dist_range), 2)
    time = random_time(*time_range)
    heart_rate = random.randint(*hr_range)
    return Workout(
        user_id=user_id,
        sport=sport,
        time=time,
        distance=distance,
        heart_rate=heart_rate,
        workout_date=date
    )

def main():
    with app.app_context():
        user = User.query.get(USER_ID)
        if not user:
            print(f"UserID {USER_ID} does not exist. Please register a user first.")
            return
        date = START_DATE
        workouts = []
        while date <= END_DATE:
            for sport, dist_range, time_range, hr_range in SPORTS:
                if random.random() < 0.7:
                    workouts.append(random_workout(date, USER_ID, sport, dist_range, time_range, hr_range))
            date += timedelta(days=1)
        db.session.bulk_save_objects(workouts)
        db.session.commit()
        print(f"Generated {len(workouts)} workout records.")

if __name__ == "__main__":
    main()
