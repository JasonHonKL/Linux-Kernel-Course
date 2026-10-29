# Linux 全景 · 从开机到容器

一门中文互动课程：开机、Shell、文件、用户、进程、内存、存储、网络、容器、内核模块。每节先问一个短问题，再展开。

- **14 个模块 · 20 个小节**
- **11 个核心实验 + 1 个 capstone**
- **≈16 小时**
- 源码：Linux **7.3.0**（commit `c339f40`）

## 主线

1. 开机与启动
2. Shell 与文本
3. 文件、inode、挂载
4. 用户、passwd、权限
5. 进程、信号、systemd
6. 内存、mmap
7. 存储与 I/O
8. 内核 C 与地址空间
9. 网络对象与地址
10. socket 与发送路径
11. IP、路由、邻居
12. sk_buff 与 TCP
13. 驱动、NAPI、XDP
14. 容器与隔离

## 实验

```sh
node linux-course/vm.mjs setup      # Lima Ubuntu VM
node linux-course/serve.mjs         # http://127.0.0.1:4173
node linux-course/lab.mjs start all
```

| 实验 | 环境 | 主题 |
|---|---|---|
| `lab-inode` | VM | 硬链接 / inode / 链接计数 |
| `lab-passwd` | VM | passwd / shadow / 用户生命周期 |
| `lab-mmap` | macOS C | shared / private mmap |
| `lab-kernel-c` | macOS C | container_of / 链表 / ERR_PTR |
| `lab-module` | VM | 内核模块 + /proc |
| `lab-sockaddr` | macOS C | IPv4 / CIDR / MAC |
| `lab-skb` | macOS C | sk_buff 指针与解析 |
| `lab-lpm` | macOS C | 最长前缀匹配 |
| `lab-netlink` | VM | RTM_GETADDR |
| `lab-netns` | VM | veth + netns |
| `lab-xdp` | VM | XDP 丢 ICMP |
| capstone | VM | 虚拟 netdev |

检查：

```sh
node linux-course/check.mjs lab-inode
node linux-course/check.mjs lab-passwd
node linux-course/check.mjs lab-mmap
node linux-course/check.mjs --self-test
```

## 视频

网络部分：主片 68 秒 + 12 条小节视频。基础模块目前以问题卡、图与实验为主。

## 发布

```sh
sh linux-course/publish.sh
```

只同步 `docs/`，不发布 `tests/`、`work/`、检查器、`linux-src/`。
