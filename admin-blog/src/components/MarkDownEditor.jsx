import "easymde/dist/easymde.min.css";
import "github-markdown-css";
import "katex/dist/katex.min.css";
import { useMemo } from "react";
import ReactDOMServer from "react-dom/server";
import "font-awesome/css/font-awesome.min.css";
import SimpleMDE from "react-simplemde-editor";
import style from "../css/MarkDownEditor.module.css";
import MDComponent from "./MDComponent";

function MarkDownEditor({
  value = null,
  onChange = null,
  id = "post_content",
  autoSave = false,
}) {
  const mdeOptions = useMemo(() => {
    return {
      autoDownloadFontAwesome: false,
      autofocus: false,
      spellChecker: false,
      sideBySideFullscreen: false,
      autosave: {
        enabled: autoSave,
        uniqueId: id,
        delay: 60000,
      },
      showIcons: [
        "code",
        "strikethrough",
        "table",
        "horizontal-rule",
        "undo",
        "redo",
      ],
      previewRender(value) {
        return ReactDOMServer.renderToString(
          <MDComponent
            reactMDClass={`${style["preview-body"]} markdown-body`}
            mdChildren={value}
            codeBoxClass={style["code-box"]}
            syntaxHLClass={style["syntax-highlighter"]}
            hasCopyButton={false}
          />
        );
      },
    };
  }, [autoSave, id]);
  return (
    <SimpleMDE id={id} options={mdeOptions} value={value} onChange={onChange} />
  );
}

export default MarkDownEditor;
