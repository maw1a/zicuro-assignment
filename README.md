# Zicuro Assignment

Assigment for Zicuro Technologies

Candidate - **Ahmed Mawia**

## Requirements

- Node and npm

## Dev setup

- Install dependencies using your package manager (npm, yarn, pnpm etc) or simply run "npm install" in your terminal.

- Run the start script to run the development server, or simply run "npm start" in your terminal.

## Known issues

There is a chance you might face a type error with Draft.js Editor when running on your local machine.

`ERROR: Unexpected 'Editor cannot be used as a JSX component'`

If you face this error make the changes according to this code snippet 
```
import {
  Editor as _Editor, // replace this line
  EditorState,
  RichUtils,
  DraftModel,
  ContentBlock,
  ContentState,
  convertFromRaw,
  convertToRaw,
  EditorProps,
} from "draft-js";
import { useState } from "react";
import "./styles.css";

// Type enforcing becaus of some random type error with Draft.js
const Editor = _Editor as unknown as React.FC<EditorProps>; // Add this line
```

