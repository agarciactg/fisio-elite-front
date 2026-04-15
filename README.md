# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-39-10" src="https://github.com/user-attachments/assets/f72973ac-fdb2-4153-9a87-b9bf0d06378b" />
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-37-14" src="https://github.com/user-attachments/assets/14b2082b-4d90-4d59-8b3b-7b20f61d4024" />
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-37-26" src="https://github.com/user-attachments/assets/d18d7895-1aa7-45f0-a09a-acf617929783" />
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-37-34" src="https://github.com/user-attachments/assets/b2fb6fd3-92c6-447f-b4aa-3f92b6f5a017" />
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-37-50" src="https://github.com/user-attachments/assets/d587a3f7-adf8-4c46-81a8-738ab27881b1" />
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-38-04" src="https://github.com/user-attachments/assets/2465dc1b-00f1-4ee1-820d-d5a578879ce1" />
<img width="1904" height="993" alt="Screenshot from 2026-04-14 22-38-12" src="https://github.com/user-attachments/assets/7c37f877-413f-4888-8e6b-f5388a91fcce" />




