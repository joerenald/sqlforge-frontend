import Editor from "@monaco-editor/react";

function SQLEditor({ value, onChange }) {
  return (
    <Editor
      height="100%"
      defaultLanguage="sql"
      value={value}
      onChange={onChange}
      theme="vs-dark"
      options={{
        minimap: {
          enabled: false,
        },
        fontSize: 14,
        lineNumbers: "on",
        roundedSelection: false,
        scrollBeyondLastLine: false,
        automaticLayout: true,
        wordWrap: "on",
        padding: {
          top: 16,
          bottom: 16,
        },
        cursorBlinking: "smooth",
        smoothScrolling: true,
      }}
    />
  );
}

export default SQLEditor;