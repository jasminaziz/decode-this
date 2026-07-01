<!-- SEED: creative direction is fully committed below. Re-run /impeccable document in scan mode once Step 3 (styled build) lands, to capture the real rendered tokens and generate the component sidecar. -->

---
name: Decode This
description: The office memo that stops lying the moment you hit Decode.
colors:
  loudmouth-pink: "#FF2E93"
  whistleblower-yellow: "#F5D300"
  break-room-beige: "#F3ECE9"
  laminate-grey: "#6B6467"
  ink: "#1F1A1D"
  institutional-border: "#D8D0CC"
typography:
  display:
    fontFamily: "Bricolage Grotesque, system-ui, sans-serif"
    fontWeight: 800
    letterSpacing: "-0.01em"
  body:
    fontFamily: "General Sans, system-ui, sans-serif"
    fontWeight: 400
    lineHeight: 1.5
  meta:
    fontFamily: "Space Mono, monospace"
    fontWeight: 400
    letterSpacing: "0.04em"
---

# Design System: Decode This

## 1. Overview

**Creative North Star: "Beige, Until It Isn't"**

The whole design system is one transformation, run twice a session: an interface performing corporate politeness, and the same interface caught out. The before-state is deliberately, aggressively beige: institutional, over-formal, the visual register of a break room noticeboard or a Lumon-style onboarding screen from *Severance*, all fluorescent calm and nobody saying the real thing. The after-state is the same layout, the same components, flooded with colour the instant Decode fires, because honesty isn't a new screen, it's what was underneath the whole time.

This rejects two failure modes at once. It rejects generic productivity-SaaS polish (Notion, Linear, Asana clean-gradient competence) because that would make the before-state look like a good app rather than a joke about bad ones. And it rejects cute-quirky AI-tool default (soft pastels, rounded mascots, friendly illustration) because the joke is dry and a little vicious, not warm and cuddly. Reference lane: satirical-institutional, closer to an MSCHF product drop or a photocopied office memo than a startup landing page.

**Key Characteristics:**
- One colour system, two states: desaturated-institutional at rest, saturated-confessional on reveal. No new colours appear on reveal that weren't already latent in the palette.
- One type family for display, used at wildly different weight and scale between states, not swapped out. The corporate voice and the honest voice are the same voice, just louder.
- Deadpan mono type for anything performing officialdom: field labels, timestamps, the tells. Doing the bit, not winking at it.
- Flat by default. Depth comes from the state change, not from shadows.
- Expected custom components once built: the message card (before/after states), the Decode button, four context chips, the subtext meter, up to three tell stamps, three reply cards (diplomatic, straight, unhinged) with rising visual intensity.

## 2. Colors

Two roles, not four: a desaturated institutional base that owns the interface at rest, and one confessional accent that floods in on reveal. A second accent marks the most extreme reply card only, so intensity has somewhere further to go.

### Primary
- **Loudmouth Pink** (#FF2E93): the confession colour. Appears nowhere in the before-state. On reveal: the Decode button's active state, the translation headline, the subtext meter fill, the "straight" reply card's accent.

**Why pink, deliberately.** This is a confirmed choice against the "not gendered" constraint, not a default accent-picker pink. At this saturation, an unmixed hot magenta rather than a blush or a pastel, paired with hard mono type and stamped shadows, and used as a shock colour rather than a decorative one, it reads as confrontational and loud, closer to hazard-pink or a punk flyer than to romance-pink or Barbiecore. The job it's doing is the same job a klaxon does. If it ever softens toward pastel or gets paired with rounded, cute treatments, it's drifted off the brief and needs correcting back.

### Secondary
- **Whistleblower Yellow** (#F5D300): reserved for the loudest moment only, the unhinged reply card and the top end of the subtext meter (above 70). If yellow shows up anywhere else, it's diluting its own punchline.

### Neutral
- **Break Room Beige** (#F3ECE9): base background, before-state. Warm, flat, institutional, tinted toward pink at near-zero chroma so it's never a cold grey.
- **Laminate Grey** (#6B6467): before-state secondary text, field labels, placeholder copy. The colour of a laminated desk.
- **Ink** (#1F1A1D): primary text colour throughout, both states. Tinted, never pure black.
- **Institutional Border** (#D8D0CC): before-state borders and dividers, thin and quiet.

### Named Rules
**The Latent Colour Rule.** Loudmouth Pink and Whistleblower Yellow exist in the codebase from the first line of CSS, but render nowhere in the before-state. Reveal is a state change, never a new asset loading in.

**The One Yellow Rule.** Whistleblower Yellow appears in exactly two places: the unhinged reply card and the top register of the subtext meter. Anywhere else, it stops meaning "this is the extreme one."

**The Confident Beige Rule.** The Decode button must read as unmistakably clickable in the before-state using weight, contrast, size, and a solid Ink fill alone, never by borrowing Loudmouth Pink early to make it look pressable. If the beige world can't sell its own call to action, beige has failed on its own terms before the joke even lands.

## 3. Typography

**Display Font:** Bricolage Grotesque (with system-ui, sans-serif fallback)
**Body Font:** General Sans (with system-ui, sans-serif fallback)
**Label/Mono Font:** Space Mono (with monospace fallback)

**Character:** Bricolage Grotesque carries real personality at heavy weight without tipping into novelty, which is why it can do double duty: Regular/Medium for the before-state's flat corporate calm, Extrabold at a much larger size for the reveal headline. General Sans stays quiet in the body copy throughout, doing none of the emotional work. Space Mono performs officialdom: it's what makes "MESSAGE TO DECODE" or a timestamp read as a system doing its job, not a designer doing a bit.

### Hierarchy
- **Display** (800, clamp(2rem, 9vw, 3.5rem), 1.05): the translation headline on reveal only. Never appears in the before-state.
- **Headline** (600, 1.5rem, 1.2): section framing, e.g. "THE TRANSLATION", set in Bricolage Grotesque at moderate weight.
- **Title** (500, 1.125rem, 1.3): reply card headers (Diplomatic / Straight / Unhinged).
- **Body** (400, 1rem, 1.5, max 70ch): the message textarea, reply card body copy.
- **Label** (400, 0.8125rem, 1.4, 0.04em letter-spacing, uppercase, Space Mono): field labels, context chip text, tell stamps, timestamps.

### Named Rules
**The Same Voice Rule.** Display type never changes family between states, only weight and scale. The corporate voice and the honest voice are the same person; the reveal is volume, not a costume change.

## 4. Elevation

Flat by default, in both states. This is an office noticeboard, not a floating glass panel: nothing hovers, nothing glows ambiently. The one deliberate departure is the reply cards on reveal, which take a **hard, offset shadow** (no blur), like a photocopy dropped at a slight angle, not a soft SaaS card glow.

### Shadow Vocabulary
- **stamped** (`box-shadow: 4px 4px 0 var(--ink)`): reply cards only, on reveal. Hard edge, no blur, no colour, reads as paper, not as light.

### Named Rules
**The No Soft Glow Rule.** No blurred drop shadows anywhere in the system. Depth is either absent (flat, before-state) or hard-edged (stamped, after-state). A blurred shadow on this product looks like every other card-based SaaS tool, which is the exact failure this system exists to avoid.

## 6. Do's and Don'ts

### Do:
- **Do** keep Loudmouth Pink and Whistleblower Yellow completely absent from the before-state. Their sudden appearance on reveal is the whole mechanic.
- **Do** use Space Mono for anything performing institutional officialdom (field labels, timestamps, tell stamps, context chip text).
- **Do** keep the reply cards' shadow hard-edged and flat ("stamped"), never soft or blurred.
- **Do** respect `prefers-reduced-motion`: the full state change (translation, meter, cards) still resolves, as a fade or instant cut rather than the choreographed sequence.
- **Do** design mobile-first. This is judged at phone width, at a glance, usually once, in a room.
- **Do** give the Decode button strong affordance at rest, using weight, size, contrast, and a solid Ink fill, so it unmistakably invites the click without needing Loudmouth Pink to sell it.

### Don't:
- **Don't** build a gendered interface: no pastels-as-cute, no mascot, no soft rounded illustration style.
- **Don't** reach for a dark hacker-terminal aesthetic. This is bureaucratic and beige, not shadowy and green-on-black.
- **Don't** reuse any of Jasmin's existing brand colours or fonts (Aziz & Co's warm editorial rust, BJH's yofi-orange/yofi-red, ops-dashboard's cobalt/periwinkle/lime). This product has its own identity from zero.
- **Don't** let the before-state read as competent generic SaaS (Notion/Linear/Asana clean-gradient polish). It must read as a joke about that register, not an example of it.
- **Don't** use `background-clip: text` gradient text anywhere, side-stripe coloured borders on cards, glassmorphism, the hero-metric template, or identical icon-card grids.
- **Don't** add bounce or elastic easing to the reveal sequence. Ease-out-quart or ease-out-expo only.
