# 5e Monster Maker
A monster stat block builder for the 5th edition of Dungeons and Dragons.

## Features
- Quickly create stat blocks by filling in a form, rather than typesetting everything by hand
- Dynamic: Modifiers for attacks and saves are automatically calculated from core stats
- Automatic CR Estimate: Simplifies CR calculations by doing them for you and updating as monster stats and traits are updated
  - Displays an explanation of each component when hovered
- Export Formats
  - JSON: For later editing with the 5e Monster Maker
  - Markdown: For use with the [Homebrewery](https://homebrewery.naturalcrit.com/) system or other editors that accept that Markdown format
  - LaTeX: For use with the [rpgtex](https://github.com/rpgtex/DND-5e-LaTeX-Template) system
  - PNG: For when you just want an image
- Templates: Quickly apply attacks, traits, or other actions to a creature from a preset library
  - More templates (along with the ability to add custom templates) coming soon!

## Developing

This project is written in Vue and uses yarn v1 as its package manager. I'm pretty sure it'd work with npm as well.

Clone the repository and run `yarn install`. The development server can be started with `yarn serve`.