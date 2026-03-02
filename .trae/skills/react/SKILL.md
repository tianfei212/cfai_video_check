---
name: "react"
description: "提供 React/TSX 组件、Hooks、状态管理与性能优化的实现规范与模板。用户提出编写/重构 React 代码、修复交互或渲染问题时调用。"
---

# React

本技能用于在本仓库中高质量地编写、重构和排查 React（TS/TSX）代码，覆盖组件结构、Hooks 约束、状态与副作用管理、性能与可维护性。

## 何时调用

- 用户要求创建/修改 React 组件、页面或 UI 交互
- 用户反馈渲染异常、状态不同步、依赖数组错误、重复请求等典型 Hooks 问题
- 需要做性能优化（避免无效渲染、拆分组件、缓存计算/回调）
- 需要统一 TS 类型、Props 设计、事件处理与表单逻辑

## 交付目标

- 代码风格与项目现有约定一致
- 组件职责清晰、Props 接口稳定、状态更新可预测
- 副作用可控、依赖正确、无额外请求与内存泄漏
- 具备可验证性：能通过现有构建/类型检查/测试流程或提供最小验证步骤

## 工作流程

1. 先定位改动范围：相关页面/组件、数据流入口、API 调用点、类型定义位置
2. 识别模式：受控/非受控、提升状态或本地状态、是否需要 memo/useMemo/useCallback
3. 实施改动：保持最小改动集，优先复用已有组件/工具
4. 校验：类型检查、运行页面关键路径、覆盖常见边界场景（空值、加载中、错误态）

## 组件与类型规范

- Props：优先显式定义 interface/type，并给可选字段合理默认值
- 事件：对 DOM 事件使用 React 类型（如 React.ChangeEvent<HTMLInputElement>）
- 列表：key 稳定且与数据绑定，避免 index 作为 key（除非列表静态且不重排）
- 条件渲染：保证 loading/error/empty 三态清晰，避免深层嵌套三元

## Hooks 常见规则

- useEffect：依赖数组必须正确，避免在 effect 内随意读取外部可变值
- 异步请求：处理竞态与卸载后 setState（AbortController 或标志位）
- useMemo/useCallback：仅在确有收益时使用；依赖必须完整，不要为了消除 lint 警告而省略依赖
- 状态更新：涉及旧值时使用函数式更新 setX(prev => ...)

## 性能与可维护性

- 拆分组件：把频繁变化的局部状态与稳定展示拆开，减少父组件重渲染影响
- 选择合适的 state 粒度：避免把大对象整个放入 state 导致 diff 粗糙
- 计算下沉：复杂派生数据用 useMemo，避免每次渲染重复计算
- 事件下沉：把事件处理函数就近放置，必要时 useCallback 稳定引用

## 典型模板

### 受控输入

```tsx
import React from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function TextInput({ value, onChange }: Props) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full"
    />
  );
}
```

### 安全的异步 effect

```tsx
import React from "react";

type Result = { ok: boolean };

export function Example() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<Result | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();

    async function run() {
      setLoading(true);
      try {
        const res = await fetch("/api/example", { signal: controller.signal });
        const json = (await res.json()) as Result;
        setResult(json);
      } finally {
        setLoading(false);
      }
    }

    void run();
    return () => controller.abort();
  }, []);

  if (loading) return <div>Loading...</div>;
  return <pre>{JSON.stringify(result, null, 2)}</pre>;
}
```

## 输出要求

- 如涉及多文件变更：说明每个文件的职责变化与为什么这样改
- 如修复 bug：给出复现条件与验证方式
- 如引入新组件：提供建议的调用方式与 Props 说明
