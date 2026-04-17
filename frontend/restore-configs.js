const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname);

fs.writeFileSync(
  path.join(root, 'package.json'),
  JSON.stringify(
    {
      name: 'urban-guard',
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
        lint: 'eslint src --ext .ts,.tsx',
      },
      dependencies: {
        axios: '^1.6.7',
        'framer-motion': '^11.0.8',
        leaflet: '^1.9.4',
        react: '^18.2.0',
        'react-dom': '^18.2.0',
        'react-leaflet': '^4.2.1',
        zustand: '^4.5.2',
        recharts: '^2.12.0',
      },
      devDependencies: {
        '@types/leaflet': '^1.9.8',
        '@types/react': '^18.2.55',
        '@types/react-dom': '^18.2.19',
        '@typescript-eslint/eslint-plugin': '^7.0.2',
        '@typescript-eslint/parser': '^7.0.2',
        '@vitejs/plugin-react': '^4.2.1',
        autoprefixer: '^10.4.17',
        eslint: '^8.56.0',
        postcss: '^8.4.35',
        tailwindcss: '^3.4.1',
        typescript: '^5.2.2',
        vite: '^5.1.4',
      },
    },
    null,
    2
  ),
  'utf8'
);

fs.writeFileSync(
  path.join(root, 'vite.config.ts'),
  `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': '/src' },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
})
`,
  'utf8'
);

fs.writeFileSync(
  path.join(root, 'tailwind.config.js'),
  `export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
`,
  'utf8'
);

console.log('restore-complete');
