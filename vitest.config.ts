// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: [
      'src/**/*.test.ts' // <-- Add the file path here
    ],
    setupFiles: [
        './vitest.setup.ts'
    ]
  },
});
