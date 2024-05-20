import type { Field } from 'payload/types'

import { LexicalRichTextAdapter } from '@/adapters/richtext-lexical/types'
import { populateLexicalRelationships } from '../adapters/richtext-lexical/field/lexical-after-read-hook'
import { updateLexicalRelationships } from '../adapters/richtext-lexical/field/lexical-before-change-hook'
import deepMerge from '../utilities/deepMerge'

type Options = Partial<Field> & { editor?: LexicalRichTextAdapter }

type RichTextField = (options?: Options) => Field

export const lexicalRichText: RichTextField = (options = {}) =>
  deepMerge<Field, Options>(
    {
      name: 'richText',
      label: 'RichText',
      type: 'richText',
      hooks: {
        beforeChange: [updateLexicalRelationships],
        afterRead: [populateLexicalRelationships],
      },
    },
    options,
  )