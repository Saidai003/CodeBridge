export interface HoverInfo {
  description: string;
  docUrl: string;
  signature?: string;
}

export const pythonKeywords: Record<string, HoverInfo> = {
  'print': {
    description: 'Output text or values to the console.',
    docUrl: 'https://docs.python.org/3/library/functions.html#print',
    signature: 'print(*objects, sep=\' \', end=\'\\n\')'
  },
  'len': {
    description: 'Return the number of items in a container.',
    docUrl: 'https://docs.python.org/3/library/functions.html#len',
    signature: 'len(s) -> int'
  },
  'range': {
    description: 'Generate a sequence of numbers. Commonly used in for loops.',
    docUrl: 'https://docs.python.org/3/library/functions.html#func-range',
    signature: 'range(stop) or range(start, stop[, step])'
  },
  'for': {
    description: 'Loop over items in an iterable (list, string, range, etc.).',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-for-statement',
  },
  'while': {
    description: 'Repeat a block of code while a condition is true.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-while-statement',
  },
  'if': {
    description: 'Execute a block of code only if a condition is true.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-if-statement',
  },
  'elif': {
    description: 'Additional condition to check if the previous if/elif was false.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-if-statement',
  },
  'else': {
    description: 'Execute when no previous if/elif condition was true.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-if-statement',
  },
  'def': {
    description: 'Define a new function.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#function-definitions',
  },
  'return': {
    description: 'Exit a function and optionally return a value.',
    docUrl: 'https://docs.python.org/3/reference/simple_stmts.html#the-return-statement',
  },
  'import': {
    description: 'Import a module to use its functions and classes.',
    docUrl: 'https://docs.python.org/3/reference/simple_stmts.html#the-import-statement',
  },
  'class': {
    description: 'Define a new class (blueprint for creating objects).',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#class-definitions',
  },
  'True': {
    description: 'Boolean value representing truth.',
    docUrl: 'https://docs.python.org/3/library/stdtypes.html#truth-value-testing',
  },
  'False': {
    description: 'Boolean value representing falsehood.',
    docUrl: 'https://docs.python.org/3/library/stdtypes.html#truth-value-testing',
  },
  'None': {
    description: 'Represents the absence of a value.',
    docUrl: 'https://docs.python.org/3/library/stdtypes.html#the-null-object',
  },
  'and': {
    description: 'Logical AND operator. Returns True if both operands are true.',
    docUrl: 'https://docs.python.org/3/library/stdtypes.html#boolean-operations',
  },
  'or': {
    description: 'Logical OR operator. Returns True if at least one operand is true.',
    docUrl: 'https://docs.python.org/3/library/stdtypes.html#boolean-operations',
  },
  'not': {
    description: 'Logical NOT operator. Inverts the boolean value.',
    docUrl: 'https://docs.python.org/3/library/stdtypes.html#boolean-operations',
  },
  'in': {
    description: 'Check if a value exists in a sequence (list, string, etc.).',
    docUrl: 'https://docs.python.org/3/reference/expressions.html#membership-test-operations',
  },
  'int': {
    description: 'Convert a value to an integer number.',
    docUrl: 'https://docs.python.org/3/library/functions.html#int',
    signature: 'int(x, base=10) -> int'
  },
  'float': {
    description: 'Convert a value to a floating-point number.',
    docUrl: 'https://docs.python.org/3/library/functions.html#float',
    signature: 'float(x) -> float'
  },
  'str': {
    description: 'Convert a value to a string (text).',
    docUrl: 'https://docs.python.org/3/library/functions.html#str',
    signature: 'str(object) -> str'
  },
  'list': {
    description: 'Create a new list or convert an iterable to a list.',
    docUrl: 'https://docs.python.org/3/library/functions.html#func-list',
    signature: 'list([iterable]) -> list'
  },
  'dict': {
    description: 'Create a new dictionary (key-value pairs).',
    docUrl: 'https://docs.python.org/3/library/functions.html#func-dict',
    signature: 'dict(**kwargs) -> dict'
  },
  'input': {
    description: 'Read a line of text from the user.',
    docUrl: 'https://docs.python.org/3/library/functions.html#input',
    signature: 'input([prompt]) -> str'
  },
  'append': {
    description: 'Add an item to the end of a list.',
    docUrl: 'https://docs.python.org/3/tutorial/datastructures.html',
    signature: 'list.append(item) -> None'
  },
  'enumerate': {
    description: 'Loop with both index and value from an iterable.',
    docUrl: 'https://docs.python.org/3/library/functions.html#enumerate',
    signature: 'enumerate(iterable, start=0)'
  },
  'sorted': {
    description: 'Return a new sorted list from the items in iterable.',
    docUrl: 'https://docs.python.org/3/library/functions.html#sorted',
    signature: 'sorted(iterable, *, key=None, reverse=False) -> list'
  },
  'max': {
    description: 'Return the largest item in an iterable or between arguments.',
    docUrl: 'https://docs.python.org/3/library/functions.html#max',
    signature: 'max(iterable, *[, key, default])'
  },
  'min': {
    description: 'Return the smallest item in an iterable or between arguments.',
    docUrl: 'https://docs.python.org/3/library/functions.html#min',
    signature: 'min(iterable, *[, key, default])'
  },
  'sum': {
    description: 'Add all items in an iterable and return the total.',
    docUrl: 'https://docs.python.org/3/library/functions.html#sum',
    signature: 'sum(iterable, /, start=0)'
  },
  'abs': {
    description: 'Return the absolute value of a number.',
    docUrl: 'https://docs.python.org/3/library/functions.html#abs',
    signature: 'abs(x)'
  },
  'try': {
    description: 'Catch and handle exceptions (errors) in code.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-try-statement',
  },
  'except': {
    description: 'Handle a specific type of exception.',
    docUrl: 'https://docs.python.org/3/reference/compound_stmts.html#the-try-statement',
  },
  'break': {
    description: 'Exit the innermost loop immediately.',
    docUrl: 'https://docs.python.org/3/reference/simple_stmts.html#the-break-statement',
  },
  'continue': {
    description: 'Skip the rest of the current loop iteration.',
    docUrl: 'https://docs.python.org/3/reference/simple_stmts.html#the-continue-statement',
  },
  'lambda': {
    description: 'Create a small anonymous function.',
    docUrl: 'https://docs.python.org/3/reference/expressions.html#lambda',
    signature: 'lambda arguments: expression'
  },
  'map': {
    description: 'Apply a function to every item in an iterable.',
    docUrl: 'https://docs.python.org/3/library/functions.html#map',
    signature: 'map(function, iterable, ...) -> map'
  },
  'filter': {
    description: 'Filter items from an iterable based on a function.',
    docUrl: 'https://docs.python.org/3/library/functions.html#filter',
    signature: 'filter(function, iterable) -> filter'
  },
};

export function getHoverInfo(word: string): HoverInfo | null {
  return pythonKeywords[word] || null;
}
