---
title: "How I Ended Up on Arch + Niri (The Long Way Lol)"
description: "A chronological walkthrough of learning Linux the hard way: broken dual-boots, WM hopping, shell/terminal/editor evolution, and where I landed."
---

## Why This Exists

Most portfolios show projects. Few show the infrastructure you had to learn just to build them. This is that infrastructure: the Linux side that doesn't live in a GitHub repo but shapes how you work every day.

---

## The False Starts

### VM → Dual-Boot → Hardware Hell

Started with Ubuntu in a VM. It lagged so bad it was unusable. Everyone said "start with Ubuntu" so I figured that was just how Linux was.

Switched to dual-boot thinking bare metal would fix it.

**It didn't.** WiFi, Bluetooth, microphone: none worked. Spent days on Reddit and the Arch Wiki tweaking kernel parameters. Someone said "just get the latest kernel." Back then that sounded like rocket science. I didn't even know how to switch kernels. Gave up and hid in WSL2 for a while.

WSL worked, but it hid everything: no boot process, no real hardware, no init. Convenient, but I wasn't *learning* Linux.

**The hardware:** MediaTek WiFi/Bluetooth + NVIDIA dGPU. Classic "new for Linux, old for Windows" combo. Still unsolved on that install.

---

## Learning the System Properly

Two resources changed everything:

- **[Linux Journey](https://linuxjourney.com/)**: filled the mental model gaps: permissions, processes, package managers, boot flow, filesystems.
- **[OverTheWire Bandit](https://overthewire.org/wargames/bandit/)**: forced me to use the CLI for real: SSH, file ops, grep, tar, cron, setuid binaries.

Stopped copy-pasting from ChatGPT and started understanding *why* commands worked. The shift from "how do I do X" to "what does this flag do" was the real turning point.

Then I went bare metal with Debian + KDE. Still no WiFi, Bluetooth, or mic. In hindsight it was obvious: the hardware was too new for the kernel I was running.

---

## Arch + Hyprland Era

### Why Arch

Needed a newer kernel for the MediaTek hardware. Arch's rolling releases meant kernel 6.x without manual compilation. The install (archinstall → manual partitioning later) taught me more about bootloaders, fstab, and kernel parameters than months of Ubuntu.

### Hyde → Custom Hyprland

Started with **[Hyde](https://github.com/HyDE-Project/HyDE)**, a pre-riced Hyprland dotfile suite. Tiling felt amazing on day one. Then one day it just stopped working, and I had no idea why. New to Linux, so I reinstalled. Again and again. Loop.

After a few months I got into ricing, ditched Hyde, and built my own config from scratch:
- **Waybar**: custom modules (pacman updates, network, audio)
- **matugen** + **swww**: dynamic wallpaper → color scheme sync (Material You style)
- **hyprpaper** → **swww** for smoother transitions
- Keybindings: workspace per project, scratchpads for terminals

This phase taught me Wayland protocols, XDG Desktop Portal, and why `wl-clipboard` matters.

---

## The Shell Hopping

| Phase | Setup | Why I Moved On |
|-------|-------|----------------|
| 1 | oh-my-zsh + plugins | Slow startup, opaque internals |
| 2 | Manual `.zshrc` with sourced files | Maintenance burden |
| 3 | **antigen** | Stable, declarative, stopped the hopping |

Antigen worked. Clean plugin list: `zsh-autosuggestions`, `zsh-syntax-highlighting`, `fzf-tab`, `zoxide`, `eza` aliases.

Then I tried **fish + fisher** and it just worked out of the box. No `compdef` ordering wars, no plugin manager bootstrap, no framework tax. Completions, autosuggestions, keybindings: sane by default. Only config I maintain: a few aliases and `fish_add_path` calls.

**Now:** Fish (primary), Zsh + antigen (secondary/POSIX fallback).

---

## The Terminal Hopping

Kitty, Ghostty, Alacritty, WezTerm: tried them all. Each had something (GPU rendering, ligatures, multiplexing) but also latency or config complexity.

**Foot** won:

```ini
# foot.ini: that's the whole config
[main]
include=~/.config/foot/themes/noctalia
font=MartianMono Nerd Font Mono:size=12
pad=4x4

[colors-dark]
alpha=0.85

[cursor]
style=block

[bell]
urgent=no

[scrollback]
indicator-position=relative
indicator-format=percentage

[search-bindings]
find-next=Control+n
find-prev=Control+p
```

`foot --server` + `footclient` starts instantly. No daemon management, no Lua config, just an `.ini` file. Fast as hell. Only terminal I've kept 6+ months without the itch.

---

## The WM Switch: Hyprland → Niri

While shell/terminal hopping, I also moved WMs.

Hyprland was great until the random crashes, plugin API churn, and config breakage on updates. I wanted something stable, scrollable, and keyboard-driven.

**Niri** (scrollable-tiling Wayland compositor) clicked immediately:
- Vertical workspace stack = mental model matches how I think
- **noctalia** handles night light, idle, DPMS, screenshots, wallpapers: one daemon, declarative config
- **ly** (TUI display manager) replaces SDDM: faster, lighter

No more rewriting my config every time Hyprland updates.

---

## The Editor Saga

### VSCode

Worked. Then Electron bloat hit: high RAM, slow startup, random freezes on large workspaces. Extension ecosystem unmatched, but the foundation felt wrong.

### LazyVim

Best "batteries included" Neovim distro. LSP, treesitter, formatting, pickers, all configured sanely. Used it 3 months. Learned Neovim's architecture by reading its source.

### Custom Neovim (Shell Editor & Quick Edits)

Stripped to a `mini.nvim`-centric config (~200 lines). No distro overhead.

```lua
-- plugins.lua
vim.pack.add({
  "https://github.com/RRethy/base16-nvim",
  "https://github.com/nvim-mini/mini.nvim",
  "https://github.com/nvim-telescope/telescope.nvim",
  "https://github.com/nvim-lua/plenary.nvim",
  "https://github.com/rafamadriz/friendly-snippets",
  { src = "https://github.com/nvim-treesitter/nvim-treesitter", branch = "main" },
  "https://github.com/neovim/nvim-lspconfig",
  "https://github.com/stevearc/conform.nvim",
  "https://github.com/lukas-reineke/indent-blankline.nvim",
  "https://github.com/mason-org/mason.nvim",
  "https://github.com/tpope/vim-fugitive",
  "https://github.com/stevearc/aerial.nvim",
  "https://github.com/brenton-leighton/multiple-cursors.nvim",
  { src = "https://github.com/nvim-treesitter/nvim-treesitter-textobjects", branch = "main" },
})
```

**Setup:**
- **LSP** via `nvim-lspconfig` + `mason.nvim` (installs servers/formatters)
- **Formatting** via `conform.nvim` (format-on-save, no linters)
- **Picker** via `telescope.nvim` + `mini.pick` fallbacks
- **UI**: `mini.statusline`, `mini.indentscope`, `mini.surround`, `mini.pairs`, `mini.ai`. The `mini.nvim` modules replace most single-purpose plugins
- **Treesitter** on `main` branch with `textobjects` for `yaf`/`daf`/`vaf`
