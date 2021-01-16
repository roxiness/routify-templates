module.exports = {
    configs: ({ getConfigString, stringify }) => ({
        rollup: {
            preserveEntrySignatures: "false",
            input: ["`src/main.js`"],
            output: {
                sourcemap: "true",
                format: "'esm'",
                dir: "buildDir",
                // for performance, disabling filename hashing in development
                chunkFileNames: "`[name]${production && '-[hash]' || ''}.js`"
            },
            plugins: [
                `svelte(${getConfigString('svelte')})`,

                // resolve matching modules from current working directory
                `resolve({
                    browser: "true",
                    dedupe: "importee => !!importee.match(/svelte(\/|$)/)"
                })`,
                "commonjs()",

                `production && terser()`,
                `!production && livereload(distDir), // refresh entire window when code is updated`,
                `production && copyToDist()`,
            ],
            watch: { clearScreen: "false" }
        },
        packagejson: require('./template/package.json')
    }),
}