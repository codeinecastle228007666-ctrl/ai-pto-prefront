// Orval config: generates typed API client (react-query) from docs/openapi.yaml.
// Run: `npm run generate:api` from the package root (frontend/1st/ai-pto-frontend).
//
// - input: ../../../docs/openapi.yaml (repo root docs folder, relative to package root)
// - output: src/shared/api/generated/ - isolated layer; existing API code
//   (src/shared/api/client.ts, features/*/api) is NOT touched
// - mode: tags-split - one file per tag (auth, objects, packages, documents,
//   findings, checklist, reports) + shared models in generated/model
// - mutator: orval-mutator.ts - all requests go through the existing axios
//   instance (baseURL /api, Bearer token, refresh on 401)

import { defineConfig } from 'orval'

export default defineConfig({
  ptoApi: {
    input: '../../../docs/openapi.yaml',
    output: {
      target: './src/shared/api/generated',
      schemas: './src/shared/api/generated/model',
      mode: 'tags-split',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      prettier: false,
      override: {
        mutator: {
          path: './src/shared/api/orval-mutator.ts',
          name: 'orvalInstance',
        },
        query: {
          useQuery: true,
          useMutation: true,
          useSuspenseQuery: false,
          shouldExportQueryKey: true,
          shouldExportHooks: true,
        },
      },
    },
  },
})
