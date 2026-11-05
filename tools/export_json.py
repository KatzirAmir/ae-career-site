"""Export problems_pg.py / lessons_pg.py to JSON for build_pg.mjs."""
import json, os
from problems_pg import P
from lessons_pg import M
os.makedirs('build', exist_ok=True)
# Official LeetCode titles (verified via leetcode.com GraphQL; pages are free problems).
TITLES = {
 "https://leetcode.com/problems/customers-who-never-order/": "LeetCode: Customers Who Never Order",
 "https://leetcode.com/problems/employees-earning-more-than-their-managers/": "LeetCode: Employees Earning More Than Their Managers",
 "https://leetcode.com/problems/department-highest-salary/": "LeetCode: Department Highest Salary",
 "https://leetcode.com/problems/rank-scores/": "LeetCode: Rank Scores",
 "https://leetcode.com/problems/department-top-three-salaries/": "LeetCode: Department Top Three Salaries",
 "https://leetcode.com/problems/last-person-to-fit-in-the-bus/": "LeetCode: Last Person to Fit in the Bus",
 "https://leetcode.com/problems/reformat-department-table/": "LeetCode: Reformat Department Table",
 "https://leetcode.com/problems/monthly-transactions-i/": "LeetCode: Monthly Transactions I",
 "https://leetcode.com/problems/second-highest-salary/": "LeetCode: Second Highest Salary",
 "https://leetcode.com/problems/restaurant-growth/": "LeetCode: Restaurant Growth",
 "https://leetcode.com/problems/immediate-food-delivery-ii/": "LeetCode: Immediate Food Delivery II",
 "https://leetcode.com/problems/consecutive-numbers/": "LeetCode: Consecutive Numbers",
 "https://leetcode.com/problems/duplicate-emails/": "LeetCode: Duplicate Emails",
 "https://leetcode.com/problems/customers-who-bought-all-products/": "LeetCode: Customers Who Bought All Products",
 "https://leetcode.com/problems/game-play-analysis-i/": "LeetCode: Game Play Analysis I",
 "https://leetcode.com/problems/user-activity-for-the-past-30-days-i/": "LeetCode: User Activity for the Past 30 Days I"
}
def lc_title(url):
    return TITLES[url]
out = []
for i, (tier, topic, title, prompt, hint, sol, expl, ordered, sim) in enumerate(P, 1):
    out.append(dict(id=f"q{i}", tier=tier, topic=topic, title=title, prompt=prompt, hint=hint, solution=sol,
                    explanation=expl, ordered=ordered, similar={'url': sim, 'title': lc_title(sim)} if sim else None))
json.dump(out, open('build/p.json', 'w'))
L = [dict(title=m[0], lessons=[dict(id=l[0], title=l[1], body=l[2], example=l[3], prompt=l[4], solution=l[5], ordered=l[6]) for l in m[1]]) for m in M]
json.dump(L, open('build/l.json', 'w'))
print(len(out), 'problems,', sum(len(m['lessons']) for m in L), 'lessons')
