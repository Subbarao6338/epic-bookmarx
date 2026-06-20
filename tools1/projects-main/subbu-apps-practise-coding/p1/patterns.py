n=int(input("pattern lines:"))
#1
for i in range(n):
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#2
for i in range(n):
    for j in range(i,n):
        print("*",end=" ")
    print("\r")
#3
k=2*n-2
for i in range(n):
    for j in range(0,k):
        print(end=" ")
    k=k-2
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#4
k=2*n-2
for i in range(n):
    for j in range(0,k):
        print(end=" ")
    k=k-1
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#5
for i in range(1,n+1):
    for j in range(1,i+1):
        print(i,end=" ")
    print("\r")
#6
for i in range(1,n+1):
    for j in range(1,i+1):
        print(j,end=" ")
    print("\r")
#7
k=1
for i in range(1,n+1):
    for j in range(1,i+1):
        print(k,end=" ")
        k+=1
    print("\r")
#8
k=1
for i in range(0,n):
    for j in range(i,n):
        print(k,end=" ")
        k+=1
    print("\r")
#9
for i in range(0,n):
    for j in range(0,n):
        print("*",end=" ")
    print("\r")
#10
k=2*n-2
for i in range(0,n):
    for j in range(0,k):
        print(end=" ")
    k=k-2
    for j in range(0,i+1):
        print(i+1,end=" ")
    print("\r")
#11
k=2*n-2
for i in range(0,n):
    for j in range(0,k):
        print(end=" ")
    k=k-2
    for j in range(0,i+1):
        print(j+1,end=" ")
    print("\r")
#12
k=2*n-2
for i in range(n,-1,-1):
    for j in range(k,0,-1):
        print(end=" ")
    k=k+1
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#13
for i in range(n):
    for j in range(0,i+1):
        print(".",end=" ")
    print("\r")
for i in range(n,0,-1):
    for j in range(i+1):
        print(".",end=" ")
    print("\r")
print(".")
#14
k=2*n-2
for i in range(0,n-1):
    for j in range(0,k):
        print(end=" ")
    k=k-2
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
k=-1
for i in range(n-1,-1,-1):
    for j in range(k,-1,-1):
        print(end=" ")
    k=k+2
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#15
k=n-2
for i in range(n,-1,-1):
    for j in range(k,0,-1):
        print(end=" ")
    k=k+1
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
k=2*n-2
for i in range(0,n+1):
    for j in range(0,k):
        print(end=" ")
    k=k-1
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#16
for i in range(n,-1,-1):
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#17
k=2*n-2
for i in range(0,n):
    for j in range(0,k):
        print(end=" ")
    k=k-1
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
k=n-2
for i in range(n,-1,-1):
    for j in range(k,0,-1):
        print(end=" ")
    k=k+1
    for j in range(0,i+1):
        print("*",end=" ")
    print("\r")
#18
k=2*n-2
c=0
for i in range(0,n):
    c+=1
    for j in range(0,k):
        print(end=" ")
    k=k-1
    for j in range(0,i+1):
        print(c,end=" ")
    print("\r")
k=n-2
c=n+2
for i in range(n,-1,-1):
    c-=1
    for j in range(k,0,-1):
        print(end=" ")
    k=k+1
    for j in range(0,i+1):
        print(c,end=" ")
    print("\r")
#19
for i in range(n):
    for j in range(n):
        if(i+j==2 or i-j==2 or i+j==6 or j-i==2):
            print("*",end=" ")
        else:
            print(end=" ")
    print()
#20
x=0
for i in range(0,n):
    x+=1
    for j in range(0,i+1):
        print(x,end=" ")
    print("\r")
#21 pascal triangle
r=1
if(k>n-k):
    k=n-k
for i in range(0,k):
    r=r*(n-i)
    r=r//(i+1)

for i in range(0,n):
    for j in range(0,i+1):
        print(r," ",end=" ")
    print()

# Print Pascal's Triangle in Java
from math import factorial

# input n
n = 5
for i in range(n):
	for j in range(n-i+1):

		# for left spacing
		print(end=" ")

	for j in range(i+1):

		# nCr = n!/((n-r)!*r!)
		print(factorial(i)//(factorial(j)*factorial(i-j)), end=" ")

	# for new line
	print()
