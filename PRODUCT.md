# Product

## Register

brand

## Users

Anyone who has stared at a message like "sure, whatever works for you" and known it meant the opposite. No specific demographic: the shared experience is receiving passive-aggressive, over-polite, vague, or loaded messages from a boss, a client, a group chat, or a mum, and wanting the satisfaction of seeing the subtext named. Context: a phone, often shown to someone else in the room ("look at this"), frequently in a demo or portfolio setting where the first ten seconds decide whether it lands.

## Product Purpose

Decode This takes a message that says one thing and means another, strips the politeness, and shows the subtext underneath, then hands back three replies (diplomatic, straight, unhinged). It is a hackathon build and a portfolio piece: the joke and the utility are the same thing. Success is the reveal landing, the moment the honest read appears and gets a laugh of recognition, immediately followed by "wait, that's actually useful."

## Brand Personality

Funky, joyful, satirical. Reference point: Slack, sent up. The input state performs sterile, buttoned-up corporate politeness, the kind of channel where everyone is unbearably nice to each other's faces. Hitting Decode floods the interface with honesty: the mask visibly slips. That before/after contrast between polite-corporate and levelly honest is the entire personality of the product, carried in the interface itself, not only in the copy.

## Anti-references

- Not gendered. No pastels-as-cute, no dark hacker terminal aesthetic, no mascot character.
- None of Jasmin's existing brand colours, fonts, or house style (Aziz & Co, jasminaziz.co.uk, BJH, The Edit AI, Touch Grass, ops-dashboard). This is its own identity from zero.
- Generic AI-assembled interfaces: templated hero-metric layouts, gradient text, side-stripe card borders, identical icon-card grids. The studio bar is non-negotiable: it must read as design-studio work, not AI output.
- Literal Slack cloning. The reference is satirical distance from Slack, not a skin of it.

## Design Principles

- The before/after contrast is the product. Every design decision gets checked against whether it sharpens the gap between the sterile input state and the alive reveal state, not just whether it looks good in isolation.
- Function and joke are inseparable. The subtext meter, the tells, the reply cards are both the punchline and the deliverable; nothing should read as decoration bolted onto a serious tool or a joke bolted onto a bare form.
- Mobile-first, demo-first. This is shown on a phone, in a room, usually once. Judge every choice at phone width and at a glance, not at a leisurely desktop scroll.
- Commit, don't hedge. Funky and joyful means taking a visual position, not landing on safe middle ground to avoid risk.

## Accessibility & Inclusion

WCAG 2.1 AA as the floor: colour contrast, semantic markup, keyboard operability for the textarea, button, context chips, and copy buttons. The reveal animation respects `prefers-reduced-motion`: users with that preference set get the full state change (translation, meter, reply cards) with a fade or instant transition rather than the full choreographed sequence, never a skipped or broken result.
