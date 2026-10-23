import os

files = {
    "txt": {
        "little": [
            "Hello world",
            "This is a dummy text file",
            "Used for testing uploads"
        ],
        "medium": [
            "Hello world",
            "This is a dummy text file",
            "Used for testing uploads",
            "Line four example",
            "Line five example",
            "Line six example"
        ],
        "more": [
            "Dummy data start",
            "Line 2 example",
            "Line 3 example",
            "Line 4 example",
            "Line 5 example",
            "Line 6 example",
            "Line 7 example",
            "Line 8 example",
            "Line 9 example",
            "Line 10 example",
            "Line 11 example",
            "Line 12 example"
        ]
    },

    "py": {
        "little": [
            "print('Hello Python')",
            "x = 5",
            "print(x)"
        ],
        "medium": [
            "def greet():",
            "    print('Hello from Python')",
            "",
            "for i in range(3):",
            "    greet()",
            "print('Done')"
        ],
        "more": [
            "def add(a, b):",
            "    return a + b",
            "",
            "def main():",
            "    result = add(3, 4)",
            "    print('Result:', result)",
            "",
            "if __name__ == '__main__':",
            "    main()"
        ]
    },

    "js": {
        "little": [
            "console.log('Hello JS');",
            "let x = 10;",
            "console.log(x);"
        ],
        "medium": [
            "function greet(){",
            "  console.log('Hello');",
            "}",
            "",
            "for(let i=0;i<3;i++){",
            "  greet();",
            "}"
        ],
        "more": [
            "function add(a,b){",
            "  return a+b;",
            "}",
            "",
            "const result = add(5,6);",
            "console.log('Result:', result);",
            "",
            "console.log('JS test file');"
        ]
    },

    "java": {
        "little": [
            "public class Hello {",
            "  public static void main(String[] args){",
            "    System.out.println('Hello Java');",
            "  }",
            "}"
        ],
        "medium": [
            "public class Test {",
            "  public static void main(String[] args){",
            "    for(int i=0;i<3;i++){",
            "      System.out.println(i);",
            "    }",
            "  }",
            "}"
        ],
        "more": [
            "public class Calc {",
            "  static int add(int a,int b){",
            "    return a+b;",
            "  }",
            "",
            "  public static void main(String[] args){",
            "    int r = add(4,5);",
            "    System.out.println(r);",
            "  }",
            "}"
        ]
    },

    "c": {
        "little": [
            "#include <stdio.h>",
            "int main(){",
            "printf('Hello C');",
            "return 0;",
            "}"
        ],
        "medium": [
            "#include <stdio.h>",
            "int main(){",
            "for(int i=0;i<3;i++){",
            "printf('%d', i);",
            "}",
            "return 0;",
            "}"
        ],
        "more": [
            "#include <stdio.h>",
            "int add(int a,int b){",
            "return a+b;",
            "}",
            "",
            "int main(){",
            "int r = add(3,4);",
            "printf('%d', r);",
            "return 0;",
            "}"
        ]
    },

    "cpp": {
        "little": [
            "#include <iostream>",
            "using namespace std;",
            "int main(){",
            "cout << 'Hello C++';",
            "}"
        ],
        "medium": [
            "#include <iostream>",
            "using namespace std;",
            "int main(){",
            "for(int i=0;i<3;i++){",
            "cout << i;",
            "}",
            "}"
        ],
        "more": [
            "#include <iostream>",
            "using namespace std;",
            "int add(int a,int b){",
            "return a+b;",
            "}",
            "",
            "int main(){",
            "cout << add(5,6);",
            "}"
        ]
    },

    "html": {
        "little": [
            "<html>",
            "<body>",
            "<h1>Hello HTML</h1>",
            "</body>",
            "</html>"
        ],
        "medium": [
            "<html>",
            "<body>",
            "<h1>Test Page</h1>",
            "<p>Example paragraph</p>",
            "<button>Click</button>",
            "</body>",
            "</html>"
        ],
        "more": [
            "<html>",
            "<head>",
            "<title>Dummy Page</title>",
            "</head>",
            "<body>",
            "<h1>Heading</h1>",
            "<p>Paragraph example</p>",
            "<ul>",
            "<li>Item</li>",
            "</ul>",
            "</body>",
            "</html>"
        ]
    }
}

for ext, sizes in files.items():
    for size, lines in sizes.items():
        filename = f"{ext}_{size}.{ext}"
        with open(filename, "w") as f:
            f.write("\n".join(lines))

print("✅ Dummy files created successfully!")