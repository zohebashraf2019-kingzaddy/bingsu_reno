/* Bingsu Reno — interactions */
(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Nav ---------- */
  const nav = $(".nav");
  const toggle = $(".nav__toggle");
  const drawer = $("#drawer");
  addEventListener("scroll", () => nav.classList.toggle("is-scrolled", scrollY > 10), { passive: true });
  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    drawer.hidden = open;
  });
  $$("a", drawer).forEach(a => a.addEventListener("click", () => { drawer.hidden = true; toggle.setAttribute("aria-expanded", "false"); }));

  /* ---------- Open / closed status (Reno time) ---------- */
  // day: 0=Sun … 6=Sat. Times in 24h decimal.
  const HOURS = { 3: [17, 20], 4: [17, 20], 5: [17, 21], 6: [16, 21] };
  const DAY = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const fmt = h => { const hr = Math.floor(h) % 12 || 12; const m = Math.round((h % 1) * 60); return hr + (m ? ":" + String(m).padStart(2, "0") : "") + (h >= 12 ? " PM" : " AM"); };

  function renoNow() {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: "America/Los_Angeles", weekday: "short", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date());
    const get = t => parts.find(p => p.type === t).value;
    const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
    const h = (parseInt(get("hour"), 10) % 24) + parseInt(get("minute"), 10) / 60;
    return { day, h };
  }
  function status() {
    const { day, h } = renoNow();
    const today = HOURS[day];
    if (today && h >= today[0] && h < today[1]) return { cls: "is-open", text: `Open now · until ${fmt(today[1])}`, day };
    if (today && h < today[0]) return { cls: "is-soon", text: `Opens today at ${fmt(today[0])}`, day };
    for (let i = 1; i <= 7; i++) {
      const d = (day + i) % 7;
      if (HOURS[d]) return { cls: "", text: `Closed · opens ${i === 1 ? "tomorrow" : DAY[d]} ${fmt(HOURS[d][0])}`, day };
    }
  }
  function paintStatus() {
    const s = status();
    $$("[data-status], [data-status-big]").forEach(el => {
      el.classList.remove("is-open", "is-soon");
      if (s.cls) el.classList.add(s.cls);
      $("[data-status-text]", el).textContent = s.text;
    });
    $$("[data-hours] tr").forEach(tr => {
      const d = Number(tr.dataset.day);
      const isClosedRow = d === 0 && (s.day === 0 || s.day === 1 || s.day === 2);
      tr.classList.toggle("is-today", d === s.day || isClosedRow);
    });
  }
  paintStatus();
  setInterval(paintStatus, 60000);

  /* ---------- Menu ---------- */
  const data = window.BINGSU_MENU;
  const tabs = $("[data-menu-tabs]");
  const grid = $("[data-menu-grid]");
  const money = p => (typeof p === "number" ? "$" + p.toFixed(2) : null);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  function renderMenu(id) {
    const cat = data.categories.find(c => c.id === id);
    $$("button", tabs).forEach(b => b.setAttribute("aria-selected", String(b.dataset.cat === id)));
    grid.innerHTML = (cat.note ? `<p class="menu__note">${esc(cat.note)}</p>` : "") + cat.items.map((it, i) => {
      const price = money(it.price);
      return `<article class="dish${it.soldOut ? " dish--soldout" : ""}" style="animation-delay:${i * 70}ms">
        <div class="dish__img">
          <img src="${esc(it.img)}" alt="${esc(it.name)}" loading="lazy" />
          ${it.soldOut ? `<span class="dish__tag">Sold out today</span>` : it.tag ? `<span class="dish__tag">${esc(it.tag)}</span>` : ""}
        </div>
        <div class="dish__body">
          <div class="dish__top">
            <h3>${esc(it.name)}</h3>
            ${price ? `<span class="dish__price">${price}</span>` : `<span class="dish__price dish__price--ask">Ask at the truck</span>`}
          </div>
          <span class="dish__ko" lang="ko">${esc(it.korean || "")}${it.size ? " · " + esc(it.size) : ""}</span>
          <p>${esc(it.desc)}</p>
        </div>
      </article>`;
    }).join("");
  }
  if (data && tabs && grid) {
    tabs.innerHTML = data.categories.map(c => `<button role="tab" data-cat="${c.id}">${esc(c.title)}<span lang="ko">${esc(c.korean || "")}</span></button>`).join("");
    tabs.addEventListener("click", e => { const b = e.target.closest("button"); if (b) renderMenu(b.dataset.cat); });
    renderMenu(data.categories[0].id);
    const upd = $("[data-menu-updated]");
    if (upd) upd.textContent = "Menu updated " + data.updated;
  }

  /* ---------- Quiz ---------- */
  const quiz = $("[data-quiz]");
  const findItem = name => data.categories.flatMap(c => c.items).find(i => i.name === name);
  const MATCH = {
    fruity: { photo: "Melon Bingsu", classic: "Strawberry Cheesecake Bingsu", tropical: "Mango Bingsu" },
    creamy: { photo: "Strawberry Cheesecake Bingsu", classic: "Strawberry Cheesecake Bingsu", tropical: "Mango Cheesecake Bingsu" },
    nutty: { photo: "Injeolmi Bingsu", classic: "Injeolmi Bingsu", tropical: "Mango Sticky Rice Matcha" },
    choco: { photo: "Oreo Bingsu", classic: "Oreo Bingsu", tropical: "Mango Sticky Rice Matcha" }
  };
  let first = null;
  const show = n => $$(".quiz__step", quiz).forEach(s => s.classList.toggle("is-active", s.dataset.step === String(n)));
  quiz.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    if (b.dataset.pick) { first = b.dataset.pick; show(2); }
    else if (b.dataset.pick2) {
      const item = findItem(MATCH[first][b.dataset.pick2]);
      if (!item) return;
      $("[data-result-img]", quiz).src = item.img;
      $("[data-result-img]", quiz).alt = item.name;
      $("[data-result-name]", quiz).textContent = item.name;
      $("[data-result-desc]", quiz).textContent = item.desc + (money(item.price) ? "  " + money(item.price) + "." : "");
      show(3);
    } else if (b.hasAttribute("data-quiz-reset")) { first = null; show(1); }
  });

  /* ---------- Reels: play when visible ---------- */
  const reels = $$("[data-reel]");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      const v = en.target;
      if (en.isIntersecting && !reduced) { v.preload = "auto"; v.play().catch(() => {}); }
      else v.pause();
    }), { threshold: 0.35 });
    reels.forEach(v => io.observe(v));
  }
  $$("[data-sound]").forEach(btn => btn.addEventListener("click", () => {
    const v = btn.parentElement.querySelector("video");
    v.muted = !v.muted;
    if (!v.muted) { reels.forEach(o => { if (o !== v) o.muted = true; }); v.currentTime = 0; v.play(); }
    btn.textContent = v.muted ? "🔈 Tap for sound" : "🔊 Sound on";
  }));

  /* ---------- Reveal on scroll ---------- */
  const rv = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("is-in"); rv.unobserve(e.target); } }), { threshold: 0.15 });
  $$(".reveal").forEach(el => rv.observe(el));

  /* ---------- Lightbox ---------- */
  const lb = $("[data-lightbox-view]");
  const lbImg = $("img", lb);
  $$("[data-lightbox]").forEach(b => b.addEventListener("click", () => {
    lbImg.src = b.dataset.lightbox; lbImg.alt = $("img", b).alt; lb.hidden = false;
  }));
  const close = () => { lb.hidden = true; lbImg.src = ""; };
  lb.addEventListener("click", e => { if (e.target !== lbImg) close(); });
  addEventListener("keydown", e => { if (e.key === "Escape" && !lb.hidden) close(); });

  /* ---------- Snowfall (shaved-ice flakes) ---------- */
  const canvas = $(".snow");
  if (canvas && !reduced) {
    const ctx = canvas.getContext("2d");
    let W, H, flakes, dpr;
    const resize = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      W = canvas.clientWidth; H = canvas.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(70, W / 18));
      flakes = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 2.6 + 0.8, s: Math.random() * 0.5 + 0.25, d: Math.random() * Math.PI * 2 }));
    };
    resize(); addEventListener("resize", resize);
    let visible = true;
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(canvas);
    (function tick() {
      if (visible) {
        ctx.clearRect(0, 0, W, H);
        for (const f of flakes) {
          f.y += f.s; f.d += 0.01; f.x += Math.sin(f.d) * 0.35;
          if (f.y > H + 5) { f.y = -5; f.x = Math.random() * W; }
          ctx.beginPath(); ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
          ctx.fillStyle = f.r > 2.4 ? "rgba(241,174,182,.55)" : "rgba(255,255,255,.95)";
          ctx.fill();
        }
      }
      requestAnimationFrame(tick);
    })();
  }

  /* ---------- Footer year ---------- */
  const y = $("[data-year]"); if (y) y.textContent = new Date().getFullYear();
})();
