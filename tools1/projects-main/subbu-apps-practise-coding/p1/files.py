# 1
import sys
for i in range(1,11):
    for j in range(1,11):
        k=i*j
        print(k,end=" ")
    print()

# 2
for l in 'python':
    if l=='h':
        continue
    print(l,end="")

# 3
print()
print(abs(-4))
print(abs(10.2))

# 4
s="this is string example.... wow!!!"
print(s.capitalize())
print(s.center(40,'a'))
print(s.count('s',1,40))

# 5
import calendar
cal=calendar.month(2010,7)
print(cal)
