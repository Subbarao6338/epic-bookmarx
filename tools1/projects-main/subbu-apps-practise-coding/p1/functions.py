# fibonacci
def fib(n):
    result = []
    a, b = 0, 1
    while b < n:
        result.append(b)
        a, b = b, a + b
    return result

print(fib(100))

# K to F temperature
def KtoF(T):
    assert (T<=0),"colder than absolute zero!"
    return ((T-273)*1.8)+32
print(KtoF(273))
print(int(KtoF(505.78)))
print(KtoF(-5))