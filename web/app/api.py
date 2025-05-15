from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from sqlalchemy import func, extract
from datetime import datetime, date, timezone, timedelta
from app.models import Workout

api = Blueprint('api', __name__, url_prefix='/api')

@api.route('/marked_dates')
@login_required
def marked_dates():
    now_utc = datetime.now(timezone.utc)
    year = int(request.args.get('year', now_utc.year))
    month = int(request.args.get('month', now_utc.month))

    ## Query distinct workout dates for this user/month
    rows = (
        Workout.query
        .with_entities(func.date(Workout.workout_date).label('d'))
        .filter(Workout.user_id == current_user.id)
        .filter(extract('year', Workout.workout_date) == year)
        .filter(extract('month', Workout.workout_date) == month)
        .group_by('d')
        .all()
    )
    ## r.d is already a 'YYYY-MM-DD' string
    dates = [r.d for r in rows]
    return jsonify(dates)

@api.route('/workouts')
@login_required
def get_workouts():
    period = request.args.get('period', 'day')
    date_str = request.args.get(
        'date',
        datetime.now(timezone.utc).date().isoformat()
    )
    try:
        base_date = datetime.fromisoformat(date_str).date()
    except ValueError:
        return jsonify({'error': 'Invalid date format'}), 400

    sports = ['Swimming', 'Cycling', 'Running']
    result = {
        'labels': sports,
        'distance': [],
        'duration': [],
        'speed': [],
        'heart_rate': []
    }
    q = Workout.query.filter_by(user_id=current_user.id)

    if period == 'day':
        ## Aggregate for a single day
        rows = q.filter(func.date(Workout.workout_date) == base_date).all()
        for sport in sports:
            subs = [w for w in rows if w.sport == sport]
            dist = sum(w.distance for w in subs)
            dur = sum(w.time / 3600 for w in subs)
            result['distance'].append(round(dist, 2))
            result['duration'].append(round(dur, 2))
            spd = round(dist / dur, 2) if dur > 0 else 0
            hrs = [w.heart_rate for w in subs if w.heart_rate is not None]
            hr_avg = round(sum(hrs) / len(hrs)) if hrs else 0
            result['speed'].append(spd)
            result['heart_rate'].append(hr_avg)
        return jsonify(result)

    if period == 'week':
        ## Calculate week start (Monday) and end
        monday = base_date - timedelta(days=base_date.weekday())
        week_dates = [monday + timedelta(days=i) for i in range(7)]
        ## Totals per sport over the week
        for sport in sports:
            subs = (
                q.filter(Workout.sport == sport)
                 .filter(func.date(Workout.workout_date)
                         .between(monday, monday + timedelta(days=6)))
                 .all()
            )
            dist = sum(w.distance for w in subs)
            dur = sum(w.time / 3600 for w in subs)
            result['distance'].append(round(dist, 2))
            result['duration'].append(round(dur, 2))
        ## Day-by-day speed and heart rate
        for d in week_dates:
            day_rows = q.filter(func.date(Workout.workout_date) == d).all()
            day_speed, day_hr = [], []
            for sport in sports:
                subs = [w for w in day_rows if w.sport == sport]
                dist = sum(w.distance for w in subs)
                dur = sum(w.time / 3600 for w in subs)
                spd = round(dist / dur, 2) if dur > 0 else 0
                hrs = [w.heart_rate for w in subs if w.heart_rate is not None]
                hr_avg = round(sum(hrs) / len(hrs)) if hrs else 0
                day_speed.append(spd)
                day_hr.append(hr_avg)
            result['speed'].append(day_speed)
            result['heart_rate'].append(day_hr)
        return jsonify(result)

    if period == 'month':
        ## Calculate month boundaries
        y, m = base_date.year, base_date.month
        first_day = date(y, m, 1)
        next_month = date(y + (m // 12), (m % 12) + 1, 1)
        last_day = next_month - timedelta(days=1)
        ## Totals per sport for the full month
        for sport in sports:
            subs = (
                q.filter(Workout.sport == sport)
                 .filter(func.date(Workout.workout_date)
                         .between(first_day, last_day))
                 .all()
            )
            dist = sum(w.distance for w in subs)
            dur = sum(w.time / 3600 for w in subs)
            result['distance'].append(round(dist, 2))
            result['duration'].append(round(dur, 2))
        ## Split month into 4 segments for trends
        segments = [(1,7), (8,14), (15,21), (22, last_day.day)]
        for start_d, end_d in segments:
            seg_start = date(y, m, start_d)
            seg_end = date(y, m, end_d)
            seg_rows = (
                q.filter(func.date(Workout.workout_date)
                        .between(seg_start, seg_end))
                 .all()
            )
            seg_speed, seg_hr = [], []
            for sport in sports:
                subs = [w for w in seg_rows if w.sport == sport]
                dist = sum(w.distance for w in subs)
                dur = sum(w.time / 3600 for w in subs)
                spd = round(dist / dur, 2) if dur > 0 else 0
                hrs = [w.heart_rate for w in subs if w.heart_rate is not None]
                hr_avg = round(sum(hrs) / len(hrs)) if hrs else 0
                seg_speed.append(spd)
                seg_hr.append(hr_avg)
            result['speed'].append(seg_speed)
            result['heart_rate'].append(seg_hr)
        return jsonify(result)

    return jsonify({'error': 'Unknown period'}), 400
