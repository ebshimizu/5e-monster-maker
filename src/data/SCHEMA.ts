import { Schema } from 'jsonschema'
import v1 from './schema/5emm-v1.json'
import v2 from './schema/5emm-v2.json'
import v3 from './schema/5emm-v3.json'
import v4 from './schema/5emm-v4.json'
import v5 from './schema/5emm-v5.json'
import v6 from './schema/5emm-v6.json'
import v7 from './schema/5emm-v7.json'
import v8 from './schema/5emm-v8.json'
import v9 from './schema/5emm-v9.json'
import v10 from './schema/5emm-v10.json'

import spellsV1 from './schema/spells-v1.json'
import spellsV2 from './schema/spells-v2.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const SPELL_SCHEMA: Record<string, any> = {
  v1: spellsV1,
  v2: spellsV2,
}

export const SCHEMA: Record<string, Schema> = {
  '1': v1,
  '2': v2,
  '3': v3,
  '4': v4,
  '5': v5,
  '6': v6,
  '7': v7,
  '8': v8,
  '9': v9,
  '10': v10,
}
