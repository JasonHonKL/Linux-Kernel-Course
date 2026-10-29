# Linux 内核网络 · 从 socket 到网卡

一门中文互动课程：用内核风格的 C 读网络栈，从一个 `sendto()` 追到驱动与 XDP。

**在线课程**：https://jasonhonkl.github.io/Linux-Kernel-Course/

## 内容

- 6 个模块 · 12 个小节
- 8 个核心实验 + 1 个 capstone
- 主片 68 秒 + 12 条小节视频
- 源码对照：Linux **7.3.0**（commit `c339f40`）

| 模块 | 主题 | 实验 |
|---|---|---|
| 1 | 内核 C 与地址空间 | Lab 0 kernel-c、Lab 1 module |
| 2 | 网络栈地图与地址 | Lab 2 sockaddr |
| 3 | socket 与发送路径 | Lab 3 netlink |
| 4 | IP、路由与邻居 | Lab 4 lpm、Lab 5 netns |
| 5 | sk_buff 与 TCP | Lab 6 skb |
| 6 | 驱动、NAPI 与 XDP | Lab 7 xdp、capstone |

## 这个仓库是什么

只托管**静态站点**（`docs/`）：页面、图、视频、选择题与简答。

GitHub Pages 不能运行实验检查，所以：

- 页面顶部会提示“实验检查需本地运行”。
- 「检查我的实验」在 `github.io` 上会提示回本地。
- 阅读、视频、19 张以内的 Mermaid 图、选择题、简答和本地保存都正常。

## 本地运行完整课程

静态仓库不包含检查器、`tests/`、`linux-src/` 和 VM 脚本。完整课程目录里：

```sh
node linux-course/vm.mjs setup      # Lima Ubuntu VM + 内核头文件
node linux-course/serve.mjs         # http://127.0.0.1:4173
node linux-course/lab.mjs start all

node linux-course/check.mjs lab-kernel-c
node linux-course/check.mjs lab-module
node linux-course/check.mjs lab-netns
node linux-course/check.mjs lab-xdp
```

`node linux-course/check.mjs --self-test` 验证 8 个实验的骨架必失败、参考实现必通过（VM 实验需要 Lima 运行）。

## 视频

- `docs/assets/linux-main.mp4`：主片 68 秒
- `docs/assets/sec-s1-1.mp4` … `sec-s6-2.mp4`：12 条小节视频

生成：`cd linux-course/video && node render.mjs`（Chrome + ffmpeg + edge-tts）。

## 发布

`docs/` 由本地课程目录生成：

```sh
sh linux-course/publish.sh
```

只同步公开静态文件（不含 `tests/`、`work/`、检查器、`linux-src/`、VM）。

## License

课程文字与站点：MIT。引用的 Linux 源码片段版权归 Linux 项目（GPL-2.0）。
