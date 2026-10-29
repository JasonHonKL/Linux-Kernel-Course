/* Lab checker UI: calls the local course server. */
(function () {
  "use strict";

  var LAB_TIMEOUT = 240000;
  var IS_PAGES = /\.github\.io$/.test(location.hostname);

  if (IS_PAGES) {
    var note = document.createElement("div");
    note.className = "pages-note";
    note.innerHTML =
      '<div class="wrap">这是 GitHub Pages 静态版：视频、图示、选择题和简答都能用；' +
      "实验检查需要在本地运行 <code>node linux-course/serve.mjs</code>。" +
      "实验文件与检查器见课程仓库说明。</div>";
    var main = document.querySelector("main");
    if (main) main.prepend(note);
  }

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text) n.textContent = text;
    return n;
  }

  function render(box, data) {
    var out = box.querySelector(".lab-results");
    if (!out) return;
    out.hidden = false;
    out.innerHTML = "";

    var badge = el(
      "span",
      "result-badge " + (data.pass ? "pass" : "fail"),
      data.pass ? "✓ 通过" : "✗ 未通过",
    );
    out.appendChild(badge);
    if (data.summary) {
      var s = el("p", "", data.summary);
      s.style.fontSize = "13px";
      s.style.color = "var(--text-2)";
      out.appendChild(s);
    }

    var cases = data.cases || data.criteria || [];
    if (cases.length) {
      var table = el("table", "result-table");
      var thead = el("thead");
      var hr = el("tr");
      hr.appendChild(el("th", "", "检查项"));
      hr.appendChild(el("th", "", "结果"));
      hr.appendChild(el("th", "", "证据"));
      thead.appendChild(hr);
      table.appendChild(thead);
      var tbody = el("tbody");
      cases.forEach(function (c) {
        var tr = el("tr");
        tr.appendChild(el("td", "", c.name || c.id || ""));
        var res = el(
          "td",
          "",
          (c.pass ? "✓ " : "✗ ") + (c.pass ? "通过" : "失败"),
        );
        res.style.color = c.pass ? "var(--success)" : "var(--error)";
        tr.appendChild(res);
        tr.appendChild(el("td", "", c.detail || c.evidence || ""));
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      out.appendChild(table);
    }

    if (data.log) {
      out.appendChild(el("pre", "buildlog", data.log));
    }
  }

  document.querySelectorAll(".lab[data-lab]").forEach(function (box) {
    var id = box.getAttribute("data-lab");
    var btn = box.querySelector("[data-check]");
    var status = box.querySelector(".lab-status");
    if (!btn) return;

    btn.addEventListener("click", function () {
      if (IS_PAGES) {
        if (status) {
          status.textContent =
            "GitHub Pages 不能运行实验检查。请克隆课程到本地后运行 node linux-course/serve.mjs。";
          status.className = "lab-status bad";
        }
        return;
      }
      btn.disabled = true;
      var old = btn.textContent;
      btn.innerHTML = '<span class="spinner"></span> 正在检查…';
      if (status) {
        status.textContent = "运行确定性检查中，可能需要重新编译 Git。";
        status.className = "lab-status";
      }
      var controller = new AbortController();
      var t = setTimeout(function () {
        controller.abort();
      }, LAB_TIMEOUT);

      fetch("/api/lab/" + encodeURIComponent(id) + "/check", {
        method: "POST",
        signal: controller.signal,
      })
        .then(function (r) {
          if (!r.ok)
            throw new Error("HTTP " + r.status + " " + r.statusText);
          return r.json();
        })
        .then(function (data) {
          render(box, data);
          if (status) {
            status.textContent = data.pass
              ? "检查完成：通过。"
              : "检查完成：还有未通过的项目。";
            status.className = "lab-status " + (data.pass ? "good" : "bad");
          }
        })
        .catch(function (e) {
          if (status) {
            status.textContent =
              e.name === "AbortError"
                ? "检查超时。请在终端运行 node linux-course/check.mjs " + id
                : "无法连接本地检查服务。请在课程目录运行 node linux-course/serve.mjs，或使用终端命令。";
            status.className = "lab-status bad";
          }
        })
        .then(function () {
          clearTimeout(t);
          btn.disabled = false;
          btn.textContent = old;
        });
    });
  });
})();
