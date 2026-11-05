#!/usr/bin/env python3
"""Collect real Analytics Engineer postings from public ATS APIs (Greenhouse, Lever, Ashby).
Writes jobs.json and jobs.js (fallback for file://). Usage: python3 scripts/update_jobs.py"""
import json, re, sys, os, concurrent.futures as cf, urllib.request, datetime as dt
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# (display name, slug candidates) -- insurance companies first
INSURANCE = ["lemonade","root","rootinsurance","coalition","coalitioninc","vouch","corgi","shepherd","shepherdinsurance",
 "nextinsurance","next-insurance","hippo","hippoinsurance","kin","kininsurance","clearcover","branch","ourbranch","openly",
 "pie","pieinsurance","newfront","embroker","at-bay","atbay","cowbell","cowbellcyber","ethos","ethoslife","ladder","ladderlife",
 "oscar","oscarhealth","bestow","policygenius","newfrontinsurance","sproutt","jerry","gabi","insurify","tailor","kanguro",
 "hiscox","markel","boost","boostinsurance","federato","sixfold","koalaroo","counterpart","counterpartinsurance","huckleberry",
 "obie","steadily","goosehead","marshmallow","wefox","getsafe","clearcoverinsurance","mileauto","openlyinsurance","assurance",
 "accelerant","ledgebrook","relm","cover","coverwallet","thimble","harbor","ambetter","nirvana","nirvanatech","bold-penguin","boldpenguin",
 "trov","slide","slideinsurance","neptune","neptuneflood","kettle","descartes","bound","foresight","foresightinsurance","mylo","agentsync",
 "zebra","thezebra","everquote","goodcover","duck-creek","duckcreek","guidewire","snapsheet","clara","clara-analytics","sure","gainsco","amwins",
 "travelers","libertymutual","progressive","statefarm","chubb","aig","allstate","nationwide","usaa","geico","farmers","thehartford","cincinnatifinancial",
 "elephant","freeway","swyfft","openroad","insurancequotes","notablehealth","devoted","devotedhealth","alan","clover","cloverhealth","sana","sanabenefits","angle","anglehealth"]
GENERAL = ["airbnb","stripe","dbtlabs","databricks","figma","notion","ramp","brex","gusto","plaid","chime","robinhood","affirm","doordash",
 "instacart","lyft","reddit","discord","dropbox","asana","hightouch","census","fivetran","sigmacomputing","hex","mercury","rippling","deel",
 "wealthfront","betterment","sofi","nerdwallet","carta","zillow","opendoor","faire","grammarly","duolingo","canva","spotify","squarespace",
 "webflow","calendly","zapier","airtable","monzo","wise","gitlab","hashicorp","datadog","snowflake","coinbase","flexport","whoop","peloton",
 "hims","ro","noom","calm","headspace","seatgeek","etsy","github","vercel","linear","retool","mixpanel","amplitude","clickup","miro","tripadvisor"]
TITLE = re.compile(r"analytics engineer|analytics engineering", re.I)
ADJ = re.compile(r"data engineer|business intelligence|bi engineer|analytics|data scientist|data analyst", re.I)
INS_WORDS = re.compile(r"insur|underwrit|claims|actuar|policyholder|reinsur", re.I)
UA = {"User-Agent": "ae-career-site/1.0"}
def get(url):
    try:
        with urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=15) as r:
            return json.load(r)
    except Exception:
        return None
def iso(v):
    if v is None: return ""
    if isinstance(v, (int, float)): return dt.datetime.fromtimestamp(v/1000, dt.timezone.utc).strftime("%Y-%m-%d")
    return str(v)[:10]
def greenhouse(s):
    d = get(f"https://boards-api.greenhouse.io/v1/boards/{s}/jobs")
    if not d or "jobs" not in d: return None
    co = get(f"https://boards-api.greenhouse.io/v1/boards/{s}") or {}
    return [dict(title=j["title"], company=co.get("name") or s, location=(j.get("location") or {}).get("name",""),
                 url=j["absolute_url"], posted=iso(j.get("first_published") or j.get("updated_at")), source="Greenhouse") for j in d["jobs"]]
def lever(s):
    d = get(f"https://api.lever.co/v0/postings/{s}?mode=json")
    if not isinstance(d, list) or not d: return None
    return [dict(title=j["text"], company=s.title(), location=(j.get("categories") or {}).get("location",""),
                 url=j["hostedUrl"], posted=iso(j.get("createdAt")), source="Lever") for j in d]
def ashby(s):
    d = get(f"https://api.ashbyhq.com/posting-api/job-board/{s}")
    if not d or not d.get("jobs"): return None
    return [dict(title=j["title"], company=s.title(), location=j.get("location",""), url=j["jobUrl"],
                 posted=iso(j.get("publishedAt")), source="Ashby", remote=j.get("isRemote")) for j in d["jobs"]]
def scan(slug, insurance):
    out, hit = [], []
    for fn in (greenhouse, lever, ashby):
        r = fn(slug)
        if r: hit.append(fn.__name__); out += r
    keep = []
    for j in out:
        t = j["title"]
        is_ae = bool(TITLE.search(t))
        if is_ae or (insurance and ADJ.search(t)):
            j["insurance"] = insurance or bool(INS_WORDS.search(j["company"]))
            j["role_type"] = "Analytics Engineer" if is_ae else "Adjacent data role"
            j["remote"] = bool(j.get("remote")) or "remote" in (j["location"] or "").lower()
            keep.append(j)
    return slug, hit, keep
def main():
    tasks = [(s, True) for s in INSURANCE] + [(s, False) for s in GENERAL]
    jobs, boards = [], {}
    with cf.ThreadPoolExecutor(24) as ex:
        for slug, hit, keep in ex.map(lambda a: scan(*a), tasks):
            if hit: boards[slug] = hit
            jobs += keep
    seen, uniq = set(), []
    for j in jobs:
        k = j["url"].split("?")[0].lower()
        k2 = (j["company"].lower(), j["title"].lower(), (j["location"] or "").lower())
        if k in seen or k2 in seen: continue
        seen |= {k, k2}; uniq.append(j)
    uniq.sort(key=lambda j: (not j["insurance"], j["role_type"] != "Analytics Engineer", -(int(j["posted"].replace("-","") or 0))))
    data = dict(generated=dt.datetime.now(dt.timezone.utc).isoformat(timespec="seconds"), boards_found=boards,
                count=len(uniq), insurance_count=sum(j["insurance"] for j in uniq), jobs=uniq)
    json.dump(data, open(os.path.join(ROOT, "jobs.json"), "w"), indent=1)
    open(os.path.join(ROOT, "jobs.js"), "w").write("window.JOBS_FALLBACK = " + json.dumps(data) + ";\n")
    print(f"boards responding: {len(boards)} | jobs: {len(uniq)} | insurance: {data['insurance_count']} | AE titles: {sum(j['role_type']=='Analytics Engineer' for j in uniq)}")
if __name__ == "__main__": main()
