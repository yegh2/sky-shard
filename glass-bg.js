(() => {
  'use strict';

  const canvas = document.getElementById('glassCanvas');
  if (!canvas) return;

  const gl = canvas.getContext('webgl', {
    alpha: false,
    antialias: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power'
  });

  if (!gl) {
    canvas.classList.add('is-failed');
    return;
  }

  const vertexSource = `
    attribute vec2 a_pos;
    void main() {
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const uvVertexSource = `
    attribute vec2 a_pos;
    varying vec2 v_uv;
    void main() {
      v_uv = a_pos * 0.5 + 0.5;
      gl_Position = vec4(a_pos, 0.0, 1.0);
    }
  `;

  const backgroundSource = `
    precision highp float;
    uniform vec2 u_res;
    uniform float u_time;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      return mix(
        mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
        mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x),
        f.y
      );
    }

    float fbm(vec2 p) {
      float v = 0.0;
      float a = 0.5;
      for (int i = 0; i < 4; i++) {
        v += a * noise(p);
        p = p * 2.02 + 17.3;
        a *= 0.5;
      }
      return v;
    }

    void main() {
      vec2 uv = gl_FragCoord.xy / u_res;
      float aspect = u_res.x / u_res.y;
      vec2 p = (uv - 0.5) * vec2(aspect, 1.0);
      float t = u_time * 0.035;

      vec2 q = p;
      q.x += 0.22 * sin(p.y * 2.6 + t * 2.2);
      q.y += 0.18 * cos(p.x * 3.1 - t * 1.7);

      float n = fbm(q * 1.8 + t * 0.4);
      vec3 col = vec3(0.010, 0.016, 0.048);

      vec3 blue = vec3(0.060, 0.16, 0.62);
      vec3 violet = vec3(0.38, 0.08, 0.62);
      vec3 pink = vec3(0.82, 0.10, 0.40);
      vec3 cyan = vec3(0.03, 0.55, 0.65);

      float d1 = smoothstep(0.78, 0.02, length(p - vec2(-0.62, 0.44) + 0.12 * vec2(sin(t * 1.2), cos(t * 0.9))));
      float d2 = smoothstep(0.70, 0.02, length(p - vec2(0.58, 0.14) + 0.15 * vec2(cos(t * 1.1), sin(t * 1.4))));
      float d3 = smoothstep(0.88, 0.02, length(p - vec2(0.0, -0.62) + 0.10 * vec2(sin(t * 0.8), cos(t * 1.3))));

      col = mix(col, blue, d1 * 0.9);
      col = mix(col, violet, d2 * 0.8);
      col = mix(col, pink, d3 * 0.5);
      col += cyan * 0.09 * smoothstep(0.42, 1.0, n);
      col *= 0.75 + 0.5 * n;

      float caustic = abs(sin(q.x * 5.2 + n * 5.0 + t * 2.0) * sin(q.y * 4.4 - n * 4.0 - t * 1.6));
      caustic = pow(caustic, 8.0);
      col += vec3(0.14, 0.24, 0.42) * caustic * 0.65;

      float ribbons = abs(sin(q.x * 96.0 + n * 24.0 + t * 3.2) * sin(q.y * 84.0 - n * 20.0 - t * 2.6));
      ribbons = pow(ribbons, 16.0);
      col += vec3(0.08, 0.13, 0.24) * ribbons * 0.28;

      col *= smoothstep(1.45, 0.22, length(p));
      col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.012;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const copySource = `
    precision highp float;
    uniform sampler2D u_tex;
    varying vec2 v_uv;
    void main() {
      gl_FragColor = texture2D(u_tex, v_uv);
    }
  `;

  const glassSource = `
    precision highp float;
    uniform sampler2D u_tex;
    uniform vec2 u_res;
    uniform vec4 u_rect;
    uniform float u_radius;
    uniform vec3 u_tint;
    uniform float u_time;

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
    }

    vec3 blurSample(vec2 uv, float radius) {
      vec2 t = vec2(radius) / u_res;
      vec3 c = texture2D(u_tex, uv).rgb * 0.20;
      c += texture2D(u_tex, uv + vec2(t.x, 0.0)).rgb * 0.12;
      c += texture2D(u_tex, uv - vec2(t.x, 0.0)).rgb * 0.12;
      c += texture2D(u_tex, uv + vec2(0.0, t.y)).rgb * 0.12;
      c += texture2D(u_tex, uv - vec2(0.0, t.y)).rgb * 0.12;
      c += texture2D(u_tex, uv + t * 0.72).rgb * 0.08;
      c += texture2D(u_tex, uv - t * 0.72).rgb * 0.08;
      c += texture2D(u_tex, uv + vec2(t.x, -t.y) * 0.72).rgb * 0.08;
      c += texture2D(u_tex, uv + vec2(-t.x, t.y) * 0.72).rgb * 0.08;
      return c;
    }

    void main() {
      vec2 halfSize = u_rect.zw * 0.5;
      vec2 p = gl_FragCoord.xy - (u_rect.xy + halfSize);
      vec2 q = abs(p) - halfSize + u_radius;
      float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - u_radius;
      float alpha = smoothstep(0.0, -1.5, d);
      if (alpha <= 0.0) discard;

      vec2 uv = gl_FragCoord.xy / u_res;
      vec2 panelCenter = (u_rect.xy + u_rect.zw * 0.5) / u_res;
      vec2 n = p / max(halfSize, vec2(1.0));
      float nLength = length(n);
      n = nLength > 0.0001 ? n / nLength : vec2(0.0);
      float edge = 1.0 - smoothstep(0.0, 24.0, -d);
      vec2 offset = n * edge * 0.016;
      vec2 lensUv = panelCenter + (uv - panelCenter) * 0.94;

      vec3 base = blurSample(uv, 7.0);
      vec3 lens = blurSample(lensUv, 8.0);
      vec3 refracted = blurSample(uv + offset, 4.0);
      vec3 col = mix(base, lens, 0.16);
      col = mix(col, refracted, edge * 0.65);

      float ca = edge * 0.38;
      col.r = mix(col.r, texture2D(u_tex, uv + offset * 1.03).r, ca);
      col.b = mix(col.b, texture2D(u_tex, uv + offset * 0.97).b, ca);

      float rim = exp(-max(0.0, -d) * 0.38);
      float inward = smoothstep(0.0, 20.0, -d);
      float top = smoothstep(0.0, 1.0, (p.y / max(halfSize.y, 1.0)) * 0.5 + 0.5);
      vec2 hp = p / max(halfSize, vec2(1.0));
      float bubble = smoothstep(0.58, 0.0, length(hp - vec2(-0.55, 0.55)));

      col = mix(col, u_tint, 0.60);
      col += u_tint * 0.14;
      col *= 0.84 + 0.16 * inward;
      col += vec3(0.58, 0.72, 1.0) * rim * 0.16;
      col += vec3(0.34, 0.44, 0.78) * top * 0.03;
      col += vec3(0.35, 0.45, 0.70) * bubble * 0.04;
      col += (hash(gl_FragCoord.xy + u_time) - 0.5) * 0.015;

      gl_FragColor = vec4(col, alpha);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.warn('[SkyGlass] shader compile failed:', gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  function makeProgram(fragmentSource, vertex = vertexSource) {
    const vs = compile(gl.VERTEX_SHADER, vertex);
    const fs = compile(gl.FRAGMENT_SHADER, fragmentSource);
    if (!vs || !fs) return null;

    const program = gl.createProgram();
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn('[SkyGlass] program link failed:', gl.getProgramInfoLog(program));
      return null;
    }

    return {
      program,
      position: gl.getAttribLocation(program, 'a_pos')
    };
  }

  const background = makeProgram(backgroundSource);
  const copy = makeProgram(copySource, uvVertexSource);
  const glass = makeProgram(glassSource);

  if (!background || !copy || !glass) {
    canvas.classList.add('is-failed');
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const uniform = {
    bgRes: gl.getUniformLocation(background.program, 'u_res'),
    bgTime: gl.getUniformLocation(background.program, 'u_time'),
    copyTex: gl.getUniformLocation(copy.program, 'u_tex'),
    glassTex: gl.getUniformLocation(glass.program, 'u_tex'),
    glassRes: gl.getUniformLocation(glass.program, 'u_res'),
    glassRect: gl.getUniformLocation(glass.program, 'u_rect'),
    glassRadius: gl.getUniformLocation(glass.program, 'u_radius'),
    glassTint: gl.getUniformLocation(glass.program, 'u_tint'),
    glassTime: gl.getUniformLocation(glass.program, 'u_time')
  };

  function bindProgram(entry) {
    gl.useProgram(entry.program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(entry.position);
    gl.vertexAttribPointer(entry.position, 2, gl.FLOAT, false, 0, 0);
  }

  let raf = null;
  let running = false;
  let failed = false;
  let startedAt = 0;
  let lastFrame = 0;
  let lastSeconds = 0;

  let fbTexture = null;
  let framebuffer = null;
  let fbWidth = 0;
  let fbHeight = 0;

  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fail() {
    failed = true;
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
    canvas.classList.add('is-failed');
    document.documentElement.classList.remove('glass-liquid-ready');
  }

  function ensureFramebuffer(width, height) {
    if (fbTexture && framebuffer && fbWidth === width && fbHeight === height) return true;

    if (fbTexture) gl.deleteTexture(fbTexture);
    if (framebuffer) gl.deleteFramebuffer(framebuffer);

    fbTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    framebuffer = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbTexture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    if (status !== gl.FRAMEBUFFER_COMPLETE) {
      fail();
      return false;
    }

    fbWidth = width;
    fbHeight = height;
    return true;
  }

  function resize() {
    const box = canvas.getBoundingClientRect();
    const cssWidth = Math.max(1, box.width || window.innerWidth);
    const cssHeight = Math.max(1, box.height || window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.floor(cssWidth * dpr));
    const height = Math.max(1, Math.floor(cssHeight * dpr));

    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }

    return ensureFramebuffer(width, height);
  }

  function collectPanels() {
    const box = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, box.width);
    const scaleY = canvas.height / Math.max(1, box.height);
    const viewportHeight = window.innerHeight;
    const nodes = document.querySelectorAll('.hero-side, .telemetry, .calendar-panel, .cal-detail, .rule-card, .day');
    const panels = [];

    for (const node of nodes) {
      const rect = node.getBoundingClientRect();
      if (rect.width < 12 || rect.height < 12) continue;
      if (rect.bottom < -20 || rect.top > viewportHeight + 20) continue;

      const style = getComputedStyle(node);
      if (style.display === 'none' || style.visibility === 'hidden') continue;

      let tint = [0.035, 0.045, 0.10];
      if (node.classList.contains('hero-side')) tint = [0.075, 0.035, 0.13];
      else if (node.classList.contains('is-red')) tint = [0.14, 0.03, 0.06];
      else if (node.classList.contains('is-black')) tint = [0.025, 0.09, 0.14];
      else if (node.classList.contains('telemetry')) tint = [0.025, 0.035, 0.075];

      const radius = Math.min(
        parseFloat(style.borderTopLeftRadius) || 0,
        Math.min(rect.width, rect.height) * 0.5
      );

      panels.push({
        x: (rect.left - box.left) * scaleX,
        y: canvas.height - (rect.bottom - box.top) * scaleY,
        w: rect.width * scaleX,
        h: rect.height * scaleY,
        radius: radius * Math.min(scaleX, scaleY),
        tint
      });
    }

    return panels;
  }

  function draw(seconds) {
    if (failed) return;
    lastSeconds = seconds;

    if (!resize()) return;

    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.BLEND);

    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.viewport(0, 0, canvas.width, canvas.height);
    bindProgram(background);
    gl.uniform2f(uniform.bgRes, canvas.width, canvas.height);
    gl.uniform1f(uniform.bgTime, seconds);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    bindProgram(copy);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);
    gl.uniform1i(uniform.copyTex, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    const panels = collectPanels();
    if (!panels.length) return;

    bindProgram(glass);
    gl.uniform2f(uniform.glassRes, canvas.width, canvas.height);
    gl.uniform1i(uniform.glassTex, 0);
    gl.uniform1f(uniform.glassTime, seconds);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fbTexture);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.SCISSOR_TEST);

    for (const panel of panels) {
      const sx = Math.max(0, Math.floor(panel.x));
      const sy = Math.max(0, Math.floor(panel.y));
      const sw = Math.min(canvas.width - sx, Math.ceil(panel.w));
      const sh = Math.min(canvas.height - sy, Math.ceil(panel.h));
      if (sw <= 0 || sh <= 0) continue;

      gl.scissor(sx, sy, sw, sh);
      gl.uniform4f(uniform.glassRect, panel.x, panel.y, panel.w, panel.h);
      gl.uniform1f(uniform.glassRadius, panel.radius);
      gl.uniform3f(uniform.glassTint, panel.tint[0], panel.tint[1], panel.tint[2]);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }

    gl.disable(gl.SCISSOR_TEST);
    gl.disable(gl.BLEND);
  }

  function loop(now) {
    if (!running) return;
    if (!startedAt) startedAt = now;
    if (now - lastFrame >= 32) {
      lastFrame = now;
      draw((now - startedAt) / 1000);
    }
    raf = requestAnimationFrame(loop);
  }

  let redrawQueued = false;
  function redraw() {
    if (redrawQueued || running || failed) return;
    if (document.documentElement.dataset.theme !== 'glass') return;
    redrawQueued = true;
    requestAnimationFrame(() => {
      redrawQueued = false;
      draw(lastSeconds);
    });
  }

  function start() {
    if (running || failed) return;
    document.documentElement.classList.add('glass-liquid-ready');
    running = true;
    startedAt = 0;
    lastFrame = 0;

    if (reducedMotion) {
      draw(0);
      running = false;
      return;
    }

    raf = requestAnimationFrame(loop);
  }

  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  window.addEventListener('resize', () => {
    if (running) return;
    redraw();
  }, { passive: true });

  window.addEventListener('scroll', redraw, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (document.documentElement.dataset.theme === 'glass') {
      start();
    }
  });

  window.SkyGlass = { start, stop };
})();
