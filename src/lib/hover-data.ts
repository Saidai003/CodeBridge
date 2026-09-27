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
  // JavaScript/TypeScript keywords
  'const': {
    description: 'Declares a block-scoped constant. The value cannot be reassigned.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/const',
    signature: 'const name = value'
  },
  'let': {
    description: 'Declares a block-scoped variable that can be reassigned.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/let',
    signature: 'let name = value'
  },
  'var': {
    description: 'Declares a function-scoped or globally-scoped variable.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/var',
    signature: 'var name = value'
  },
  'function': {
    description: 'Declares a function with the specified parameters.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/function',
    signature: 'function name(params) { body }'
  },
  'async': {
    description: 'Declares an asynchronous function that returns a Promise.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function',
    signature: 'async function name(params) { body }'
  },
  'await': {
    description: 'Pauses async function execution until a Promise settles.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await',
    signature: 'await promise'
  },
  '=>': {
    description: 'Arrow function expression. Shorter syntax for function expressions.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions',
    signature: '(params) => expression'
  },
  'console': {
    description: 'Provides access to the browser debugging console.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/console',
    signature: 'console.log(), console.error(), etc.'
  },
  'document': {
    description: 'Represents the HTML document loaded in the browser.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Document',
  },
  'window': {
    description: 'Represents the browser window containing the DOM document.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/API/Window',
  },
  'Array': {
    description: 'Global object used to construct arrays (ordered, indexed collections).',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array',
    signature: 'new Array() or []'
  },
  'Object': {
    description: 'Global object for storing key-value pairs.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object',
    signature: 'new Object() or {}'
  },
  'Promise': {
    description: 'Represents the eventual completion of an asynchronous operation.',
    docUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise',
    signature: 'new Promise((resolve, reject) => {})'
  },
  'interface': {
    description: 'TypeScript: Defines the shape of an object (type contract).',
    docUrl: 'https://www.typescriptlang.org/docs/handbook/2/objects.html',
    signature: 'interface Name { prop: type }'
  },
  'type': {
    description: 'TypeScript: Creates a type alias.',
    docUrl: 'https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-aliases',
    signature: 'type Name = Type'
  },
  // Java keywords
  'public': {
    description: 'Access modifier: visible to all classes.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
  },
  'private': {
    description: 'Access modifier: visible only within the declaring class.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
  },
  'protected': {
    description: 'Access modifier: visible within the package and subclasses.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/accesscontrol.html',
  },
  'static': {
    description: 'Belongs to the class rather than instances of the class.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/classvars.html',
  },
  'void': {
    description: 'Indicates that a method does not return any value.',
    docUrl: 'https://docs.oracle.com/javase/specs/jls/se8/html/jls-8.html#jls-8.4.5',
  },
  'new': {
    description: 'Creates a new instance of a class.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/objectcreation.html',
    signature: 'new ClassName(args)'
  },
  'this': {
    description: 'Reference to the current object instance.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/javaOO/thiskey.html',
  },
  'extends': {
    description: 'Indicates that a class inherits from another class.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html',
    signature: 'class Child extends Parent'
  },
  'implements': {
    description: 'Indicates that a class implements an interface.',
    docUrl: 'https://docs.oracle.com/javase/tutorial/java/IandI/createinterface.html',
    signature: 'class Name implements Interface'
  },
  // C/C++ keywords
  'include': {
    description: 'Preprocessor directive to include header files.',
    docUrl: 'https://en.cppreference.com/w/cpp/preprocessor/include',
    signature: '#include <header>'
  },
  'namespace': {
    description: 'C++: Declares a named scope to organize code.',
    docUrl: 'https://en.cppreference.com/w/cpp/language/namespace',
    signature: 'namespace Name { }'
  },
  'std': {
    description: 'C++: The standard namespace containing standard library components.',
    docUrl: 'https://en.cppreference.com/w/cpp/namespace/std',
  },
  'cout': {
    description: 'C++: Standard output stream object.',
    docUrl: 'https://en.cppreference.com/w/cpp/io/cout',
    signature: 'std::cout << value'
  },
  'cin': {
    description: 'C++: Standard input stream object.',
    docUrl: 'https://en.cppreference.com/w/cpp/io/cin',
    signature: 'std::cin >> variable'
  },
  'nullptr': {
    description: 'C++: Pointer literal representing a null pointer.',
    docUrl: 'https://en.cppreference.com/w/cpp/language/nullptr',
  },
  'sizeof': {
    description: 'Returns the size in bytes of a type or variable.',
    docUrl: 'https://en.cppreference.com/w/cpp/language/sizeof',
    signature: 'sizeof(type)'
  },
  // Common functions across languages
  'main': {
    description: 'The entry point of a program where execution begins.',
    docUrl: 'https://en.wikipedia.org/wiki/Main_function',
    signature: 'int main() { }'
  },
  'useState': {
    description: 'React Hook: Adds state to functional components.',
    docUrl: 'https://react.dev/reference/react/useState',
    signature: 'const [state, setState] = useState(initialValue)'
  },
  'useEffect': {
    description: 'React Hook: Synchronizes a component with external systems.',
    docUrl: 'https://react.dev/reference/react/useEffect',
    signature: 'useEffect(() => { }, [deps])'
  },
  'useRef': {
    description: 'React Hook: Returns a mutable ref object that persists across renders.',
    docUrl: 'https://react.dev/reference/react/useRef',
    signature: 'const ref = useRef(initialValue)'
  },
  'useMemo': {
    description: 'React Hook: Caches the result of a calculation between re-renders.',
    docUrl: 'https://react.dev/reference/react/useMemo',
    signature: 'const memoized = useMemo(() => compute(), [deps])'
  },
  'useCallback': {
    description: 'React Hook: Caches a function definition between re-renders.',
    docUrl: 'https://react.dev/reference/react/useCallback',
    signature: 'const fn = useCallback(() => { }, [deps])'
  },
  // Luau (Roblox) keywords and globals
  'game': {
    description: 'Luau/Roblox: The global Game object representing the entire game instance.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/DataModel',
    signature: 'game:GetService("ServiceName")'
  },
  'workspace': {
    description: 'Luau/Roblox: Container for all 3D objects (parts, models) in the game world.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/Workspace',
  },
  'Instance': {
    description: 'Luau/Roblox: Base class for all objects in the Roblox engine.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/Instance',
    signature: 'Instance.new("ClassName")'
  },
  'Part': {
    description: 'Luau/Roblox: A basic 3D building block (cube, sphere, etc.).',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/BasePart',
  },
  'Model': {
    description: 'Luau/Roblox: A container for grouping multiple parts together.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/Model',
  },
  'script': {
    description: 'Luau/Roblox: Reference to the Script object containing this code.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/Script',
  },
  'wait': {
    description: 'Luau/Roblox: Pauses execution for a specified number of seconds.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/globals/RobloxGlobals',
    signature: 'wait(seconds)'
  },
  'spawn': {
    description: 'Luau/Roblox: Runs a function in a new thread (coroutine).',
    docUrl: 'https://create.roblox.com/docs/reference/engine/globals/RobloxGlobals',
    signature: 'spawn(function)'
  },
  'task': {
    description: 'Luau/Roblox: Library for managing tasks and coroutines.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/libraries/task',
    signature: 'task.wait(), task.spawn(), task.defer()'
  },
  'GetService': {
    description: 'Luau/Roblox: Returns a service from the game (e.g., Players, ReplicatedStorage).',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/DataModel',
    signature: 'game:GetService("ServiceName")'
  },
  'Players': {
    description: 'Luau/Roblox: Service that manages all players in the game.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/Players',
    signature: 'game:GetService("Players")'
  },
  'ReplicatedStorage': {
    description: 'Luau/Roblox: Container shared between server and all clients.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/ReplicatedStorage',
  },
  'ServerScriptService': {
    description: 'Luau/Roblox: Container for scripts that run only on the server.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/ServerScriptService',
  },
  'StarterGui': {
    description: 'Luau/Roblox: Container for UI elements that appear when players join.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/StarterGui',
  },
  'LocalScript': {
    description: 'Luau/Roblox: A script that runs only on the client (player\'s device).',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/LocalScript',
  },
  'RemoteEvent': {
    description: 'Luau/Roblox: Object for communication between client and server.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/RemoteEvent',
    signature: 'event:FireServer(), event:FireClient()'
  },
  'BindableEvent': {
    description: 'Luau/Roblox: Object for communication between scripts in the same context.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/BindableEvent',
  },
  'TweenService': {
    description: 'Luau/Roblox: Service for creating smooth animations and transitions.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/TweenService',
    signature: 'TweenService:Create(object, tweenInfo, goal)'
  },
  'UserInputService': {
    description: 'Luau/Roblox: Service for detecting player input (keyboard, mouse, touch).',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/UserInputService',
  },
  'RunService': {
    description: 'Luau/Roblox: Service for running code every frame or at specific intervals.',
    docUrl: 'https://create.roblox.com/docs/reference/engine/classes/RunService',
    signature: 'RunService.Heartbeat:Connect(function)'
  },
  // C# Unity keywords and classes
  'MonoBehaviour': {
    description: 'Unity: Base class for all scripts attached to GameObjects.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.html',
    signature: 'public class MyScript : MonoBehaviour'
  },
  'GameObject': {
    description: 'Unity: The fundamental object in Unity scenes. Everything is a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/GameObject.html',
    signature: 'GameObject obj = new GameObject("Name")'
  },
  'Transform': {
    description: 'Unity: Component that stores position, rotation, and scale of a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Transform.html',
    signature: 'transform.position, transform.rotation'
  },
  'Vector3': {
    description: 'Unity: Represents a 3D vector (x, y, z). Used for positions, directions, etc.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Vector3.html',
    signature: 'Vector3(x, y, z)'
  },
  'Vector2': {
    description: 'Unity: Represents a 2D vector (x, y). Used for UI, 2D games, etc.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Vector2.html',
    signature: 'Vector2(x, y)'
  },
  'Quaternion': {
    description: 'Unity: Represents a rotation in 3D space.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Quaternion.html',
    signature: 'Quaternion.Euler(x, y, z)'
  },
  'Rigidbody': {
    description: 'Unity: Component that enables physics simulation on a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Rigidbody.html',
    signature: 'rigidbody.velocity, rigidbody.AddForce()'
  },
  'Collider': {
    description: 'Unity: Component that defines the shape for physics collisions.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Collider.html',
  },
  'Collider2D': {
    description: 'Unity: 2D version of Collider for 2D physics.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Collider2D.html',
  },
  'Rigidbody2D': {
    description: 'Unity: 2D version of Rigidbody for 2D physics.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Rigidbody2D.html',
  },
  'AudioSource': {
    description: 'Unity: Component that plays audio clips.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/AudioSource.html',
    signature: 'audioSource.Play(), audioSource.clip'
  },
  'AudioClip': {
    description: 'Unity: Container for audio data.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/AudioClip.html',
  },
  'Camera': {
    description: 'Unity: Component that renders the scene to the screen.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Camera.html',
    signature: 'Camera.main'
  },
  'Light': {
    description: 'Unity: Component that emits light in the scene.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Light.html',
  },
  'Renderer': {
    description: 'Unity: Component that renders a GameObject visually.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Renderer.html',
  },
  'MeshRenderer': {
    description: 'Unity: Renders a mesh (3D model) on a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MeshRenderer.html',
  },
  'SpriteRenderer': {
    description: 'Unity: Renders a 2D sprite on a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/SpriteRenderer.html',
  },
  'Animator': {
    description: 'Unity: Component that controls animations on a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Animator.html',
    signature: 'animator.SetTrigger(), animator.SetBool()'
  },
  'Animation': {
    description: 'Unity: Legacy animation component (use Animator for new projects).',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Animation.html',
  },
  'Input': {
    description: 'Unity: Class for detecting player input (keyboard, mouse, gamepad).',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Input.html',
    signature: 'Input.GetKeyDown(), Input.GetMouseButton()'
  },
  'Time': {
    description: 'Unity: Class for accessing time-related information.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Time.html',
    signature: 'Time.deltaTime, Time.time'
  },
  'Debug': {
    description: 'Unity: Class for logging messages to the console.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Debug.html',
    signature: 'Debug.Log(), Debug.LogWarning(), Debug.LogError()'
  },
  'Start': {
    description: 'Unity: Called once when the script starts (before first Update).',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.Start.html',
    signature: 'void Start() { }'
  },
  'Update': {
    description: 'Unity: Called every frame. Use for game logic.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.Update.html',
    signature: 'void Update() { }'
  },
  'FixedUpdate': {
    description: 'Unity: Called at fixed intervals (for physics). Independent of frame rate.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.FixedUpdate.html',
    signature: 'void FixedUpdate() { }'
  },
  'OnCollisionEnter': {
    description: 'Unity: Called when this collider/rigidbody touches another.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnCollisionEnter.html',
    signature: 'void OnCollisionEnter(Collision collision) { }'
  },
  'OnTriggerEnter': {
    description: 'Unity: Called when another collider enters this trigger volume.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnTriggerEnter.html',
    signature: 'void OnTriggerEnter(Collider other) { }'
  },
  'GetComponent': {
    description: 'Unity: Returns a component of a specific type from a GameObject.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/GameObject.GetComponent.html',
    signature: 'GetComponent<Type>()'
  },
  'Instantiate': {
    description: 'Unity: Creates a copy of an object (prefab, GameObject, etc.).',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Object.Instantiate.html',
    signature: 'Instantiate(prefab, position, rotation)'
  },
  'Destroy': {
    description: 'Unity: Removes a GameObject or component from the scene.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/Object.Destroy.html',
    signature: 'Destroy(gameObject, delay)'
  },
  'SerializeField': {
    description: 'Unity: Attribute that makes a private field visible in the Inspector.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/SerializeField.html',
    signature: '[SerializeField] private int value;'
  },
  'HideInInspector': {
    description: 'Unity: Attribute that hides a public field from the Inspector.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/HideInInspector.html',
    signature: '[HideInInspector] public int value;'
  },
  'RequireComponent': {
    description: 'Unity: Attribute that automatically adds required components.',
    docUrl: 'https://docs.unity3d.com/ScriptReference/RequireComponent.html',
    signature: '[RequireComponent(typeof(Rigidbody))]'
  },
};

export function getHoverInfo(word: string): HoverInfo | null {
  return pythonKeywords[word] || null;
}
