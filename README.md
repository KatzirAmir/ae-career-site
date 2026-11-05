# AE Career Site — top-1% Analytics Engineer (insurance edition)
Static site: 12-month gameplan, 64 runnable SQL interview problems (sql.js) with spaced review, AE drills, courses, and an AE jobs board.
- Open `index.html` or the GitHub Pages URL. Progress is stored in your browser's localStorage.
- Refresh jobs: `python3 scripts/update_jobs.py` (public Greenhouse/Lever/Ashby APIs; no secrets).
- Rebuild SQL problems: `cd tools && python3 seed.py && python3 build.py` (validates every solution in SQLite).
- Daily refresh: copy `workflow-templates/update-jobs.yml` to `.github/workflows/`.
