import Editor from "@monaco-editor/react";
import useLocalStorage from "use-local-storage";
import deafultValues from "./deafultValues";
import { useState } from "react";
import getIframeUrl from "./get-iframe-url";

export default function App() {
  //editor
  const [editorSelected, setEditorSelected] = useState<string>("html");

  //code values
  const [htmlValue, setHtmlValue] = useLocalStorage<string>(
    "easy-coder-html",
    deafultValues.htmlValue
  );
  const [cssValue, setCssValue] = useLocalStorage<string>(
    "easy-coder-css",
    deafultValues.cssValue
  );
  const [jsValue, setJsValue] = useLocalStorage<string>(
    "easy-coder-js",
    deafultValues.jsValue
  );

  console.log(
    editorSelected == "javascript"
      ? jsValue
      : editorSelected == "css"
      ? cssValue
      : htmlValue
  );

  window.onkeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "s") {
      e.preventDefault();
    } else if (e.ctrlKey && e.key === "1") {
      e.preventDefault();
      setEditorSelected("html");
    } else if (e.ctrlKey && e.key === "2") {
      e.preventDefault();
      setEditorSelected("javascript");
    } else if (e.ctrlKey && e.key === "3") {
      e.preventDefault();
      setEditorSelected("css");
    }
  };

  return (
    <>
      <div className="editor">
        <div className="controlls">
          <button
            className={editorSelected == "html" ? "focus" : ""}
            type="button"
            onClick={() => setEditorSelected("html")}
          >
            HTML (Body)
          </button>
          <button
            className={editorSelected == "javascript" ? "focus" : ""}
            type="button"
            onClick={() => setEditorSelected("javascript")}
          >
            JS
          </button>
          <button
            className={editorSelected == "css" ? "focus" : ""}
            type="button"
            onClick={() => setEditorSelected("css")}
          >
            CSS
          </button>
        </div>
        <Editor
          height="calc(100dvh - 30px)"
          width="50dvw"
          theme="vs-dark"
          language={editorSelected}
          value={
            editorSelected == "javascript"
              ? jsValue
              : editorSelected == "css"
              ? cssValue
              : htmlValue
          }
          onChange={(value) => {
            if (editorSelected == "javascript") setJsValue(value);
            else if (editorSelected == "css") setCssValue(value);
            else setHtmlValue(value);
          }}
        />
      </div>
      <div className="preview">
        <iframe
          src={getIframeUrl(htmlValue, jsValue, cssValue)}
          frameBorder="0"
        ></iframe>
      </div>
    </>
  );
}
