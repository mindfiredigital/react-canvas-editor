import { babel } from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import scss from "rollup-plugin-scss";
import svg from "rollup-plugin-svg";
import { nodeResolve } from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';

export default [
    {
        input: 'component/index.ts',
        external: [/node_module/, "react", "react-dom"],
        output: [
            {
                file: 'dist/index.js',
                format: 'es',
            }
        ],
        plugins: [
            nodeResolve(),
            external(),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/preset-react']
            }),
            typescript({ tsconfig: './tsconfig.json' }),
            commonjs(),
            scss({
                insert: true
            }),
            svg(),
            terser(),
        ],
    }
]