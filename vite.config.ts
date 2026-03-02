import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const cafaiRoot = path.resolve(__dirname, '.');
    const matchboxRoot = path.resolve(__dirname, '../matchbox/frontend');
    const matchboxEntry = path.resolve(matchboxRoot, 'dist-lib/index.js');
    const matchboxStyle = path.resolve(matchboxRoot, 'dist-lib/style.css');
    const patchMatchboxTimelineHandle = () => {
      const re =
        /ce\.useEffect\(\(\) => \{\n\s*if \(b\.segmentIds\.length === 1\) \{\n\s*const O = \(b\.versionId === e\.id \? e : t\)\.timeList\.find\(\(j\) => j\.id === b\.segmentIds\[0\]\);\n\s*O && \(a\(Math\.floor\(\(O\.startFrame \+ O\.endFrame\) \/ 2\)\), c\(b\.versionId\)\);\n\s*\} else\n\s*a\(null\), c\(null\);\n\s*\}, \[b, e, t, a, c\]\);/;
      const to = `ce.useEffect(() => {
    if (b.segmentIds.length === 1) {
      if (l === b.versionId && o !== null) return;
      const O = (b.versionId === e.id ? e : t).timeList.find((j) => j.id === b.segmentIds[0]);
      O && (a(Math.floor((O.startFrame + O.endFrame) / 2)), c(b.versionId));
    } else
      a(null), c(null);
  }, [b.versionId, b.segmentIds, e.id, t.id, o, l, a, c]);`;
      return {
        name: 'patch-matchbox-timeline-handle',
        enforce: 'pre' as const,
        transform(code: string, id: string) {
          const cleanId = id.split('?')[0];
          if (cleanId !== matchboxEntry) return;
          if (!re.test(code)) return;
          return { code: code.replace(re, to), map: null };
        },
      };
    };
    return {
      server: {
        allowedHosts: ['hzs.xi-jin.cn'],
        port: 3000,
        host: '0.0.0.0',
        fs: {
          allow: [cafaiRoot, matchboxRoot],
        },
      },
      optimizeDeps: {
        exclude: ['cafai-matchbox'],
      },
      plugins: [patchMatchboxTimelineHandle(), react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: [
          { find: /^cafai-matchbox$/, replacement: matchboxEntry },
          { find: /^cafai-matchbox\/style\.css$/, replacement: matchboxStyle },
          { find: '@', replacement: cafaiRoot },
        ],
        dedupe: ['react', 'react-dom'],
      }
    };
});
