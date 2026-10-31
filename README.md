# Pokédex

A game companion Pokédex built on [PokeAPI](https://pokeapi.co): browse every
Pokémon, move, ability and item, check type matchups, and theorycraft a team
for any game. Built with React, TypeScript, Vite and Tailwind CSS.

## Features

Pick a game and Pokédex from the selector in the top bar and the whole app
follows it for the session: Pokédex numbering, types, stats, abilities, move
values, held items, encounters, the type chart and the team planner all show
what was true in that game. Nothing else is saved, and the app only reads from
PokeAPI.

**Pokédex**
- The National Dex plus every regional Pokédex
- Filter by name, number or type; sort by number or name; card or compact view
- Loads as you scroll, with placeholders that match the real cards

**Pokémon pages** (`/pokemon/:name`, which also accept ids and form names)
- Official artwork with a shiny toggle, plus the cry
- Pokédex entries, base stats with level 100 ranges, EV yield, abilities, held
  items and type matchups, using the selected game's rules
- Every Pokédex number, names in each language, Pal Park data and breeding facts
- Forms and appearances, and sprites from every game
- Evolution tree, moves by game and method, and wild encounters by game
- Previous and next Pokémon (← → keys, or swipe on a phone)

**Moves**
- Moves and abilities, each with a browser and a detail page, limited to what
  existed in the selected game (with a toggle to show everything)
- A move's values as they were in the selected game, its history of changes,
  stat changes, contest data and its TM number in each game
- The full TM, TR and HM list for any game

**Items**
- Every item with prices by game, the moves a TM teaches by game, and effects
- Every berry with flavours, growth and Natural Gift

**World**
- Games, with their versions, regions, Pokédexes and move methods
- Regions, their locations, and what can be caught in each area by game
- Generations, with what each one introduced

**Guide**
- The team planner: build a team of six for any game and see shared weaknesses
  and offensive coverage under that game's rules. The team lives in the link
- The type chart and defence calculator, for any generation
- Natures, stats, characteristics, egg groups, growth rates, genders, habitats,
  colours, shapes and evolution triggers
- Damage classes, move categories, ailments, targets, learn methods and battle
  styles
- Bag pockets, item attributes, Fling effects, berry firmness and flavours, and
  currencies
- Encounter methods and conditions, Pal Park, contest types and effects,
  Pokéathlon stats and languages

**Navigation**
- Search everything with Ctrl/⌘ + K or `/`: Pokémon, moves, abilities, items,
  berries, types, locations, natures, games and Guide pages
- Top bar on desktop, bottom tabs on phones and tablets, with tabs inside each
  section
- Almost every fact links to its own page, so you can follow a thread from a
  Pokémon to its egg group, a move's category or an encounter's location
- Back returns to where you were, including how far you had scrolled
- Filters, tabs and forms live in the URL, so a view can be linked to

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
  Hooks/        scrolling, loading, the selected game, document title
  Pages/        one file per route
  Utils/        pure logic (type chart, team rules, history by game, stats,
                evolution text, search) and the Guide's list of resources
  types/        PokeAPI response types
```

Colours live in `src/index.css` as `pk-*` design tokens (navy, yellow, gold,
red, cream, silver) so the look stays consistent.
