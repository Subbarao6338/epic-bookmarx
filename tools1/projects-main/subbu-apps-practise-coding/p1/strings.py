# palindrome
s1=str(input("enter string:"))
s2=s1.casefold()
print(s1)

v=['a','e','i','o','u','A','E','I','O','U']

# count vowels
cv={}.fromkeys(v,0)
for i in s1:
    if i in cv:
        cv[i]+=1
print(cv)
l=list(s1)
s3=""
co=0
for i in range(0,len(s1)):
    if(l[i] in v):
        co+=1
        t=l[i]
        s3=s3+t
print(co,s3)
# remove duplicate vowels
l2=list(s3)
l3=set(l2)
l4=list(l3)
l4.append(l3)
print(l2,l3,l4)
# frequency of each vowel
for i in range(0,len(l2)):
    c1=0
    for j in range(0,len(l2)):
        if(l2[j]==l2[i]):
            c1+=1
    print("frequency ",l2[i],':',c1)
'''
rs=reversed(s1)
if(list(s1)==list(rs)):
    print("palindrome")
else:
    print("not palindrome")

# first one character
fc=s1[:1]
print(fc)
# last one character
lc=s1[-1:]
print(lc)
# everything except first char
ef=s1[1:]
print(ef)
# everything except last char
el=s1[:-1]
print(el)
# everything b/w first and last two char
bt=s1[2:-2]
print(bt)
# skip one char
so=s1[0:len(s1):2]
print(so)
# reverse string
rs=s1[::-1]
print(rs)
# no of char or string
from collections import Counter
a=str(input("str:"))
c=Counter(s1)
print(c[a])
#swap , and .
s1=s1.replace(',','t')
s1=s1.replace('.',',')
s1=s1.replace('t','.')
print(s1)
# convert string to list
li=list(s1)
print(li)
'''
