import React from 'react';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { MatchboxPage, type Shot, type Version, type Language } from 'cafai-matchbox';
import { ReviewStatus, type FilmVersion } from '../types';
import { getProjectDetailVersions } from '../data/projectVersions';

type DemoConfig = {
  defaultDemoId?: string;
  demos: Array<{
    id: string;
    name: string;
    typeJsonUrl: string;
    videoBaseUrl: string;
    thumbnailBaseUrl?: string;
    videoFilesByVersionId?: Record<string, string>;
    thumbnailFilesByVersionId?: Record<string, string>;
  }>;
};

const Matchbox: React.FC = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const searchParams = new URLSearchParams(location.search);
  const projectId = searchParams.get('projectId') || 'm1';
  const lang: Language = i18n.language.startsWith('zh') ? 'zh-CN' : 'en';
  const [loadedShot, setLoadedShot] = React.useState<Shot | null>(null);
  const [demoConfig, setDemoConfig] = React.useState<DemoConfig | null>(null);
  const [selectedDemoId, setSelectedDemoId] = React.useState<string>('');
  const [videoProbeSummary, setVideoProbeSummary] = React.useState<{ ok: number; total: number } | null>(null);
  const [shotRenderKey, setShotRenderKey] = React.useState<number>(0);

  React.useEffect(() => {
    document.title = t('Matchbox');
  }, [t]);

  const demoIdFromQuery = searchParams.get('demo') || '';
  const demoIdFromStorage = (() => {
    try {
      return localStorage.getItem('cafaiDemoId') || '';
    } catch {
      return '';
    }
  })();

  const statusToMatchbox = React.useCallback((status: ReviewStatus): Version['status'] => {
    if (status === ReviewStatus.APPROVED) return 'approved';
    if (status === ReviewStatus.REJECTED) return 'rejected';
    if (status === ReviewStatus.PROCESSING) return 'in_progress';
    return 'pending';
  }, []);

  const deriveVideoStem = React.useCallback((versionName: string) => {
    const m = versionName.match(/v\d+(?:\.\d+)*/i);
    if (m) return m[0];
    return versionName;
  }, []);

  const buildShotFromProjectDetail = React.useCallback(
    (baseShot: Partial<Shot> | null, versions: FilmVersion[]): Shot => {
      const shotVersions: Version[] = versions.map((v) => ({
        id: v.id,
        name: v.versionName,
        status: statusToMatchbox(v.status),
        author: 'CAFAI',
        timestamp: v.uploadDate,
        thumbnail: baseShot?.versions?.find((x) => x.id === v.id)?.thumbnail || `https://picsum.photos/seed/${encodeURIComponent(v.id)}/320/180`,
        description: v.notes,
        timeList: [{ id: `${v.id}-seg-1`, name: 'Full Shot', startFrame: 0, endFrame: 240 }],
        annotations: [],
      }));

      return {
        id: baseShot?.id || `shot-${projectId}`,
        code: baseShot?.code || `PJ-${projectId}`,
        description: baseShot?.description || 'Matchbox',
        versions: shotVersions,
        differences: baseShot?.differences || [],
      };
    },
    [projectId, statusToMatchbox]
  );

  const probePlayableVideo = React.useCallback(async (url: string) => {
    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: { Range: 'bytes=0-99' },
        cache: 'no-store',
      });
      if (!(res.status === 206 || res.status === 200)) return false;
      const ct = (res.headers.get('content-type') || '').toLowerCase();
      if (ct.includes('text/html')) return false;
      if (ct.startsWith('video/')) return true;
      if (ct.includes('application/octet-stream')) return true;
      return false;
    } catch {
      return false;
    }
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        const res = await fetch('/data/demo-config.json', { cache: 'no-store' });
        if (!res.ok) throw new Error(`GET /data/demo-config.json failed: ${res.status}`);
        const json = (await res.json()) as DemoConfig;
        if (cancelled) return;
        setDemoConfig(json);
        const initial =
          demoIdFromQuery ||
          demoIdFromStorage ||
          json.defaultDemoId ||
          (json.demos[0] ? json.demos[0].id : '');
        setSelectedDemoId(initial);
      } catch {
        if (cancelled) return;
        setDemoConfig({ demos: [] });
        setSelectedDemoId('');
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [demoIdFromQuery, demoIdFromStorage]);

  const selectedDemo = React.useMemo(() => {
    if (!demoConfig) return null;
    return demoConfig.demos.find((d) => d.id === selectedDemoId) || null;
  }, [demoConfig, selectedDemoId]);

  React.useEffect(() => {
    try {
      if (selectedDemoId) localStorage.setItem('cafaiDemoId', selectedDemoId);
    } catch {}
  }, [selectedDemoId]);

  React.useEffect(() => {
    const versions = getProjectDetailVersions(t);
    setLoadedShot(buildShotFromProjectDetail(null, versions));
  }, [buildShotFromProjectDetail, t, lang]);

  React.useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setVideoProbeSummary(null);
      const versions = getProjectDetailVersions(t);
      let baseShot: Partial<Shot> | null = null;
      if (selectedDemo?.typeJsonUrl) {
        try {
          const res = await fetch(selectedDemo.typeJsonUrl, { cache: 'no-store' });
          if (res.ok) baseShot = (await res.json()) as any;
        } catch {}
      }
      const shot = buildShotFromProjectDetail(baseShot, versions);
      const videoBase = selectedDemo?.videoBaseUrl || '/data/video_input';
      const nextVersions = await Promise.all(
        shot.versions.map(async (v) => {
          const stem = deriveVideoStem(v.name);
          const explicit = selectedDemo?.videoFilesByVersionId?.[v.id];
          const candidates = explicit
            ? [explicit]
            : [`${v.id}.mp4`, `${v.id}.mov`, `${v.id}.webm`, `${stem}.mp4`, `${stem}.mov`, `${stem}.webm`];
          for (const file of candidates) {
            const url = `${videoBase}/${encodeURIComponent(file)}`;
            const ok = await probePlayableVideo(url);
            if (ok) return { ...v, videoUrl: url };
          }
          return v;
        })
      );
      if (cancelled) return;
      const okCount = nextVersions.filter((v) => !!v.videoUrl).length;
      setVideoProbeSummary({ ok: okCount, total: nextVersions.length });
      setLoadedShot({ ...shot, versions: nextVersions });
      setShotRenderKey((k) => k + 1);
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [buildShotFromProjectDetail, deriveVideoStem, probePlayableVideo, t, lang, selectedDemo]);

  if (!loadedShot) {
    return (
      <div className="flex items-center justify-center h-screen bg-matchbox-bg text-matchbox-text">
        <div className="flex flex-col items-center gap-4 max-w-xl px-6 text-center">
          <div className="w-12 h-12 border-4 border-matchbox-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium animate-pulse">{t('正在加载演示数据…')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full">
      <div className="absolute z-[200] top-3 left-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex items-center gap-3">
        <span className="opacity-80">{t('演示数据')}</span>
        {demoConfig && demoConfig.demos.length > 0 ? (
          <select
            value={selectedDemoId}
            onChange={(e) => setSelectedDemoId(e.target.value)}
            className="bg-black/40 border border-white/10 rounded-lg px-2 py-1 text-xs text-white outline-none"
          >
            {demoConfig.demos.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        ) : (
          <span className="text-matchbox-text-dim">{t('未找到演示配置')}</span>
        )}
        {videoProbeSummary && (
          <span className="text-[10px] opacity-80">
            {videoProbeSummary.ok === videoProbeSummary.total ? t('视频可播放') : t('视频不可用')} ({videoProbeSummary.ok}/
            {videoProbeSummary.total})
          </span>
        )}
      </div>
      <MatchboxPage
        key={`${lang}:${selectedDemoId}:${shotRenderKey}`}
        lang={lang}
        initialShot={loadedShot}
        projectCode={`PJ-${projectId}`}
        totalFrames={240}
        persistVersionUpdate={(versionId, updates) => {
          setLoadedShot((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              versions: prev.versions.map((v) => (v.id === versionId ? ({ ...v, ...updates } as Version) : v)),
            };
          });
        }}
      />
    </div>
  );
};

export default Matchbox;
