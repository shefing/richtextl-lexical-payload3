/**
 * Portions copyright (c) 2018-2022 Payload CMS, LLC info@payloadcms.com
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * Adapted from https://github.com/payloadcms/payload/tree/main/packages/richtext-lexical
 */

import { withMergedProps } from '@payloadcms/ui/elements/withMergedProps'
import { withNullableJSONSchemaType } from 'payload/utilities'

import { RichTextCell } from './cell'
import { RichTextField } from './field/field-component'

import { defaultEditorConfig, EditorSettings } from './field/config'
import { cloneDeep } from './field/utils/cloneDeep'
import { richTextValidate } from './validate/validate-server'

import type { JSONSchema4 } from 'json-schema'
import type { EditorConfig as LexicalEditorConfig } from 'lexical'
import type { EditorConfig } from './field/config/types'
import type { LexicalRichTextAdapter } from './types'

import type { LexicalEditorProps } from './types'

// TODO: sanitize / validate all inputs (okay for now as we control all inputs)
export function lexicalEditor(props?: LexicalEditorProps): LexicalRichTextAdapter {
  let settings: EditorSettings | null
  if (props?.settings != null) {
    settings =
      props.settings != null && typeof props.settings === 'function'
        ? props?.settings(cloneDeep(defaultEditorConfig.settings))
        : null

    if (settings == null) {
      settings = cloneDeep(defaultEditorConfig.settings)
    }
  } else {
    settings = cloneDeep(defaultEditorConfig.settings)
  }

  let lexical: () => Promise<LexicalEditorConfig>
  if (props?.lexical != null) {
    lexical = async () => await Promise.resolve(props.lexical as unknown as LexicalEditorConfig)//fix
  } else {
    lexical = defaultEditorConfig.lexical
  }

  const editorConfig: EditorConfig = {
    settings,
    lexical,
  }

  return {
    CellComponent: withMergedProps({
      Component: RichTextCell,
      toMergeIntoProps: { editorConfig },
    }),
    FieldComponent: withMergedProps({
      Component: RichTextField,
      toMergeIntoProps: { editorConfig },
    }),
    editorConfig,
    generateComponentMap: () => new Map(),
    outputSchema: ({ field, isRequired }) => {
      const outputSchema: JSONSchema4 = {
        // NOTE: Directly from https://github.com/payloadcms/payload/blob/main/packages/richtext-lexical/src/index.ts
        // This schema matches the SerializedEditorState type so far, that it's possible to cast SerializedEditorState to this schema without any errors.
        // In the future, we should
        // 1) allow recursive children
        // 2) Pass in all the different types for every node added to the editorconfig. This can be done with refs in the schema.
        type: withNullableJSONSchemaType('object', isRequired),
        properties: {
          root: {
            type: 'object',
            additionalProperties: false,
            properties: {
              children: {
                items: {
                  additionalProperties: true,
                  properties: {
                    type: {
                      type: 'string',
                    },
                    version: {
                      type: 'integer',
                    },
                  },
                  required: ['type', 'version'],
                  type: 'object',
                },
                type: 'array',
              },
              direction: {
                oneOf: [
                  {
                    enum: ['ltr', 'rtl'],
                  },
                  {
                    type: 'null',
                  },
                ],
              },
              format: {
                enum: ['left', 'start', 'center', 'right', 'end', 'justify', ''], // ElementFormatType, since the root node is an element
                type: 'string',
              },
              indent: {
                type: 'integer',
              },
              type: {
                type: 'string',
              },
              version: {
                type: 'integer',
              },
            },
            required: ['children', 'direction', 'format', 'indent', 'type', 'version'],
          },
        },
        required: ['root'],
      }

      return outputSchema
    },
    validate: richTextValidate,
  }
}
