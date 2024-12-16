import { defineConfig } from 'vite';


export default defineConfig({
  base: '/toefl_timer/',
  server: {
    host: true,
    port: 3000
  },
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo: any) => {
          // public 폴더 파일을 assets 디렉토리로 복사
          if (assetInfo.name.includes('public')) {
            return 'assets/[name][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    }
  }
});
