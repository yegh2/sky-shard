# Third-Party Notices

SKY::SHARD 的 WinUI 3 主题现在**真实打包并使用** [WinUIonWeb](https://github.com/Furry-Xiyi/WinUIonWeb) 的 Vue 3 控件；液态玻璃主题的视觉参考来自 [liquid-glass-webgl](https://github.com/martin65536/liquid-glass-webgl)，但该项目的渲染器是整屏 Canvas 场景，未直接打包到本站。

## WinUIonWeb（已打包）

- 项目：**Furry-Xiyi / WinUIonWeb**
- 链接：<https://github.com/Furry-Xiyi/WinUIonWeb>
- 许可证：**GNU General Public License v3.0 only (GPL-3.0-only)**
- 完整许可证：[LICENSE](LICENSE)
- 使用位置：`winui-controls.js` / `winui-controls.css`，由 `winui-ui/` 构建；WinUI 主题的服务器切换、风格切换、复制、导出与日历按钮均使用该库的 `ToggleButton` / `Button` 组件。
- 说明：因为打包了 GPL-3.0 代码，本仓库整体按 **GPL-3.0-only** 发布。构建入口、锁文件与完整对应源码在上游仓库和本仓库的 `winui-ui/` 中提供。
- 图标字体：包本身不包含从 Windows 提取的字体文件；控件使用本机安装的 `Segoe Fluent Icons`，不随本站分发字体。

WinUIonWeb 的构建还包含以下依赖：

| 依赖 | 版本 | 许可证 | 许可证文本 |
| --- | --- | --- | --- |
| Vue | 3.5.32 | MIT | [licenses/vue.txt](licenses/vue.txt) |
| MathLive | 0.111.1 | MIT | [licenses/mathlive.txt](licenses/mathlive.txt) |
| rtf.js | 3.0.9 | MIT | [licenses/rtf.js.txt](licenses/rtf.js.txt) |
| codepage | 1.15.0 | Apache-2.0 | [licenses/codepage.txt](licenses/codepage.txt) |

## liquid-glass-webgl（视觉参考）

- 项目：**martin65536 / liquid-glass-webgl**
- 链接：<https://github.com/martin65536/liquid-glass-webgl>
- 许可证：**GNU Affero General Public License v3.0 (AGPL-3.0)**
- 上游设计参考：**Kyant0 / AndroidLiquidGlass** — <https://github.com/Kyant0/AndroidLiquidGlass>
- 使用位置：液态玻璃主题的深色磨砂玻璃、镜面高光、边缘折射与流动背景的视觉语言。
- 说明：上游把完整的玻璃、文字和交互绘制在单个 WebGL Canvas 中，没有可嵌入普通 DOM 的组件边界；本站的 `glass-bg.js` 是独立的 WebGL 渲染器，实时采样背景并绘制面板的模糊、折射、色散与边缘高光，顶栏与按钮仍使用 CSS `backdrop-filter`。**没有复制或打包该仓库的渲染器代码**，因此本仓库不因它而适用 AGPL-3.0。

## Microsoft WinUI / Fluent Design

WinUI、Fluent Design、Windows 是 Microsoft Corporation 的商标或设计体系。本站与 Microsoft 无关联，也未获得其授权或认可。

## 游戏内容

《光·遇》（Sky: Children of the Light）及相关名称、素材版权归其版权方所有。本站是非官方玩家工具。
