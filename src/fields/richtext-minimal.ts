import type { Field } from 'payload/types'

import { lexicalEditor } from '../adapters/richtext-lexical'
import { populateLexicalRelationships } from '../adapters/richtext-lexical/field/lexical-after-read-hook'
import { updateLexicalRelationships } from '../adapters/richtext-lexical/field/lexical-before-change-hook'
import deepMerge from '../utilities/deepMerge'

import type { LexicalRichTextAdapter } from '../adapters/richtext-lexical/types'

type Options = Partial<Field> & { editor?: LexicalRichTextAdapter }

type RichTextField = (options?: Options) => Field

export const lexicalRichTextMinimal: RichTextField = (options = {}) =>
  deepMerge<Field, Options>(
    {
      name: 'richText',
      label: 'RichText',
      type: 'richText',
      editor: lexicalEditor({
        settings: (config) => {
          config.options.textAlignment = false
          config.options.tablePlugin = false
          config.options.horizontalRulePlugin = false
          config.options.inlineImagePlugin = true
          config.options.autoEmbedPlugin = false
          config.options.floatingTextFormatToolbarPlugin = false
          config.options.floatingLinkEditorPlugin = false
          config.options.checkListPlugin = false
          config.options.listPlugin = false
          config.options.autoEmbedPlugin = false
          config.options.admonitionPlugin = false
          config.options.layoutPlugin = true
          config.options.codeHighlightPlugin = false
          config.options.layoutPlugin = true
          config.options.debug = false
          config.options.tablePlugin = true
          config.options.horizontalRulePlugin=true
          config.options.admonitionPlugin=true
          config.options.autoEmbedPlugin=true
          config.options.collab=true
          return config
        },
      }),
      hooks: {
        beforeChange: [updateLexicalRelationships],
        afterRead: [populateLexicalRelationships],
      },
    },
    options,
  )