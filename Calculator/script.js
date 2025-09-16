class Calculator {
    constructor(previousOperandElement, currentOperandElement) {
        this.previousOperandElement = previousOperandElement;
        this.currentOperandElement = currentOperandElement;
        this.clear();
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operation = undefined;
        this.shouldResetScreen = false;
    }

    delete() {
        if (this.currentOperand.length === 1) {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.toString().slice(0, -1);
        }
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }
        
        if (number === '.' && this.currentOperand.includes('.')) return;
        
        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number.toString();
        } else {
            this.currentOperand = this.currentOperand.toString() + number.toString();
        }
    }

    chooseOperation(operation) {
        if (this.currentOperand === '') return;
        
        if (this.previousOperand !== '') {
            this.compute();
        }
        
        this.operation = operation;
        this.previousOperand = this.currentOperand;
        this.currentOperand = '';
    }

    compute() {
        let computation;
        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (this.operation) {
            case 'add':
                computation = prev + current;
                break;
            case 'subtract':
                computation = prev - current;
                break;
            case 'multiply':
                computation = prev * current;
                break;
            case 'divide':
                if (current === 0) {
                    alert('Cannot divide by zero!');
                    this.clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        // Round to prevent floating point errors
        computation = Math.round((computation + Number.EPSILON) * 100000000) / 100000000;
        
        this.currentOperand = computation.toString();
        this.operation = undefined;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    percentage() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }

    getDisplayNumber(number) {
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('en', {
                maximumFractionDigits: 0
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }

    updateDisplay() {
        this.currentOperandElement.innerText = this.getDisplayNumber(this.currentOperand);
        
        if (this.operation != null) {
            const operationSymbols = {
                'add': '+',
                'subtract': '−',
                'multiply': '×',
                'divide': '÷'
            };
            this.previousOperandElement.innerText = 
                `${this.getDisplayNumber(this.previousOperand)} ${operationSymbols[this.operation]}`;
        } else {
            this.previousOperandElement.innerText = '';
        }
        
        // Update operator button states
        document.querySelectorAll('.btn.operator').forEach(btn => {
            btn.classList.remove('active');
            if (this.operation && btn.dataset.action === this.operation) {
                btn.classList.add('active');
            }
        });
    }
}

// Initialize calculator
const previousOperandElement = document.getElementById('previous-operand');
const currentOperandElement = document.getElementById('current-operand');
const calculator = new Calculator(previousOperandElement, currentOperandElement);

// Button event listeners
document.querySelectorAll('[data-number]').forEach(button => {
    button.addEventListener('click', () => {
        calculator.appendNumber(button.dataset.number);
        calculator.updateDisplay();
        animateButton(button);
    });
});

document.querySelectorAll('[data-action]').forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        switch(action) {
            case 'clear':
                calculator.clear();
                break;
            case 'delete':
                calculator.delete();
                break;
            case 'equals':
                calculator.compute();
                break;
            case 'decimal':
                calculator.appendNumber('.');
                break;
            case 'percent':
                calculator.percentage();
                break;
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                calculator.chooseOperation(action);
                break;
        }
        
        calculator.updateDisplay();
        animateButton(button);
    });
});

// Button animation
function animateButton(button) {
    button.classList.add('pressed');
    setTimeout(() => {
        button.classList.remove('pressed');
    }, 100);
}

// Keyboard support
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Prevent default for calculator keys
    if (/[0-9+\-*/.=%]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault();
    }
    
    // Numbers
    if (/[0-9]/.test(key)) {
        calculator.appendNumber(key);
        calculator.updateDisplay();
        highlightKey(`[data-number="${key}"]`);
    }
    
    // Operators
    const operatorMap = {
        '+': 'add',
        '-': 'subtract',
        '*': 'multiply',
        '/': 'divide'
    };
    
    if (operatorMap[key]) {
        calculator.chooseOperation(operatorMap[key]);
        calculator.updateDisplay();
        highlightKey(`[data-action="${operatorMap[key]}"]`);
    }
    
    // Other actions
    switch(key) {
        case 'Enter':
        case '=':
            calculator.compute();
            calculator.updateDisplay();
            highlightKey('[data-action="equals"]');
            break;
        case 'Escape':
            calculator.clear();
            calculator.updateDisplay();
            highlightKey('[data-action="clear"]');
            break;
        case 'Backspace':
            calculator.delete();
            calculator.updateDisplay();
            highlightKey('[data-action="delete"]');
            break;
        case '.':
            calculator.appendNumber('.');
            calculator.updateDisplay();
            highlightKey('[data-action="decimal"]');
            break;
        case '%':
            calculator.percentage();
            calculator.updateDisplay();
            highlightKey('[data-action="percent"]');
            break;
    }
});

// Highlight key function for keyboard input
function highlightKey(selector) {
    const button = document.querySelector(selector);
    if (button) {
        animateButton(button);
    }
}

// Initialize display
calculator.updateDisplay();