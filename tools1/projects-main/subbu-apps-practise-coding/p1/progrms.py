'''
# interst
p=float(input("Principle:"))
t=float(input("time(months):"))
r=float(input("interst:"))
si=(p*t*r)/100
ci=p*(pow((1+r/100),t))-p
print("si:",si,round(si))
print("ci:",round(ci))

# sum of numbers
n=int(input("n:"))
s1=[x for x in range(n+1)]
s2=[x*x for x in range(n+1)]
s3=[x**3 for x in range(n+1)]
print(s1)
print(s2)
print(s3)
print(sum(s1),sum(s2),sum(s3))

# area of circle
import math
r=float(input("radius:"))
A=math.pi*r*r
C=2*math.pi*r
print("area ",A)
print("circumference ",C)

# area of rectangle
length=float(input("length:"))
breadth=float(input("breadth:"))
AR=length*breadth
print(AR)
height=float(input("height:"))
v=length*breadth*height
print(v)

# display power of n
n=int(input("enter number:"))
t=int(input("no of terms:"))
#r=list(map(lambda x:n**x,range(t)))
r=[n**x for x in range(t)]
print("total terms are:",t)
print(r)

# factors of number
n=int(input("enter number:"))
f=[i for i in range(1,n+1) if (n%i==0)]
print(f)
'''

# decimal to binary
n=int(input("decimal no:"))
t=n
b=""
while t>0:
    d=t%2
    b=str(d)+b
    t//=2
print(b)