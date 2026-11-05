# Courses: (module title, [ (id, title, body_html, example_sql, practice_prompt, practice_solution, ordered) ])
M=[
("0 · SQL Refresher", [
("l01","Logical query order",
"""<p>Postgres evaluates a query in this order: <code>FROM/JOIN → WHERE → GROUP BY → HAVING → window functions → SELECT → DISTINCT → ORDER BY → LIMIT</code>.</p>
<ul><li>A SELECT alias doesn't exist yet in WHERE. Postgres <i>does</i> allow it (and column positions) in GROUP BY and ORDER BY.</li>
<li>Window functions run after WHERE, so to filter on one, wrap it in a CTE (Postgres has no QUALIFY).</li></ul>""",
"SELECT product, COUNT(*) AS n\nFROM policies\nWHERE status <> 'CANCELLED'\nGROUP BY product\nHAVING COUNT(*) >= 3\nORDER BY n DESC;",
"Tables: policies. Return state and active_policies (count of status = 'ACTIVE') for states with at least 2 active policies, ordered by state.",
"SELECT state, COUNT(*) AS active_policies\nFROM policies\nWHERE status = 'ACTIVE'\nGROUP BY state\nHAVING COUNT(*) >= 2\nORDER BY state;",True),
("l02","Joins, anti-joins and fan-out",
"""<p><b>INNER</b> keeps matches, <b>LEFT</b> keeps all left rows, <b>FULL</b> keeps both, <b>CROSS</b> builds every combination.</p>
<ul><li>Anti-join: <code>NOT EXISTS (...)</code>. Avoid <code>NOT IN</code> when the subquery can return NULL.</li>
<li>A filter on the right table in WHERE turns a LEFT JOIN into an INNER JOIN. Put it in ON.</li>
<li><b>Fan-out:</b> joining a one-to-many table multiplies the left side's measures. Aggregate before joining.</li></ul>""",
"-- Premium gets duplicated once per claim (wrong):\nSELECT SUM(p.premium) AS inflated_premium\nFROM policies p JOIN claims c ON c.policy_id = p.policy_id;\n",
"Tables: policies, claims. Return policy_id of policies that have no claims, ordered by policy_id.",
"SELECT p.policy_id FROM policies p\nWHERE NOT EXISTS (SELECT 1 FROM claims c WHERE c.policy_id = p.policy_id)\nORDER BY p.policy_id;",True),
("l03","NULLs and three-valued logic",
"""<ul><li><code>NULL = NULL</code> is unknown, not true. Use <code>IS NULL</code> or <code>IS NOT DISTINCT FROM</code>.</li>
<li><code>COUNT(col)</code> skips NULLs; <code>COUNT(*)</code> doesn't. <code>AVG</code> ignores NULLs.</li>
<li><code>COALESCE(a, b)</code> returns the first non-NULL; <code>NULLIF(x, 0)</code> avoids divide-by-zero.</li></ul>""",
"SELECT COUNT(*) AS all_rows, COUNT(referred_by) AS referred,\n  COUNT(*) FILTER (WHERE referred_by IS NULL) AS not_referred\nFROM customers;",
"Tables: claims. Return claim_id and paid_share = paid_amount / (paid_amount + reserve_amount), 2 decimals, returning NULL instead of an error when the denominator is 0. Order by claim_id.",
"SELECT claim_id, ROUND(paid_amount / NULLIF(paid_amount + reserve_amount, 0), 2) AS paid_share\nFROM claims ORDER BY claim_id;",True),
("l04","Aggregation with FILTER",
"""<p>Postgres's <code>FILTER (WHERE ...)</code> clause is a clean way to compute several conditional aggregates in one pass. The portable form is <code>SUM(CASE WHEN ... THEN 1 ELSE 0 END)</code>.</p>
<p>Int / int truncates in Postgres. Multiply by <code>100.0</code> or cast with <code>::numeric</code>.</p>""",
"SELECT product,\n  COUNT(*) AS quotes,\n  COUNT(*) FILTER (WHERE bound) AS binds,\n  ROUND(100.0 * COUNT(*) FILTER (WHERE bound) / COUNT(*), 1) AS bind_pct\nFROM quotes GROUP BY product ORDER BY product;",
"Tables: claims. Return cause, open_claims (status 'OPEN') and closed_claims (status 'CLOSED'), ordered by cause.",
"SELECT cause,\n  COUNT(*) FILTER (WHERE status = 'OPEN') AS open_claims,\n  COUNT(*) FILTER (WHERE status = 'CLOSED') AS closed_claims\nFROM claims GROUP BY cause ORDER BY cause;",True),
("l05","Dates and intervals",
"""<ul><li><code>date - date</code> = integer days; <code>date + 7</code> = date; <code>date + INTERVAL '1 month'</code> = timestamp (cast back with <code>::date</code>).</li>
<li><code>DATE_TRUNC('month', d)</code> buckets; <code>EXTRACT(YEAR FROM d)</code> pulls parts; <code>AGE(a, b)</code> gives an interval.</li>
<li>Write literals as <code>DATE '2025-06-30'</code> or <code>'2025-06-30'::date</code>.</li></ul>""",
"SELECT policy_id, effective_date,\n  expiration_date - effective_date AS term_days,\n  (effective_date + INTERVAL '6 months')::date AS mid_term,\n  DATE_TRUNC('quarter', effective_date)::date AS qtr\nFROM policies ORDER BY policy_id LIMIT 5;",
"Tables: claims. Return report_month (DATE_TRUNC month, as date) and avg_lag (average report_date - loss_date, 1 decimal), ordered by report_month.",
"SELECT DATE_TRUNC('month', report_date)::date AS report_month,\n  ROUND(AVG(report_date - loss_date), 1) AS avg_lag\nFROM claims GROUP BY 1 ORDER BY 1;",True),
]),
("1 · Window Functions", [
("l11","Ranking, top-N and DISTINCT ON",
"""<p><code>ROW_NUMBER</code> (unique), <code>RANK</code> (gaps after ties), <code>DENSE_RANK</code> (no gaps). Top-N per group = rank in a CTE, then filter.</p>
<p>For top-1 per group, Postgres's <code>DISTINCT ON (key)</code> picks the first row by the ORDER BY. It's short and fast.</p>""",
"SELECT DISTINCT ON (customer_id) customer_id, policy_id, effective_date, premium\nFROM policies\nORDER BY customer_id, effective_date DESC;  -- latest term per customer",
"Tables: claims. For each cause return the single claim with the largest paid_amount (ties: lower claim_id): cause, claim_id, paid_amount. Order by cause.",
"SELECT DISTINCT ON (cause) cause, claim_id, paid_amount\nFROM claims ORDER BY cause, paid_amount DESC, claim_id;",True),
("l12","LAG/LEAD, running totals and frames",
"""<p><code>LAG(x) OVER (PARTITION BY k ORDER BY t)</code> reads the previous row. Running totals use <code>SUM(x) OVER (ORDER BY t ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW)</code>.</p>
<p>Gotcha: with ORDER BY, the default frame is <code>RANGE ... CURRENT ROW</code>, which includes ties. <code>LAST_VALUE</code> needs <code>ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</code>.</p>""",
"SELECT user_id, order_id, order_date, amount,\n  order_date - LAG(order_date) OVER w AS days_since_prev,\n  SUM(amount) OVER (w ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS running\nFROM orders\nWINDOW w AS (PARTITION BY user_id ORDER BY order_date, order_id)\nORDER BY user_id, order_date, order_id;",
"Tables: orders. For each order return order_id and next_amount = the same user's next order amount (by order_date, order_id), NULL for the last. Order by order_id.",
"SELECT order_id, LEAD(amount) OVER (PARTITION BY user_id ORDER BY order_date, order_id) AS next_amount\nFROM orders ORDER BY order_id;",True),
("l13","Gaps and islands",
"""<p>Consecutive values minus a ROW_NUMBER stay constant inside a run: <code>login_date - ROW_NUMBER()::int</code>. Group by that key to get islands.</p>
<p>For intervals (policy terms), start a new island when a start date is after the running max end date. Dedupe first.</p>""",
"WITH d AS (SELECT DISTINCT user_id, login_date FROM logins)\nSELECT user_id, MIN(login_date) AS streak_start, MAX(login_date) AS streak_end, COUNT(*) AS days\nFROM (SELECT *, login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp FROM d) x\nGROUP BY user_id, grp\nORDER BY user_id, streak_start;",
"Tables: logins. Return user_id and streaks = number of separate consecutive-day streaks per user (dedupe same-day logins). Order by user_id.",
"WITH d AS (SELECT DISTINCT user_id, login_date FROM logins)\nSELECT user_id, COUNT(DISTINCT grp) AS streaks FROM (\n  SELECT user_id, login_date - (ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date))::int AS grp FROM d) x\nGROUP BY user_id ORDER BY user_id;",True),
]),
("2 · Advanced Patterns", [
("l21","CTEs, recursion and date spines",
"""<p>CTEs name steps; read top-down. <code>WITH RECURSIVE</code> walks hierarchies. <code>generate_series</code> builds a date spine so reports show zero periods instead of dropping them.</p>""",
"SELECT d::date AS day, COUNT(l.user_id) AS logins\nFROM generate_series(DATE '2025-06-01', DATE '2025-06-14', INTERVAL '1 day') d\nLEFT JOIN logins l ON l.login_date = d\nGROUP BY d ORDER BY d;",
"Tables: quotes. For every month from 2024-01-01 to 2024-12-01 return month_start and quotes (0 when none), ordered by month_start.",
"SELECT m::date AS month_start, COUNT(q.quote_id) AS quotes\nFROM generate_series(DATE '2024-01-01', DATE '2024-12-01', INTERVAL '1 month') m\nLEFT JOIN quotes q ON DATE_TRUNC('month', q.quote_date) = m\nGROUP BY m ORDER BY m;",True),
("l22","Pivots, funnels and cohorts",
"""<p>Pivot with <code>COUNT(*) FILTER (WHERE col = 'x') AS x</code>. Funnels count distinct users per step. Cohorts group users by first-activity month and count activity at month offsets.</p>""",
"SELECT DATE_TRUNC('month', signup_date)::date AS cohort,\n  COUNT(*) AS users,\n  COUNT(*) FILTER (WHERE plan = 'pro') AS pro,\n  COUNT(*) FILTER (WHERE plan = 'team') AS team\nFROM users GROUP BY 1 ORDER BY 1;",
"Tables: users, orders. Per user country return users and buyers (distinct users with any complete order), ordered by country.",
"SELECT u.country, COUNT(DISTINCT u.user_id) AS users, COUNT(DISTINCT o.user_id) AS buyers\nFROM users u LEFT JOIN orders o ON o.user_id = u.user_id AND o.status = 'complete'\nGROUP BY u.country ORDER BY u.country;",True),
("l23","Interval overlap",
"""<p>Two half-open intervals [s1, e1) and [s2, e2) overlap when <code>s1 &lt; e2 AND s2 &lt; e1</code>. Overlap length: <code>GREATEST(0, LEAST(e1, e2) - GREATEST(s1, s2))</code>. Postgres also has range types: <code>daterange(s, e) &amp;&amp; daterange(...)</code>.</p>""",
"SELECT policy_id, premium,\n  GREATEST(0, LEAST(expiration_date, DATE '2026-01-01') - GREATEST(effective_date, DATE '2025-01-01')) AS days_in_2025\nFROM policies ORDER BY policy_id LIMIT 8;",
"Tables: policies. Return policy_id for non-cancelled policies in force at any point during 2026-01 (overlapping [2026-01-01, 2026-02-01)), ordered by policy_id.",
"SELECT policy_id FROM policies\nWHERE status <> 'CANCELLED'\n  AND daterange(effective_date, expiration_date) && daterange(DATE '2026-01-01', DATE '2026-02-01')\nORDER BY policy_id;",True),
]),
("3 · Dimensional Modeling", [
("l31","Grain and drill-across",
"""<p>First rule: <b>declare the grain</b> (one row per what?). Facts at different grains (policy premium vs claim losses) are aggregated to a shared grain, then joined. This is drill-across, and it avoids fan-out.</p>""",
"WITH prem AS (SELECT state, SUM(premium) AS premium FROM policies GROUP BY state),\nloss AS (SELECT p.state, SUM(c.paid_amount + c.reserve_amount) AS incurred\n  FROM claims c JOIN policies p USING (policy_id) GROUP BY p.state)\nSELECT state, premium, COALESCE(incurred, 0) AS incurred,\n  ROUND(COALESCE(incurred, 0) / premium, 3) AS loss_ratio\nFROM prem LEFT JOIN loss USING (state) ORDER BY state;",
"Tables: policies, claims. At the customer grain return customer_id, premium (total) and claim_count (0 if none), ordered by customer_id. Avoid fan-out.",
"WITH p AS (SELECT customer_id, SUM(premium) AS premium FROM policies GROUP BY customer_id),\nc AS (SELECT po.customer_id, COUNT(*) AS claim_count FROM claims cl JOIN policies po USING (policy_id) GROUP BY po.customer_id)\nSELECT p.customer_id, p.premium, COALESCE(c.claim_count, 0) AS claim_count\nFROM p LEFT JOIN c USING (customer_id) ORDER BY p.customer_id;",True),
("l32","SCD Type 2 and as-of joins",
"""<p>An SCD2 dimension keeps history with <code>valid_from</code>/<code>valid_to</code>. Join a fact to the version valid <i>at the event date</i>: <code>f.d &gt;= valid_from AND f.d &lt; valid_to</code>. The example builds a small SCD2 table inline with VALUES.</p>""",
"WITH dim_customer AS (\n  SELECT * FROM (VALUES\n    (1, 'CA', DATE '2000-01-01', DATE '2025-01-01'),\n    (1, 'TX', DATE '2025-01-01', DATE '9999-12-31')) v(customer_id, state, valid_from, valid_to))\nSELECT p.policy_id, p.effective_date, d.state AS state_as_of\nFROM policies p\nJOIN dim_customer d ON d.customer_id = p.customer_id\n AND p.effective_date >= d.valid_from AND p.effective_date < d.valid_to\nORDER BY p.policy_id;",
"Tables: policies. Build SCD2-style rows from policies: for each policy return customer_id, policy_id, valid_from (effective_date) and valid_to (the customer's next policy effective_date, or DATE '9999-12-31'). Order by customer_id, valid_from.",
"SELECT customer_id, policy_id, effective_date AS valid_from,\n  COALESCE(LEAD(effective_date) OVER (PARTITION BY customer_id ORDER BY effective_date, policy_id), DATE '9999-12-31') AS valid_to\nFROM policies ORDER BY customer_id, valid_from;",True),
]),
("4 · dbt Fundamentals", [
("l41","Staging → intermediate → marts",
"""<p>dbt models are SELECT statements. <b>staging</b>: one per source, rename/cast only. <b>intermediate</b>: business logic. <b>marts</b>: facts/dims for consumers. <code>{{ ref('stg_policies') }}</code> builds the DAG. Below, each CTE plays the role of a model.</p>
<pre><code>-- models/staging/stg_policies.sql
select policy_id, customer_id, lower(product) as product_code, premium::numeric(12,2) as written_premium
from {{ source('core', 'policies') }}</code></pre>""",
"WITH stg_policies AS (\n  SELECT policy_id, customer_id, lower(product) AS product_code, premium AS written_premium, status\n  FROM policies),\nint_active AS (SELECT * FROM stg_policies WHERE status <> 'CANCELLED')\nSELECT product_code, COUNT(*) AS policies, SUM(written_premium) AS written_premium\nFROM int_active GROUP BY 1 ORDER BY 1;",
"Tables: claims. Write a 'stg_claims' style query: claim_id, policy_id, lower(status) AS claim_status, paid_amount + reserve_amount AS incurred_amount, report_date - loss_date AS report_lag_days. Order by claim_id.",
"SELECT claim_id, policy_id, lower(status) AS claim_status,\n  paid_amount + reserve_amount AS incurred_amount,\n  report_date - loss_date AS report_lag_days\nFROM claims ORDER BY claim_id;",True),
("l42","Incremental models and upserts",
"""<p>An incremental model processes only new or changed rows, then merges on a <code>unique_key</code>. In dbt: <code>{{ config(materialized='incremental', unique_key='claim_id') }}</code> plus <code>{% if is_incremental() %} where updated_at &gt; (select max(updated_at) from {{ this }}) {% endif %}</code>. Postgres runs this as <code>MERGE</code> or <code>INSERT ... ON CONFLICT</code>. The runner wraps every run in a transaction and rolls it back, so you can safely write.</p>""",
"CREATE TEMP TABLE fct_claims AS SELECT claim_id, status FROM claims WHERE claim_id <= 3;\nMERGE INTO fct_claims t\nUSING (SELECT claim_id, status FROM claims WHERE claim_id <= 5) s ON t.claim_id = s.claim_id\nWHEN MATCHED THEN UPDATE SET status = s.status\nWHEN NOT MATCHED THEN INSERT (claim_id, status) VALUES (s.claim_id, s.status);\nSELECT * FROM fct_claims ORDER BY claim_id;",
"Tables: claims. Return the 'new rows' an incremental run would pick up: claim_id and report_date for claims with report_date after the latest report_date already loaded, where 'already loaded' ({{ this }}) is claims reported before 2025-01-01. Order by claim_id.",
"SELECT claim_id, report_date FROM claims\nWHERE report_date > (SELECT MAX(report_date) FROM claims WHERE report_date < DATE '2025-01-01')\nORDER BY claim_id;",True),
]),
("5 · Data Quality & Testing", [
("l51","Tests as queries that return failures",
"""<p>A dbt test is a query that returns failing rows (pass = 0 rows). <code>unique</code>, <code>not_null</code>, <code>relationships</code>, <code>accepted_values</code>, plus singular tests for business rules (loss_date ≤ report_date, paid ≥ 0).</p>""",
"-- relationships test: claims pointing at a missing policy\nSELECT c.claim_id, c.policy_id\nFROM claims c LEFT JOIN policies p ON p.policy_id = c.policy_id\nWHERE p.policy_id IS NULL;",
"Tables: claims. Write a singular test that returns claim_id and policy_id of possible duplicate claims: rows where another claim exists on the same policy with the same cause and loss_date within 3 days. Return each claim once, ordered by claim_id.",
"SELECT DISTINCT a.claim_id, a.policy_id FROM claims a\nJOIN claims b ON b.policy_id = a.policy_id AND b.cause = a.cause AND b.claim_id <> a.claim_id\n AND ABS(a.loss_date - b.loss_date) <= 3\nORDER BY a.claim_id;",True),
("l52","Reconciliation and anomaly checks",
"""<p>Reconcile marts to a trusted total (e.g. finance's written premium) within a tolerance, and check volume against recent history. Ship these as warn-severity tests with alerts.</p>""",
"WITH m AS (SELECT DATE_TRUNC('month', order_date)::date AS mon, COUNT(*) AS n FROM orders GROUP BY 1)\nSELECT mon, n,\n  ROUND(AVG(n) OVER (ORDER BY mon ROWS BETWEEN 3 PRECEDING AND 1 PRECEDING), 1) AS trailing_avg\nFROM m ORDER BY mon;",
"Tables: policies. Reconcile: return product, mart_premium = SUM(premium) of non-cancelled policies, all_premium = SUM(premium) of all policies, and diff = all_premium - mart_premium. Order by product.",
"SELECT product,\n  SUM(premium) FILTER (WHERE status <> 'CANCELLED') AS mart_premium,\n  SUM(premium) AS all_premium,\n  SUM(premium) - COALESCE(SUM(premium) FILTER (WHERE status <> 'CANCELLED'), 0) AS diff\nFROM policies GROUP BY product ORDER BY product;",True),
]),
("6 · Airflow & Databricks", [
("l61","Idempotent, backfillable loads",
"""<p>Airflow tasks should be idempotent: rerunning a day gives the same result. Use the data interval (<code>{{ data_interval_start }}</code>), not <code>now()</code>, and replace the partition: delete that window, then insert it, in one transaction. Push heavy compute to Databricks (<code>DatabricksSubmitRunOperator</code> / Databricks SQL).</p>""",
"CREATE TEMP TABLE daily_orders(day date, orders int);\n-- rerunnable load for one data interval\nDELETE FROM daily_orders WHERE day = DATE '2025-05-20';\nINSERT INTO daily_orders SELECT order_date, COUNT(*) FROM orders WHERE order_date = DATE '2025-05-20' GROUP BY 1;\nDELETE FROM daily_orders WHERE day = DATE '2025-05-20';\nINSERT INTO daily_orders SELECT order_date, COUNT(*) FROM orders WHERE order_date = DATE '2025-05-20' GROUP BY 1;\nSELECT * FROM daily_orders;",
"Tables: orders. Write the SELECT a daily task would load for the interval [2025-03-01, 2025-04-01): order_date, orders (count), revenue (sum of complete amounts, 0 if none). Order by order_date.",
"SELECT order_date, COUNT(*) AS orders,\n  COALESCE(SUM(amount) FILTER (WHERE status = 'complete'), 0) AS revenue\nFROM orders\nWHERE order_date >= DATE '2025-03-01' AND order_date < DATE '2025-04-01'\nGROUP BY order_date ORDER BY order_date;",True),
("l62","Databricks SQL ↔ Postgres",
"""<p>You'll write Databricks SQL at work and Postgres in many interviews. Key translations:</p>
<table><tr><th>Databricks</th><th>Postgres</th></tr>
<tr><td><code>QUALIFY ROW_NUMBER() OVER (...) = 1</code></td><td><code>DISTINCT ON</code> or CTE + WHERE</td></tr>
<tr><td><code>datediff(end, start)</code></td><td><code>end - start</code></td></tr>
<tr><td><code>count_if(x)</code></td><td><code>COUNT(*) FILTER (WHERE x)</code></td></tr>
<tr><td><code>explode(sequence(a, b))</code></td><td><code>generate_series(a, b, INTERVAL '1 day')</code></td></tr>
<tr><td><code>MERGE INTO delta_table</code></td><td><code>MERGE INTO</code> (PG15+) / <code>ON CONFLICT</code></td></tr></table>
<p>Delta-specific (no Postgres equivalent): time travel, <code>OPTIMIZE</code>, liquid clustering, Change Data Feed, Unity Catalog grants.</p>""",
"-- Databricks: SELECT * FROM claims QUALIFY ROW_NUMBER() OVER (PARTITION BY policy_id ORDER BY report_date DESC) = 1\nSELECT DISTINCT ON (policy_id) policy_id, claim_id, report_date\nFROM claims ORDER BY policy_id, report_date DESC, claim_id DESC;",
"Tables: quotes. Translate this Databricks query to Postgres: SELECT product, count_if(bound) AS binds, datediff(max(quote_date), min(quote_date)) AS span_days FROM quotes GROUP BY product. Order by product.",
"SELECT product, COUNT(*) FILTER (WHERE bound) AS binds,\n  MAX(quote_date) - MIN(quote_date) AS span_days\nFROM quotes GROUP BY product ORDER BY product;",True),
]),
("7 · Metrics & Stakeholders", [
("l71","Defining metrics once",
"""<p>Define each metric once (dbt Semantic Layer or Databricks metric views): numerator, denominator, grain and filters. Write a one-line definition stakeholders can read: "Frequency = claims per 100 policies in force, by product."</p>""",
"SELECT p.product,\n  COUNT(DISTINCT p.policy_id) AS policies,\n  COUNT(c.claim_id) AS claims,\n  ROUND(100.0 * COUNT(c.claim_id) / COUNT(DISTINCT p.policy_id), 1) AS freq_per_100,\n  ROUND(AVG(c.paid_amount + c.reserve_amount), 2) AS severity\nFROM policies p LEFT JOIN claims c ON c.policy_id = p.policy_id\nGROUP BY p.product ORDER BY p.product;",
"Tables: orders. Define average order value: per month (month start date) return mon and aov = average amount of complete orders, 2 decimals. Order by mon.",
"SELECT DATE_TRUNC('month', order_date)::date AS mon, ROUND(AVG(amount), 2) AS aov\nFROM orders WHERE status = 'complete' GROUP BY 1 ORDER BY 1;",True),
]),
("Optional · Insurance Data Refresher", [
("l81","Premium, losses and report lag",
"""<p class="muted">Optional: interview vocabulary you already use daily. Written vs earned premium, incurred = paid + case reserves, IBNR, loss ratio = incurred / earned, and triangles (accident period × development age).</p>""",
"SELECT EXTRACT(YEAR FROM loss_date)::int AS accident_year,\n  COUNT(*) FILTER (WHERE report_date - loss_date <= 30) AS reported_30d,\n  COUNT(*) AS reported_total\nFROM claims GROUP BY 1 ORDER BY 1;",
"Tables: claims. Return accident_year and incurred (sum of paid + reserve, 2 decimals) by year of loss_date, ordered by accident_year.",
"SELECT EXTRACT(YEAR FROM loss_date)::int AS accident_year, ROUND(SUM(paid_amount + reserve_amount), 2) AS incurred\nFROM claims GROUP BY 1 ORDER BY 1;",True),
]),
]
