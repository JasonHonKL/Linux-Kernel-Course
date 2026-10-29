# Linux 全景 · 从开机到 GPU

一本中文互动书：先会用 Linux，再读内核，再做网络与平台，最后做系统工程。每节先问一个短问题，再展开。

- **22 章 · 28 节**
- **11 个核心实验 + 1 个 capstone + 8 个系统工程**
- **≈24 小时阅读/实验；项目 150–250 小时**
- 源码：Linux **7.3.0**（commit `c339f40`）

## 五个 Part

**Part I · 系统基础（1–7）**
1 开机与启动 · 2 Shell 与文本 · 3 文件/inode · 4 用户/passwd · 5 进程/systemd · 6 存储/IO · 7 内存/mmap

**Part II · 内核基础（8–11）**
8 内核 C 与地址空间 · 9 UB/内存序 · 10 锁/RCU · 11 内存/DMA/IOMMU

**Part III · 网络（12–16）**
12 socket/对象 · 13 发送路径 · 14 IP/路由 · 15 sk_buff/TCP · 16 驱动/NAPI/XDP

**Part IV · 平台与加速器（17–20）**
17 PCIe/驱动 · 18 GPU/DRM/KMS · 19 KVM/virtio · 20 容器/隔离

**Part V · 工程能力（21–22）**
21 性能/eBPF · 22 安全/测试/上游

## 实验

```sh
node linux-course/vm.mjs setup      # Lima Ubuntu VM
node linux-course/serve.mjs         # http://127.0.0.1:4173
node linux-course/lab.mjs start all
```

| 实验 | 环境 | 主题 |
|---|---|---|
| `lab-inode` | VM | 硬链接 / inode |
| `lab-passwd` | VM | passwd / shadow / 用户 |
| `lab-mmap` | macOS C | shared / private mmap |
| `lab-kernel-c` | macOS C | container_of / 链表 |
| `lab-module` | VM | 模块 + /proc |
| `lab-sockaddr` | macOS C | IPv4 / CIDR / MAC |
| `lab-skb` | macOS C | sk_buff |
| `lab-lpm` | macOS C | 最长前缀 |
| `lab-netlink` | VM | RTM_GETADDR |
| `lab-netns` | VM | veth + netns |
| `lab-xdp` | VM | XDP |
| capstone | VM | 虚拟 netdev |

## 系统工程（项目制）

P1 lock-free ring · P2 竞态修复 · P3 DMA · P4 QEMU PCIe 驱动 · P5 DRM/KMS · P6 virtio · P7 性能回归 · P8 upstream patch

## 视频

网络部分：主片 68 秒 + 12 条小节视频。其他章节以问题卡、图与实验为主。

## 发布

```sh
sh linux-course/publish.sh
```

只同步 `docs/`，不发布 `tests/`、`work/`、检查器、`linux-src/`。
