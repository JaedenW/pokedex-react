# Pokédex

A game companion Pokédex built on [PokeAPI](https://pokeapi.co): browse every
Pokémon, move, ability and item, check type matchups, and theorycraft a team
for any game. Built with React, TypeScript, Vite and Tailwind CSS.

## Features

**Pokédex**
- The National Dex plus every regional Pokédex, including sub-dexes such as
  Let's Go or the Isle of Armor, chosen from a Pokédex picker
- Filter by name or number and by one or two types; sort by number or name;
  card or compact view
- Loads as you scroll, with placeholders that match the real cards

**Pokémon pages** (`/pokemon/:name`, which also accept ids and form names)
- Official artwork with a shiny toggle, plus the cry
- Pokédex entries per game, base stats with level 100 ranges, EV yield,
  abilities, held items and full type matchups
- Forms (Mega, regional, Gigantamax) and a gallery: artwork, HOME renders,
  animated sprites and sprites from every game
- Evolution tree with readable requirements
- Moves by game and learn method, with power, accuracy and PP
- Wild encounters by game
- Previous and next Pokémon (← → keys, or swipe on a phone)

**More to explore**
- Moves, abilities and items, each with a browser and a detail page
- Type chart and a defence calculator
- Team planner: pick a game, build a team of six with up to four moves each,
  and see its shared weaknesses and offensive coverage using that game's own
  rules (the types that exist, the damage chart and each Pokémon's types in
  that generation, and the Pokémon available in its Pokédex)

**Navigation**
- Search everything with Ctrl/⌘ + K or `/`: Pokémon, moves, abilities, items
  and types, with keyboard navigation
- Top bar on desktop, bottom tabs on phones and tablets
- Back returns to where you were, including how far you had scrolled
- Filters, tabs and forms live in the URL, so every view can be linked to

Nothing is saved: the app only reads from PokeAPI. All state, including a
planned team, lives in the URL, so a view or team is shared by copying the link.

## Development

```bash
npm install
npm start          # dev server at http://localhost:3000
npm test           # unit tests
npm run typecheck  # TypeScript
npm run build      # type-check, then build to build/
```

## Project layout

```
src/
  api/          PokeAPI hooks and image URLs
  Components/   UI; pokemon/ and team/ hold the larger features
  Hooks/        scrolling, search-as-you-type loading, document title
  Pages/        one file per route
  Utils/        pure logic (type chart, team rules, stats, evolution text, search)
  types/        PokeAPI response types
```

Colours live in `src/index.css` as `pk-*` design tokens (navy, yellow, gold,
red, cream, silver) so the look stays consistent.
