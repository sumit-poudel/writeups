---
title: "Zeditor: The Editor I Configure Workflow In"
description: "My Zed setup for Go + Templ projects: vim keymap, minimal UI, tmux terminal, lazygit tasks, and local-only AI."
---

## Why Zed

I went VSCode → LazyVim → custom Neovim → Zed. VSCode was Electron bloat. Neovim was great, but I was spending time on editor internals instead of projects. Zed gave me a native (Rust) editor with vim mode, LSP, treesitter, git, a terminal and tasks built in, so most of my config is about *workflow*, not plumbing.

Neovim is still my shell editor for commits and quick edits. Zed is for projects.

---

## Minimal UI

I want the code and nothing else on screen.

```json
"tab_bar": { "show": false },
"scrollbar": { "show": "never" },
"hover_popover_enabled": false,
"toolbar": { "code_actions": false, "quick_actions": false, "breadcrumbs": true },
"title_bar": { "show_branch_name": false, "show_sign_in": false, "show_user_menu": false },
"restore_on_startup": "empty_tab"
```

- **No tab bar.** I switch buffers with `shift-h` / `shift-l`, so tabs are wasted space.
- **Every panel docks right** (project, outline, git, collaboration), and the agent panel docks left. The editor stays in the middle.
- **Theme:** Quasi Monochrome Dark, with Ayu Light for light mode. I override Ayu Darker and Noctalia Light so the gutter, borders, panels, title bar and status bar all share one background color. That gives a flat look with no visible seams.
- **Fonts:** MartianMono Nerd Font at size 14, with relative line numbers on.
- **Cursor:** a non-blinking bar.

---

## Vim Mode and Keymap

Vim mode is on by default, so text objects like surround and `yaf`/`daf` work natively. My keymap uses **space as the leader**, like my Neovim setup, so the muscle memory carries over.

### Navigation and files

| Keys | Action |
|------|--------|
| `space f f` | File finder |
| `space f g` | Text finder (grep) |
| `space f p` | Open recent project |
| `space e` | Focus project panel |
| `space o` / `space space o` | Symbol outline / outline panel |
| `space p` | Command palette |
| `space r` | Search and replace |

### Buffers and panes

| Keys | Action |
|------|--------|
| `shift-h` / `shift-l` | Previous / next buffer |
| `space w` | Close buffer |
| `space i` | Close other buffers |
| `space q a` | Close all buffers |
| `space s h/j/k/l` | Move between panes |
| `space -` / `space |` | New file, split horizontal / vertical |
| `space ;` | Toggle right dock |
| `ctrl-/` | Toggle terminal |

### Code

| Keys | Action |
|------|--------|
| `f f` | Format |
| `space c` | Toggle comments (normal and visual) |
| `space f r` | Find all references |
| `space d` | Toggle inline diagnostics |
| `space j` / `space '` | Next / previous diagnostic |
| `shift-j` / `shift-k` | Move line down / up |
| `U` | Redo |
| `ctrl-j` / `ctrl-k` | Add cursor below / above |
| `ctrl-[` / `ctrl-]` | Fold / unfold |
| `ctrl-alt-[` / `ctrl-alt-]` | Fold all / unfold all |

I also rebound the project panel to single keys: `a` new file, `A` new directory, `r` rename, `x` cut, `y` copy, `p` paste, `d` delete, `c` copy relative path, `o` reveal in file manager, `q` close the dock. It works like oil.nvim or a file manager.

I unbound `ctrl-s` on purpose, because autosave is on:

```json
"autosave": { "after_delay": { "milliseconds": 1000 } }
```

---

## Go + Templ Workflow

Go is my main language, so it gets the most attention.

```json
"Go": { "tab_size": 2, "formatter": "auto", "format_on_save": "on" },
"Templ": {
  "tab_size": 2,
  "formatter": { "external": { "command": "templ", "arguments": ["fmt", "-stdin-filepath", "{buffer_path}"] } },
  "format_on_save": "on",
  "language_servers": ["templ", "tailwindcss-language-server", "datastar-lsp", "vscode-html-language-server", "emmet-language-server"],
  "inlay_hints": { "enabled": true }
}
```

- **Format on save is off globally** and on only for Go and Templ, so I never reformat files I don't own.
- **Templ files** get the templ LSP plus Tailwind, Datastar, HTML and Emmet servers running together. Tailwind class completion works inside templ because I map `templ` to `html` in `includeLanguages` and add a `classRegex`.
- **JS/TS formatting** goes through Biome (`fixAll` and `organizeImports` on format), with Prettier settings as a fallback.

---

## Git and Fuzzy Finding: Tasks Instead of Plugins

Zed's plugin story is small, so I use tasks to call the tools I already like.

```json
{
  "label": "start lazygit",
  "command": "lazygit -p $ZED_WORKTREE_ROOT",
  "hide": "on_success",
  "use_new_terminal": true,
  "shell": { "program": "sh" }
}
```

- `space g g` opens **lazygit** for the whole project in a centered terminal, and it closes itself when I quit.
- `space g f` opens **lazygit's file log** for the current file, using `$ZED_RELATIVE_FILE`.
- Two more tasks, `File Finder` and `Find in File`, run `zeditor "$(tv files)"` and `zeditor "$(tv rg)"`. They use [television](https://github.com/alexpasmantier/television) as a fuzzy picker and open the result in Zed.
- A **Bun test** task, tagged for JS/TS tests, runs the test under the cursor.

---

## Terminal: One tmux Session per Project

```json
"terminal": {
  "dock": "right",
  "shell": {
    "with_arguments": {
      "program": "/bin/zsh",
      "args": ["-c", "tmux new-session -A -s \"$(basename \"$PWD\" | tr '.:' '-')\""]
    }
  }
}
```

Opening the terminal attaches to (or creates) a tmux session named after the project folder. Closing the terminal doesn't kill anything, and reopening it drops me back where I was. I use zsh here instead of fish because this one-liner is POSIX-friendly.

---

## Local-Only AI

Everything AI in my Zed runs on my own machine.

- **Edit predictions:** a local OpenAI-compatible server on `localhost:8080` running Qwen2.5-Coder-3B (Q4_K_M) with the `qwen` prompt format. I use `subtle` mode and cap output at 64 tokens. I keep predictions off by default so they don't distract, and `alt-v` accepts one when they're on.
- **Agent panel:** LM Studio on `127.0.0.1:1234`, with a small DeepSeek-R1 distill as the default model and Qwen2.5-Coder-3B as an option.
- **External agents:** OpenCode (set to build mode with a free model), plus Copilot CLI and Devin registered from the agent registry.

No API keys are needed for the daily setup, and nothing leaves my machine.

---

## Extensions

I keep the list short: HTML, Dockerfile, SQL, Emmet, Make, Biome and Catppuccin. Language support is mostly built in, and the extensions cover the rest.

---

## What I Like and What I'd Change

**Likes**
- It starts fast, and I never have to wait for it.
- Vim binds and text objects are built in.
- Tasks turn any CLI tool into an editor feature.
- The whole config is three small files: `settings.json`, `keymap.json`, `tasks.json`.

**Would change**
- The extension and plugin ecosystem is still smaller than VSCode's or Neovim's.
- Some vim behaviors differ from real Neovim (my `f f` format binding shadows the `f` motion, for example).
- Small local models are fast but limited, so anything big I do outside the editor.

---

## The Config

The full files live in my dotfiles:

```
git clone https://github.com/sumit-poudel/dotfiles
```

- `~/.config/zed/settings.json`
- `~/.config/zed/keymap.json`
- `~/.config/zed/tasks.json`
