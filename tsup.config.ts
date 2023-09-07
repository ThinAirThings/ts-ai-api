import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/index.ts'],
    outDir: 'dist',
    clean: true,
    shims: true,
    dts: true,
    format: ['esm', 'cjs'],
    publicDir: 'copyToDist'
})