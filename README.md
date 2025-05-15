# Web Application for Training Tracking

## Project Purpose

The purpose of this project is to develop a comprehensive and user-friendly application that enables triathlon athletes to track, monitor, and analyze their performance across swimming, cycling, and running. By offering functionalities such as data upload (both manually and via CSV files), share and interactive dashboards, the application aims to simplify the process of managing triathlon training data. Users can effortlessly record their heart rate, distance, date, and time for each activity, with the flexibility to select multiple activities for a single date entry.

In addition to data logging, the application provides a calendar view to highlight current and past training sessions, offering athletes clear visibility into their workout history. A dedicated dashboard visualizes performance metrics, allowing users to track progress over time, identify trends, and make data-driven adjustments to their training routines. Through this application, triathlon athletes can enhance their preparation, optimize their training strategy, and achieve their endurance goals more effectively.


### What is a Triathlon?

A triathlon is a multi-discipline endurance race consisting of swimming, cycling, and running performed in immediate succession. The most recognized formats include:

Sprint: 750m swim, 20km bike, 5km run
Olympic (Standard): 1.5km swim, 40km bike, 10km run
Half Ironman (70.3): 1.9km swim, 90km bike, 21.1km run
Ironman: 3.8km swim, 180km bike, 42.2km run

Each distance typically has a cut-off time. For full Ironman races, athletes must finish within 17 hours, with intermediate limits for each segment (e.g., 2h20 for the swim). Triathlons test endurance, strategy, and versatility across disciplines.

## Group Member

| UWA ID   | Name         | Github Username |
| -------- | ------------ | --------------- |
| 24552745 | Vu Huy Pham  | vuhuy194779     |
| 24408753 | Zhehao Chen  | FakePicasso1    |
| 24327882 | Merlyn John  | merlynjohn      |
| 24022113 | Olivia Zhang | OliviaZ12       |

## Instruction

You must have installed Python version >= 3.9

In the terminal, run the following command

```
cd web
```

Then for windows users run

```
py -3 -m venv .venv
.venv/Scripts/activate
```

Or if you're a Mac/Linux user

```
python3 -m venv .venv
.venv/bin/activate
```

And follow these command to open the application

```
pip install -r requirements.txt
flask db upgrade
flask run
```

## Test
