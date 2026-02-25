# I Was Too Lazy to Set Up Figma MCP, So I Built Something Better

Last week I wanted Claude to control my Figma file. The "official" way is MCP with a Figma API key. You need to generate tokens, configure servers, deal with JSON configs.

I looked at the setup docs for 30 seconds, then asked Claude: "Is there a simpler way?"

Turns out, there is. Figma Desktop has Chrome DevTools built in. You can connect directly. No API key. No tokens. Just your Figma app that's already open.

So we built a CLI that talks to Figma through DevTools. And then I realized: this is actually better than MCP for designers.

## Why This Beats MCP

- **No API key.** Your Figma session is already authenticated.
- **Works with your open file.** You see changes live.
- **Free Figma account works.** No paid tiers needed.

## The Real Power: Claude Learns Your Workflow

Every time you show Claude something and tell it what you want, Claude writes it to a file called `CLAUDE.md`. Next time, it remembers.

You're not just using an AI assistant. You're training your own design agent.

**Examples of what Claude can learn:**

- How you name and organize layers
- Your preferred spacing and alignment
- How you structure pages and frames
- Your export settings
- Any repetitive task you do in Figma

Show it once, explain what you want. Claude saves it. Next time it just works.

## How to Set It Up

**What you need:**
- Figma Desktop (free account works)
- Claude Code installed ([get it here](https://claude.ai/code))

**Step 1: Download**

Go to the GitHub repo, click "Code" → "Download ZIP". Unzip it.

**Step 2: Open Terminal**

On Mac: Open Terminal (Spotlight → "Terminal")

Type:
```
cd ~/Downloads/figma-cli-main
```

**Step 3: Start Claude**

```
claude
```

**Step 4: First message**

```
Setup: install dependencies and connect to Figma
```

Done. Now talk to Claude about your Figma file.

## Building Your Own Design Agent

This is the part I'm excited about.

Every designer works differently. Your shortcuts, your naming, your process. Generic AI doesn't know any of that.

But Claude can learn. Show it your workflow, tell it what matters. It writes everything to `CLAUDE.md`. Copy that file to your next project, your agent comes with you.

Over time, you build an AI that works the way YOU work.

## Try It

This is a work in progress. I'm still experimenting with what's possible when you connect Claude directly to Figma.

GitHub: [link to repo]

Open Figma, start Claude, tell it what you want to build. Then teach it something about your workflow.

If you try it, let me know what works and what doesn't. DM me on X or open an issue on GitHub. Your feedback shapes where this goes next.

---

*Built by Sil Bormüller, creator of Into Design Systems.*
