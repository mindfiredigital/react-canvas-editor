import { babel } from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
// import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import postcss from "rollup-plugin-postcss";
import svg from "rollup-plugin-svg";

export default [
    {
        input: './src/index.tsx',
        output: [
            {
                file:'dist/index.js',
                format: 'cjs',
        },
        {
            file:'dist/index.es.js',
            format: 'es',
            exports: 'named',
        }
        ],
        plugins: [
            postcss({
                plugins:[],
                minimize: true
            }),
            babel ({
                exclude: 'node_modules/**'
            }),
            external(),
            resolve(),
            typescript({ tsconfig: "./tsconfig.json" }),
            svg()
        ],
        external: [
            /node_modules/
        ]
    }
]