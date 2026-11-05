// All gameplan + course content. Plain data, rendered by app.js.
window.PHASES = [
{when:"Months 1–2",title:"SQL interview fluency",goal:"Rebuild what you forgot after StrataScratch and get fast: solve medium problems in under 15 minutes, hard in under 30, out loud.",
 ms:["Read the SQL Refresher module end to end and redo every cheatsheet example in the runner","Solve all 20 easy problems (target: under 5 minutes each)","Solve all 23 medium problems; flag anything that took over 15 minutes","Solve 15 of 21 hard problems (gaps-and-islands, recursion, cohorts, funnels)","Clear your spaced-review queue every day for 3 weeks straight","Do 3 timed mock interviews (45 min, talk through your approach) with a peer, or record yourself"],
 topics:["Joins & anti-joins, fan-out traps","Window functions: ranking, LAG/LEAD, frames, running totals","Gaps & islands, sessionization, interval merging","CTEs, recursion, date spines, pivots, cohorts and funnels","Dialect differences: SQLite / Databricks / Snowflake"],
 proj:"<b>Deliverable:</b> a public <code>sql-interview-notes</code> repo with your own solutions to 60+ problems, each with a one-line pattern name (e.g. ‘top-N per group: ROW_NUMBER + filter’)."},
{when:"Months 3–5",title:"General AE excellence",goal:"Be strong at every AE interview loop: modeling, dbt, orchestration, Databricks, debugging and code review.",
 ms:["Complete the dbt Fundamentals course and build a dbt-databricks project with staging → intermediate → marts","Do all data modeling drills; draw 3 star schemas from scratch on a whiteboard in 20 minutes","Write 5 generic tests and 2 macros; add dbt unit tests to one model","Do the Airflow and Databricks drills; refactor one work DAG to be idempotent and deferrable","Do all debugging and code-review scenarios; leave 10 high-quality PR reviews at work","Set up GitHub Actions slim CI (state:modified+, --defer) on your portfolio repo"],
 topics:["Kimball: grain, fact types, SCD2, conformed dims","dbt: materializations, incremental, tests, macros, contracts","Airflow: idempotency, backfills, sensors vs deferrable, Assets","Delta: MERGE, liquid clustering, OPTIMIZE, Unity Catalog","CI/CD, linting, code review"],
 proj:"<b>Project:</b> open-source <code>insurtech-dbt-databricks</code> repo: synthetic policies/quotes/claims → dbt models with tests, Airflow DAG, GitHub Actions CI. This is your portfolio centerpiece."},
{when:"Months 6–8",title:"System design & interviews",goal:"Pass senior/staff AE loops: system design, behavioral, and take-home.",
 ms:["Answer all AE system-design questions in writing; then out loud in 30 minutes each","Write 8 STAR stories from your Next work (actuarial partnerships, quote metrics, a production incident, a disagreement)","Do 2 take-home style exercises (build a small dbt project from CSVs in 4 hours)","Do 4 mock interviews (SQL, modeling, system design, behavioral)","Start applying to 3–5 target roles per week from the jobs board; track in a spreadsheet"],
 topics:["Designing a metrics platform / semantic layer","Batch vs streaming, CDC, late-arriving data","Cost & performance trade-offs on Databricks","Data contracts and ownership","Behavioral: impact, conflict, ambiguity, influence"],
 proj:"<b>Deliverable:</b> a 2-page design doc for a ‘quote & bind analytics platform’ (sources → lakehouse → dbt → metrics layer → BI), published on your blog."},
{when:"Months 9–12",title:"Elite & visible",goal:"Multiply your impact: standards, mentoring, writing, and a public reputation.",
 ms:["Publish 4 technical posts (e.g. ‘Gaps-and-islands for policy continuity’, ‘Slim CI for dbt on Databricks’)","Contribute a PR to an open-source project (dbt-utils, dbt-databricks, SQLFluff, an Airflow provider)","Give one internal tech talk and one meetup talk","Write your team's modeling, testing and PR-review standards","Quantify your impact (cost, latency, trust, decisions) for your promotion packet or resume; keep solving 3 hard SQL problems a week"],
 topics:["Technical leadership: RFCs, design docs, standards","Stakeholder comms: decision memos, metric definitions","Career: brag doc, promotion packet, public portfolio","Certs (optional): dbt Analytics Engineering, Databricks Data Engineer Associate"],
 proj:"<b>Capstone:</b> extend your portfolio repo with a metrics layer and a dashboard, plus a write-up of design trade-offs."}];
window.HABITS = [
["Daily (20 min)","Clear the SQL spaced-review queue, then one new problem. Consistency beats cramming."],
["Weekly",""+"5 hrs deliberate practice: one lesson + one exercise + one PR to your portfolio repo. Keep a brag doc."],
["Every PR","Tests, docs, and a clear description of business impact. Review others' PRs thoughtfully — it's the fastest way to learn the codebase."],
["Monthly","1:1 coffee with an actuary, underwriter, claims or finance partner. Ask: what decision do you make, and what data do you wish you trusted?"],
["Quarterly","Ship one measurable improvement (cost, runtime, freshness, trust). Write a 1-page memo about it."],
["Top-1% signal","You define the metrics. When the CFO asks ‘what is our loss ratio?’, the answer comes from your model, with your definition."],
["Insurance edge","You already partner with actuaries on reserving, loss-ratio and quote metrics. That is rare among AEs, so lead with it in interviews."]];
window.RESOURCES = [
["dbt Learn (free courses)","https://learn.getdbt.com/catalog"],["dbt best-practice guides","https://docs.getdbt.com/best-practices"],["dbt Semantic Layer docs","https://docs.getdbt.com/docs/use-dbt-semantic-layer/dbt-sl"],
["Databricks Delta Lake docs","https://docs.databricks.com/aws/en/delta/"],["Unity Catalog docs","https://docs.databricks.com/aws/en/data-governance/unity-catalog/"],["Lakeflow Declarative Pipelines (DLT)","https://docs.databricks.com/aws/en/dlt/"],
["Liquid clustering","https://docs.databricks.com/aws/en/delta/clustering"],["Databricks Academy (free self-paced)","https://www.databricks.com/learn/training/home"],["Airflow best practices","https://airflow.apache.org/docs/apache-airflow/stable/best-practices.html"],
["Airflow Databricks provider","https://airflow.apache.org/docs/apache-airflow-providers-databricks/stable/index.html"],["GitHub Actions docs","https://docs.github.com/en/actions"],["SQLFluff","https://docs.sqlfluff.com/en/stable/"],
["Kimball dimensional modeling techniques","https://www.kimballgroup.com/data-warehouse-business-intelligence-resources/kimball-techniques/dimensional-modeling-techniques/"],["Mode SQL tutorial (window functions)","https://mode.com/sql-tutorial/sql-window-functions/"],["CAS — Basic Ratemaking & reserving study notes","https://www.casact.org/"],
["Friedland: Estimating Unpaid Claims Using Basic Techniques (CAS)","https://www.casact.org/sites/default/files/database/studynotes_friedland_estimating.pdf"],["NAIC (statutory reporting)","https://content.naic.org/"],["IFRS 17 Insurance Contracts (IFRS Foundation)","https://www.ifrs.org/issued-standards/list-of-standards/ifrs-17-insurance-contracts/"],
["Great Expectations / data quality","https://docs.greatexpectations.io/docs/home/"],["Locally Optimistic (analytics leadership blog)","https://locallyoptimistic.com/"],["The Analytics Engineering Guide (dbt)","https://www.getdbt.com/analytics-engineering"]];

const SCHEMA = `<pre><code>policies(policy_id, product, state, effective_date, expiration_date, status, customer_id)
policy_transactions(txn_id, policy_id, txn_type,  -- NEW, ENDORSE, RENEW, CANCEL
    txn_date, effective_date, expiration_date, written_premium)
claims(claim_id, policy_id, loss_date, report_date, status, cause)
claim_transactions(claim_id, txn_date, paid_loss, case_reserve_change, paid_lae)</code></pre>`;

window.COURSES = [
{id:"m0",title:"0 · SQL Refresher & Cheatsheet",lessons:[
{id:"m0l1",title:"Query order & core syntax",body:`<p><b>Logical execution order</b> (why aliases and filters behave the way they do):</p>
<pre><code>FROM / JOIN → WHERE → GROUP BY → HAVING → window functions → SELECT → DISTINCT → ORDER BY → LIMIT</code></pre>
<ul><li>You can't use a SELECT alias in WHERE (it doesn't exist yet). Most engines allow it in ORDER BY; Databricks/Snowflake also allow it in GROUP BY.</li><li>You can't filter on a window function in WHERE → wrap in a CTE, or use <code>QUALIFY</code> (Databricks, Snowflake, BigQuery).</li><li><code>COUNT(*)</code> counts rows; <code>COUNT(col)</code> skips NULLs; <code>COUNT(DISTINCT col)</code> counts unique non-NULL values.</li></ul>
<pre><code>SELECT product, COUNT(*) AS n, ROUND(AVG(premium),2) AS avg_prem
FROM policies
WHERE status &lt;&gt; 'CANCELLED'
GROUP BY product
HAVING COUNT(*) &gt;= 3
ORDER BY n DESC;</code></pre>`,
ex:[{q:"Why does <code>WHERE rn = 1</code> fail if rn is defined as ROW_NUMBER() in the same SELECT?",a:"Window functions run after WHERE, so rn doesn't exist yet. Compute it in a CTE/subquery and filter outside, or use QUALIFY rn = 1."}]},
{id:"m0l2",title:"Joins, NULLs & set operations",body:`<table><tr><th>Join</th><th>Keeps</th></tr><tr><td>INNER</td><td>Only matches</td></tr><tr><td>LEFT</td><td>All left rows; NULLs where no match</td></tr><tr><td>FULL OUTER</td><td>All rows from both</td></tr><tr><td>CROSS</td><td>Every combination (densify/spines)</td></tr><tr><td>Anti-join</td><td><code>LEFT JOIN ... WHERE r.key IS NULL</code> or <code>NOT EXISTS</code></td></tr><tr><td>Semi-join</td><td><code>EXISTS</code> / <code>IN</code> — no duplication</td></tr></table>
<ul><li><b>LEFT JOIN trap:</b> filtering the right table in WHERE turns it into an INNER JOIN. Put right-table filters in ON.</li><li><b>Fan-out trap:</b> joining two one-to-many tables multiplies rows → aggregate each to the shared grain first.</li><li><b>NULL:</b> <code>NULL = NULL</code> is unknown; use <code>IS NULL</code>, <code>COALESCE</code>, <code>IS DISTINCT FROM</code> / <code>&lt;=&gt;</code> (Databricks). <code>NOT IN</code> with a NULL in the list returns nothing.</li><li><code>UNION</code> dedupes (sorts/hashes); <code>UNION ALL</code> doesn't. <code>INTERSECT</code>, <code>EXCEPT</code> for set logic.</li></ul>
<pre><code>-- customers with a policy but no claim (anti-join)
SELECT DISTINCT p.customer_id
FROM policies p
LEFT JOIN claims c ON c.policy_id = p.policy_id
WHERE c.claim_id IS NULL;</code></pre>`,
ex:[{q:"This query is meant to show all users with their count of complete orders, but users with none disappear. Fix it: <code>SELECT u.user_id, COUNT(o.order_id) FROM users u LEFT JOIN orders o ON o.user_id=u.user_id WHERE o.status='complete' GROUP BY u.user_id</code>",a:"Move the filter into the ON clause: <code>... LEFT JOIN orders o ON o.user_id=u.user_id AND o.status='complete' ...</code>. The WHERE filter discards the NULL rows produced for users with no orders."}]},
{id:"m0l3",title:"Window functions cheatsheet",body:`<pre><code>fn() OVER (PARTITION BY a ORDER BY b ROWS BETWEEN x AND y)

ROW_NUMBER()  1,2,3,4    unique: dedup, top-N
RANK()        1,2,2,4    ties share, gaps after
DENSE_RANK()  1,2,2,3    ties share, no gaps
NTILE(4)      quartiles
PERCENT_RANK(), CUME_DIST()
LAG(x,1) / LEAD(x,1)     previous / next row
FIRST_VALUE(x) / LAST_VALUE(x)  -- LAST_VALUE needs ROWS ... UNBOUNDED FOLLOWING!
SUM(x) OVER (ORDER BY d ROWS UNBOUNDED PRECEDING)      running total
AVG(x) OVER (ORDER BY d ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)  7-row moving avg
SUM(x) OVER (PARTITION BY g)                            group total on every row</code></pre>
<p><b>Default frame</b> when ORDER BY is present: <code>RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW</code> — includes ties on the ORDER BY value. Be explicit with ROWS.</p>
<p><b>Pattern names to memorize:</b> top-N per group (ROW_NUMBER + filter) · dedup latest (ROW_NUMBER DESC = 1) · gaps & islands (date − ROW_NUMBER) · sessionize (LAG + flag + running SUM) · % of total (x / SUM(x) OVER (PARTITION BY g)) · period-over-period (LAG after aggregation).</p>`,
ex:[{q:"Write the islands key for consecutive daily logins.",a:"<code>julianday(login_date) - ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY login_date)</code> (Databricks: <code>date_sub(login_date, ROW_NUMBER() OVER (...))</code>). Consecutive days share the same value. Dedupe same-day rows first."}]},
{id:"m0l4",title:"Dates, CASE, CTEs & dialect cheatsheet",body:`<table><tr><th>Task</th><th>Databricks / Spark SQL</th><th>Snowflake</th><th>SQLite (practice runner)</th></tr>
<tr><td>Truncate to month</td><td><code>date_trunc('month', d)</code></td><td><code>DATE_TRUNC('month', d)</code></td><td><code>strftime('%Y-%m-01', d)</code></td></tr>
<tr><td>Days between</td><td><code>datediff(end, start)</code></td><td><code>DATEDIFF('day', start, end)</code></td><td><code>julianday(end)-julianday(start)</code></td></tr>
<tr><td>Add interval</td><td><code>date_add(d, 7)</code>, <code>add_months(d,1)</code></td><td><code>DATEADD('day',7,d)</code></td><td><code>date(d,'+7 day')</code></td></tr>
<tr><td>Date series</td><td><code>explode(sequence(a,b))</code></td><td><code>GENERATOR</code></td><td>recursive CTE</td></tr>
<tr><td>Filter windows</td><td><code>QUALIFY</code></td><td><code>QUALIFY</code></td><td>CTE + WHERE</td></tr>
<tr><td>Greatest/least</td><td><code>greatest()</code>/<code>least()</code></td><td>same</td><td><code>MAX(a,b)</code>/<code>MIN(a,b)</code></td></tr></table>
<pre><code>WITH RECURSIVE months(d) AS (
  SELECT '2025-01-01'
  UNION ALL SELECT date(d, '+1 month') FROM months WHERE d &lt; '2025-12-01')
SELECT * FROM months;

-- Conditional aggregation = portable pivot
SELECT product,
  SUM(CASE WHEN bound = 1 THEN 1 ELSE 0 END) AS binds,
  ROUND(100.0 * AVG(bound), 1)               AS bind_rate_pct
FROM quotes GROUP BY product;</code></pre>
<p><b>Interview routine:</b> 1) restate the question & grain of the output 2) ask about ties, NULLs, duplicates 3) sketch CTE steps 4) write 5) sanity-check with a tiny example.</p>`,
ex:[{q:"Integer division gotcha: why might <code>SUM(bound)/COUNT(*)</code> return 0?",a:"Both operands are integers in many engines (SQLite, Postgres), so the result is truncated. Use <code>100.0*SUM(bound)/COUNT(*)</code> or CAST to decimal/double."}]}]},

{id:"m2",title:"1 · Advanced SQL Patterns",lessons:[
{id:"m2l1",title:"Window functions that matter",body:`<p>Top AEs think in windows. Master: <code>ROW_NUMBER/RANK</code>, <code>LAG/LEAD</code>, running totals with explicit frames, and <code>QUALIFY</code> (supported by Databricks SQL) to filter on window results.</p>
<pre><code>-- Latest status per claim (dedupe CDC rows)
SELECT * FROM claims_cdc
QUALIFY ROW_NUMBER() OVER (PARTITION BY claim_id ORDER BY _commit_ts DESC) = 1;

-- Running incurred per claim with an explicit frame
SELECT claim_id, txn_date,
  SUM(paid_loss + case_reserve_change) OVER (
    PARTITION BY claim_id ORDER BY txn_date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS incurred_to_date
FROM claim_transactions;</code></pre>
<p>Pitfall: default frame with <code>ORDER BY</code> is <code>RANGE ... CURRENT ROW</code>, which includes ties (same txn_date). Be explicit.</p>`,
ex:[{q:"Find each customer's policy that was renewed the most times.",a:`<pre><code>WITH r AS (SELECT p.customer_id, t.policy_id, COUNT(*) AS renewals
  FROM policy_transactions t JOIN policies p USING (policy_id)
  WHERE txn_type='RENEW' GROUP BY 1,2)
SELECT * FROM r
QUALIFY RANK() OVER (PARTITION BY customer_id ORDER BY renewals DESC) = 1;</code></pre>`},
{q:"Days between a claim's loss_date and report_date, and flag the top 5% slowest reports per cause.",a:`<pre><code>SELECT claim_id, cause, datediff(report_date, loss_date) AS report_lag,
  PERCENT_RANK() OVER (PARTITION BY cause ORDER BY datediff(report_date, loss_date)) &gt;= 0.95 AS slow_report
FROM claims;</code></pre>`}]},
{id:"m2l2",title:"Gaps & islands and coverage continuity",body:`<p>"Is this customer continuously insured?" is a gaps-and-islands problem. Sort terms, compare each start to the previous max end, start a new island when there's a gap.</p>
<pre><code>WITH t AS (
  SELECT customer_id, effective_date AS s, expiration_date AS e,
    MAX(expiration_date) OVER (PARTITION BY customer_id ORDER BY effective_date
      ROWS BETWEEN UNBOUNDED PRECEDING AND 1 PRECEDING) AS prev_end
  FROM policies),
g AS (SELECT *, SUM(CASE WHEN prev_end IS NULL OR s &gt; prev_end THEN 1 ELSE 0 END)
       OVER (PARTITION BY customer_id ORDER BY s) AS island FROM t)
SELECT customer_id, island, MIN(s) AS cover_start, MAX(e) AS cover_end
FROM g GROUP BY 1,2;</code></pre>`,
ex:[{q:"Modify the query to allow a 30-day grace period before declaring a lapse.",a:"Change the condition to <code>s &gt; date_add(prev_end, 30)</code>."}]},
{id:"m2l3",title:"As-of joins and SCD Type 2",body:`<p>Point-in-time correctness: when joining a claim to policy attributes, use the attributes <i>as of the loss date</i>, not today's.</p>
<pre><code>SELECT c.claim_id, c.loss_date, d.state, d.industry_class
FROM claims c
JOIN dim_policy_scd2 d
  ON c.policy_id = d.policy_id
 AND c.loss_date &gt;= d.valid_from
 AND c.loss_date &lt;  coalesce(d.valid_to, DATE'9999-12-31');</code></pre>
<p>Test SCD2 tables for non-overlapping windows and exactly one current row per key.</p>`,
ex:[{q:"Write a test query that finds overlapping SCD2 windows.",a:`<pre><code>SELECT a.policy_id FROM dim_policy_scd2 a JOIN dim_policy_scd2 b
  ON a.policy_id=b.policy_id AND a.valid_from &lt; b.valid_from
 AND b.valid_from &lt; coalesce(a.valid_to, DATE'9999-12-31');</code></pre>`}]}]},
{id:"m3",title:"2 · Dimensional Modeling for Insurance",lessons:[
{id:"m3l1",title:"Grain, facts, and the insurance bus matrix",body:`<p>Kimball's first rule: <b>declare the grain</b>. Then pick dimensions and facts consistent with it. Insurance has three classic fact table types (all described by Kimball):</p>
<ul><li><b>Transaction fact</b>: <code>fct_policy_transactions</code>, <code>fct_claim_transactions</code>.</li><li><b>Periodic snapshot</b>: <code>fct_policy_monthly_snapshot</code> (in-force, earned, exposure), <code>fct_claim_monthly_snapshot</code> (incurred to date — feeds triangles).</li><li><b>Accumulating snapshot</b>: <code>fct_claim_lifecycle</code> with FNOL, first contact, first payment, closure dates.</li></ul>
<table><tr><th></th><th>dim_date</th><th>dim_policy</th><th>dim_customer</th><th>dim_product</th><th>dim_coverage</th><th>dim_claimant</th></tr>
<tr><td>Policy txn</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td></td></tr><tr><td>Earned/exposure snapshot</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td></td></tr><tr><td>Claim txn</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td><td>✓</td></tr></table>
<p>Conformed <code>dim_product</code>/<code>dim_policy</code> across facts is what makes loss ratio (claims ÷ premium) a clean join.</p>`,
ex:[{q:"Loss ratio by product requires claims and earned premium. Why should you aggregate each to (month, product) before joining?",a:"They're at different grains (claim transactions vs policy-days). Joining raw facts fans out rows and double counts. Aggregate each fact to the common grain, then join (‘drill across’)."}]},
{id:"m3l2",title:"Accumulating snapshot: claim lifecycle",body:`<pre><code>SELECT c.claim_id, c.loss_date, c.report_date,
  MIN(CASE WHEN ct.paid_loss &gt; 0 THEN ct.txn_date END) AS first_payment_date,
  MAX(CASE WHEN c.status='CLOSED' THEN ct.txn_date END) AS closed_date,
  datediff(MIN(CASE WHEN ct.paid_loss &gt; 0 THEN ct.txn_date END), c.report_date) AS days_to_first_pay,
  SUM(ct.paid_loss) AS paid_to_date,
  SUM(ct.case_reserve_change) AS case_reserve_outstanding
FROM claims c LEFT JOIN claim_transactions ct USING (claim_id)
GROUP BY c.claim_id, c.loss_date, c.report_date;</code></pre>
<p>This is the table claims ops leaders love: cycle time, aging, and backlog in one place.</p>`,
ex:[{q:"Add a fraud-signal flag: claims reported within 30 days of policy effective date.",a:`<pre><code>... JOIN policies p USING (policy_id)
, datediff(c.loss_date, p.effective_date) &lt;= 30 AS early_claim_flag</code></pre>Early claims are a classic SIU indicator; combine with others (multiple claims, same address/phone/bank across customers) — never use alone.`}]}]},
{id:"m4",title:"3 · dbt on Databricks",lessons:[
{id:"m4l1",title:"Project structure & conventions",body:`<p>dbt is in most AE job posts. Follow dbt Labs' recommended structure: <code>staging</code> (1:1 with sources, rename/cast only) → <code>intermediate</code> (business logic) → <code>marts</code> (facts/dims for consumers).</p>
<pre><code>models/
  staging/policy_admin/stg_policy_admin__policy_transactions.sql
  intermediate/int_policy_transactions__daily_earned.sql
  marts/finance/fct_earned_premium_daily.sql
  marts/claims/fct_claim_lifecycle.sql</code></pre>
<pre><code>-- stg_policy_admin__policy_transactions.sql
SELECT
  CAST(txn_id AS STRING) AS policy_transaction_id,
  CAST(policy_id AS STRING) AS policy_id,
  upper(txn_type) AS transaction_type,
  CAST(txn_date AS DATE) AS transaction_date,
  CAST(written_premium AS DECIMAL(18,2)) AS written_premium
FROM {{ source('policy_admin','policy_transactions') }}</code></pre>
<pre><code># _stg_policy_admin.yml
models:
  - name: stg_policy_admin__policy_transactions
    columns:
      - name: policy_transaction_id
        data_tests: [unique, not_null]
      - name: transaction_type
        data_tests:
          - accepted_values: {values: ['NEW','ENDORSE','RENEW','CANCEL','REINSTATE']}</code></pre>`,
ex:[{q:"Where should the pro-rata earned premium logic live, and why?",a:"In an intermediate model (e.g. int_policy_transactions__daily_earned). Staging stays a clean 1:1 contract with source; marts stay simple aggregations for consumers. Business logic in one place = one definition."}]},
{id:"m4l2",title:"Incremental models with Delta MERGE",body:`<pre><code>{{ config(
    materialized='incremental',
    incremental_strategy='merge',
    unique_key='claim_transaction_id',
    liquid_clustered_by=['claim_id'],
    on_schema_change='append_new_columns') }}
SELECT * FROM {{ ref('stg_claims__claim_transactions') }}
{% if is_incremental() %}
WHERE _loaded_at &gt; (SELECT max(_loaded_at) - INTERVAL 3 DAYS FROM {{ this }})
{% endif %}</code></pre>
<p>The 3-day lookback handles late-arriving data; <code>merge</code> on the unique key keeps it idempotent. Schedule a periodic <code>--full-refresh</code> or reconciliation test.</p>
<p>Also learn: <b>model contracts</b>, <b>versions</b>, <b>unit tests</b> (dbt 1.8+), and <b>exposures</b>.</p>`,
ex:[{q:"Write a dbt unit test for the earned premium model given a single 10-day $100 transaction.",a:`<pre><code>unit_tests:
  - name: earns_pro_rata
    model: int_policy_transactions__daily_earned
    given:
      - input: ref('stg_policy_admin__policy_transactions')
        rows:
          - {policy_transaction_id: 't1', written_premium: 100,
             effective_date: '2026-01-01', expiration_date: '2026-01-11'}
    expect:
      rows:
        - {policy_transaction_id: 't1', earn_date: '2026-01-01', daily_earned: 10}
        # ...10 rows of 10.00</code></pre>`}]}]},
{id:"m5",title:"4 · Databricks Lakehouse",lessons:[
{id:"m5l1",title:"Delta Lake essentials",body:`<p>Delta gives ACID tables on object storage. Know: <code>MERGE</code>, time travel, Change Data Feed, <code>OPTIMIZE</code>, and <b>liquid clustering</b> (the current recommendation over partitioning + Z-order for most new tables).</p>
<pre><code>CREATE TABLE claims.silver.claim_transactions CLUSTER BY (claim_id, txn_date)
TBLPROPERTIES (delta.enableChangeDataFeed = true) AS SELECT ...;

MERGE INTO claims.silver.claims t
USING updates s ON t.claim_id = s.claim_id
WHEN MATCHED AND s._commit_ts &gt; t._commit_ts THEN UPDATE SET *
WHEN NOT MATCHED THEN INSERT *;

-- What did reserves look like at quarter close?
SELECT SUM(case_reserve) FROM claims.silver.claims TIMESTAMP AS OF '2026-09-30';</code></pre>
<p>Insurance tip: time travel is handy but retention is limited — for audited quarter-end numbers, write explicit snapshot tables.</p>`,
ex:[{q:"Why not rely on Delta time travel for regulatory reproducibility?",a:"VACUUM removes old files after the retention window (default 7 days), so old versions eventually become unreadable. Regulatory/actuarial as-of numbers need persisted snapshot tables (e.g. fct_claim_monthly_snapshot) with explicit as_of_date."}]},
{id:"m5l2",title:"Unity Catalog, Lakeflow pipelines & performance",body:`<p><b>Unity Catalog</b>: three-level namespace <code>catalog.schema.table</code>, grants, column masks/row filters for PII, automatic lineage, and <code>system.billing.usage</code> for cost analysis.</p>
<pre><code>GRANT SELECT ON SCHEMA claims.gold TO \`actuarial-analysts\`;
-- cost by job last 30 days
SELECT usage_metadata.job_id, SUM(usage_quantity) AS dbus
FROM system.billing.usage WHERE usage_date &gt;= current_date() - 30
GROUP BY 1 ORDER BY 2 DESC LIMIT 20;</code></pre>
<p><b>Lakeflow Declarative Pipelines (formerly DLT)</b> declare tables + data-quality expectations:</p>
<pre><code>CREATE OR REFRESH STREAMING TABLE claims_silver (
  CONSTRAINT valid_loss_date EXPECT (loss_date &lt;= report_date) ON VIOLATION DROP ROW,
  CONSTRAINT has_policy EXPECT (policy_id IS NOT NULL) ON VIOLATION FAIL UPDATE
) AS SELECT * FROM STREAM(claims_bronze);</code></pre>
<p><b>Performance checklist</b>: Photon/serverless SQL warehouses, liquid clustering on common filters/joins, avoid tiny files (predictive optimization), broadcast small dims, read the query profile for spill & skew.</p>`,
ex:[{q:"A gold loss-ratio query is slow. List the first 4 things you'd check.",a:"1) Query profile: which stage dominates, spill, skew. 2) Are filters/joins on clustered columns (state, product, dates)? 3) Small-file problem — run OPTIMIZE / enable predictive optimization. 4) Is it re-computing from silver each time — should it be a materialized/incremental gold table? Also warehouse size and Photon."}]}]},
{id:"m6",title:"5 · Airflow Orchestration",lessons:[
{id:"m6l1",title:"Idempotent, backfillable DAGs",body:`<p>Airflow best practices: tasks should be <b>idempotent</b> (rerun = same result), use the <b>data interval</b> not <code>now()</code>, keep top-level DAG code light, and push heavy compute to Databricks.</p>
<pre><code>from airflow.decorators import dag
from airflow.providers.databricks.operators.databricks import DatabricksRunNowOperator
import pendulum

@dag(schedule="0 6 * * *", start_date=pendulum.datetime(2026,1,1,tz="UTC"),
     catchup=False, max_active_runs=1,
     default_args={"retries": 2, "retry_delay": pendulum.duration(minutes=10)},
     tags=["claims","gold"])
def claims_daily():
    DatabricksRunNowOperator(
        task_id="dbt_build_claims",
        databricks_conn_id="databricks_default",
        job_id="{{ var.value.claims_dbt_job_id }}",
        job_parameters={"run_date": "{{ ds }}"},
        deferrable=True)
claims_daily()</code></pre>
<p>Deferrable operators free worker slots while Databricks runs. Use Datasets/Assets for data-aware scheduling between DAGs.</p>`,
ex:[{q:"A task does INSERT INTO earned_premium SELECT ... WHERE date = '{{ ds }}'. Why is that not idempotent and how do you fix it?",a:"Re-running appends duplicates. Use INSERT OVERWRITE / REPLACE WHERE date = '{{ ds }}' (Delta supports <code>INSERT INTO t REPLACE WHERE date = ...</code>) or MERGE on a key."}]}]},
{id:"m7",title:"6 · Data Quality & CI/CD with GitHub Actions",lessons:[
{id:"m7l1",title:"A testing strategy that earns trust",body:`<p>Layer your tests: <b>source</b> (freshness, schema), <b>staging</b> (unique/not null/accepted values), <b>business rules</b> (earned = written, paid ≥ 0, loss_date ≤ report_date), <b>reconciliation</b> (gold premium vs GL within tolerance), and <b>anomaly</b> (volume drops). Severity: <code>warn</code> vs <code>error</code>.</p>
<pre><code>sources:
  - name: claims_system
    freshness: {warn_after: {count: 12, period: hour}, error_after: {count: 24, period: hour}}
    loaded_at_field: _ingested_at</code></pre>`,
ex:[{q:"Write a reconciliation test: monthly written premium in your mart within 0.5% of finance's GL table.",a:`<pre><code>WITH a AS (SELECT month, SUM(written_premium) wp FROM {{ ref('fct_written_premium_monthly') }} GROUP BY 1),
b AS (SELECT month, SUM(amount) gl FROM {{ source('finance','gl_written_premium') }} GROUP BY 1)
SELECT * FROM a JOIN b USING (month) WHERE ABS(wp-gl)/NULLIF(gl,0) &gt; 0.005</code></pre>`}]},
{id:"m7l2",title:"Slim CI with GitHub Actions",body:`<pre><code># .github/workflows/dbt-ci.yml
name: dbt CI
on: pull_request
jobs:
  build:
    runs-on: ubuntu-latest
    env:
      DATABRICKS_HOST: \${{ secrets.DATABRICKS_HOST }}
      DATABRICKS_TOKEN: \${{ secrets.DATABRICKS_TOKEN }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: {python-version: "3.12"}
      - run: pip install dbt-databricks sqlfluff
      - run: sqlfluff lint models --dialect databricks
      - run: dbt deps
      - name: Get prod manifest
        run: ./scripts/fetch_prod_manifest.sh   # e.g. from artifact storage
      - run: dbt build --select state:modified+ --defer --state prod-artifacts --target ci</code></pre>
<p>Build only what changed (+ downstream), deferring unchanged refs to prod. Add CODEOWNERS, branch protection, and a PR template asking "what business number changes?". Prefer OIDC/service principals over long-lived tokens.</p>`,
ex:[{q:"What does --defer do in slim CI?",a:"For models not selected in this run, dbt resolves ref() to the production relations (from the prod manifest) instead of requiring them in the CI schema — so you only build modified models and their children."}]}]},
{id:"m8",title:"7 · Metrics, Stakeholders & Career",lessons:[
{id:"m8l1",title:"Semantic layer for insurance KPIs",body:`<p>Define metrics once: loss ratio, frequency, severity, retention, premium per exposure. The dbt Semantic Layer (MetricFlow) and Databricks metric views both let BI tools query governed definitions.</p>
<pre><code>semantic_models:
  - name: earned_premium
    model: ref('fct_earned_premium_daily')
    defaults: {agg_time_dimension: earn_date}
    entities: [{name: policy, type: foreign, expr: policy_id}]
    dimensions: [{name: earn_date, type: time, type_params: {time_granularity: day}}, {name: product, type: categorical}]
    measures: [{name: earned_premium, agg: sum, expr: daily_earned}]
metrics:
  - name: loss_ratio
    type: ratio
    type_params: {numerator: incurred_loss, denominator: earned_premium}</code></pre>`,
ex:[{q:"An underwriter and finance report different loss ratios. What questions do you ask first?",a:"Accident-year or calendar-year? Including LAE? Including IBNR or just reported? Gross or net of reinsurance? Earned premium basis and as-of date? Then document the canonical definitions in the semantic layer with named variants."}]},
{id:"m8l2",title:"Communication & visibility",body:`<ul><li><b>Decision memos</b>: Context → Question → Answer → Evidence → Caveats → Recommendation, one page.</li><li><b>Translate</b>: "Liquid clustering cut runtime 60%" → "The claims dashboard is ready at 7am instead of 10am, before the daily triage meeting."</li><li><b>Write in public</b>: turn each portfolio project into a blog post; post on LinkedIn; share in dbt Community Slack.</li><li><b>Open source</b>: start with docs fixes and issues in dbt-databricks, dbt-utils, SQLFluff, Airflow providers.</li><li><b>Brag doc</b>: weekly bullets with metrics. Promotion and interviews become easy.</li><li><b>Market</b>: insurtechs hiring AEs value domain fluency — mention earned premium, triangles, and actuarial partnership explicitly.</li></ul>`,
ex:[{q:"Rewrite: 'I built a dbt model for claims.' into a resume bullet with impact.",a:"‘Designed the claims lifecycle mart (dbt + Databricks) used by claims ops and actuarial; cut days-to-first-payment reporting latency from weekly to daily and replaced 6 ad-hoc spreadsheets with one tested source of truth.’"}]}]},
{id:"m9",title:"Optional · Insurance Data Refresher",lessons:[
{id:"m9l1",title:"Quick refresher: premium, losses & triangles",body:`<p class="muted">Optional. You already do this work every day; this is just a reference for interview vocabulary.</p>
<ul><li><b>Written</b> premium is booked at transaction time. <b>Earned</b> premium accrues pro-rata over the term. <b>Unearned</b> = written − earned.</li><li><b>Incurred</b> = paid + case reserves (+ IBNR in aggregate). <b>Loss ratio</b> = incurred (± LAE) / earned. <b>Frequency</b> = claims / exposure. <b>Severity</b> = loss / claim.</li><li><b>Accident-year vs calendar-year</b>; triangles = accident period × development age; chain-ladder age-to-age factors → ultimate → IBNR.</li><li><b>Quote metrics:</b> quote → bind rate, time to bind, premium per bound policy, retention and renewal rate change.</li><li>Regulatory context: NAIC Schedule P, IFRS 17 (LRC/LIC, CSM).</li></ul>
<pre><code>-- Earned premium overlap formula, usable in any period
premium * GREATEST(0, datediff(LEAST(exp, period_end), GREATEST(eff, period_start)))
        / datediff(exp, eff)</code></pre>`,
ex:[{q:"In one sentence for an interviewer: why do you aggregate claims and premium separately before computing loss ratio?",a:"They sit at different grains (claim transactions vs policy-days), so joining raw rows fans out and double counts premium. Aggregate each to the shared grain (e.g. product-month), then join."}]}]}];
