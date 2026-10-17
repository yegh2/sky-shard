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

  const fragmentSource = `
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

      col *= smoothstep(1.45, 0.22, length(p));
      col += (hash(gl_FragCoord.xy + t) - 0.5) * 0.012;

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  function compile(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  }

  const vertexShader = compile(gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = compile(gl.FRAGMENT_SHADER, fragmentSource);
  if (!vertexShader || !fragmentShader) {
    canvas.classList.add('is-failed');
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    canvas.classList.add('is-failed');
    return;
  }

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const position = gl.getAttribLocation(program, 'a_pos');
  const resolution = gl.getUniformLocation(program, 'u_res');
  const time = gl.getUniformLocation(program, 'u_time');

  gl.useProgram(program);
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  let raf = null;
  let running = false;
  let startedAt = 0;
  const reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const width = Math.max(1, Math.floor(window.innerWidth * dpr));
    const height = Math.max(1, Math.floor(window.innerHeight * dpr));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      gl.viewport(0, 0, width, height);
    }
  }

  function draw(seconds) {
    resize();
    gl.useProgram(program);
    gl.uniform2f(resolution, canvas.width, canvas.height);
    gl.uniform1f(time, seconds);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  function loop(now) {
    if (!running) return;
    if (!startedAt) startedAt = now;
    draw((now - startedAt) / 1000);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    if (running) return;
    running = true;
    startedAt = 0;
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
    if (running) resize();
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stop();
    } else if (document.documentElement.dataset.theme === 'glass') {
      start();
    }
  });

  window.SkyGlass = { start, stop };
})();
