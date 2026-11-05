import random, datetime as dt
random.seed(7)
D=lambda s:dt.date.fromisoformat(s)
def ds(d): return d.isoformat()
L=[]
L.append("""CREATE TABLE customers(customer_id INT PRIMARY KEY, name TEXT, signup_date DATE, state TEXT, referred_by INT);
CREATE TABLE policies(policy_id INT PRIMARY KEY, customer_id INT, product TEXT, state TEXT, effective_date DATE, expiration_date DATE, premium NUMERIC(12,2), status TEXT);
CREATE TABLE claims(claim_id INT PRIMARY KEY, policy_id INT, loss_date DATE, report_date DATE, status TEXT, cause TEXT, paid_amount NUMERIC(12,2), reserve_amount NUMERIC(12,2));
CREATE TABLE quotes(quote_id INT PRIMARY KEY, customer_id INT, product TEXT, quote_date DATE, quoted_premium NUMERIC(12,2), bound BOOLEAN);
CREATE TABLE users(user_id INT PRIMARY KEY, signup_date DATE, country TEXT, plan TEXT);
CREATE TABLE orders(order_id INT PRIMARY KEY, user_id INT, order_date DATE, amount NUMERIC(12,2), status TEXT);
CREATE TABLE events(user_id INT, event_date DATE, event_type TEXT);
CREATE TABLE employees(emp_id INT PRIMARY KEY, name TEXT, dept TEXT, manager_id INT, salary INT, hire_date DATE);
CREATE TABLE logins(user_id INT, login_date DATE);""")
names=["Ava","Ben","Cara","Dev","Eli","Fay","Gus","Hana","Ivan","Jo","Kai","Lena"]
states=["CA","TX","NY","FL","CA","TX","NY","CA","FL","TX","CA","NY"]
for i,n in enumerate(names,1):
    ref = "NULL" if i<4 or i%3 else str(random.randint(1,i-1))
    L.append(f"INSERT INTO customers VALUES({i},'{n}','{ds(D('2024-01-05')+dt.timedelta(days=37*i))}','{states[i-1]}',{ref});")
prods=["GL","WC","BOP","Auto"]; pid=100; pols=[]
for c in range(1,13):
    start=D('2024-02-01')+dt.timedelta(days=37*c+random.randint(0,20))
    for t in range(random.randint(1,3)):
        pid+=1; p=prods[(c+t)%4] if t==0 else pols[-1][2]
        eff=start+dt.timedelta(days=365*t+(random.choice([0,0,0,45]) if t else 0)); exp=eff+dt.timedelta(days=365)
        st="CANCELLED" if random.random()<.15 else ("ACTIVE" if exp>D('2026-06-30') else "EXPIRED")
        prem=round(random.choice([800,1200,1500,2400,3600])*random.uniform(.9,1.2),2)
        pols.append((pid,c,p,states[c-1],eff,exp,prem,st))
        L.append(f"INSERT INTO policies VALUES({pid},{c},'{p}','{states[c-1]}','{ds(eff)}','{ds(exp)}',{prem},'{st}');")
causes=["Water","Fire","Theft","Injury","Collision"]
for k in range(1,23):
    p=random.choice(pols); loss=p[4]+dt.timedelta(days=random.randint(3,330)); rep=loss+dt.timedelta(days=random.choice([0,1,2,5,9,30,60]))
    stt=random.choice(["OPEN","CLOSED","CLOSED"]); paid=round(random.uniform(200,9000),2); res=0 if stt=="CLOSED" else round(random.uniform(500,6000),2)
    L.append(f"INSERT INTO claims VALUES({k},{p[0]},'{ds(loss)}','{ds(rep)}','{stt}','{random.choice(causes)}',{paid},{res});")
L.append("INSERT INTO claims VALUES(23,101,'2024-05-01','2024-05-02','CLOSED','Water',1500.0,0);")  
L.append("INSERT INTO claims VALUES(24,101,'2024-05-03','2024-05-03','OPEN','Water',0,1500.0);")
for q in range(1,31):
    c=random.randint(1,12); d=D('2024-01-10')+dt.timedelta(days=random.randint(0,800))
    L.append(f"INSERT INTO quotes VALUES({q},{c},'{random.choice(prods)}','{ds(d)}',{round(random.uniform(700,4000),2)},{'TRUE' if random.random()<.4 else 'FALSE'});")
countries=["US","US","UK","CA","US","DE","UK","US","CA","US","DE","US"]
for u in range(1,13):
    L.append(f"INSERT INTO users VALUES({u},'{ds(D('2025-01-03')+dt.timedelta(days=random.randint(0,150)))}','{countries[u-1]}','{random.choice(['free','pro','team'])}');")
for o in range(1,41):
    u=random.randint(1,12); d=D('2025-01-05')+dt.timedelta(days=random.randint(0,300))
    L.append(f"INSERT INTO orders VALUES({o},{u},'{ds(d)}',{round(random.uniform(10,500),2)},'{random.choice(['complete','complete','complete','refunded'])}');")
for u in range(1,13):
    d=D('2025-03-01')+dt.timedelta(days=random.randint(0,20)); steps=["visit","signup","add_to_cart","purchase"]
    n=random.randint(1,4)
    for s in steps[:n]:
        L.append(f"INSERT INTO events VALUES({u},'{ds(d)}','{s}');"); d+=dt.timedelta(days=random.randint(0,3))
    if random.random()<.3: L.append(f"INSERT INTO events VALUES({u},'{ds(d)}','visit');")
emps=[(1,"Mira","Exec",None,250000),(2,"Raj","Data",1,190000),(3,"Sol","Eng",1,200000),(4,"Tess","Data",2,150000),(5,"Uma","Data",2,155000),(6,"Vic","Data",4,120000),(7,"Wes","Eng",3,165000),(8,"Xia","Eng",3,170000),(9,"Yuri","Eng",7,130000),(10,"Zoe","Data",4,160000),(11,"Ari","Eng",7,170000)]
for e in emps:
    L.append(f"INSERT INTO employees VALUES({e[0]},'{e[1]}','{e[2]}',{e[3] if e[3] else 'NULL'},{e[4]},'{ds(D('2019-01-01')+dt.timedelta(days=211*e[0]))}');")
for u in range(1,9):
    d=D('2025-06-01')
    for k in range(random.randint(4,9)):
        d+=dt.timedelta(days=random.choice([1,1,1,2,5])); L.append(f"INSERT INTO logins VALUES({u},'{ds(d)}');")
        if random.random()<.1: L.append(f"INSERT INTO logins VALUES({u},'{ds(d)}');")
open("seed.sql","w").write("\n".join(L))
