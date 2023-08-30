import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import babel from '@rollup/plugin-babel';
import pkg from './package.json' assert { type: "json" }

export default [
    {
        input: 'src/index.ts',
        plugins: [
            typescript({
                tsconfig: './tsconfig.rollup.json',
                declaration: true,
                declarationDir: 'dist',
            }) // so Rollup can convert TypeScript to JavaScript
        ],
        output: [
            { file: pkg.exports.require, format: 'cjs' },
            { file: pkg.exports.import, format: 'es' }
        ],
        external: ['react', 'react-dom', 'use-immer'],
    }
];