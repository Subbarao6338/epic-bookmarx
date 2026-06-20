
# add elemnts to array
l=[]
s=int(input("size:"))
print("array elements:")
for n in range(s):
    ele=int(input())
    l.append(ele)
print(l)
'''
print(min(l))
print(max(l))
print(sum(l))
print(max(l)-min(l))
a=sum(l)/s
print(a)
l.sort()
print(l)

# left rotation
def lR(arr,d,n):
    for i in range(d):
        temp=arr[0]
        for j in range(n-1):
            arr[j]=arr[j+1]
        arr[n-1]=temp
def RR(arr1,d1,n1):
    for i in range(d1):
        last=arr1[s-1]
        for j in range(n1-1,-1,-1):
            arr1[j]=arr1[j-1]
        arr1[0]=last
r=int(input("no of rotated terms:"))
lR(l,r,s)
print(l)
RR(l,r,s)
print(l)

# copy elements
l2=[]
l2=l
print(l2)

# frequency of each element
#1
for i in range(s):
    c=0
    for j in range(s):
        if(l[j]==l[i]):
            c+=1
    print("frequency of ",l[i]," is:",c)
#2    
for k in range(s):
    print(l[k],"-",l.count(l[k]))

# remove duplicates
a1=set(l)
a2=list(a1)
print(a1,a2)

#reverse list
print(sorted(l))
print(sorted(l,reverse=True))
print(l[::-1])

# even and odd elements
[print("odd",l[i]) for i in range(0,s,2)]
[print("even",l[i]) for i in range(1,s,2)]
'''
