import {
  Editor,
  EditorState,
  RichUtils,
  DraftModel,
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
} from "draft-js";
import { useState } from "react";
import "./styles.css";

export default function App() {
  const [editorState, setEditorState] = useState(() => {
    const _defaultContent = localStorage.getItem("content");
    const defaultContent = (() => {
      try {
        if (_defaultContent) return convertFromRaw(JSON.parse(_defaultContent));
      } catch (error) {}
      return undefined;
    })();

    if (!defaultContent) return EditorState.createEmpty();

    return EditorState.createWithContent(defaultContent);
  });

  function handleBeforeInput(
    chars: string,
    state: EditorState
  ): DraftModel.Constants.DraftHandleValue {
    if (chars !== " ") return "not-handled";

    const selection = state.getSelection();
    const contentState = state.getCurrentContent();
    const currentBlock = contentState.getBlockForKey(selection.getStartKey());
    const text = currentBlock.getText();

    // * Add additional block type mappings here
    let blockType: string | undefined = {
      "#": "heading",
      "*": "bold",
      "**": "red",
      "***": "underline",
    }[text];

    if (!blockType) return "not-handled";

    /* HANDLE NEW BLOCK CREATION */
    const newContentState = RichUtils.toggleBlockType(state, blockType);
    const entityMap = newContentState.getCurrentContent().getEntityMap();

    const updatedBlocks = newContentState
      .getCurrentContent()
      .getBlocksAsArray()
      .map((block) =>
        block.getKey() === currentBlock.getKey()
          ? new ContentBlock({
              key: currentBlock.getKey(),
              type: blockType,
              text: "",
              characterList: currentBlock.getCharacterList().slice(0, 0),
            })
          : block
      );

    const finalState = ContentState.createFromBlockArray(
      updatedBlocks,
      entityMap
    );

    const newEditorState = EditorState.push(
      state,
      finalState,
      "change-block-type"
    );

    const newSelection = selection.merge({
      anchorOffset: 0,
      focusOffset: 0,
    });

    const finalEditorState = EditorState.forceSelection(
      newEditorState,
      newSelection
    );

    setEditorState(finalEditorState);

    return "handled";
  }

  function handleKeyCommand(command: string, state: EditorState) {
    const newState = RichUtils.handleKeyCommand(state, command);

    if (newState) {
      setEditorState(newState);
      return "handled";
    }

    return "not-handled";
  }

  function blockStyleFn(contentBlock: ContentBlock) {
    const type = contentBlock.getType();
    // * Add type styles mapping here
    return (
      {
        heading: "editor-heading",
        bold: "editor-bold",
        red: "editor-red",
        underline: "editor-underline",
      }[type] || ""
    );
  }

  function saveContent() {
    const contentState = editorState.getCurrentContent();
    localStorage.setItem("content", JSON.stringify(convertToRaw(contentState)));

    console.log("saved state");
  }

  return (
    <div className="wrapper">
      <div className="header">
        <div style={{ width: "100px" }} />
        <h1>Demo editor by Ahmed Mawia</h1>
        <button onClick={saveContent}>Save</button>
      </div>
      <div style={{ width: "100%", flex: 1 }}>
        <Editor
          editorState={editorState}
          onChange={setEditorState}
          placeholder="start typing..."
          handleBeforeInput={handleBeforeInput}
          handleKeyCommand={handleKeyCommand}
          blockStyleFn={blockStyleFn}
        />
      </div>
    </div>
  );
}
