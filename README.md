# AE Study: Analytics Engineer learning site (PostgreSQL)

A static study site with five tabs: **Plan**, **SQL Practice**, **Courses**, **AE Drills**, **Jobs**. The active tab is kept in the URL hash (for example `#practice/q12` or `#courses/l11`). It has a light/dark toggle that defaults to your system setting.

- **SQL Practice:** 64 original problems (20 easy, 23 medium, 21 hard) in the PostgreSQL dialect.
  - Every problem lists the tables it uses, their columns and types, and sample rows.
  - Run shows a result grid. Submit checks your output against the expected result.
  - Spaced review (1→64 days), flags and weak-topic tracking.
- **Courses:** 21 short lessons in 9 modules. Each has a runnable example and a practice question.
- Queries run in your browser on real PostgreSQL 18 via [PGlite](https://pglite.dev), loaded from jsDelivr. Each run happens in a transaction that is rolled back, so the sample data never changes.
- Progress is stored in your browser's localStorage.

## Rebuild problems and lessons
Content lives in `tools/problems_pg.py`, `tools/lessons_pg.py` and `tools/seed.py`. The build checks every solution in PGlite and embeds the expected outputs:

```
cd tools && npm install && npm run build
```

## Jobs
- `python3 scripts/update_jobs.py` pulls from public Greenhouse/Lever/Ashby APIs and needs no secrets.
- Daily refresh: copy `workflow-templates/update-jobs.yml` to `.github/workflows/`.
