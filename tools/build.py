import json, sqlite3
from problems import P
seed=open('seed.sql').read()
db=sqlite3.connect(':memory:'); db.executescript(seed)
out=[]
for i,(tier,topic,title,prompt,hint,sol,expl,ordered) in enumerate(P,1):
    rows=db.execute(sol).fetchall()
    print(i,tier,len(rows),title)
    out.append(dict(id=f"q{i}",tier=tier,topic=topic,title=title,prompt=prompt,hint=hint,solution=sol,explanation=expl,ordered=ordered))
open('../problems.js','w').write("window.SEED_SQL="+json.dumps(seed)+";\nwindow.PROBLEMS="+json.dumps(out,indent=0)+";\n")
print(len(out), {t:sum(p['tier']==t for p in out) for t in ['easy','medium','hard']}, sqlite3.sqlite_version)
