'''# fibonacci
# 1.check
import math
def perfectsquare(x):
    s=int(math.sqrt(x))
    if (s*s==x):
        return x
def fib(i):
    s1=perfectsquare(5*i*i+4)
    s2=perfectsquare(5*i*i-4)
    if (s1 or s2):
        print(i,"is fib num")
    else:
        print(i,"is not fib num")
n=int(input("enter number:"))
print(fib(n))
# 2.range
l=int(input("lower range:"))
u=int(input("upper range:"))
for f in range(l,u+1):
    print(fib(f))
'''
# armstrong number
#range
l = int(input("lower range"))
u = int(input("upper range"))
for n in range(l, u + 1):
    s=0
    c=0
    t=n
    while t>0:
        c=c+1
        t=t//10
    s=0
    t=n
    while t>0:
        d=t%10
        s=s+(d**c)
        t//=10
    if n==s:
        print(n,end=" ")

