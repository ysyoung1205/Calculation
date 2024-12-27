from sympy import sympify

def evaluate_expression(expression):
    try:
        return sympify(expression)
    except Exception as e:
        raise ValueError("Invalid expression")