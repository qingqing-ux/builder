# Button Shadow Visual Normalization Template

This template is for normalizing a batch of button components from a shadowed visual structure to a no-shadow content-body visual result.

Historical note:

- The file name is kept for continuity.
- The current local naming baseline now follows `UIButton.vue`, so the visual target stays no-shadow while the variant name stays code-compatible.

## Goal

- Visual goal: `40px` content body + no shadow
- Naming goal: keep button names compatible with `UIButton.vue`
- Safety goal: keep component `id` unchanged and only update style and `name`

## Naming Strategy

Keep the 6-part structure:

`Button / {Size} / {Tone} / {Treatment} / {Shape} / {State}`

For filled button families, keep using:

- `Shadow`

If older local nodes still carry non-code names, normalize them like this:

- `Solid` -> `Shadow`
- `Flat-Stroke / Flat-stroke` -> `Stroke`
- `Neutral` -> `Boring`

Examples:

- `Button/Large/Primary/Solid/Square/Default` -> `Button/Large/Primary/Shadow/Square/Default`
- `Button/Medium/Secondary/Solid/Square/Hover` -> `Button/Medium/Secondary/Shadow/Square/Hover`
- `Button-only icon/Medium/Neutral/Flat-Stroke/Square/Disabled` -> `Button-only icon/Medium/Boring/Stroke/Square/Disabled`

Do not rename component `id`.

## Style Template

For each selected component:

1. Root component
- Keep `id` unchanged
- Normalize `name` to code-compatible terminology if needed
- Remove the bottom shadow reservation:
  - from `padding: [0, 0, 4, 0]`
  - to `padding: [0, 0, 0, 0]`

2. Inner container
- Remove `effect`
- Keep state color, stroke, radius, gap, icon/text content unchanged
- Adjust padding or explicit height so the component height becomes the target content-body height without relying on a shadow offset

Large button baseline used in this batch:

- inner container `padding: [8, 24]`
- root `padding: [0, 0, 0, 0]`

## General Conversion Rule

When the old shadowed variant uses:

- root `padding: [0, 0, 4, 0]`
- inner content body height is visually `4px` shorter because the bottom space is reserved for shadow

Convert it like this:

1. Root
- set bottom padding to `0`

2. If the inner container uses `padding`
- move the reserved `4px` back into the content body
- add `2px` to the top and `2px` to the bottom

Examples:

- `padding: [3, 16]` -> `padding: [5, 16]`
- `padding: [3, 12]` -> `padding: [5, 12]`
- `padding: [6, 24]` -> `padding: [8, 24]`

3. If the inner container uses explicit height instead of padding
- increase the inner container height by `4px`
- increase the background shape height by `4px`
- move centered icon/text children down by `2px` if they were vertically positioned against the old 36px body

This is how the large circular danger button is normalized from a `36px` shadow body to a `40px` content body.

## Button-only Icon Notes

`Button-only icon/...` uses the same naming baseline:

- filled family stays on `Shadow`
- outline family uses `Stroke`
- `Neutral` normalizes to `Boring`

Typical conversion patterns:

1. Square icon-only buttons with shadow reservation
- root `padding: [0, 0, 4, 0]` -> `padding: [0, 0, 0, 0]`
- inner padding moves from:
  - `[7, 9]` -> `[9, 9]`
  - `[9, 11]` -> `[11, 11]`
- remove inner `effect`

2. Circle icon-only buttons with absolute layout
- root `padding: [0, 0, 4, 0]` -> `padding: [0, 0, 0, 0]`
- inner wrapper height: `36` -> `40`
- ellipse height: `36` -> `40`
- vertically centered icon/text children: `y + 2`
- remove ellipse `effect`

3. States that are already full-body and shadow-free
- only normalize the name back to the code vocabulary if needed
- do not force extra size changes if the body is already at the target size

## What Must Stay Unchanged

- `id`
- tone colors per state
- focus outline stroke
- disabled colors
- icon/text children
- state coverage:
  - `Default`
  - `Hover`
  - `Click`
  - `Loading`
  - `Disabled`
  - `Focus`

## Validation Checklist

- Root `name` uses code-compatible treatment naming: `/Shadow/`, `/Flat/`, or `/Stroke/`
- Root no longer reserves shadow space
- Inner container no longer contains `effect`
- Snapshot height matches the target size
- All state variants of the same size/tone are updated together
- No accidental rename to an already existing `Flat` variant

## Recommended Workflow For Other Sizes

1. Select one full state set for the target size and tone.
2. Normalize the name to the code vocabulary if needed.
3. Remove shadow reservation from the root.
4. Remove `effect` from the inner container.
5. Adjust inner padding to the target size.
6. Validate by snapshot instead of assuming the height from the Large button values.

## Notes

- Do not rename these components to `Flat` unless their structure and visual spec are intentionally merged with the existing `Flat` family.
- Current practical rule is: naming follows code, visuals can continue to evolve independently.
