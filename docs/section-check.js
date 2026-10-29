/* Section gate: MC with per-option rationale + short answer with local autosave. */
(function () {
  "use strict";

  var STORE_PREFIX = "tdc:linux-kernel-zh:";

  /* ---------- MC ---------- */
  document.querySelectorAll("fieldset.mc[data-mc]").forEach(function (mc) {
    var check = mc.querySelector(".btn-check");
    var retry = mc.querySelector(".btn-retry");
    var result = mc.querySelector(".mc-result");
    var why = mc.querySelector(".mc-why");
    if (!check) return;

    function clearMarks() {
      mc.querySelectorAll("label.opt").forEach(function (l) {
        l.classList.remove("answered", "correct", "wrong");
        var mark = l.querySelector(".mark");
        if (mark) mark.textContent = "";
      });
      if (result) {
        result.textContent = "";
        result.className = "mc-result";
      }
      if (why) why.hidden = true;
    }

    check.addEventListener("click", function () {
      var picked = mc.querySelector("input[type=radio]:checked");
      clearMarks();
      var correctLabel = mc.querySelector('label.opt[data-correct="1"]');
      var ok = false;

      mc.querySelectorAll("label.opt").forEach(function (l) {
        l.classList.add("answered");
        var mark = l.querySelector(".mark");
        var isCorrect = l.getAttribute("data-correct") === "1";
        var input = l.querySelector("input");
        if (isCorrect) {
          l.classList.add("correct");
          if (mark) mark.textContent = "✓ 正确答案";
        }
        if (input && input.checked && !isCorrect) {
          l.classList.add("wrong");
          if (mark) mark.textContent = "✗ 你的选择";
        }
        if (input && input.checked && isCorrect) ok = true;
      });

      if (result) {
        result.textContent = picked
          ? ok
            ? "✓ 答对了。下面的“为什么”仍然值得读一遍。"
            : "✗ 这次不对。看一遍每个选项的理由，再试一次。"
          : "先选一个选项，再检查。";
        result.className = "mc-result " + (ok ? "good" : "bad");
      }
      if (why) why.hidden = false;
      if (retry) retry.hidden = false;
      if (correctLabel) {
        /* keep the correct answer visible for comparison */
      }
    });

    if (retry)
      retry.addEventListener("click", function () {
        mc.querySelectorAll("input[type=radio]").forEach(function (i) {
          i.checked = false;
        });
        clearMarks();
        retry.hidden = true;
      });
  });

  /* ---------- short answer ---------- */
  document.querySelectorAll("[data-sa]").forEach(function (box) {
    var id = box.getAttribute("data-sa");
    var key = STORE_PREFIX + id + ":short-answer";
    var ta = box.querySelector("textarea");
    var counter = box.querySelector(".wordcount");
    var status = box.querySelector(".save-status");
    var reveal = box.querySelector("[data-reveal]");
    var stuck = box.querySelector("[data-stuck]");
    var model = box.querySelector(".model");
    var clear = box.querySelector("[data-clear]");
    var copyMine = box.querySelector("[data-copy-mine]");
    var copyModel = box.querySelector("[data-copy-model]");
    if (!ta) return;

    function count() {
      var n = ta.value.trim().length;
      if (counter) counter.textContent = n + " 字";
      return n;
    }

    function save() {
      try {
        localStorage.setItem(key, ta.value);
        if (status) status.textContent = "已保存到本机";
      } catch (e) {
        if (status) status.textContent = "无法保存（浏览器限制）";
      }
    }

    var timer = null;
    ta.addEventListener("input", function () {
      count();
      if (status) status.textContent = "正在保存…";
      clearTimeout(timer);
      timer = setTimeout(save, 450);
    });

    try {
      var saved = localStorage.getItem(key);
      if (saved) {
        ta.value = saved;
        if (status) status.textContent = "已恢复上次的内容";
      }
    } catch (e) {}
    count();

    function canReveal() {
      return ta.value.trim().length >= 15;
    }

    function doReveal() {
      if (!model) return;
      model.hidden = false;
      if (reveal) reveal.textContent = "隐藏参考答案";
    }

    if (reveal)
      reveal.addEventListener("click", function () {
        if (model && !model.hidden) {
          model.hidden = true;
          reveal.textContent = "查看参考答案";
          return;
        }
        if (!canReveal()) {
          if (status)
            status.textContent = "先写一句（至少 15 字），或点“我卡住了”。";
          return;
        }
        doReveal();
      });

    if (stuck)
      stuck.addEventListener("click", function () {
        doReveal();
        if (status) status.textContent = "先看结构，再用自己的话重写一遍。";
      });

    if (clear)
      clear.addEventListener("click", function () {
        ta.value = "";
        count();
        try {
          localStorage.removeItem(key);
        } catch (e) {}
        if (status) status.textContent = "已清空本机内容";
        if (model) model.hidden = true;
        if (reveal) reveal.textContent = "查看参考答案";
      });

    if (copyMine)
      copyMine.addEventListener("click", function () {
        navigator.clipboard.writeText(ta.value).then(function () {
          copyMine.textContent = "已复制";
          setTimeout(function () {
            copyMine.textContent = "复制我的答案";
          }, 1200);
        });
      });

    if (copyModel)
      copyModel.addEventListener("click", function () {
        var t = model ? model.querySelector("p") : null;
        navigator.clipboard.writeText(t ? t.textContent : "").then(function () {
          copyModel.textContent = "已复制";
          setTimeout(function () {
            copyModel.textContent = "复制参考答案";
          }, 1200);
        });
      });
  });
})();
