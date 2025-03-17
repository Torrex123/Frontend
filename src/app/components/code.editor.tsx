import Editor, { DiffEditor, useMonaco, loader } from '@monaco-editor/react';
import { useRef, useState } from 'react';
import LanguageSelector from './language.selector';
import CodeOutput from './code.output';
import { runCode } from "../../../api/api";

export default function CodeEditor() {
    const editorRef = useRef(null);
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState('javascript');
    const [output, setOutput] = useState('');

    const onMount = (editor: any) => {
        editorRef.current = editor;
        editor.focus();
    }

    const selectLanguage = (language: string) => {
        setLanguage(language);
        setCode(CODE_SNIPPETS[language]);
    }

    const executeCode = async () => {
        try {
            const response = await runCode(language, code);
            setOutput(response.run.output);
            console.log(response);
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="flex flex-row">
            <div className="flex-1">
                <div className="flex justify-end gap-3 items-center !m-3">
                    <LanguageSelector language={language} selectLanguage={selectLanguage} />
                    <button className="btn btn-success w-full sm:w-40 focus:outline-none shadow-md" onClick={executeCode}>
                        Run Code
                    </button>
                </div>
                <div>
                    <Editor 
                        height="78vh"
                        language={language}
                        defaultValue={CODE_SNIPPETS[language]} 
                        theme="vs-dark"
                        value={code}
                        onMount={onMount}
                        className='rounded-lg shadow-md !m-3'
                        onChange={(code) => setCode(code || '')}
                    />
                </div>
            </div>
            <div className="flex-1">
                < CodeOutput output={output}/>
            </div>
        </div>
    );
}

const CODE_SNIPPETS: Record<string, string> = {
    python: `\ndef greet():\n\tprint("Welcome to CryptoPlayground")\n\ngreet()\n`,
    javascript: `\nfunction greet() {\n\tconsole.log("Welcome to CryptoPlayground");\n}\n\ngreet();\n`,
    java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Welcome to CryptoPlayground");\n\t}\n}\n`,
    ruby: `\n# Ruby 3.0.1 Snippet\n\ndef greet\n  puts "Welcome to CryptoPlayground"\nend\n\ngreet\n`,
    c: `\n/* C 10.2.0 Snippet */\n\n#include <stdio.h>\n\nvoid greet() {\n    printf("Welcome to CryptoPlayground\\n");\n}\n\nint main() {\n    greet();\n    return 0;\n}\n`,
    'c++': `\n/* C++ 10.2.0 Snippet */\n\n#include <iostream>\n\nvoid greet() {\n    std::cout << "Welcome to CryptoPlayground" << std::endl;\n}\n\nint main() {\n    greet();\n    return 0;\n}\n`,
    php: `<?php\n\nfunction greet() {\n\techo "Welcome to CryptoPlayground";\n}\n\ngreet();\n`,
    swift: `\n// Swift 5.3.3 Snippet\n\nfunc greet() {\n    print("Welcome to CryptoPlayground")\n}\n\ngreet()\n`,
    go: `\n// Go 1.16.2 Snippet\n\npackage main\n\nimport "fmt"\n\nfunc greet() {\n    fmt.Println("Welcome to CryptoPlayground")\n}\n\nfunc main() {\n    greet()\n}\n`
};
