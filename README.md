# Linux 全景 · 从 passwd 到网络栈

一门中文互动课程：先补文件、用户、进程、内存，再进入内核网络。每节先问一个短问题，再展开。

- **10 个模块 · 16 个小节**
- **11 个核心实验 + 1 个 capstone**
- **≈14 小时**
- 源码：Linux **7.3.0**（commit `c339f40`）

## 结构

### Part A · 系统基础

| 模块 | 问题 | 实验 |
|---|---|---|
| A 文件/inode | 文件名是身份吗？ | `lab-inode` |
| B passwd/权限 | 密码到底存在哪？ | `lab-passwd` |
| C 进程/systemd | fork 共享内存吗？ | 60 秒 `/proc` 动手 |
| D 内存/mmap | mmap 会立刻读文件吗？ | `lab-mmap` |

### Part B · 内核网络深入

| 模块 | 主题 | 实验 |
|---|---|---|
| 1 | 内核 C 与地址空间 | `lab-kernel-c`、`lab-module` |
| 2 | 对象与地址 | `lab-sockaddr` |
| 3 | socket / netlink | `lab-netlink` |
| 4 | IP / 路由 / netns | `lab-lpm`、`lab-netns` |
| 5 | sk_buff / TCP | `lab-skb` |
| 6 | 驱动 / XDP | `lab-xdp` + capstone |

## 运行

```sh
node linux-course/vm.mjs setup      # Lima Ubuntu VM + 内核头文件
node linux-course/serve.mjs         # http://127.0.0.1:4173
node linux-course/lab.mjs start all
```

检查：

```sh
node linux-course/check.mjs lab-inode
node linux-course/check.mjs lab-passwd
node linux-course/check.mjs lab-mmap
node linux-course/check.mjs lab-kernel-c
```

`node linux-course/check.mjs --self-test` 验证所有实验：骨架必须失败、参考实现必须通过。

## 视频

网络部分：主片 68 秒 + 12 条小节视频。基础模块目前以问题卡、图和实验为主。

## 发布

```sh
sh linux-course/publish.sh
```

只同步 `docs/` 静态站点，不发布 `tests/`、`work/`、检查器、`linux-src/`。
