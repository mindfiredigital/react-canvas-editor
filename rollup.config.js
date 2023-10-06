import { babel } from '@rollup/plugin-babel';
// import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
// import postcss from "rollup-plugin-postcss";
import scss from "rollup-plugin-scss";
import svg from "rollup-plugin-svg";

const packageJson = require("./package.json");
const { nodeResolve } = require('@rollup/plugin-node-resolve');
export default [
    {
        input: 'component/index.ts',
        external: [/node_module/,"react", "react-dom"],
        output: [
            {
                file: 'dist/index.js',
                format: 'es',
                sourcemap: true
            }
        ],
        plugins: [
            scss({
                include: ["/**/*.css", "/**/*.scss", "/**/*.sass", "/**/*.module.scss"],
                output: "css/style.css",
                failOnError: true,
              }),
            svg(),
            babel({
                exclude: 'node_modules/**',
                presets: ['@babel/preset-react']
            }),
            external(),
            nodeResolve(),
            commonjs(),
            typescript({ tsconfig: './tsconfig.json' })
        ],
    }
]