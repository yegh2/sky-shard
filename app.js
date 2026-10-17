(() => {
  'use strict';

  const CN_TZ = 'Asia/Shanghai';
  const PT_TZ = 'America/Los_Angeles';
  const CN_OFFSET = 8 * 60 * 60 * 1000;
  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  const WEEK = [
    { short: 'SUN', cn: '周日', label: '日' },
    { short: 'MON', cn: '周一', label: '一' },
    { short: 'TUE', cn: '周二', label: '二' },
    { short: 'WED', cn: '周三', label: '三' },
    { short: 'THU', cn: '周四', label: '四' },
    { short: 'FRI', cn: '周五', label: '五' },
    { short: 'SAT', cn: '周六', label: '六' }
  ];

  const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

  const SERVERS = {
    cn: {
      id: 'cn',
      short: 'CN',
      label: '国服',
      tz: CN_TZ,
      zoneShort: 'UTC+8',
      dayHint: 'UTC+8 自然日'
    },
    intl: {
      id: 'intl',
      short: 'INTL',
      label: '国际服',
      tz: PT_TZ,
      zoneShort: 'PT',
      dayHint: 'PACIFIC 00:00 切换'
    }
  };

  const TYPE_CN = { red: '红石', black: '黑石' };
  const TYPE_EN = { red: 'RED SHARD', black: 'BLACK SHARD' };

  const CN_MAPS = ['霞谷', '暮土', '禁阁', '云野', '雨林'];
  const CN_MAP_EN = {
    '霞谷': 'VALLEY OF TRIUMPH',
    '暮土': 'GOLDEN WASTELAND',
    '禁阁': 'VAULT OF KNOWLEDGE',
    '云野': 'DAYLIGHT PRAIRIE',
    '雨林': 'HIDDEN FOREST'
  };

  const CN_MAP_SHORT = {
    '霞谷': 'VALLEY',
    '暮土': 'WASTELAND',
    '禁阁': 'VAULT',
    '云野': 'PRAIRIE',
    '雨林': 'FOREST'
  };

  const CN_AREAS = {
    '霞谷': { 2: '滑冰场', 3: '滑冰场', 5: '圆梦村', 6: '圆梦村', 0: '雪隐峰' },
    '暮土': { 2: '边陲荒漠', 3: '远古战场', 5: '黑水港湾', 6: '巨兽荒原', 0: '失落方舟' },
    '禁阁': { 2: '星光沙漠', 3: '星光沙漠', 5: '商船星球', 6: '商船星球', 0: '商船星球' },
    '云野': { 2: '蝴蝶平原', 3: '仙乡', 5: '云顶浮石', 6: '幽光山洞', 0: '圣岛' },
    '雨林': { 2: '荧光森林', 3: '密林遗迹', 5: '大树屋', 6: '雨林神殿', 0: '秘密花园' }
  };

  const CN_RED_SLOTS = {
    5: [['11:08', '12:00'], ['17:08', '18:00'], ['23:08', '24:00']],
    6: [['10:08', '11:00'], ['14:08', '15:00'], ['22:08', '23:00']],
    0: [['07:08', '08:00'], ['13:08', '14:00'], ['19:08', '20:00']]
  };

  const CN_BLACK_SLOTS = {
    2: [['09:08', '10:00'], ['14:08', '15:00'], ['19:08', '20:00']],
    3: [['09:08', '10:00'], ['15:08', '16:00'], ['21:08', '22:00']]
  };

  const INTL_REALMS = [
    { key: 'prairie', cn: '云野', en: 'DAYLIGHT PRAIRIE', short: 'PRAIRIE' },
    { key: 'forest', cn: '雨林', en: 'HIDDEN FOREST', short: 'FOREST' },
    { key: 'valley', cn: '霞谷', en: 'VALLEY OF TRIUMPH', short: 'VALLEY' },
    { key: 'wasteland', cn: '暮土', en: 'GOLDEN WASTELAND', short: 'WASTELAND' },
    { key: 'vault', cn: '禁阁', en: 'VAULT OF KNOWLEDGE', short: 'VAULT' }
  ];

  const INTL_MAP_NAMES = {
    'prairie.butterfly': { cn: '蝴蝶原野', en: 'Butterfly Fields' },
    'prairie.village': { cn: '村庄/鲤鱼池', en: 'Village Islands' },
    'prairie.cave': { cn: '山洞', en: 'Prairie Cave' },
    'prairie.bird': { cn: '鸟巢', en: 'Bird Nest' },
    'prairie.island': { cn: '圣域群岛', en: 'Sanctuary Island' },
    'forest.brook': { cn: '小溪旁', en: 'Forest Brook' },
    'forest.boneyard': { cn: '埋骨之地', en: 'Boneyard' },
    'forest.end': { cn: '神庙后', en: 'Forest Garden' },
    'forest.tree': { cn: '树屋', en: 'Treehouse' },
    'forest.sunny': { cn: '树洞高处', en: 'Elevated Clearing' },
    'valley.rink': { cn: '滑冰场', en: 'Ice Rink' },
    'valley.dreams': { cn: '圆梦村', en: 'Village of Dreams' },
    'valley.hermit': { cn: '隐士山谷', en: 'Hermit Valley' },
    'wasteland.temple': { cn: '边陲荒漠', en: 'Broken Temple' },
    'wasteland.battlefield': { cn: '远古战场', en: 'Battlefield' },
    'wasteland.graveyard': { cn: '墓地', en: 'Graveyard' },
    'wasteland.crab': { cn: '螃蟹沙原', en: 'Crab Fields' },
    'wasteland.ark': { cn: '失落方舟', en: 'Forgotten Ark' },
    'vault.starlight': { cn: '星漠', en: 'Starlight Desert' },
    'vault.jelly': { cn: '水母湾', en: 'Jellyfish Cove' }
  };

  const INTL_GROUPS = [
    {
      code: 'a',
      type: 'black',
      gate: [1, 50],
      step: 8,
      noShard: [6, 0],
      maps: ['prairie.butterfly', 'forest.brook', 'valley.rink', 'wasteland.temple', 'vault.starlight']
    },
    {
      code: 'b',
      type: 'black',
      gate: [2, 10],
      step: 8,
      noShard: [0, 1],
      maps: ['prairie.village', 'forest.boneyard', 'valley.rink', 'wasteland.battlefield', 'vault.starlight']
    },
    {
      code: 'A',
      type: 'red',
      gate: [7, 40],
      step: 6,
      noShard: [1, 2],
      maps: ['prairie.cave', 'forest.end', 'valley.dreams', 'wasteland.graveyard', 'vault.jelly'],
      acDefault: 2,
      acOverrides: { 'forest.end': 2.5, 'valley.dreams': 2.5, 'vault.jelly': 3.5 }
    },
    {
      code: 'B',
      type: 'red',
      gate: [2, 20],
      step: 6,
      noShard: [2, 3],
      maps: ['prairie.bird', 'forest.tree', 'valley.dreams', 'wasteland.crab', 'vault.jelly'],
      acDefault: 2.5,
      acOverrides: { 'forest.tree': 3.5, 'vault.jelly': 3.5 }
    },
    {
      code: 'C',
      type: 'red',
      gate: [3, 30],
      step: 6,
      noShard: [3, 4],
      maps: ['prairie.island', 'forest.sunny', 'valley.hermit', 'wasteland.ark', 'vault.jelly'],
      acDefault: 3.5,
      acOverrides: { 'vault.jelly': 3.5 }
    }
  ];

  const pad2 = (n) => String(n).padStart(2, '0');
  const pad3 = (n) => String(n).padStart(3, '0');

  function utcDate(y, m, d) {
    return new Date(Date.UTC(y, m - 1, d));
  }

  function dayOfWeek(y, m, d) {
    return utcDate(y, m, d).getUTCDay();
  }

  function addDays(y, m, d, amount) {
    const dt = new Date(Date.UTC(y, m - 1, d + amount));
    return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
  }

  function daysInMonth(y, m) {
    return new Date(Date.UTC(y, m, 0)).getUTCDate();
  }

  const zoneFormatters = new Map();
  const offsetFormatters = new Map();

  function zoneFormatter(tz) {
    if (!zoneFormatters.has(tz)) {
      zoneFormatters.set(tz, new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        weekday: 'short',
        hourCycle: 'h23'
      }));
    }
    return zoneFormatters.get(tz);
  }

  function offsetFormatter(tz) {
    if (!offsetFormatters.has(tz)) {
      offsetFormatters.set(tz, new Intl.DateTimeFormat('en-US', {
        timeZone: tz,
        timeZoneName: 'longOffset',
        hourCycle: 'h23'
      }));
    }
    return offsetFormatters.get(tz);
  }

  function zonedParts(ts, tz) {
    if (tz === CN_TZ) {
      const d = new Date(ts + CN_OFFSET);
      return {
        y: d.getUTCFullYear(),
        m: d.getUTCMonth() + 1,
        d: d.getUTCDate(),
        h: d.getUTCHours(),
        min: d.getUTCMinutes(),
        s: d.getUTCSeconds(),
        dow: d.getUTCDay(),
        dateKey: `${d.getUTCFullYear()}-${pad2(d.getUTCMonth() + 1)}-${pad2(d.getUTCDate())}`
      };
    }

    const parts = Object.fromEntries(
      zoneFormatter(tz).formatToParts(new Date(ts)).map((part) => [part.type, part.value])
    );
    const wd = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }[parts.weekday];
    return {
      y: Number(parts.year),
      m: Number(parts.month),
      d: Number(parts.day),
      h: Number(parts.hour),
      min: Number(parts.minute),
      s: Number(parts.second),
      dow: wd,
      dateKey: `${parts.year}-${parts.month}-${parts.day}`
    };
  }

  function zoneOffsetMinutes(ts, tz) {
    if (tz === CN_TZ) return 480;
    let name = '';
    try {
      name = offsetFormatter(tz).formatToParts(new Date(ts)).find((part) => part.type === 'timeZoneName')?.value || '';
    } catch (err) {
      return 0;
    }
    const match = name.match(/GMT([+-])(\d{1,2})(?::?(\d{2}))?/);
    if (!match) return 0;
    return (match[1] === '-' ? -1 : 1) * (Number(match[2]) * 60 + Number(match[3] || 0));
  }

  function wallToTs(y, m, d, h, min, tz) {
    if (tz === CN_TZ) {
      return Date.UTC(y, m - 1, d, h, min, 0, 0) - CN_OFFSET;
    }

    const target = Date.UTC(y, m - 1, d, h, min, 0, 0);
    let ts = target - zoneOffsetMinutes(target, tz) * MINUTE;

    for (let i = 0; i < 4; i += 1) {
      const offset = zoneOffsetMinutes(ts, tz);
      const next = target - offset * MINUTE;
      if (next === ts) break;
      ts = next;
    }

    const current = zonedParts(ts, tz);
    if (current.y === y && current.m === m && current.d === d && current.h === h && current.min === min) {
      return ts;
    }

    for (const delta of [60, -60, 120, -120]) {
      const candidate = ts + delta * MINUTE;
      const p = zonedParts(candidate, tz);
      if (p.y === y && p.m === m && p.d === d && p.h === h && p.min === min) {
        return candidate;
      }
    }

    return ts + HOUR;
  }

  function localParts(ts) {
    const d = new Date(ts);
    return {
      y: d.getFullYear(),
      m: d.getMonth() + 1,
      d: d.getDate(),
      h: d.getHours(),
      min: d.getMinutes(),
      s: d.getSeconds(),
      dow: d.getDay(),
      dateKey: `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`
    };
  }

  function localDateKey(ts) {
    return localParts(ts).dateKey;
  }

  function keyToUtc(key) {
    const [y, m, d] = key.split('-').map(Number);
    return Date.UTC(y, m - 1, d);
  }

  function keyDiff(a, b) {
    return Math.round((keyToUtc(a) - keyToUtc(b)) / DAY);
  }

  function crossTag(ts, baseKey) {
    const diff = keyDiff(localDateKey(ts), baseKey);
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return String(diff);
    return '';
  }

  function formatLocalTime(ts) {
    const p = localParts(ts);
    return `${pad2(p.h)}:${pad2(p.min)}`;
  }

  function formatLocalTimeTag(ts, baseKey) {
    return `${formatLocalTime(ts)}${crossTag(ts, baseKey)}`;
  }

  function formatLocalDate(ts) {
    const p = localParts(ts);
    return `${p.y}.${pad2(p.m)}.${pad2(p.d)}`;
  }

  function formatLocalDateTime(ts) {
    const p = localParts(ts);
    return `${p.y}.${pad2(p.m)}.${pad2(p.d)} ${pad2(p.h)}:${pad2(p.min)}:${pad2(p.s)}`;
  }

  function formatWindow(start, end, baseKey) {
    return `${formatLocalTimeTag(start, baseKey)}–${formatLocalTimeTag(end, baseKey)}`;
  }

  function formatDateShort(day) {
    return `${pad2(day.m)}.${pad2(day.d)}`;
  }

  function formatDateLong(day) {
    return `${day.y}.${pad2(day.m)}.${pad2(day.d)} ${WEEK[day.dow].short}`;
  }

  function relativeLocal(ts, now) {
    const a = localParts(ts);
    const b = localParts(now);
    const diff = keyDiff(a.dateKey, b.dateKey);
    if (diff === 0) return '今天';
    if (diff === 1) return '明天';
    if (diff === 2) return '后天';
    return `${a.m} 月 ${a.d} 日`;
  }

  function formatDurationShort(minutes) {
    if (minutes >= 60) {
      return `${Math.floor(minutes / 60)}H${pad2(minutes % 60)}M`;
    }
    return `${minutes} MIN`;
  }

  function formatDurationHuman(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (d > 0) return `${d} 天 ${h} 小时 ${m} 分`;
    if (h > 0) return `${h} 小时 ${m} 分 ${s} 秒`;
    return `${m} 分 ${s} 秒`;
  }

  function formatOffset(minutes) {
    const sign = minutes >= 0 ? '+' : '-';
    const abs = Math.abs(minutes);
    return `UTC${sign}${pad2(Math.floor(abs / 60))}:${pad2(abs % 60)}`;
  }

  function localOffsetLabel() {
    return formatOffset(-new Date().getTimezoneOffset());
  }

  function formatHMFromMinutes(minutes) {
    const normalized = ((minutes % 1440) + 1440) % 1440;
    return `${pad2(Math.floor(normalized / 60))}:${pad2(normalized % 60)}`;
  }

  function gameParts(ts, serverId) {
    return zonedParts(ts, SERVERS[serverId].tz);
  }

  function cnBlackCandidate(d, dow) {
    return d <= 15 ? dow === 2 : dow === 3;
  }

  function cnBlackCancelled(y, m, d, dow) {
    if (!cnBlackCandidate(d, dow)) return false;
    if (dow === 2) {
      const next = addDays(y, m, d, 1);
      return next.y !== y || next.m !== m;
    }
    const prev = addDays(y, m, d, -1);
    return prev.y !== y || prev.m !== m;
  }

  function cnReward(type) {
    return type === 'red' ? '升华蜡烛' : '烛火 ≈200';
  }

  function intlReward(group, mapKey) {
    if (group.type === 'black') return '烛火 ≈200';
    const value = group.acOverrides?.[mapKey] ?? group.acDefault ?? 2;
    return `升华蜡烛 ×${value}`;
  }

  function makeCnDay(y, m, d) {
    const dow = dayOfWeek(y, m, d);
    const red = d <= 15 ? (dow === 6 || dow === 0) : (dow === 5 || dow === 0);
    const blackCandidate = cnBlackCandidate(d, dow);
    const cancelled = blackCandidate && cnBlackCancelled(y, m, d, dow);
    const type = red ? 'red' : (blackCandidate ? 'black' : null);
    const hasShard = red || (blackCandidate && !cancelled);
    const realm = CN_MAPS[d % 5];
    const area = CN_AREAS[realm][dow] || null;
    const dayStart = wallToTs(y, m, d, 0, 0, CN_TZ);
    const nextDate = addDays(y, m, d, 1);
    const dayEnd = wallToTs(nextDate.y, nextDate.m, nextDate.d, 0, 0, CN_TZ);

    const day = {
      server: 'cn',
      y,
      m,
      d,
      dow,
      dateKey: `${y}-${pad2(m)}-${pad2(d)}`,
      type,
      hasShard,
      cancelled,
      realm,
      realmEn: CN_MAP_EN[realm],
      area,
      mapIndex: d % 5,
      groupCode: type === 'red' ? 'R' : (type === 'black' ? 'B' : null),
      groupLabel: type === 'red' ? 'RED' : (type === 'black' ? 'BLACK' : null),
      reward: type ? cnReward(type) : null,
      dayStart,
      dayEnd,
      events: []
    };

    if (hasShard) {
      const slots = type === 'red' ? CN_RED_SLOTS[dow] : CN_BLACK_SLOTS[dow];
      day.events = slots.map(([startLabel, endLabel], index) => {
        const [sh, sm] = startLabel.split(':').map(Number);
        const [eh, em] = endLabel.split(':').map(Number);
        const start = wallToTs(y, m, d, sh, sm, CN_TZ);
        const end = wallToTs(y, m, d, eh, em, CN_TZ);
        return {
          id: `cn-${y}${pad2(m)}${pad2(d)}-${index + 1}`,
          server: 'cn',
          type,
          groupCode: day.groupCode,
          groupLabel: day.groupLabel,
          index: index + 1,
          day,
          start,
          gate: null,
          land: start,
          end,
          window: formatWindow(start, end, day.dateKey),
          startLabel: formatLocalTimeTag(start, day.dateKey),
          endLabel: formatLocalTimeTag(end, day.dateKey),
          gateLabel: null,
          durationMinutes: Math.round((end - start) / MINUTE),
          reward: day.reward
        };
      });
    }

    return day;
  }

  function makeIntlDay(y, m, d) {
    const dow = dayOfWeek(y, m, d);
    const odd = d % 2 === 1;
    const type = odd ? 'red' : 'black';
    const groupIndex = odd ? ((((d - 1) / 2) % 3) + 2) : ((d / 2) % 2);
    const group = INTL_GROUPS[groupIndex];
    const hasShard = !group.noShard.includes(dow);
    const mapIndex = (d - 1) % 5;
    const realm = INTL_REALMS[mapIndex];
    const mapKey = group.maps[mapIndex];
    const area = INTL_MAP_NAMES[mapKey];
    const dayStart = wallToTs(y, m, d, 0, 0, PT_TZ);
    const nextDate = addDays(y, m, d, 1);
    const dayEnd = wallToTs(nextDate.y, nextDate.m, nextDate.d, 0, 0, PT_TZ);
    const reward = intlReward(group, mapKey);

    const day = {
      server: 'intl',
      y,
      m,
      d,
      dow,
      dateKey: `${y}-${pad2(m)}-${pad2(d)}`,
      type,
      hasShard,
      cancelled: false,
      realm: realm.cn,
      realmEn: realm.en,
      area: area.cn,
      areaEn: area.en,
      mapKey,
      mapIndex,
      groupCode: group.code,
      groupLabel: `${type === 'red' ? 'RED' : 'BLACK'} ${group.code}`,
      reward,
      dayStart,
      dayEnd,
      events: []
    };

    if (hasShard) {
      const gateStart = wallToTs(y, m, d, group.gate[0], group.gate[1], PT_TZ);
      day.events = Array.from({ length: 3 }, (_, index) => {
        const gate = gateStart + index * group.step * HOUR;
        const land = gate + 8 * MINUTE + 40 * 1000;
        const end = gate + 4 * HOUR;
        return {
          id: `intl-${y}${pad2(m)}${pad2(d)}-${index + 1}`,
          server: 'intl',
          type,
          groupCode: group.code,
          groupLabel: day.groupLabel,
          index: index + 1,
          day,
          start: gate,
          gate,
          land,
          end,
          window: formatWindow(land, end, day.dateKey),
          startLabel: formatLocalTimeTag(land, day.dateKey),
          endLabel: formatLocalTimeTag(end, day.dateKey),
          gateLabel: formatLocalTimeTag(gate, day.dateKey),
          durationMinutes: Math.ceil((end - land) / MINUTE),
          reward
        };
      });
    }

    return day;
  }

  function makeDay(serverId, y, m, d) {
    return serverId === 'cn' ? makeCnDay(y, m, d) : makeIntlDay(y, m, d);
  }

  function computeSchedule(now, serverId) {
    const gp = gameParts(now, serverId);
    const today = makeDay(serverId, gp.y, gp.m, gp.d);
    let active = null;
    let next = null;

    for (let offset = -1; offset <= 42; offset += 1) {
      const date = addDays(gp.y, gp.m, gp.d, offset);
      const day = makeDay(serverId, date.y, date.m, date.d);
      for (const event of day.events) {
        if (now >= event.land && now < event.end && !active) {
          active = event;
        }
        if (event.land > now && (!next || event.land < next.land)) {
          next = event;
        }
      }
    }

    return {
      now,
      server: serverId,
      gameParts: gp,
      today,
      active,
      next,
      displayDay: active ? active.day : (next ? next.day : today)
    };
  }

  function getPhase(schedule, now) {
    if (schedule.active) {
      return schedule.active.end - now <= 5 * MINUTE ? 'ending' : 'live';
    }
    if (schedule.next && schedule.next.server === 'intl' && now >= schedule.next.start && now < schedule.next.land) {
      return 'incoming';
    }
    if (schedule.next && schedule.next.land - now <= 30 * MINUTE) {
      return 'soon';
    }
    return 'idle';
  }

  function findNextEventFromDayStart(day) {
    const from = day.dayStart;
    for (let offset = 0; offset <= 42; offset += 1) {
      const date = addDays(day.y, day.m, day.d, offset);
      const candidate = makeDay(day.server, date.y, date.m, date.d);
      for (const event of candidate.events) {
        if (event.land > from) return event;
      }
    }
    return null;
  }

  function findFirstEventDay(serverId, y, m) {
    const total = daysInMonth(y, m);
    for (let d = 1; d <= total; d += 1) {
      const day = makeDay(serverId, y, m, d);
      if (day.events.length) return day;
    }
    return makeDay(serverId, y, m, 1);
  }

  const $ = (id) => document.getElementById(id);

  const els = {
    clock: $('clock'),
    tzLabel: $('tzLabel'),
    sysLed: $('sysLed'),
    sysState: $('sysState'),
    gameDayLabel: $('gameDayLabel'),
    localZoneLabel: $('localZoneLabel'),
    modeHint: $('modeHint'),
    kickerCode: $('kickerCode'),
    heroTitle: $('heroTitle'),
    statusPill: $('statusPill'),
    statusText: $('statusText'),
    heroSub: $('heroSub'),
    cdD: $('cdD'),
    cdH: $('cdH'),
    cdM: $('cdM'),
    cdS: $('cdS'),
    ms: $('ms'),
    targetLabel: $('targetLabel'),
    targetIso: $('targetIso'),
    heroWindow: $('heroWindow'),
    heroFootTime: $('heroFootTime'),
    copyBtn: $('copyBtn'),
    icsBtn: $('icsBtn'),
    winuiControls: $('winuiControls'),
    winuiActions: $('winuiActions'),
    eventCode: $('eventCode'),
    nextType: $('nextType'),
    nextGroup: $('nextGroup'),
    nextRealmEn: $('nextRealmEn'),
    nextRealm: $('nextRealm'),
    nextMapCode: $('nextMapCode'),
    nextArea: $('nextArea'),
    nextDate: $('nextDate'),
    nextWindow: $('nextWindow'),
    nextMetaType: $('nextMetaType'),
    nextServer: $('nextServer'),
    nextStartLabel: $('nextStartLabel'),
    nextStart: $('nextStart'),
    nextStatus: $('nextStatus'),
    queueTitle: $('queueTitle'),
    queueDate: $('queueDate'),
    queueList: $('queueList'),
    sideNote: $('sideNote'),
    telemetryServer: $('telemetryServer'),
    telemetryZone: $('telemetryZone'),
    telemetryWindow: $('telemetryWindow'),
    forecastNote: $('forecastNote'),
    calendarNote: $('calendarNote'),
    daysGrid: $('daysGrid'),
    calDetail: $('calDetail'),
    calYear: $('calYear'),
    calMonth: $('calMonth'),
    prevMonth: $('prevMonth'),
    nextMonth: $('nextMonth'),
    todayBtn: $('todayBtn'),
    calGrid: $('calGrid'),
    selCode: $('selCode'),
    selDayNum: $('selDayNum'),
    selMonthYear: $('selMonthYear'),
    selRealm: $('selRealm'),
    selArea: $('selArea'),
    selBadge: $('selBadge'),
    selSessions: $('selSessions'),
    selCopy: $('selCopy'),
    selNote: $('selNote'),
    rulesNote: $('rulesNote'),
    ruleFormulaLabel: $('ruleFormulaLabel'),
    ruleFormula: $('ruleFormula'),
    ruleSlotsLabel: $('ruleSlotsLabel'),
    ruleSlots: $('ruleSlots'),
    ruleMapsLabel: $('ruleMapsLabel'),
    ruleMaps: $('ruleMaps'),
    ruleNotes: $('ruleNotes'),
    toast: $('toast'),
    copyDialog: $('copyDialog'),
    copyArea: $('copyArea'),
    copyClose: $('copyClose'),
    srStatus: $('srStatus'),
    footerTz: $('footerTz'),
    footerYear: $('footerYear')
  };

  const state = {
    server: 'cn',
    theme: 'terminal',
    schedule: null,
    lastGameDayKey: null,
    lastPhase: null,
    lastOffsetLabel: null,
    forecastTodayMarker: null,
    forecastDayStart: null,
    forecastDaySpan: null,
    cal: {
      year: 0,
      month: 0,
      selectedKey: null,
      selected: null
    },
    toastTimer: null
  };

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add('is-visible');
    if (state.toastTimer) clearTimeout(state.toastTimer);
    state.toastTimer = setTimeout(() => {
      els.toast.classList.remove('is-visible');
    }, 3000);
  }

  async function copyText(text) {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        toast('已复制到剪贴板');
        return true;
      }
    } catch (err) {
      // Fall through to the legacy path.
    }

    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.top = '0';
    area.style.left = '-9999px';
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch (err) {
      ok = false;
    }
    area.remove();

    if (ok) {
      toast('已复制到剪贴板');
      return true;
    }

    showCopyDialog(text);
    toast('自动复制受限，已打开手动复制窗口');
    return false;
  }

  function showCopyDialog(text) {
    if (!els.copyDialog || !els.copyArea) return;
    els.copyArea.value = text;
    if (typeof els.copyDialog.showModal === 'function') {
      if (!els.copyDialog.open) els.copyDialog.showModal();
    } else {
      els.copyDialog.setAttribute('open', '');
    }
    window.setTimeout(() => {
      els.copyArea.focus();
      els.copyArea.select();
    }, 60);
  }

  function statusLabel(phase) {
    return {
      live: 'LIVE',
      ending: 'ENDING',
      incoming: 'INCOMING',
      soon: 'SOON',
      idle: 'STANDBY'
    }[phase] || 'STANDBY';
  }

  function typeName(type) {
    return TYPE_CN[type] || '碎石';
  }

  function renderHero(schedule, phase) {
    const active = schedule.active;
    const next = schedule.next;
    const focus = active || next;

    document.body.dataset.stone = focus ? focus.type : 'red';
    els.statusPill.classList.remove('is-live', 'is-soon', 'is-incoming');
    document.body.classList.toggle('is-live', Boolean(active));

    if (!focus) {
      els.heroTitle.innerHTML = '下一次<span class="accent">碎石</span>';
      els.heroSub.textContent = '暂时没有可计算的场次。';
      els.statusText.textContent = 'STANDBY';
      els.sysState.textContent = 'STANDBY';
      els.sysLed.classList.remove('is-live');
      return;
    }

    els.kickerCode.textContent = `${SERVERS[state.server].short}-01`;
    els.heroWindow.textContent = `WINDOW ${formatDurationShort(focus.durationMinutes)}`;

    if (active) {
      els.heroTitle.innerHTML = active.type === 'red'
        ? '红石雨<span class="accent">进行中</span>'
        : '黑石<span class="accent">降落中</span>';
      els.statusText.textContent = statusLabel(phase);
      els.statusPill.classList.add(phase === 'ending' ? 'is-soon' : 'is-live');
      els.heroSub.textContent = phase === 'ending'
        ? `${typeName(active.type)}本场将在 5 分钟内结束，不建议卡点前往。`
        : `${typeName(active.type)}正在降落 · ${active.day.realm} · ${active.day.area} · ${active.window}。每日仅首场计入奖励。`;
      els.sysState.textContent = statusLabel(phase);
      els.sysLed.classList.add('is-live');
      return;
    }

    if (phase === 'incoming') {
      els.heroTitle.innerHTML = next.type === 'red'
        ? '红石雨<span class="accent">即将落地</span>'
        : '黑石<span class="accent">即将落地</span>';
      els.statusText.textContent = 'INCOMING';
      els.statusPill.classList.add('is-incoming');
      els.heroSub.textContent = `${typeName(next.type)}即将落地 · ${next.day.realm} · ${next.day.area} · ${formatLocalTime(next.land)}。`;
      els.sysState.textContent = 'INCOMING';
      els.sysLed.classList.add('is-live');
      return;
    }

    els.heroTitle.innerHTML = next.type === 'red'
      ? '下一次<span class="accent">红石雨</span>'
      : '下一次<span class="accent">黑石</span>';
    els.statusText.textContent = statusLabel(phase);
    if (phase === 'soon') els.statusPill.classList.add('is-soon');
    els.heroSub.textContent = `下一场${typeName(next.type)}：${relativeLocal(next.land, schedule.now)} ${formatLocalTime(next.land)} · ${next.day.realm} · ${next.day.area}。当天 ${next.day.events.length} 场。`;
    els.sysState.textContent = statusLabel(phase);
    els.sysLed.classList.toggle('is-live', phase === 'soon');
  }

  function renderSide(schedule, phase) {
    const focus = schedule.active || schedule.next;
    if (!focus) return;

    const cfg = SERVERS[state.server];
    const day = focus.day;
    els.eventCode.textContent = `${cfg.short}-${day.dateKey.slice(2).replace(/-/g, '')}-${focus.groupCode}${focus.index}`;
    els.nextType.textContent = TYPE_EN[focus.type];
    els.nextType.classList.toggle('is-black', focus.type === 'black');
    els.nextGroup.textContent = state.server === 'intl' ? `GROUP ${focus.groupCode}` : `CN · ${focus.groupLabel}`;
    els.nextRealmEn.textContent = day.realmEn;
    els.nextRealm.textContent = day.realm;
    els.nextMapCode.textContent = `MAP ${pad2(day.mapIndex)}`;
    els.nextArea.textContent = day.area;
    els.nextDate.textContent = formatDateLong(day);
    els.nextWindow.textContent = focus.window;
    els.nextMetaType.textContent = state.server === 'intl' ? focus.groupLabel : TYPE_EN[focus.type];
    els.nextServer.textContent = `${cfg.label} · ${cfg.zoneShort}`;
    els.nextStartLabel.textContent = focus.gate ? 'GATE' : 'START';
    els.nextStart.textContent = focus.gate
      ? formatLocalTimeTag(focus.gate, day.dateKey)
      : formatLocalTimeTag(focus.land, day.dateKey);
    els.nextStatus.textContent = statusLabel(phase);
    els.sideNote.innerHTML = `<span>REWARD</span>${focus.reward} · 每日仅首场计入`;
  }

  function renderQueue(schedule) {
    const day = schedule.displayDay;
    const now = Date.now();
    const isToday = day.dateKey === schedule.today.dateKey;

    els.queueTitle.textContent = isToday ? 'TODAY / 今日场次' : 'NEXT DAY / 下场日';
    els.queueDate.textContent = `${formatDateShort(day)} ${WEEK[day.dow].short} · ${day.groupLabel || TYPE_EN[day.type]}`;
    els.queueList.replaceChildren();

    let nextMarked = false;

    for (const event of day.events) {
      let key = 'queued';
      let label = '—';

      if (now >= event.end) {
        key = 'done';
        label = 'DONE';
      } else if (now >= event.land) {
        key = 'live';
        label = 'LIVE';
      } else if (event.gate && now >= event.start) {
        key = 'incoming';
        label = 'GATE';
      } else if (!nextMarked) {
        key = 'next';
        label = 'NEXT';
        nextMarked = true;
      }

      const item = document.createElement('li');
      item.className = `q-item is-${key}`;

      const index = document.createElement('span');
      index.className = 'q-idx';
      index.textContent = pad2(event.index);

      const time = document.createElement('span');
      time.className = 'q-time';
      time.textContent = formatLocalTime(event.land);
      const tag = crossTag(event.land, day.dateKey);
      if (tag) {
        const small = document.createElement('small');
        small.className = 'cross-tag';
        small.textContent = tag;
        time.appendChild(small);
      }

      const place = document.createElement('span');
      place.className = 'q-place';
      place.textContent = day.area;

      const status = document.createElement('span');
      status.className = 'q-status';
      status.textContent = label;

      item.append(index, time, place, status);
      els.queueList.appendChild(item);
    }
  }

  function renderForecast(schedule) {
    const now = Date.now();
    els.daysGrid.replaceChildren();
    state.forecastTodayMarker = null;
    state.forecastDayStart = null;
    state.forecastDaySpan = null;

    for (let offset = 0; offset < 7; offset += 1) {
      const date = addDays(schedule.today.y, schedule.today.m, schedule.today.d, offset);
      const day = makeDay(state.server, date.y, date.m, date.d);
      const isToday = day.dateKey === schedule.today.dateKey;
      const card = document.createElement('article');
      card.className = 'day';
      if (day.hasShard) card.classList.add(day.type === 'red' ? 'is-red' : 'is-black');
      else card.classList.add('is-empty');
      if (isToday) card.classList.add('is-today');

      const sessionsText = day.events.map((event) => event.startLabel).join(' / ');
      card.setAttribute(
        'aria-label',
        `${day.y}年${day.m}月${day.d}日 ${WEEK[day.dow].cn}，${day.hasShard ? `${TYPE_CN[day.type]} ${day.groupLabel}，${day.realm}${day.area}，${sessionsText}` : '无碎石'}`
      );

      const top = document.createElement('div');
      top.className = 'day-top';

      const dow = document.createElement('span');
      dow.className = 'dow';
      dow.textContent = `${WEEK[day.dow].short} / ${WEEK[day.dow].label}`;

      const dateEl = document.createElement('time');
      dateEl.className = 'date';
      dateEl.dateTime = day.dateKey;
      dateEl.textContent = formatDateShort(day);

      top.append(dow, dateEl);

      const flag = document.createElement('div');
      flag.className = 'day-flag';
      flag.textContent = day.hasShard
        ? (state.server === 'intl' ? `${day.type === 'red' ? 'RED' : 'BLACK'} ${day.groupCode}` : (day.type === 'red' ? 'RED' : 'BLACK'))
        : 'NO SHARD';

      const loc = document.createElement('div');
      loc.className = 'day-loc';
      if (day.hasShard) {
        const realm = document.createElement('span');
        realm.className = 'realm';
        realm.textContent = day.realm;
        const area = document.createElement('span');
        area.textContent = day.area;
        loc.append(realm, area);
      } else {
        const dash = document.createElement('span');
        dash.textContent = day.cancelled ? '跨月取消' : '—';
        loc.appendChild(dash);
      }

      const track = document.createElement('div');
      track.className = 'day-track';
      track.setAttribute('aria-hidden', 'true');
      const span = day.dayEnd - day.dayStart;

      for (const event of day.events) {
        const segment = document.createElement('span');
        segment.className = 'day-seg';
        segment.style.left = `${Math.max(0, ((event.land - day.dayStart) / span) * 100)}%`;
        segment.style.width = `${Math.max(0.35, ((event.end - event.land) / span) * 100)}%`;
        track.appendChild(segment);
      }

      if (isToday && now >= day.dayStart && now < day.dayEnd) {
        const marker = document.createElement('span');
        marker.className = 'day-now';
        marker.style.left = `${Math.min(100, Math.max(0, ((now - day.dayStart) / span) * 100))}%`;
        track.appendChild(marker);
        state.forecastTodayMarker = marker;
        state.forecastDayStart = day.dayStart;
        state.forecastDaySpan = span;
      }

      const times = document.createElement('div');
      times.className = 'day-times';
      if (day.hasShard) {
        for (const event of day.events) {
          const time = document.createElement('span');
          time.textContent = formatLocalTime(event.land);
          const tag = crossTag(event.land, day.dateKey);
          if (tag) {
            const small = document.createElement('small');
            small.className = 'cross-tag';
            small.textContent = tag;
            time.appendChild(small);
          }
          times.appendChild(time);
        }
      } else {
        const none = document.createElement('span');
        none.textContent = 'NO SHARD';
        times.appendChild(none);
      }

      card.append(top, flag, loc, track, times);
      els.daysGrid.appendChild(card);
    }

    const filler = document.createElement('div');
    filler.className = 'day-filler';
    filler.setAttribute('aria-hidden', 'true');
    els.daysGrid.appendChild(filler);
  }

  function renderCalendar(schedule) {
    const { year, month } = state.cal;
    const total = daysInMonth(year, month);
    const offset = (dayOfWeek(year, month, 1) + 6) % 7;
    const rows = Math.ceil((offset + total) / 7);
    const cells = Math.max(35, rows * 7);
    const todayKey = schedule.today.dateKey;

    els.calYear.textContent = String(year);
    els.calMonth.textContent = `${month}月`;
    els.calGrid.replaceChildren();

    for (let i = 0; i < cells; i += 1) {
      const dayNum = i - offset + 1;

      if (dayNum < 1 || dayNum > total) {
        const empty = document.createElement('span');
        empty.className = 'cal-day is-empty';
        empty.setAttribute('aria-hidden', 'true');
        els.calGrid.appendChild(empty);
        continue;
      }

      const day = makeDay(state.server, year, month, dayNum);
      const cell = document.createElement('button');
      cell.type = 'button';
      cell.className = 'cal-day';
      if (day.hasShard) cell.classList.add(day.type === 'red' ? 'is-red' : 'is-black');
      if (day.dateKey === todayKey) cell.classList.add('is-today');
      if (day.dateKey === state.cal.selectedKey) cell.classList.add('is-selected');
      cell.setAttribute('aria-pressed', String(day.dateKey === state.cal.selectedKey));
      cell.setAttribute(
        'aria-label',
        day.hasShard
          ? `${day.y}年${day.m}月${day.d}日 ${WEEK[day.dow].cn}，${TYPE_CN[day.type]}${state.server === 'intl' ? ` ${day.groupLabel}` : ''}，${day.realm}${day.area}，共 ${day.events.length} 场`
          : `${day.y}年${day.m}月${day.d}日 ${WEEK[day.dow].cn}，${day.cancelled ? '跨月黑石取消' : '无碎石'}`
      );
      cell.addEventListener('click', () => selectCalendarDay(day));

      const num = document.createElement('span');
      num.className = 'cal-num';
      num.textContent = String(dayNum);
      cell.appendChild(num);

      if (day.hasShard) {
        const mark = document.createElement('span');
        mark.className = 'cal-mark';
        mark.textContent = `0${day.events.length}`;

        const line = document.createElement('span');
        line.className = 'cal-line';

        cell.append(mark, line);
      }

      els.calGrid.appendChild(cell);
    }
  }

  function renderDetail(day) {
    els.calDetail.classList.toggle('is-empty', !day.hasShard);
    els.selCode.textContent = `${SERVERS[state.server].short}-${day.dateKey.replace(/-/g, '.')}`;
    els.selDayNum.textContent = pad2(day.d);
    els.selMonthYear.textContent = `${MONTHS[day.m - 1]} ${day.y} / ${WEEK[day.dow].cn}`;
    els.selSessions.replaceChildren();
    els.selBadge.classList.remove('is-black', 'is-empty');

    if (day.hasShard) {
      els.selRealm.textContent = day.realm;
      els.selArea.textContent = day.area;
      els.selBadge.textContent = `${TYPE_EN[day.type]}${state.server === 'intl' ? ` ${day.groupCode}` : ''} · ${day.events.length} SESSIONS`;
      if (day.type === 'black') els.selBadge.classList.add('is-black');

      for (const event of day.events) {
        const li = document.createElement('li');
        li.className = 'd-session';

        const n = document.createElement('span');
        n.className = 'n';
        n.textContent = pad2(event.index);

        const w = document.createElement('span');
        w.className = 'w';
        w.textContent = event.window;
        if (event.gate) {
          const small = document.createElement('small');
          small.textContent = `GATE ${formatLocalTimeTag(event.gate, day.dateKey)}`;
          w.appendChild(small);
        }

        const l = document.createElement('span');
        l.className = 'l';
        l.textContent = formatDurationShort(event.durationMinutes);

        li.append(n, w, l);
        els.selSessions.appendChild(li);
      }

      els.selCopy.disabled = false;
      els.selCopy.textContent = '复制当日场次';
      const serverNote = state.server === 'intl'
        ? '游戏日按 Pacific 00:00 切换；时间已换算到本地。'
        : '国服按 UTC+8 自然日；时间已换算到本地。';
      els.selNote.textContent = `奖励：${day.reward} · 每日仅首场计入。${serverNote}`;
      return;
    }

    els.selRealm.textContent = day.cancelled ? '跨月取消' : '无碎石';
    els.selArea.textContent = day.cancelled ? '月末周二与月初周三分属不同月份，本周黑石取消。' : '该游戏日没有红石或黑石。';
    els.selBadge.textContent = 'NO SHARD';
    els.selBadge.classList.add('is-empty');

    const empty = document.createElement('p');
    empty.className = 'detail-empty';
    empty.textContent = day.cancelled ? 'BLACK SHARD / CROSS-MONTH CANCEL' : 'NO SHARD / 该游戏日无碎石';
    els.selSessions.appendChild(empty);

    els.selCopy.disabled = true;
    els.selCopy.textContent = '无场次可复制';

    const next = findNextEventFromDayStart(day);
    els.selNote.textContent = next
      ? `下一场：${formatLocalDate(next.land)} ${formatLocalTime(next.land)} · ${next.day.realm} ${next.day.area}`
      : '未来 42 天内没有可计算的场次。';
  }

  function selectCalendarDay(day) {
    state.cal.selectedKey = day.dateKey;
    state.cal.selected = day;
    if (day.y !== state.cal.year || day.m !== state.cal.month) {
      state.cal.year = day.y;
      state.cal.month = day.m;
    }
    renderCalendar(state.schedule);
    renderDetail(day);
  }

  function shiftMonth(delta) {
    let year = state.cal.year;
    let month = state.cal.month + delta;
    if (month < 1) {
      month = 12;
      year -= 1;
    } else if (month > 12) {
      month = 1;
      year += 1;
    }
    state.cal.year = year;
    state.cal.month = month;

    const first = findFirstEventDay(state.server, year, month);
    state.cal.selectedKey = first.dateKey;
    state.cal.selected = first;
    renderCalendar(state.schedule);
    renderDetail(first);
  }

  function goToday() {
    const gp = gameParts(Date.now(), state.server);
    const today = makeDay(state.server, gp.y, gp.m, gp.d);
    state.cal.year = gp.y;
    state.cal.month = gp.m;
    state.cal.selectedKey = today.dateKey;
    state.cal.selected = today;
    renderCalendar(state.schedule);
    renderDetail(today);
  }

  function initCalendar(focusDay) {
    state.cal.year = focusDay.y;
    state.cal.month = focusDay.m;
    state.cal.selectedKey = focusDay.dateKey;
    state.cal.selected = focusDay;
    renderCalendar(state.schedule);
    renderDetail(focusDay);
  }

  function updateCountdown(schedule, now) {
    const focus = schedule.active || schedule.next;
    if (!focus) return;

    const target = schedule.active ? schedule.active.end : schedule.next.land;
    const diff = Math.max(0, target - now);
    const d = Math.floor(diff / DAY);
    const h = Math.floor((diff % DAY) / HOUR);
    const m = Math.floor((diff % HOUR) / MINUTE);
    const s = Math.floor((diff % MINUTE) / 1000);
    const ms = Math.floor(diff % 1000);

    els.cdD.textContent = pad2(d);
    els.cdH.textContent = pad2(h);
    els.cdM.textContent = pad2(m);
    els.cdS.textContent = pad2(s);
    els.ms.textContent = `.${pad3(ms)}`;
    els.targetLabel.textContent = schedule.active
      ? (focus.type === 'red' ? '距本场结束' : '距本场消失')
      : (state.server === 'intl' ? '距落地' : '距开始');
    els.targetIso.textContent = formatLocalDateTime(target);

    if (state.forecastTodayMarker && state.forecastDayStart !== null && state.forecastDaySpan) {
      const p = ((now - state.forecastDayStart) / state.forecastDaySpan) * 100;
      state.forecastTodayMarker.style.left = `${Math.min(100, Math.max(0, p))}%`;
    }
  }

  function updateClock(now) {
    const p = localParts(now);
    const time = `${pad2(p.h)}:${pad2(p.min)}:${pad2(p.s)}`;
    els.clock.textContent = time;
    els.clock.dateTime = new Date(now).toISOString();
    els.heroFootTime.textContent = `SYNC ${time}`;
    const offset = localOffsetLabel();
    if (offset !== state.lastOffsetLabel) {
      state.lastOffsetLabel = offset;
      els.tzLabel.textContent = offset;
      if (els.localZoneLabel) els.localZoneLabel.textContent = offset;
      setFooterMeta();
    }
  }

  function setFooterMeta() {
    const offset = -new Date().getTimezoneOffset();
    let zone = 'LOCAL';
    try {
      zone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOCAL';
    } catch (err) {
      zone = 'LOCAL';
    }
    els.footerTz.textContent = `TZ ${zone} · ${formatOffset(offset)}`;
    els.footerYear.textContent = String(localParts(Date.now()).y);
  }

  function renderModebar(schedule) {
    const cfg = SERVERS[state.server];
    const day = schedule.today;

    els.gameDayLabel.textContent = `${day.y}.${pad2(day.m)}.${pad2(day.d)} ${WEEK[day.dow].short}`;
    els.localZoneLabel.textContent = localOffsetLabel();
    els.modeHint.textContent = cfg.dayHint;
    els.tzLabel.textContent = localOffsetLabel();
    els.telemetryServer.textContent = `${cfg.short} SERVER`;
    els.telemetryZone.textContent = cfg.zoneShort;
    els.telemetryWindow.textContent = state.server === 'cn' ? 'WINDOW 52 MIN' : 'WINDOW 3H52M';
    els.heroWindow.textContent = state.server === 'cn' ? 'WINDOW 52 MIN' : 'WINDOW 3H52M';
    els.footerTz.textContent = `TZ ${Intl.DateTimeFormat().resolvedOptions().timeZone || 'LOCAL'} · ${formatOffset(-new Date().getTimezoneOffset())}`;
    els.footerYear.textContent = String(localParts(Date.now()).y);

    document.querySelectorAll('.server-btn[data-server]').forEach((button) => {
      const active = button.dataset.server === state.server;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    document.title = `SKY::SHARD — ${cfg.label}红黑石时刻表`;
    updateWinUIComponents();
  }

  function renderServerTexts() {
    if (state.server === 'cn') {
      els.forecastNote.textContent = '红石：上半月周六/周日、下半月周五/周日；黑石：上半月周二、下半月周三。跨月黑石取消。';
      els.calendarNote.textContent = '红石为红色，黑石为蓝色。日期按国服 UTC+8 自然日分组，时间显示为本地时区；跨本地午夜的场次标注 +1。';
      els.rulesNote.textContent = '国服规则：红石与黑石；日期按 UTC+8 自然日 00:00 切换，界面时间换算到本地。';
    } else {
      els.forecastNote.textContent = '红黑石按日期奇偶交替；每组有固定的无碎石星期。游戏日按 Pacific 00:00 切换，时间显示为本地时区。';
      els.calendarNote.textContent = '红石为红色，黑石为蓝色。日期按 Pacific 游戏日分组，跨本地午夜的场次会标注 +1。';
      els.rulesNote.textContent = '国际服规则：红黑石按日期奇偶交替；游戏日按 Pacific 00:00 切换，时间换算到本地。';
    }
  }

  function cnRulesHtml() {
    const formula = `
<pre class="formula"><code><span class="code-key">isRed</span>(d) =
  d ≤ 15  <span class="code-op">?</span>  dow(d) <span class="code-op">∈</span> { <span class="code-red">SAT</span>, <span class="code-red">SUN</span> }
          <span class="code-op">:</span>  dow(d) <span class="code-op">∈</span> { <span class="code-red">FRI</span>, <span class="code-red">SUN</span> }

<span class="code-key">isBlack</span>(d) =
  d ≤ 15  <span class="code-op">?</span>  dow(d) <span class="code-op">=</span> <span class="code-black">TUE</span>
          <span class="code-op">:</span>  dow(d) <span class="code-op">=</span> <span class="code-black">WED</span>

<span class="code-key">realm</span>(d) = MAPS[ d <span class="code-op">mod</span> 5 ]</code></pre>
<p class="rule-copy">以日期数字 15 为分界判断红石日与黑石日；大地图由日期余数决定，具体区域再由星期决定。</p>`;

    const rows = [
      { day: '周五', en: 'FRI', type: 'red', slots: CN_RED_SLOTS[5] },
      { day: '周六', en: 'SAT', type: 'red', slots: CN_RED_SLOTS[6] },
      { day: '周日', en: 'SUN', type: 'red', slots: CN_RED_SLOTS[0] },
      { day: '周二', en: 'TUE', type: 'black', slots: CN_BLACK_SLOTS[2] },
      { day: '周三', en: 'WED', type: 'black', slots: CN_BLACK_SLOTS[3] }
    ];

    const tableRows = rows.map((row) => `
      <tr class="row-${row.type}">
        <td class="day-cell"><b>${row.day}</b><em>${row.en}</em><span class="stone-tag${row.type === 'black' ? ' is-black' : ''}">${row.type === 'red' ? 'RED' : 'BLACK'}</span></td>
        ${row.slots.map(([a, b]) => `<td><span>${a}–${b}</span></td>`).join('')}
      </tr>`).join('');

    const slots = `
<div class="table-scroll">
  <table class="slot-table">
    <thead><tr><th>TYPE / DAY</th><th>01</th><th>02</th><th>03</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>
<p class="rule-copy">单场 52 分钟；23:08 场次的结束点为次日 00:00。表内为游戏时间 UTC+8。</p>`;

    const maps = `
<div class="map-list">
  ${CN_MAPS.map((map, index) => `<div><code>d mod 5 = ${index}</code><span>${map}</span><em>${CN_MAP_SHORT[map]}</em></div>`).join('')}
</div>
<p class="rule-copy">红石与黑石共用大地图规则；区域按星期查表，黑石使用周二/周三，红石使用周五/周六/周日。</p>`;

    const notes = `
<li><span>TIME BASE</span>国服 UTC+8 自然日 00:00 切换；界面显示为本地时区。</li>
<li><span>BLACK</span>黑石按上半月周二、下半月周三；跨月取消（月末周二 / 月初周三）。</li>
<li><span>WINDOW</span>红石与黑石均为每日 3 场，单场 52 分钟。</li>
<li><span>REWARD</span>红石给升华蜡烛；黑石约 200 烛火；每日仅首场计入。</li>
<li><span>PRECISION</span>场次时刻精确到秒；毫秒仅用于显示倒计时的连续变化。</li>
<li><span>CLOCK</span>倒计时读取本机时钟；设备时间偏差会同步反映到结果中。</li>
<li><span>SOURCE</span>社区归纳规律，非官方数据。游戏更新或活动调整时，以游戏内天气预报为准。</li>`;

    return { formula, slots, maps, notes };
  }

  function intlRulesHtml() {
    const formula = `
<pre class="formula"><code><span class="code-key">type</span>(d) = d <span class="code-op">mod</span> 2 = 1 <span class="code-op">?</span> <span class="code-red">RED</span> <span class="code-op">:</span> <span class="code-black">BLACK</span>
<span class="code-key">group</span>(d) = RED <span class="code-op">?</span> ((d - 1) / 2 <span class="code-op">mod</span> 3) + 2 <span class="code-op">:</span> (d / 2 <span class="code-op">mod</span> 2)
<span class="code-key">shard</span>(d) = dow(d) <span class="code-op">∉</span> group.noShard
<span class="code-key">realm</span>(d) = REALMS[(d - 1) <span class="code-op">mod</span> 5]

<span class="code-key">gate</span> = group.gate (PT)
<span class="code-key">land</span> = gate + 8:40
<span class="code-key">end</span>  = gate + 4:00</code></pre>
<p class="rule-copy">偶数日黑石，奇数日红石；组内按 6 小时（红）或 8 小时（黑）重复 3 场。游戏日按 Pacific 00:00 切换，实际时间会自动处理美国夏令时。</p>`;

    const tableRows = INTL_GROUPS.map((group) => {
      const windows = [0, 1, 2].map((index) => {
        const base = group.gate[0] * 60 + group.gate[1];
        const land = base + 8 + index * group.step * 60;
        const end = base + 240 + index * group.step * 60;
        return `${formatHMFromMinutes(land)}–${formatHMFromMinutes(end)}`;
      });
      return `
        <tr class="row-${group.type}">
          <td class="day-cell"><b>${group.code}</b><em>${group.type === 'red' ? 'RED' : 'BLACK'}</em></td>
          ${windows.map((window) => `<td><span>${window}</span></td>`).join('')}
        </tr>`;
    }).join('');

    const slots = `
<div class="table-scroll">
  <table class="slot-table">
    <thead><tr><th>GROUP</th><th>01</th><th>02</th><th>03</th></tr></thead>
    <tbody>${tableRows}</tbody>
  </table>
</div>
<p class="rule-copy">表内为游戏时间 PT（GATE 后 8:40 落地，4 小时后消失）；界面会换算到本地时区。</p>`;

    const maps = `
<div class="map-list">
  ${INTL_REALMS.map((realm, index) => `<div><code>(d - 1) mod 5 = ${index}</code><span>${realm.cn}</span><em>${realm.short}</em></div>`).join('')}
</div>
<p class="rule-copy">大地图按日期序号循环；具体区域由红/黑石组与大地图共同决定，日历中的每日详情即为解算结果。</p>`;

    const notes = `
<li><span>GAME DAY</span>国际服游戏日按 Pacific 00:00 切换，而非本地 00:00。</li>
<li><span>GATE</span>闸门开启后 8 分 40 秒落地，落地后约 4 小时消失。</li>
<li><span>NO SHARD</span>A 周一/周二；B 周二/周三；C 周三/周四；a 周六/周日；b 周日/周一。</li>
<li><span>DST</span>美国夏令时自动处理；本地时间随 DST 平移。</li>
<li><span>PRECISION</span>场次时刻精确到秒；毫秒仅用于显示倒计时的连续变化。</li>
<li><span>CLOCK</span>倒计时读取本机时钟；设备时间偏差会同步反映到结果中。</li>
<li><span>SOURCE</span>社区归纳规律，非官方数据。游戏更新或活动调整时，以游戏内天气预报为准。</li>`;

    return { formula, slots, maps, notes };
  }

  function renderRules() {
    const rules = state.server === 'cn' ? cnRulesHtml() : intlRulesHtml();
    els.ruleFormulaLabel.textContent = 'CORE / 判定式';
    els.ruleSlotsLabel.textContent = state.server === 'cn' ? 'SLOTS / 游戏时间 UTC+8' : 'SLOTS / 游戏时间 PT';
    els.ruleMapsLabel.textContent = state.server === 'cn' ? 'MAPS / 日期余数' : 'MAPS / 日期序号';
    els.ruleFormula.innerHTML = rules.formula;
    els.ruleSlots.innerHTML = rules.slots;
    els.ruleMaps.innerHTML = rules.maps;
    els.ruleNotes.innerHTML = rules.notes;
  }

  function setSrStatus(schedule, phase) {
    const focus = schedule.active || schedule.next;
    if (!focus) {
      els.srStatus.textContent = '当前没有可计算的场次。';
      return;
    }
    if (schedule.active) {
      els.srStatus.textContent = `${typeName(focus.type)}正在降落，${focus.day.realm}${focus.day.area}，${phase === 'ending' ? '即将结束' : '距结束还有一段时间'}。`;
    } else {
      els.srStatus.textContent = `下一场${typeName(focus.type)}：${formatLocalDate(focus.land)} ${formatLocalTime(focus.land)}，${focus.day.realm}${focus.day.area}。`;
    }
  }

  function buildNextCopyText(event) {
    const now = Date.now();
    const cfg = SERVERS[state.server];
    const isLive = now >= event.land && now < event.end;
    const isGate = event.gate && now >= event.start && now < event.land;
    let distance;
    if (isLive) distance = `进行中，距消失 ${formatDurationHuman(event.end - now)}`;
    else if (isGate) distance = `闸门已开，距落地 ${formatDurationHuman(event.land - now)}`;
    else distance = `距${event.gate ? '落地' : '开始'} ${formatDurationHuman(event.land - now)}`;

    const lines = [
      `光遇${cfg.label} · ${typeName(event.type)}`,
      `游戏日 ${formatDateLong(event.day)} ${WEEK[event.day.dow].cn}`,
      `本地 ${formatLocalDateTime(event.land)} → ${formatLocalDateTime(event.end)}`,
      `${event.day.realm} · ${event.day.area}`,
      `奖励：${event.reward} · 每日仅首场`,
      distance
    ];
    if (event.gate) {
      lines.splice(3, 0, `GATE ${formatLocalDateTime(event.gate)}`);
    }
    lines.push('', 'SKY::SHARD / 本地确定性计算');
    return lines.join('\n');
  }

  function buildDayCopyText(day) {
    const cfg = SERVERS[state.server];
    return [
      `光遇${cfg.label} · ${typeName(day.type)} ${day.groupLabel}`,
      `游戏日 ${formatDateLong(day)} ${WEEK[day.dow].cn}`,
      `${day.realm} · ${day.area}`,
      ...day.events.map((event) => event.window),
      `奖励：${day.reward} · 每日仅首场`,
      '',
      'SKY::SHARD / 本地确定性计算'
    ].join('\n');
  }

  function copyNext() {
    const schedule = state.schedule;
    const event = schedule?.active || schedule?.next;
    if (!event) {
      toast('暂时没有可复制的场次');
      return;
    }
    copyText(buildNextCopyText(event));
  }

  function exportICS() {
    const count = buildICS();
    toast(count ? `已导出未来 90 个游戏日 · ${count} 场` : '未来 90 个游戏日内没有可导出的场次');
  }

  function toCalendar() {
    const calendar = document.getElementById('calendar');
    if (calendar) calendar.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copySelected() {
    const day = state.cal.selected;
    if (!day || !day.hasShard) {
      toast('该游戏日没有碎石场次');
      return;
    }
    copyText(buildDayCopyText(day));
  }

  function icsUtc(ts) {
    return new Date(ts).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
  }

  function icsEscape(value) {
    return String(value)
      .replace(/\\/g, '\\\\')
      .replace(/\n/g, '\\n')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;');
  }

  function foldICSLine(line) {
    const encoder = new TextEncoder();
    if (encoder.encode(line).length <= 75) return line;
    const parts = [];
    let current = '';
    let currentBytes = 0;
    for (const char of line) {
      const charBytes = encoder.encode(char).length;
      if (currentBytes + charBytes > 73) {
        parts.push(current);
        current = ` ${char}`;
        currentBytes = 1 + charBytes;
      } else {
        current += char;
        currentBytes += charBytes;
      }
    }
    parts.push(current);
    return parts.join('\r\n');
  }

  function buildICS() {
    const now = Date.now();
    const schedule = state.schedule;
    if (!schedule) return 0;
    const cfg = SERVERS[state.server];
    const stamp = new Date(now).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SKY SHARD//CN and INTL Red Black Shard Calendar//ZH-CN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      `X-WR-CALNAME:光遇红石黑石 · ${cfg.label}`,
      `X-WR-TIMEZONE:${icsEscape(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')}`,
      `X-WR-CALDESC:由 SKY::SHARD 本地生成；${cfg.label}，时间已换算到本地时区。`
    ];

    let count = 0;

    for (let offset = 0; offset < 90; offset += 1) {
      const date = addDays(schedule.today.y, schedule.today.m, schedule.today.d, offset);
      const day = makeDay(state.server, date.y, date.m, date.d);
      for (const event of day.events) {
        if (event.end <= now) continue;
        count += 1;

        const description = [
          `光遇${cfg.label} · ${typeName(event.type)} ${day.groupLabel}`,
          `游戏日 ${formatDateLong(day)} ${WEEK[day.dow].cn}`,
          `本地 ${formatLocalDateTime(event.land)} → ${formatLocalDateTime(event.end)}`,
          event.gate ? `GATE ${formatLocalDateTime(event.gate)}` : '',
          `地点：${day.realm} · ${day.area}`,
          `奖励：${day.reward} · 每日仅首场`,
          '非官方社区规则，以游戏内天气预报为准。'
        ].filter(Boolean).join('\n');

        lines.push(
          'BEGIN:VEVENT',
          `UID:${event.id}@skyredstone.local`,
          `DTSTAMP:${stamp}`,
          `DTSTART:${icsUtc(event.land)}`,
          `DTEND:${icsUtc(event.end)}`,
          `SUMMARY:${icsEscape(`${typeName(event.type)} · ${day.realm} ${day.area}`)}`,
          `DESCRIPTION:${icsEscape(description)}`,
          `LOCATION:${icsEscape(`${day.realm} · ${day.area}`)}`,
          'BEGIN:VALARM',
          'ACTION:DISPLAY',
          `DESCRIPTION:${icsEscape(`${typeName(event.type)} 10 分钟后${event.gate ? '落地' : '开始'}`)}`,
          'TRIGGER:-PT10M',
          'END:VALARM',
          'END:VEVENT'
        );
      }
    }

    if (!count) return 0;

    lines.push('END:VCALENDAR');
    const body = lines.map(foldICSLine).join('\r\n') + '\r\n';
    const blob = new Blob([body], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `sky-shard-${state.server}-${localDateKey(now)}.ics`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    return count;
  }

  function initForServer(now) {
    state.schedule = computeSchedule(now, state.server);
    state.lastGameDayKey = state.schedule.today.dateKey;
    state.lastPhase = null;
    const focus = state.schedule.active || state.schedule.next;
    renderServerTexts();
    renderRules();
    renderModebar(state.schedule);
    initCalendar(focus ? focus.day : state.schedule.today);
    renderForecast(state.schedule);
    updateState(now, true);
    setFooterMeta();
  }

  function updateState(now, force) {
    const gp = gameParts(now, state.server);
    const dayChanged = gp.dateKey !== state.lastGameDayKey;
    let schedule = state.schedule;

    if (
      !schedule ||
      dayChanged ||
      (schedule.active && now >= schedule.active.end) ||
      (!schedule.active && schedule.next && now >= schedule.next.land)
    ) {
      schedule = computeSchedule(now, state.server);
      state.schedule = schedule;
    }

    const phase = getPhase(schedule, now);

    if (force || dayChanged || phase !== state.lastPhase) {
      renderHero(schedule, phase);
      renderSide(schedule, phase);
      renderQueue(schedule);
      setSrStatus(schedule, phase);
      state.lastPhase = phase;
    }

    if (dayChanged) {
      state.lastGameDayKey = gp.dateKey;
      renderForecast(schedule);
      renderCalendar(schedule);
      if (state.cal.selected) renderDetail(state.cal.selected);
      renderModebar(schedule);
      setFooterMeta();
    }

    updateCountdown(schedule, now);
    updateClock(now);
  }

  function tick() {
    updateState(Date.now(), false);
  }

  function switchServer(serverId) {
    if (serverId !== 'cn' && serverId !== 'intl') return;
    if (serverId === state.server) return;
    state.server = serverId;
    document.body.dataset.server = serverId;
    persistServer(serverId);
    initForServer(Date.now());
    toast(serverId === 'intl' ? '已切换：国际服' : '已切换：国服');
  }

  function readServer() {
    const q = new URLSearchParams(location.search).get('server');
    if (q === 'intl' || q === 'cn') return q;
    try {
      const saved = localStorage.getItem('sky-shard-server');
      if (saved === 'intl' || saved === 'cn') return saved;
    } catch (err) {
      // Ignore storage restrictions.
    }
    return 'cn';
  }

  function persistServer(serverId) {
    try {
      localStorage.setItem('sky-shard-server', serverId);
    } catch (err) {
      // Ignore storage restrictions.
    }
    try {
      const url = new URL(location.href);
      if (serverId === 'intl') url.searchParams.set('server', 'intl');
      else url.searchParams.delete('server');
      history.replaceState(null, '', url);
    } catch (err) {
      // Ignore history restrictions on file URLs.
    }
  }

  function bindServerButtons() {
    document.querySelectorAll('.server-btn[data-server]').forEach((button) => {
      button.addEventListener('click', () => switchServer(button.dataset.server));
    });
  }

  function readTheme() {
    const q = new URLSearchParams(location.search).get('theme');
    if (q === 'terminal' || q === 'winui' || q === 'glass') return q;
    try {
      const saved = localStorage.getItem('sky-shard-theme');
      if (saved === 'terminal' || saved === 'winui' || saved === 'glass') return saved;
    } catch (err) {
      // Ignore storage restrictions.
    }
    return 'terminal';
  }

  function persistTheme(theme) {
    try {
      localStorage.setItem('sky-shard-theme', theme);
    } catch (err) {
      // Ignore storage restrictions.
    }
    try {
      const url = new URL(location.href);
      if (theme === 'terminal') url.searchParams.delete('theme');
      else url.searchParams.set('theme', theme);
      history.replaceState(null, '', url);
    } catch (err) {
      // Ignore history restrictions on file URLs.
    }
  }

  function applyTheme(theme, persist) {
    if (theme !== 'terminal' && theme !== 'winui' && theme !== 'glass') theme = 'terminal';
    state.theme = theme;
    document.documentElement.dataset.theme = theme;

    document.querySelectorAll('.style-btn[data-style]').forEach((button) => {
      const active = button.dataset.style === theme;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });

    const themeColor = document.getElementById('metaThemeColor');
    if (themeColor) {
      themeColor.setAttribute('content', theme === 'winui' ? '#202020' : theme === 'glass' ? '#070b18' : '#070809');
    }

    if (window.SkyGlass) {
      if (theme === 'glass') window.SkyGlass.start();
      else window.SkyGlass.stop();
    }

    if (theme === 'winui') ensureWinUIComponents();
    syncWinUIComponentsStyle();
    updateWinUIComponents();

    if (persist) persistTheme(theme);
  }

  function switchTheme(theme) {
    if (theme === state.theme) return;
    applyTheme(theme, true);
  }

  let winuiComponentsPromise = null;

  function mountWinUIComponents() {
    if (!window.WinUIThemeControls || !els.winuiControls || !els.winuiActions) return;
    window.WinUIThemeControls.mount(els.winuiControls, els.winuiActions, {
      server: state.server,
      theme: state.theme
    });
    window.WinUIThemeControls.update({
      server: state.server,
      theme: state.theme
    });
  }

  function ensureWinUIComponents() {
    if (window.WinUIThemeControls) {
      mountWinUIComponents();
      return Promise.resolve();
    }
    if (winuiComponentsPromise) return winuiComponentsPromise;

    winuiComponentsPromise = new Promise((resolve) => {
      const css = document.createElement('link');
      css.rel = 'stylesheet';
      css.href = 'winui-controls.css?v=2.2.0';
      css.id = 'winuiControlsStyle';
      document.head.appendChild(css);

      const script = document.createElement('script');
      script.src = 'winui-controls.js?v=2.2.0';
      script.onload = () => {
        syncWinUIComponentsStyle();
        mountWinUIComponents();
        resolve();
      };
      script.onerror = () => {
        winuiComponentsPromise = null;
        resolve();
      };
      document.head.appendChild(script);
    });

    return winuiComponentsPromise;
  }

  function syncWinUIComponentsStyle() {
    const link = document.getElementById('winuiControlsStyle');
    if (link) link.disabled = false;
  }

  function updateWinUIComponents() {
    syncWinUIComponentsStyle();
    if (window.WinUIThemeControls) {
      window.WinUIThemeControls.update({
        server: state.server,
        theme: state.theme
      });
    }
  }

  function bindStyleButtons() {
    document.querySelectorAll('.style-btn[data-style]').forEach((button) => {
      button.addEventListener('click', () => switchTheme(button.dataset.style));
    });
  }

  function bindEvents() {
    els.copyBtn.addEventListener('click', copyNext);
    els.icsBtn.addEventListener('click', exportICS);
    els.selCopy.addEventListener('click', copySelected);
    els.prevMonth.addEventListener('click', () => shiftMonth(-1));
    els.nextMonth.addEventListener('click', () => shiftMonth(1));
    els.todayBtn.addEventListener('click', goToday);

    if (els.copyClose) {
      els.copyClose.addEventListener('click', () => {
        if (typeof els.copyDialog.close === 'function') els.copyDialog.close();
        else els.copyDialog.removeAttribute('open');
      });
    }

    if (els.copyDialog) {
      els.copyDialog.addEventListener('click', (event) => {
        if (event.target !== els.copyDialog) return;
        if (typeof els.copyDialog.close === 'function') els.copyDialog.close();
        else els.copyDialog.removeAttribute('open');
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (els.copyDialog && els.copyDialog.open) return;
      const target = event.target;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      const key = event.key.toLowerCase();
      if (key === '[') {
        event.preventDefault();
        shiftMonth(-1);
      } else if (key === ']') {
        event.preventDefault();
        shiftMonth(1);
      } else if (key === 't') {
        event.preventDefault();
        goToday();
      } else if (key === 'c') {
        event.preventDefault();
        copyNext();
      }
    });

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) tick();
    });
  }

  function bindNav() {
    const links = Array.from(document.querySelectorAll('[data-nav]'));
    const sections = ['now', 'forecast', 'calendar', 'rules']
      .map((id) => document.getElementById(id))
      .filter(Boolean);
    let scheduled = false;

    function update() {
      scheduled = false;
      const y = window.scrollY + 110;
      let current = 'now';
      for (const section of sections) {
        if (section.offsetTop <= y) current = section.id;
      }
      for (const link of links) {
        link.classList.toggle('is-active', link.dataset.nav === current);
      }
    }

    window.addEventListener('scroll', () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(update);
    }, { passive: true });

    update();
  }

  function reveal() {
    const items = Array.from(document.querySelectorAll('.reveal'));
    requestAnimationFrame(() => {
      items.forEach((item, index) => {
        window.setTimeout(() => item.classList.add('is-visible'), Math.min(index * 55, 330));
      });
    });
  }

  function init() {
    state.server = readServer();
    state.theme = readTheme();
    document.body.dataset.server = state.server;
    window.SkyUI = {
      switchServer,
      switchTheme,
      copyNext,
      exportICS,
      toCalendar
    };
    applyTheme(state.theme, false);
    setFooterMeta();
    bindServerButtons();
    bindStyleButtons();
    bindEvents();
    bindNav();
    initForServer(Date.now());
    reveal();
    setInterval(tick, 100);
  }

  init();
})();
