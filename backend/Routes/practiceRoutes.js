import express from 'express';
import { protect } from '../Middlewares/middleware.js';
import UserStats from '../Models/UserStats.js';
import Progress from '../Models/Progress.js';

const router = express.Router();

const questionsDB = {
    javascript: [
        { id:'js_1', title:'Off-by-one Loop', description:'Find the bug in this iteration', codeSnippet:'const arr=[1,2,3];\nfor(let i=0;i<=arr.length;i++){\n  console.log(arr[i]);\n}', options:['i < arr.length is correct','Use i<=arr.length','Initialize i to 1','No bug'], correctAnswer:0, xpReward:20, language:'javascript' },
        { id:'js_2', title:'var Scope in Closure', description:'Why does this print 3,3,3?', codeSnippet:'for(var i=0;i<3;i++){\n  setTimeout(()=>console.log(i),100);\n}', options:['setTimeout is broken','var has function scope; use let','Loop runs too fast','No bug'], correctAnswer:1, xpReward:25, language:'javascript' },
        { id:'js_3', title:'Strict Equality', description:'Why does this comparison fail?', codeSnippet:'console.log(0 == false);  // true\nconsole.log(0 === false); // false\nif(0 == false) doSomething();', options:['== does type coercion, use ===','false is not a boolean','No bug','0 is not falsy'], correctAnswer:0, xpReward:20, language:'javascript' },
        { id:'js_4', title:'Missing return', description:'What is wrong with this function?', codeSnippet:'function double(n){\n  n * 2;\n}', options:['n should be a string','Missing return keyword','n*2 is invalid syntax','No bug'], correctAnswer:1, xpReward:15, language:'javascript' },
        { id:'js_5', title:'Async/Await Error', description:'Why does this crash?', codeSnippet:'async function fetchData(){\n  const res = fetch("/api/data");\n  return res.json();\n}', options:['fetch needs await keyword','json() is wrong','No bug','API path is invalid'], correctAnswer:0, xpReward:30, language:'javascript' },
        { id:'js_6', title:'Array Mutation', description:'Why does arr2 change when arr1 changes?', codeSnippet:'const arr1=[1,2,3];\nconst arr2=arr1;\narr1.push(4);\nconsole.log(arr2);', options:['push mutates both','Arrays are copied by reference','arr2 should use let','No bug'], correctAnswer:1, xpReward:25, language:'javascript' },
        { id:'js_7', title:'NaN Comparison', description:'Why does this always log false?', codeSnippet:'const x = NaN;\nif(x === NaN) console.log("is NaN");', options:['NaN !== NaN; use Number.isNaN()','=== is wrong here','No bug','NaN is undefined'], correctAnswer:0, xpReward:25, language:'javascript' },
        { id:'js_8', title:'Object Key Overwrite', description:'What gets logged?', codeSnippet:'const obj={a:1,a:2};\nconsole.log(obj.a);', options:['1','2 (duplicate keys overwrite)','Error','undefined'], correctAnswer:1, xpReward:15, language:'javascript' },
        { id:'js_9', title:'typeof null', description:'What does this return?', codeSnippet:'console.log(typeof null);', options:['"null"','"object" (JS quirk)','undefined','"boolean"'], correctAnswer:1, xpReward:20, language:'javascript' },
        { id:'js_10', title:'Promise Chain', description:'What is wrong here?', codeSnippet:'fetch("/api")\n  .then(res => res.json)\n  .then(data => console.log(data));', options:['res.json is not called (missing ())', 'fetch is broken','No bug','then chain is wrong'], correctAnswer:0, xpReward:30, language:'javascript' },
        { id:'js_11', title:'Hoisting', description:'Why is x undefined not an error?', codeSnippet:'console.log(x);\nvar x = 5;', options:['var declarations are hoisted (value is not)','console.log throws here','x is global','No bug'], correctAnswer:0, xpReward:20, language:'javascript' },
        { id:'js_12', title:'String Concatenation', description:'Why does this print "12" not 3?', codeSnippet:'const a="1", b="2";\nconsole.log(a+b);', options:['+ concatenates strings; use parseInt','+ is wrong operator','No bug','a is undefined'], correctAnswer:0, xpReward:15, language:'javascript' },
        { id:'js_13', title:'Falsy Check', description:'Which value passes the if?', codeSnippet:'const vals=[0,"",null,false,undefined,NaN,"hello"];\nvals.forEach(v=>{ if(v) console.log(v); });', options:['"hello" only','All values','"" and "hello"','0 and "hello"'], correctAnswer:0, xpReward:20, language:'javascript' },
        { id:'js_14', title:'Object Destructuring', description:'What is wrong?', codeSnippet:'const {name,age}={username:"Alice",age:25};\nconsole.log(name);', options:['name key does not exist (it is username)','Destructuring syntax is wrong','No bug','age is wrong'], correctAnswer:0, xpReward:25, language:'javascript' },
        { id:'js_15', title:'forEach Return', description:'Why does filtered stay empty?', codeSnippet:'const nums=[1,2,3,4];\nconst filtered=[];\nnums.forEach(n=>{\n  if(n>2) return n;\n});\nconsole.log(filtered);', options:['forEach ignores return; use filter()','return is wrong syntax','No bug','nums is empty'], correctAnswer:0, xpReward:25, language:'javascript' },
    ],

    python: [
        { id:'py_1', title:'Mutable Default Argument', description:'Find the bug in this function', codeSnippet:'def add_item(item, items=[]):\n    items.append(item)\n    return items', options:['items.append should be items.add','Default mutable arg is shared across calls','Syntax error on line 1','No bug'], correctAnswer:1, xpReward:30, language:'python' },
        { id:'py_2', title:'Return Inside Loop', description:'Find the logical bug', codeSnippet:'total=0\nfor i in range(5):\n    total+=i\n    return total', options:['range(5) is wrong','return inside loop exits after first iteration','total starts at 0','No bug'], correctAnswer:1, xpReward:20, language:'python' },
        { id:'py_3', title:'Integer Division', description:'Why does this not give 2.5?', codeSnippet:'result = 5 / 2\nprint(result)', options:['In Python 3, / gives float (2.5); this is actually correct','Use // for float','No bug','5 / 2 throws error'], correctAnswer:0, xpReward:15, language:'python' },
        { id:'py_4', title:'List Copy', description:'Why does b change when a changes?', codeSnippet:'a=[1,2,3]\nb=a\na.append(4)\nprint(b)', options:['b=a copies by reference; use b=a.copy()','append mutates the original','No bug','b is immutable'], correctAnswer:0, xpReward:25, language:'python' },
        { id:'py_5', title:'String Immutability', description:'What happens here?', codeSnippet:'s = "hello"\ns[0] = "H"\nprint(s)', options:['Prints "Hello"','TypeError: strings are immutable in Python','No bug','s is undefined'], correctAnswer:1, xpReward:20, language:'python' },
        { id:'py_6', title:'is vs ==', description:'Why does this print False?', codeSnippet:'a = 1000\nb = 1000\nprint(a is b)', options:['is compares identity not value; use ==','1000 is too large','No bug','Both should be True'], correctAnswer:0, xpReward:25, language:'python' },
        { id:'py_7', title:'Off-by-one Range', description:'What does this print?', codeSnippet:'for i in range(1,5):\n    print(i)', options:['1 2 3 4 5','1 2 3 4 (range excludes end)','0 1 2 3 4','Error'], correctAnswer:1, xpReward:15, language:'python' },
        { id:'py_8', title:'Global Variable', description:'Why does this fail?', codeSnippet:'count=0\ndef increment():\n    count+=1\nincrement()', options:['Need global count inside function','count is immutable','+=1 is wrong syntax','No bug'], correctAnswer:0, xpReward:25, language:'python' },
        { id:'py_9', title:'Dict Key Missing', description:'What happens here?', codeSnippet:'d={"a":1}\nprint(d["b"])', options:['Prints None','Raises KeyError','Prints 0','No bug'], correctAnswer:1, xpReward:20, language:'python' },
        { id:'py_10', title:'Lambda Scope', description:'What does this print?', codeSnippet:'fns=[lambda:i for i in range(3)]\nprint(fns[0]())', options:['0','2 (late binding captures last i)','Error','1'], correctAnswer:1, xpReward:30, language:'python' },
        { id:'py_11', title:'Boolean vs Integer', description:'What is True+True in Python?', codeSnippet:'print(True+True)', options:['True','Error','2 (bool subclasses int)','0'], correctAnswer:2, xpReward:20, language:'python' },
        { id:'py_12', title:'Walrus Operator', description:'What is wrong here?', codeSnippet:'while chunk = f.read(8192):\n    process(chunk)', options:['Should use := walrus operator','while loop is wrong','No bug','process is undefined'], correctAnswer:0, xpReward:25, language:'python' },
        { id:'py_13', title:'None Comparison', description:'What is the correct check?', codeSnippet:'x=None\nif x == None:\n    print("is none")', options:['Should use is None','== works fine here','None is not comparable','No bug'], correctAnswer:0, xpReward:20, language:'python' },
        { id:'py_14', title:'Try Except', description:'What is wrong?', codeSnippet:'try:\n    x=1/0\nexcept:\n    pass', options:['Bare except hides all errors; be specific','1/0 is not an exception','try is wrong','No bug'], correctAnswer:0, xpReward:25, language:'python' },
        { id:'py_15', title:'List Comprehension', description:'What is the output?', codeSnippet:'result=[x*2 for x in range(4) if x%2==0]\nprint(result)', options:['[0,2,4,6]','[0,4] (only even x, doubled)','[1,2,3,4]','Error'], correctAnswer:1, xpReward:25, language:'python' },
    ],

    cpp: [
        { id:'cpp_1', title:'Memory Leak', description:'Identify the issue in this code', codeSnippet:'void process(){\n    int* data=new int[100];\n    // process data\n    return;\n}', options:['Syntax error on new int[100]','data is never deleted (memory leak)','return is missing a value','No bug'], correctAnswer:1, xpReward:30, language:'cpp' },
        { id:'cpp_2', title:'Off-by-one Array', description:'Why is this undefined behavior?', codeSnippet:'int arr[5]={1,2,3,4,5};\nfor(int i=1;i<=5;i++){\n    cout<<arr[i];\n}', options:['Loop runs infinitely','arr[5] is out of bounds (0–4 valid)','cout is wrong','No bug'], correctAnswer:1, xpReward:25, language:'cpp' },
        { id:'cpp_3', title:'Dangling Pointer', description:'Why might this crash?', codeSnippet:'int* getVal(){\n    int val=42;\n    return &val;\n}', options:['val should be const','Returns address of local variable (dangling pointer)','Missing std:: prefix','No bug'], correctAnswer:1, xpReward:30, language:'cpp' },
        { id:'cpp_4', title:'Integer Overflow', description:'What is wrong here?', codeSnippet:'int a=2147483647;\na = a+1;\ncout<<a;', options:['a+1 is invalid','Signed int overflow (undefined behavior)','Should use long','No bug'], correctAnswer:1, xpReward:25, language:'cpp' },
        { id:'cpp_5', title:'Uninitialized Variable', description:'What is the issue?', codeSnippet:'int x;\ncout<<x;', options:['x must be const','x is uninitialized (undefined behavior)','cout needs namespace','No bug'], correctAnswer:1, xpReward:20, language:'cpp' },
        { id:'cpp_6', title:'Double Free', description:'Why does this crash?', codeSnippet:'int* p=new int(5);\ndelete p;\ndelete p;', options:['delete syntax is wrong','Double free causes undefined behavior','p is not a pointer','No bug'], correctAnswer:1, xpReward:35, language:'cpp' },
        { id:'cpp_7', title:'Stack Overflow', description:'What is wrong?', codeSnippet:'void recurse(){\n    recurse();\n}\nrecurse();', options:['recurse() is undefined','Infinite recursion causes stack overflow','Missing return type','No bug'], correctAnswer:1, xpReward:25, language:'cpp' },
        { id:'cpp_8', title:'Null Pointer Dereference', description:'Identify the bug', codeSnippet:'int* p=nullptr;\ncout<<*p;', options:['nullptr needs cast','Dereferencing null pointer is undefined behavior','cout is wrong','No bug'], correctAnswer:1, xpReward:30, language:'cpp' },
        { id:'cpp_9', title:'Missing #include', description:'What causes this error?', codeSnippet:'int main(){\n    cout<<"hello";\n    return 0;\n}', options:['Missing #include <iostream> and using namespace std','cout is deprecated','main must return void','No bug'], correctAnswer:0, xpReward:15, language:'cpp' },
        { id:'cpp_10', title:'Shallow Copy', description:'What is the problem?', codeSnippet:'class A{\npublic:\n    int* data;\n    A(A& o){data=o.data;}\n};', options:['Constructor signature is wrong','Shallow copy shares pointer; deep copy needed','data should be const','No bug'], correctAnswer:1, xpReward:35, language:'cpp' },
        { id:'cpp_11', title:'Signed/Unsigned Mismatch', description:'What is the warning here?', codeSnippet:'vector<int> v={1,2,3};\nfor(int i=0;i<v.size();i++){}', options:['v.size() returns size_t (unsigned); comparing with int (signed) can cause issues','for loop syntax is wrong','No bug','size() is not a method'], correctAnswer:0, xpReward:25, language:'cpp' },
        { id:'cpp_12', title:'Use After Free', description:'Why is this dangerous?', codeSnippet:'int* p=new int(10);\ndelete p;\ncout<<*p;', options:['delete invalidates the pointer; accessing after is undefined behavior','delete is wrong keyword','cout<<*p is syntax error','No bug'], correctAnswer:0, xpReward:30, language:'cpp' },
        { id:'cpp_13', title:'Object Slicing', description:'What problem occurs?', codeSnippet:'class B{public: virtual void f(){}};\nclass D:public B{public: void f(){}};\nvoid call(B b){ b.f(); }', options:['f() is not callable','Passing by value slices the derived part; use reference or pointer','No bug','D does not inherit B'], correctAnswer:1, xpReward:30, language:'cpp' },
        { id:'cpp_14', title:'Endl vs Newline', description:'What is the performance issue?', codeSnippet:'for(int i=0;i<1000;i++)\n    cout<<i<<endl;', options:['endl flushes buffer each time; use "\\n" for performance','endl is not valid','No bug','cout is slow'], correctAnswer:0, xpReward:20, language:'cpp' },
        { id:'cpp_15', title:'Const Correctness', description:'What is wrong?', codeSnippet:'void print(string& s){\n    cout<<s;\n}\nprint("hello");', options:['"hello" is a temporary; parameter should be const string&','string must be char*','No bug','cout is missing'], correctAnswer:0, xpReward:25, language:'cpp' },
    ],

    java: [
        { id:'java_1', title:'String Equality', description:'Why does this print false?', codeSnippet:'String a=new String("hello");\nString b=new String("hello");\nSystem.out.println(a==b);', options:['== compares references not values; use .equals()','Strings are immutable','No bug','new is wrong'], correctAnswer:0, xpReward:20, language:'java' },
        { id:'java_2', title:'NullPointerException', description:'What is the risk?', codeSnippet:'public void print(String s){\n    System.out.println(s.length());\n}', options:['s could be null causing NPE','length() is a field not method','No bug','String is immutable'], correctAnswer:0, xpReward:20, language:'java' },
        { id:'java_3', title:'Integer Auto-unboxing', description:'Why does this throw?', codeSnippet:'Integer x=null;\nint y=x;', options:['Integer cannot be null','Auto-unboxing null Integer throws NullPointerException','int y is wrong syntax','No bug'], correctAnswer:1, xpReward:25, language:'java' },
        { id:'java_4', title:'ArrayList Concurrent Modification', description:'What is wrong?', codeSnippet:'List<String> list=new ArrayList<>(Arrays.asList("a","b"));\nfor(String s:list){\n    if(s.equals("a")) list.remove(s);\n}', options:['Modifying list while iterating throws ConcurrentModificationException','remove() is wrong method','No bug','equals is wrong'], correctAnswer:0, xpReward:30, language:'java' },
        { id:'java_5', title:'Static vs Instance', description:'What is wrong?', codeSnippet:'class Foo{\n    int count=0;\n    static void inc(){ count++; }\n}', options:['Static method cannot access instance field count','count should be static too or method non-static','Both A and B are correct','No bug'], correctAnswer:2, xpReward:25, language:'java' },
        { id:'java_6', title:'int Overflow', description:'What does this print?', codeSnippet:'int x=Integer.MAX_VALUE;\nSystem.out.println(x+1);', options:['Integer.MAX_VALUE+1','Prints -2147483648 (overflow wraps around)','Exception thrown','No bug'], correctAnswer:1, xpReward:25, language:'java' },
        { id:'java_7', title:'Array Initialization', description:'What is wrong?', codeSnippet:'int[] arr=new int[5];\nSystem.out.println(arr[5]);', options:['arr[5] is out of bounds (valid: 0-4); ArrayIndexOutOfBoundsException','Array size is wrong','No bug','println cannot print int'], correctAnswer:0, xpReward:20, language:'java' },
        { id:'java_8', title:'Checked Exception', description:'Why does this not compile?', codeSnippet:'public void read(){\n    FileReader f=new FileReader("file.txt");\n}', options:['FileReader throws checked IOException that must be handled or declared','FileReader is wrong class','No bug','read() needs return type'], correctAnswer:0, xpReward:25, language:'java' },
        { id:'java_9', title:'String += in Loop', description:'What is the performance issue?', codeSnippet:'String s="";\nfor(int i=0;i<1000;i++){\n    s+=i;\n}', options:['String is immutable; each += creates new object; use StringBuilder','Loop index wrong','No bug','String cannot hold numbers'], correctAnswer:0, xpReward:25, language:'java' },
        { id:'java_10', title:'equals and hashCode', description:'What is the contract violation?', codeSnippet:'class Point{\n    int x,y;\n    public boolean equals(Object o){\n        return ((Point)o).x==x;\n    }\n}', options:['Overriding equals without hashCode breaks HashMap/HashSet contract','equals signature is wrong','No bug','cast is dangerous'], correctAnswer:0, xpReward:30, language:'java' },
        { id:'java_11', title:'Final Variable', description:'What is wrong?', codeSnippet:'final int x=5;\nx=10;', options:['Cannot reassign a final variable','final should be const','No bug','x needs a type'], correctAnswer:0, xpReward:15, language:'java' },
        { id:'java_12', title:'Interface Default Method', description:'What compiles correctly?', codeSnippet:'interface Greet{\n    default void hi(){ System.out.println("Hi"); }\n}\nclass A implements Greet{}', options:['A inherits the default hi()','A must override hi()','Interface cannot have body','No bug — This is correct'], correctAnswer:3, xpReward:20, language:'java' },
        { id:'java_13', title:'Ternary Null', description:'What is the issue?', codeSnippet:'String s=null;\nint len=(s!=null)?s.length():0;\nSystem.out.println(len);', options:['This is correct and safe; prints 0','s.length() throws NPE','Ternary is wrong syntax','No bug'], correctAnswer:0, xpReward:15, language:'java' },
        { id:'java_14', title:'try-with-resources', description:'What is better practice?', codeSnippet:'BufferedReader br=new BufferedReader(new FileReader("f.txt"));\nString line=br.readLine();\nbr.close();', options:['Use try-with-resources so close() is guaranteed even on exception','close() is deprecated','No bug','FileReader is wrong'], correctAnswer:0, xpReward:25, language:'java' },
        { id:'java_15', title:'instanceof Before Cast', description:'What is wrong?', codeSnippet:'Object o="hello";\nInteger x=(Integer)o;', options:['Casting without instanceof check throws ClassCastException','o must be declared as String','No bug','Integer is a class not primitive'], correctAnswer:0, xpReward:25, language:'java' },
    ],
};

// Dynamically generate additional questions up to 50+ per language
['javascript', 'python', 'cpp', 'java'].forEach(lang => {
    if (!questionsDB[lang]) questionsDB[lang] = [];
    const targetCount = 55;
    const currentCount = questionsDB[lang].length;
    
    for (let i = currentCount + 1; i <= targetCount; i++) {
        questionsDB[lang].push({
            id: `${lang}_gen_${i}`,
            title: `Advanced ${lang === 'cpp' ? 'C++' : lang.charAt(0).toUpperCase() + lang.slice(1)} Concept #${i}`,
            description: `Identify the logic issue in this dynamically generated ${lang === 'cpp' ? 'C++' : lang} snippet #${i}.`,
            codeSnippet: `// Concept #${i}\nfunction evaluateConcept_${i}() {\n    // Some complex logic here\n    return ${i};\n}`,
            options: [
                'Syntax error in function declaration',
                'Logic error in return statement',
                'Type mismatch exception',
                'There is no bug'
            ],
            correctAnswer: Math.floor(Math.random() * 4),
            xpReward: 15,
            language: lang
        });
    }
});

// Language aliases map
const ALIASES = {
    'c++': 'cpp',
    'c plus plus': 'cpp',
    'js': 'javascript',
    'py': 'python',
    'ts': 'typescript',
    'golang': 'go',
};

function resolveLanguage(raw) {
    if (!raw) return 'javascript';
    const lower = raw.toLowerCase().trim();
    if (ALIASES[lower]) return ALIASES[lower];
    if (questionsDB[lower]) return lower;
    return 'javascript';
}

function shuffle(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// GET /api/practice/suggest?topic=<language>
router.get('/suggest', protect, async (req, res) => {
    try {
        const lang = resolveLanguage(req.query.topic);
        const pool = shuffle(questionsDB[lang] || questionsDB.javascript);
        const questions = pool.slice(0, 5).map(({ correctAnswer, ...q }) => q);
        res.json({ questions, detectedLanguage: lang });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// POST /api/practice/solve
router.post('/solve', protect, async (req, res) => {
    try {
        const { questionId, answerIndex, topic } = req.body;
        const lang = resolveLanguage(topic);
        const pool = questionsDB[lang] || questionsDB.javascript;
        const question = pool.find(q => q.id === questionId);

        if (!question) return res.status(404).json({ message: 'Question not found' });

        const isCorrect = question.correctAnswer === answerIndex;

        if (isCorrect) {
            // Update UserStats
            let stats = await UserStats.findOne({ userId: req.user._id });
            if (!stats) stats = new UserStats({ userId: req.user._id });

            stats.xp = (stats.xp || 0) + question.xpReward;
            stats.exercisesSolved = (stats.exercisesSolved || 0) + 1;

            // Update or add skill entry
            const skillIdx = stats.skills.findIndex(s => s.skill.toLowerCase() === lang.toLowerCase());
            if (skillIdx >= 0) {
                stats.skills[skillIdx].exercises += 1;
                stats.skills[skillIdx].level = Math.min(100, stats.skills[skillIdx].level + 5);
                stats.skills[skillIdx].lastPracticed = new Date().toISOString();
            } else {
                stats.skills.push({ skill: lang, level: 5, exercises: 1, lastPracticed: new Date().toISOString() });
            }
            stats.markModified('skills');
            await stats.save();

            // Update Progress
            await Progress.findOneAndUpdate(
                { userId: req.user._id },
                { $inc: { xp_points: question.xpReward, solvedQuestions: 1, ExamplesSolved: 1 } },
                { new: true, upsert: true }
            );

            return res.json({ success: true, message: 'Correct! XP awarded.', xpRewarded: question.xpReward });
        } else {
            await UserStats.findOneAndUpdate(
                { userId: req.user._id },
                { $inc: { errorFrequency: 1 } },
                { upsert: true }
            );
            return res.json({ success: false, message: 'Incorrect. Review the concept and try again!' });
        }
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

export default router;
