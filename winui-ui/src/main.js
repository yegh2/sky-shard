import { createApp, h, ref } from 'vue';
import { Button, ToggleButton } from 'winuionweb';
import 'winuionweb/style.css';
import './island.css';

const state = {
  server: ref('cn'),
  theme: ref('terminal')
};

let mounted = false;

function toggle(content, active, onClick) {
  return h(ToggleButton, {
    Content: content,
    IsChecked: active,
    class: 'winui-toggle',
    onClick
  });
}

function group(children) {
  return h('div', { class: 'winui-group' }, children);
}

function mountControls(el) {
  const app = createApp({
    render() {
      return h('div', { class: 'win-theme-scope theme-dark winui-island' }, [
        group([
          toggle('国服', state.server.value === 'cn', () => window.SkyUI?.switchServer('cn')),
          toggle('国际服', state.server.value === 'intl', () => window.SkyUI?.switchServer('intl'))
        ]),
        group([
          toggle('终端', state.theme.value === 'terminal', () => window.SkyUI?.switchTheme('terminal')),
          toggle('WinUI3', state.theme.value === 'winui', () => window.SkyUI?.switchTheme('winui')),
          toggle('玻璃', state.theme.value === 'glass', () => window.SkyUI?.switchTheme('glass'))
        ])
      ]);
    }
  });
  app.mount(el);
}

function mountActions(el) {
  const app = createApp({
    render() {
      return h('div', { class: 'win-theme-scope theme-dark winui-island-actions' }, [
        h(Button, {
          Content: '复制场次',
          class: 'winui-action',
          onClick: () => window.SkyUI?.copyNext()
        }),
        h(Button, {
          Content: '导出 .ics',
          class: 'winui-action',
          onClick: () => window.SkyUI?.exportICS()
        }),
        h(Button, {
          Content: '查看日历',
          class: 'winui-action',
          onClick: () => window.SkyUI?.toCalendar()
        })
      ]);
    }
  });
  app.mount(el);
}

function mount(controlsEl, actionsEl, initial) {
  if (!controlsEl || !actionsEl || mounted) return;
  state.server.value = initial?.server || 'cn';
  state.theme.value = initial?.theme || 'terminal';
  mountControls(controlsEl);
  mountActions(actionsEl);
  mounted = true;
  document.documentElement.classList.add('winui-components-ready');
}

function update(next) {
  if (!mounted || !next) return;
  state.server.value = next.server;
  state.theme.value = next.theme;
}

window.WinUIThemeControls = { mount, update };
