# 1
class employee:
    empCount=0
    def __init__(self,name,salary):
        self.name=name
        self.salary=salary
        employee.empCount+=1
    def displayCount(self):
        print("total emplyee:",employee.empCount)
    def displayEmployee(self):
        print("name:",self.name, ",salary:",self.salary)

emp1=employee("zara",2000)
emp2=employee("mani",5000)
emp1.displayEmployee()
emp2.displayEmployee()
print("total employee",employee.empCount)
print(employee.__doc__)

# 2
class vector:
    def __init__(self,a,b):
        self.a=a
        self.b=b
    def __str__(self):
        return vector(self.a,self.b)
    def __add__(self, other):
        return vector(self.a+other.a,self.b+other.b)
v1=vector(2,10)
v2=vector(5,-2)
print(v1+v2)
