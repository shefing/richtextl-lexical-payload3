import type { RichTextAdapter, RichTextFieldProps } from 'payload/types'

import type { EditorConfig, EditorSettings } from './field/config/types'
import type { SerializedEditorState } from 'lexical'

import type { EditorConfig as LexicalEditorConfig } from './field/config/types'
export interface LexicalEditorProps {
  settings?: (config: EditorSettings) => EditorSettings
  lexical?: LexicalEditorConfig
}

export interface AdapterProps {
  editorConfig: EditorConfig
}

export type LexicalRichTextAdapter = RichTextAdapter<SerializedEditorState, AdapterProps, any> & {
  editorConfig: EditorConfig
}
