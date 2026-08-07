# MediNova Icon Library

A consistent 24×24 stroke icon catalog (1.8px stroke, round caps/joins) covering the
full app module surface: navigation, health, doctors, pharmacy, appointments,
records, payments, messaging, security, system, status, admin and more.

## Usage

Icons render with `stroke="currentColor"` so they inherit the surrounding text color.

```html
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.8" stroke-linecap="round"
     stroke-linejoin="round" aria-hidden="true" width="20" height="20">
  <!-- paths -->
</svg>
```

- `SVG/` — standalone files for direct use / sprites.
- `HTML/` — drop-in snippets (see any file for the full markup).
- `index.json` — machine-readable manifest (name, path, category).

## Naming

Kebab-case, one icon per file. Add new icons by extending
`scripts/gen-icons-catalog.mjs` and re-running `node scripts/gen-icons-catalog.mjs`.

## Catalog

### navigation

- `home`
- `dashboard`
- `menu`
- `menu-grid`
- `chevron-left`
- `chevron-right`
- `chevron-up`
- `chevron-down`
- `arrow-left`
- `arrow-right`
- `arrow-up`
- `arrow-down`
- `arrow-up-right`
- `close`
- `plus`
- `minus`
- `more-horizontal`
- `more-vertical`
- `back`
- `forward`

### health

- `plus-cross`
- `heart-pulse`
- `stethoscope`
- `syringe`
- `first-aid`
- `pill`
- `capsule`
- `dna`
- `heartbeat`
- `bone`
- `brain`
- `eye-check`
- `teeth`
- `baby`
- `wheelchair`
- `x-ray`
- `scan`
- `virus`
- `blood-drop`
- `temperature`
- `bandage`
- `clipboard-pulse`
- `shield-cross`
- `star-of-life`

### doctors

- `doctor`
- `user`
- `user-plus`
- `user-minus`
- `users`
- `user-doctor`
- `user-nurse`
- `avatar`
- `patient`
- `gender`
- `id-badge`
- `user-check`

### files

- `edit`
- `pen`
- `trash`
- `file`
- `file-text`
- `file-plus`
- `file-check`
- `file-search`
- `folder`
- `folder-open`
- `clipboard`
- `clipboard-check`
- `clipboard-list`
- `notes`
- `document`
- `archive`
- `list`
- `list-check`
- `receipt`
- `download`
- `upload`
- `save`
- `print`
- `share`
- `link`
- `copy`

### status

- `alert`
- `info`
- `check-circle`
- `xmark-circle`
- `info-circle`
- `alert-triangle`
- `alert-circle`
- `help-circle`
- `question`
- `exclamation`
- `warning`
- `success-check`
- `ban-circle`

### pharmacy

- `pills`
- `medicine-bottle`
- `mortar-pestle`
- `prescription`
- `rx`
- `pharmacy-cross`
- `shopping-bag`
- `cart`
- `cart-plus`
- `truck`
- `package`
- `box-open`
- `warehouse`
- `shelf`
- `barcode`
- `tags`
- `tag`
- `coupon`
- `discount`

### calendar

- `calendar`
- `calendar-plus`
- `calendar-check`
- `calendar-xmark`
- `calendar-clock`
- `clock`
- `hourglass`
- `alarm`
- `timer`
- `schedule`
- `location-pin`
- `map-pin`
- `compass`
- `navigation`

### payments

- `credit-card`
- `wallet`
- `bank`
- `money`
- `cash`
- `receipt-check`
- `payment`
- `invoice`
- `coin`
- `percent`
- `banknote`

### messages

- `mail`
- `mail-open`
- `send`
- `chat`
- `chat-bubble`
- `message-circle`
- `bell`
- `bell-ring`
- `bell-slash`
- `notification`
- `comment`

### search

- `search`
- `filter`
- `filter-sliders`
- `sliders`
- `sort`
- `sort-desc`
- `sort-asc`
- `eye`
- `eye-off`
- `scan-search`

### security

- `lock`
- `lock-open`
- `unlock`
- `shield`
- `shield-check`
- `shield-xmark`
- `shield-halved`
- `key`
- `fingerprint`
- `user-shield`
- `ban`
- `alert-octagon`
- `password`

### system

- `settings`
- `gear`
- `cog`
- `sliders-horizontal`
- `tools`
- `wrench`
- `server`
- `database`
- `cpu`
- `hard-drive`
- `terminal`
- `code`
- `bug`
- `refresh`
- `refresh-cw`
- `spinner`
- `cloud`
- `cloud-off`
- `wifi`
- `wifi-off`
- `plug`
- `power`
- `toggle-on`
- `toggle-off`
- `layers`
- `globe`
- `globe-check`

### admin

- `chart-line`
- `chart-bar`
- `chart-pie`
- `chart-area`
- `trending-up`
- `trending-down`
- `analytics`
- `gauge`
- `activity`
- `target`
- `grid`
- `layout`
- `newspaper`
- `monitor`
- `building`
- `hospital`
- `clinic`
- `sign-in`
- `sign-out`
- `external-link`
- `bookmark`
- `star`
- `star-half`
- `heart`
- `thumbs-up`
- `flag`
- `gift`
- `tag-percent`

### misc

- `phone`
- `smartphone`
- `tablet`
- `laptop`
- `camera`
- `image`
- `video`
- `video-slash`
- `play`
- `pause`
- `microphone`
- `volume`
- `headset`
- `language`
- `translate`
- `moon`
- `sun`
- `sparkles`
- `palette`
- `brush`
- `paint-roller`
- `anchor`
- `fire`
- `lightbulb`
- `rocket`
- `robot`
- `calendar-sync`
