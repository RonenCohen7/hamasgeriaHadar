import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import obfuscatorPluginModule from 'vite-plugin-javascript-obfuscator'

const obfuscatorPlugin =
    'default' in obfuscatorPluginModule
        ? obfuscatorPluginModule.default
        : obfuscatorPluginModule
export default defineConfig({
    plugins: [
        react(),

        obfuscatorPlugin({
            apply: 'build',
            debugger: true,
            options: {
                compact: true,
                controlFlowFlattening: true,
                controlFlowFlatteningThreshold: 0.5,

                deadCodeInjection: false,

                debugProtection: false,
                disableConsoleOutput: false,

                identifierNamesGenerator: 'hexadecimal',

                renameGlobals: false,

                selfDefending: false,

                stringArray: true,
                stringArrayEncoding: ['base64'],
                stringArrayThreshold: 0.75,

                transformObjectKeys: true,
                unicodeEscapeSequence: false,
            },
        }),
    ],
})