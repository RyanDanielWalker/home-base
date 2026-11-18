# 0022. Keep the current list until Ryan changes it: drag to reorder, a soft cap of 6, and a quiet stale label at 2 days

- **Status:** Accepted; past-cap "yellow" replaced by a pale amber tint in [0025](./0025-task-states-three-shapes-three-meanings.md)
- **Date:** 2026-11-18
- **Related:** [0020](./0020-built-in-to-do-list-backlog-and-current-list.md), [0021](./0021-two-clocks-and-optional-due-dates.md), [0023](./0023-deal-with-stale-tasks-before-adding.md)

## In plain English

The current list never clears itself. Ryan drags tasks into the order he wants, and new ones land at the bottom. Anything past the sixth task is marked (the brief said yellow; [0025](./0025-task-states-three-shapes-three-meanings.md) makes it a dashed divider and a pale amber tint), meaning "you're probably not getting to this one today," but nothing is blocked. A task that's been on the list 2 days or more gets a quiet label like "on the list 3 days."

## Context

Covers four decision log rows from 2026-11-18: "Current list never resets; soft cap of 6, with tasks past it shown in yellow," "Current-list tasks go stale at 2+ days," "Stale marker: a quiet 'on the list N days' label in its own style," and "Current list order: drag to reorder, new tasks at the bottom."

A **soft cap** is a limit that warns instead of refusing. A hard cap would block the seventh task; this one lets it in and colors it.

## Options considered

1. **Never reset, drag to reorder, soft cap of 6, stale label at 2 days.** Finite without the app moving Ryan's tasks for him.
2. **Daily or weekly reset.** A clean slate. The app moves tasks Ryan didn't ask it to move, and unfinished work silently drops back.
3. **A hard cap.** Enforces focus. A wall, not friction, and the principles prefer friction.
4. **Order added, no reordering.** Less to build. Ryan can't say what matters most.
5. **A wilting task that looks worse each day** as the stale marker. Playful. Vague, and reads as guilt.
6. **No staleness rules.** Calm. Stalled tasks pile up unseen.

## Decision

Option 1. Because new tasks land at the bottom, a task added to a full list arrives already past the cap, which adds a little friction on its own.

## Consequences

- **Good:** The list stays finite, and Ryan stays in charge of it.
- **Bad:** Drag to reorder is real work on a phone (touch dragging, keyboard alternatives for accessibility).
- **Follow-ups:** the visual system for task states, decided in [0025](./0025-task-states-three-shapes-three-meanings.md).
