import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/cli.ts'],
    outDir: 'bin',
    clean: true,
    shims: true,
    dts: {
        entry: 'src/type-index.ts',
    },
    format: ['esm'],
})