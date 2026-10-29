/* Course shell: Mermaid, rail, progress, tooltips, micro-checks, copy. */
(function () {
  "use strict";

  var COURSE = "linux-kernel-zh";

  /* ---------- Mermaid ---------- */
  function renderDiagrams() {
    if (typeof mermaid === "undefined") {
      document.querySelectorAll(".mermaid").forEach(function (el) {
        el.classList.add("mermaid-failed");
      });
      return;
    }
    mermaid.initialize({
      startOnLoad: false,
      theme: "base",
      securityLevel: "loose",
      themeVariables: {
        primaryColor: "#FFFFFF",
        primaryTextColor: "#111318",
        primaryBorderColor: "#1F6F8B",
        lineColor: "#5F6673",
        secondaryColor: "#F3F4F6",
        tertiaryColor: "#EAF4F8",
        clusterBkg: "#F7F7F8",
        clusterBorder: "#D7DADF",
        fontFamily:
          '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif',
        fontSize: "14px",
      },
      flowchart: { curve: "basis", htmlLabels: true, padding: 10 },
      sequence: { mirrorActors: false, messageAlign: "left" },
    });
    var nodes = Array.prototype.slice.call(
      document.querySelectorAll(".mermaid"),
    );
    if (!nodes.length) return;
    mermaid.run({ nodes: nodes }).catch(function () {
      nodes.forEach(function (n) {
        n.classList.add("mermaid-failed");
      });
    });
  }

  /* ---------- rail ---------- */
  function buildRail() {
    var list = document.getElementById("railList");
    if (!list) return;
    var sections = Array.prototype.slice.call(
      document.querySelectorAll(".section"),
    );
    var html = "";
    var currentModule = null;
    sections.forEach(function (sec) {
      var mod = sec.closest(".module");
      var modTitle = mod ? mod.getAttribute("data-title") : "";
      var modNum = mod ? mod.getAttribute("data-num") : "";
      if (modTitle && modTitle !== currentModule) {
        currentModule = modTitle;
        html +=
          '<li class="rail-module">模块 ' +
          modNum +
          " · " +
          modTitle +
          "</li>";
      }
      var h = sec.querySelector("h3");
      var title = sec.getAttribute("data-title") || (h ? h.textContent : "");
      var read = sec.getAttribute("data-read") || "";
      var check = sec.getAttribute("data-check") || "";
      var total = read && check ? Number(read) + Number(check) : 0;
      var time = total ? "≈" + total + " 分钟" : "";
      var tip =
        read && check
          ? "阅读约 " + read + " 分钟 + 检查约 " + check + " 分钟"
          : "";
      html +=
        '<li><a href="#' +
        sec.id +
        '"><span class="dot"></span><span>' +
        title +
        '<span class="rt" title="' +
        tip +
        '">' +
        time +
        "</span></span></a></li>";
    });
    list.innerHTML = html;
    observeSections(sections);
  }

  function observeSections(sections) {
    var links = {};
    document.querySelectorAll("#railList a").forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var active = null;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          var id = e.target.id;
          if (active === id) return;
          active = id;
          Object.keys(links).forEach(function (k) {
            links[k].classList.toggle("active", k === id);
          });
          var next = document.getElementById("railNext");
          if (next) {
            var label =
              e.target.getAttribute("data-next") ||
              "下一节：" +
                (e.target.nextElementSibling &&
                e.target.nextElementSibling.querySelector("h3")
                  ? e.target.nextElementSibling.querySelector("h3")
                      .textContent
                  : "继续");
            next.textContent = label;
          }
        });
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );
    sections.forEach(function (s) {
      io.observe(s);
    });
  }

  function progress() {
    var bar = document.getElementById("progressBar");
    if (!bar) return;
    function update() {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      var p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = p.toFixed(1) + "%";
    }
    document.addEventListener("scroll", update, { passive: true });
    update();
  }

  /* ---------- tooltips ---------- */
  function tooltips() {
    var tip = document.createElement("div");
    tip.className = "tooltip";
    tip.setAttribute("role", "tooltip");
    document.body.appendChild(tip);
    var current = null;

    function show(el) {
      var text = el.getAttribute("data-def");
      if (!text) return;
      current = el;
      tip.textContent = text;
      var r = el.getBoundingClientRect();
      tip.style.left = Math.min(
        window.innerWidth - 310,
        Math.max(8, r.left - 8),
      ) + "px";
      tip.style.top = r.bottom + 8 + "px";
      tip.classList.add("show");
    }
    function hide() {
      current = null;
      tip.classList.remove("show");
    }
    document.addEventListener("mouseover", function (e) {
      var el = e.target.closest("abbr.term");
      if (el) show(el);
    });
    document.addEventListener("mouseout", function (e) {
      if (e.target.closest("abbr.term")) hide();
    });
    document.addEventListener("focusin", function (e) {
      var el = e.target.closest("abbr.term");
      if (el) show(el);
    });
    document.addEventListener("focusout", function (e) {
      if (e.target.closest("abbr.term")) hide();
    });
    document.addEventListener("click", function (e) {
      var el = e.target.closest("abbr.term");
      if (el && window.matchMedia("(hover: none)").matches) {
        e.preventDefault();
        current === el ? hide() : show(el);
      }
    });
    window.addEventListener("scroll", hide, { passive: true });
  }

  /* ---------- copy ---------- */
  function copyButtons() {
    document.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-copy]");
      if (!btn) return;
      var text = btn.getAttribute("data-copy");
      if (text === "target") {
        var sel = btn.getAttribute("data-copy-target");
        var node = sel ? document.querySelector(sel) : null;
        text = node ? node.textContent : "";
      }
      if (!text) return;
      navigator.clipboard
        .writeText(text)
        .then(function () {
          var old = btn.textContent;
          btn.textContent = "已复制";
          setTimeout(function () {
            btn.textContent = old;
          }, 1400);
        })
        .catch(function () {});
    });
  }

  /* ---------- micro checks ---------- */
  function microChecks() {
    document.querySelectorAll("[data-micro]").forEach(function (box) {
      var good = box.getAttribute("data-good");
      var result = box.querySelector(".micro-result");
      box.querySelectorAll("button[data-pick]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var val = btn.getAttribute("data-pick");
          box.querySelectorAll("button[data-pick]").forEach(function (b) {
            b.classList.remove("picked", "good", "bad");
          });
          btn.classList.add("picked");
          var ok = good === null || good === "" || val === good;
          btn.classList.add(ok ? "good" : "bad");
          if (result) {
            result.hidden = false;
            result.classList.toggle("bad", !ok && good !== null);
            var msg = result.getAttribute("data-msg-" + val);
            if (msg) result.textContent = msg;
          }
        });
      });
    });

    document.querySelectorAll("[data-order]").forEach(function (box) {
      var answer = (box.getAttribute("data-order") || "").split("|");
      var seq = box.querySelector(".order-seq");
      var status = box.querySelector(".order-status");
      var pool = box.querySelector(".order-pool");
      if (!seq || !pool) return;
      var chosen = [];
      pool.querySelectorAll("button[data-step]").forEach(function (btn) {
        btn.addEventListener("click", function () {
          var step = btn.getAttribute("data-step");
          chosen.push(step);
          var chip = document.createElement("button");
          chip.type = "button";
          chip.textContent = step;
          chip.className = "picked";
          chip.disabled = true;
          seq.appendChild(chip);
          var i = chosen.length - 1;
          if (chosen[i] !== answer[i]) {
            if (status) {
              status.textContent = "顺序不对，清空后再试一次。";
              status.classList.add("bad");
            }
            setTimeout(function () {
              chosen = [];
              seq.innerHTML = "";
              if (status) {
                status.textContent = "";
                status.classList.remove("bad");
              }
            }, 900);
          } else if (chosen.length === answer.length) {
            if (status) {
              status.textContent = "顺序正确：" + answer.join(" → ");
              status.classList.add("good");
            }
          }
        });
      });
      var reset = box.querySelector("[data-order-reset]");
      if (reset)
        reset.addEventListener("click", function () {
          chosen = [];
          seq.innerHTML = "";
          if (status) {
            status.textContent = "";
            status.classList.remove("good", "bad");
          }
        });
    });
  }

  /* ---------- syntax highlighting ---------- */
  function guessLang(text) {
    if (/^\s*(import |def |class )/m.test(text) || /struct\.unpack|json\.dump/.test(text))
      return "python";
    if (/^#!\/bin\/sh|^ip netns|^make |^\$ /m.test(text)) return "bash";
    if (/^\s*\{/m.test(text)) return "json";
    return "c";
  }

  function highlightCode() {
    if (!window.Prism) return;

    document.querySelectorAll(".code pre code").forEach(function (el) {
      if (!/\blanguage-/.test(el.className)) el.className = "language-c";
    });

    document.querySelectorAll(".translate .t-code").forEach(function (el) {
      if (!/\blanguage-/.test(el.className)) el.classList.add("language-c");
    });

    document.querySelectorAll(".lab-preview pre").forEach(function (pre) {
      var code = pre.querySelector("code");
      if (!code) {
        code = document.createElement("code");
        code.textContent = pre.textContent;
        pre.textContent = "";
        pre.appendChild(code);
      }
      if (!/\blanguage-/.test(code.className))
        code.className = "language-" + guessLang(code.textContent);
    });

    document
      .querySelectorAll('code[class*="language-"], .t-code[class*="language-"]')
      .forEach(function (el) {
        try {
          window.Prism.highlightElement(el);
        } catch (e) {
          /* leave the block unhighlighted rather than break the page */
        }
      });
  }

  /* ---------- start ---------- */
  document.addEventListener("DOMContentLoaded", function () {
    highlightCode();
    renderDiagrams();
    buildRail();
    progress();
    tooltips();
    copyButtons();
    microChecks();
  });

  window.COURSE_KEY = COURSE;
})();
