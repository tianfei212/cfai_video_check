import type { TFunction } from 'i18next';
import { ReviewStatus, RiskLevel, type FilmVersion } from '../types';

export function getProjectDetailVersions(t: TFunction): FilmVersion[] {
  return [
    {
      id: 'v-102',
      versionName: t('v1.2 (终审版)'),
      uploadDate: '2023-11-25 14:20',
      status: ReviewStatus.APPROVED,
      aiScore: 99,
      riskLevel: RiskLevel.LOW,
      notes: t('根据第二次 AI 反馈修正了背景 logo 侵权风险。'),
    },
    {
      id: 'v-101',
      versionName: t('v1.1 (修改版)'),
      uploadDate: '2023-11-24 09:30',
      status: ReviewStatus.REJECTED,
      aiScore: 82,
      riskLevel: RiskLevel.MEDIUM,
      notes: t('AI 检测到第 42 秒存在未授权标志。'),
    },
    {
      id: 'v-100',
      versionName: t('v1.0 (原始素材)'),
      uploadDate: '2023-11-23 18:00',
      status: ReviewStatus.FLAGGED,
      aiScore: 65,
      riskLevel: RiskLevel.HIGH,
      notes: t('初次导入，自动启动全量扫描。'),
    },
  ];
}

