# XBuilder Button V2.0 -> V1.0 Migration Mapping

本文用于评估并指导 `XBuilder V2.0` Button 视觉规范迁移到 `XBuilder V1.0` Button 设计库的方式。

## Scope

- V1.0 design source:
  - `ui/components/spx/builder-component.lib.pen`
- V2.0 design source:
  - 当前 Figma Desktop 选中节点
  - Figma file: `Z0ikT8bZrfkpD7mvJPavin`
  - Node: `5:12018`
- Only for:
  - `Button`
  - `Button-only icon`

## Conclusion

结论：可行，而且优先建议采用“样式迁移”而不是“组件体系重构”。

原因：

- V1.0 已经具备完整 Button 体系：
  - `size`: `Small / Medium / Large`
  - `state`: `Default / Hover / Click / Loading / Disabled / Focus`
  - `tone`: `Primary / Secondary / Boring / Danger / Success / White`，以及部分 `Blue / Purple`
  - `shape`: `Square / Circle`
  - `kind`: normal button / icon-only button
- V2.0 当前选中 Button 板的核心维度与 V1.0 是兼容的。
- 因此本次迁移的本质是：
  - 保留 V1.0 组件结构
  - 用 V2.0 的视觉规则覆盖 V1.0 的样式细节

## Recommended Strategy

本次建议采用三层策略：

1. Keep structure
- 保留 V1.0 组件 `id`
- 保留现有 state coverage
- 保留现有 size axis
- 保留现有 square / circle / icon-only 结构

2. Normalize naming by mapping
- 不强制第一阶段改组件命名
- 先建立 V2.0 -> V1.0 tone mapping
- 先在语义上完成对齐，再决定是否二阶段重命名

3. Replace style only
- 更新 fill / stroke / shadow / radius / padding / icon size / font size / focus feedback
- 不在第一阶段新增完全新的 Button taxonomy

## Core Mapping

### Tone Mapping

| V2.0 tone | V1.0 tone | Notes |
|----------|-----------|-------|
| `primary` | `Primary` | 直接映射 |
| `secondary` | `Secondary` | 直接映射 |
| `neutral` | `Boring` | 建议先保留 V1.0 命名，样式改成 V2.0 neutral |
| `white` | `White` | 直接映射 |
| `red` | `Danger` | 建议先保留 V1.0 命名，样式改成 V2.0 red |
| `green` | `Success` | 建议先保留 V1.0 命名，样式改成 V2.0 green |
| `blue` | `Blue` | 仅出现在 V2.0 icon-only circle 区域 |
| `purple` | `Purple` | 仅出现在 V2.0 icon-only circle 区域 |

### Size Mapping

| V2.0 size | V1.0 size | Actual height |
|-----------|-----------|---------------|
| `small (26)` | `Small` | `26px` |
| `medium (32)` | `Medium` | `32px` |
| `large (40)` | `Large` | `40px` |

### State Mapping

| V2.0 state | V1.0 state |
|------------|------------|
| `default` | `Default` |
| `hover` | `Hover` |
| `click` | `Click` |
| `loading` | `Loading` |
| `disabled` | `Disabled` |
| `focus` | `Focus` |

### Shape Mapping

| V2.0 shape | V1.0 shape | Notes |
|------------|------------|-------|
| `default` | `Square` | V1.0 用 `Square` 承接 V2.0 的常规文本按钮 |
| `circle` | `Circle` | 直接映射 |
| `square` | `Square` | 直接映射 |

## What To Edit In V1.0

### A. Filled text buttons

V2.0 中主矩阵的常规 filled button，建议落到 V1.0 的这几组：

- `Button/{Size}/Primary/Shadow/Square/{State}`
- `Button/{Size}/Secondary/Shadow/Square/{State}`
- `Button/{Size}/Boring/Shadow/Square/{State}`
- `Button/{Size}/Danger/Shadow/Square/{State}`
- `Button/{Size}/Success/Shadow/Square/{State}`

说明：

- 当前本地库已经按代码词表完成了按钮命名对齐
- 对齐 V2.0 时，filled button 在命名上仍使用 `Shadow` 这条轴，但视觉上可以继续采用“内容本体 + 无阴影”的规范
- 现有 [button-solid-migration-template.md](/Users/zengqingqing/workspace/builder/ui/docs/button-solid-migration-template.md) 可直接复用为这一层的迁移子流程

### B. White text buttons

V2.0 中的白底描边文本按钮，建议落到：

- `Button/{Size}/White/Stroke/Square/{State}`

说明：

- 这一支在 V1.0 已存在完整状态集
- 适合直接做视觉刷新，不需要重构结构

### C. Circle icon-only buttons

V2.0 中的圆形 icon-only 按钮，建议落到：

- `Button-only icon/Large/Primary/Shadow/Circle/{State}`
- `Button/Large/Danger/Shadow/Circle/{State}`
- `Button-only icon/Large/Success/Shadow/Circle/{State}`
- `Button-only icon/Large/Blue/Shadow/Circle/{State}`
- `Button-only icon/Large/Purple/Shadow/Circle/{State}`

说明：

- 这一层和 V2.0 的可见结构很接近
- 适合直接按 tone/state 重刷视觉

### D. Square icon-only buttons

V2.0 中的方形 icon-only 按钮，建议落到：

- `Button-only icon/{Size}/White/Flat/Square/{State}`
- `Button-only icon/{Size}/White/Stroke/Square/{State}`
- `Button-only icon/{Size}/Boring/Flat/Square/{State}`
- `Button-only icon/{Size}/Secondary/Flat/Square/{State}`

说明：

- 这里本质上承接的是 V2.0 的 `neutral / white / secondary` 小型方形操作按钮
- 如果 V2.0 最终要求描边更强，可以优先调整 `Stroke` 分支；如果要求纯白底轻操作感，则优先调整 `Flat`

## What Should Not Be Touched First

第一阶段不建议动这些：

- `Yellow` 相关旧分支
- V1.0 中未被 V2.0 当前按钮板覆盖的历史实验分支
- 组件 `id`
- 非 button 组件
- Button 命名体系的大规模重命名

## Migration Rules

### Rule 1: Migrate style, not topology

不要先拆组件树，不要先删状态，不要先合并 family。

优先改：

- fill
- stroke
- shadow
- padding
- font size
- text color
- icon size
- focus visual

### Rule 2: Update by family

按 family 批量迁移，不要只改单个 state。

例如：

- `Button/Medium/Primary/Shadow/Square/*`
- `Button/Small/Secondary/Shadow/Square/*`
- `Button-only icon/Large/Blue/Shadow/Circle/*`

必须保证同一 family 的 `Default / Hover / Click / Loading / Disabled / Focus` 一起更新。

### Rule 3: Keep semantic coverage

V2.0 当前已显式定义的状态，需要在 V1.0 里保留：

- `Default`
- `Hover`
- `Click`
- `Loading`
- `Disabled`
- `Focus`

不要因为 V2.0 看起来更简洁，就删掉 V1.0 的状态节点。

## Implementation Order

建议按下面顺序做：

1. Filled text button family
- `Primary`
- `Secondary`
- `Boring -> Neutral`
- `Danger -> Red`
- `Success -> Green`

2. White text button family
- `White / Stroke / Square`

3. Circle icon-only family
- `Primary`
- `Danger`
- `Success`
- `Blue`
- `Purple`

4. Square icon-only family
- `White`
- `Boring`
- `Secondary`

5. Optional second pass
- 统一命名
- 清理旧分支
- 补文档与 code mapping

## Current Local Library Status

截至当前本地设计库，按钮迁移已经有一部分实际落地：

1. Filled text button family
- `Button/{Small|Medium|Large}/{Primary|Secondary|Boring|Danger|Success}/Shadow/Square/{State}`
- 已完成与 `UIButton.vue` 词表的一致化命名
- 已完成“去阴影 + 把原本阴影占用的 4px 回填到内容本体”的样式归一化

2. Icon-only button family
- `Button-only icon/{Medium|Large}/Boring/Shadow/Square/{State}`
- `Button-only icon/Large/{Primary|Purple|Success|Blue}/Shadow/Circle/{State}`
- 已完成与 `UIButton.vue` 词表的一致化命名
- 已完成对应的去阴影与内容体高度回填

3. Duplicate cleanup
- 对选中的 `Button-only icon` 组件做过一次结构级去重
- 判定规则是：忽略根节点 `id / name / x / y / reusable`，其余样式与结构完全一致则视为重复
- 当前这批已处理的选中按钮中，完全重复组已清零

### Duplicate Cleanup Result

本轮清理中，以下重复组件已收敛到保留项：

| Keep | Removed |
|------|---------|
| `uKsxH` | `7sYrb`, `tIKkb` |
| `j1VUL` | `TUOVN` |
| `OUAnv` | `AEvhj`, `bDUvg` |
| `RiDLI` | `OPPHt` |
| `pVySI` | `0pVbW` |
| `lPF9N` | `szSDJ` |
| `oUrLb` | `AJExf` |
| `IJRdI` | `y4HI3` |
| `bbVGV` | `zqlYU` |

说明：

- 本次没有发现这些被删组件在 `ui/pages` 中被直接按底层 ID 引用
- 实际同步修改只发生在 `builder-component.lib.pen` 内部的 `slot` 聚合入口
- 页面层仍然通过聚合组件消费按钮，无需逐页改引用

### Page-level Check Result

已补查 `ui/pages/spx` 中通过别名导入 `builder-component.lib.pen` 的页面：

- `community-user.pen`
- `community-explore.pen`
- `editor-stage.pen`
- `tutorial.pen`
- `editor-map.pen`
- `community-search.pen`
- `editor-sprite.pen`
- `community-project.pen`
- `community-home.pen`

结论：

- 和本轮按钮去重直接相关的页面命中只出现在 `community-project.pen`
- 页面使用的是聚合入口 `8dhVn` (`Button-only icon/Default`)
- 因为聚合入口内部的 `slot` 已同步去重，所以页面层不需要额外改动

## Risks

### Low-risk

- tone color refresh
- shadow removal or weakening
- stroke color adjustment
- text/icon color refresh
- focus state样式更新

### Medium-risk

- `Flat` 和 `Stroke` 的边界重新定义
- `Square` icon-only family 到底采用 `Flat` 还是 `Stroke` 作为主规范

### Higher-risk

- 批量重命名 `Boring / Danger / Success`
- 删除旧 family
- 让 V1.0 taxonomy 完全变成 V2.0 taxonomy

## Final Recommendation

建议采用：

- Phase 1: `V2 visual spec -> V1 existing button families`
- Phase 2: optional naming cleanup

换句话说：

- 现在可以直接开始改 `builder-component.lib.pen` 的 button 样式
- 不需要先重构整个 V1.0 Button 设计系统
- 只要把迁移范围控制在 button family 内，这件事是可执行且可控的
