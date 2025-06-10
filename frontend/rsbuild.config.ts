import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';
import { pluginSass } from '@rsbuild/plugin-sass';
import { pluginLess } from '@rsbuild/plugin-less';
import { pluginEslint } from '@rsbuild/plugin-eslint';

export default defineConfig({
  html: {
    template: './public/index.html',
  },
  source: {
    entry: {
      index: './src/index.tsx',
    },
  },
  output: {
    distPath: {
      root: 'build',
    },
    assetPrefix: '/',
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: false,
  },
  dev: {
    hmr: true,
  },
  plugins: [
    pluginReact(),
    pluginTypeCheck(),
    pluginSass(),
    pluginLess(),
    // 暂时禁用 ESLint 插件
    // pluginEslint({
    //   eslintPluginOptions: {
    //     configType: 'legacy',
    //   },
    // }),
  ],
  tools: {
    postcss: {
      postcssOptions: {
        plugins: [
          require('autoprefixer'),
        ],
      },
    },
  },
}); 