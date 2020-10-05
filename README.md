# 5e Monster Maker
Live site: https://ebshimizu.github.io/5emm/

A monster stat block builder for the 5th edition of Dungeons and Dragons.

![5e Monster Maker Screenshot](https://ebshimizu.github.io/5emm/readme-image.png)

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
  - PDF: Use the standard print button on your browser to save the stat block to PDF
  - Sharable Link: Send a direct link to your monster in the 5emm app. 
- Spellcasting: Create class-based lists or innate spellcasting lists. Add any spell available in the SRD.
  - Custom spells can be added, imported, and exported if you need a homebrew spell
- Templates: Quickly apply attacks, traits, or other actions to a creature from a preset library
  - More templates (along with the ability to add custom templates) coming soon!

## How It Works
The best way to see what the application can do is to just try making a monster. There are a few examples of SRD monsters in the [data folder](https://github.com/ebshimizu/5e-monster-maker/tree/master/src/data/templates/monsters) of the repository. If something looks off or breaks, let me know via an [issue](https://github.com/ebshimizu/5e-monster-maker/issues)! Here are a few things to know though:

### Saving
The current monster that's being worked on in the app is automatically saved every time you make a change. To export it to a file, click on the download icon in the top right. Exporting in the `.5emm.json` format allows you to import it back into the app to continue work later.

### Using {} Tokens in Descriptions
There's a little bit of support in the app for using text replacement tokens. Currently supported:
- {NAME} for the monster's name
- {#d#} for computing a dice roll (e.g. {3d6})
- {DC:STAT} for computing a Save DC based on the given stat. Stat must be one of: STR, DEX, CON, INT, WIS, CHA

### Calculating CR
First of all, the CR calculation displayed at the bottom of the page is just a *suggestion* and can be ignored entirely if you want. The app tries to compute CR as described in the 5e Dungeon Master's Guide:

1. The damage per round is averaged over three rounds, assuming the monster uses its most damaging attacks every round. Limited use, recharge, and spellcasting abilities are used only once in these three rounds (so if you do decide to cast, say, *fireball* three times in a row, this will not capture that). Trait damage is applied every round. Multitarget actions are assumed to do 2x damage. All attacks and actions are assumed to hit/do full damage.
2. An offensive CR is computed from the average damage per round.
3. The offensive CR is adjusted based on the attack bonus or save DC of the monster, prioritizing whichever has a higher expected CR
4. The effective HP of the monster is calculated based on the offensive CR. The offensive CR is needed to set the proper multipliers for immunities and resistances.
5. A defensive CR is computed from the effective HP
6. The defensive CR is adjusted based on the effective AC of the monster
7. Offensive CR and defensive CR are averaged to create the final estimate

Attacks are automatically considered in the CR calculation. Other actions and traits need annotations in order to be included. Each of the CR components can be hovered over to see a detailed explanation of the computed values.

### Spellcasting
The spellcasting panel allows you to setup slot-based casting or innate spellcasting. If using slots, selecting a class and level will automatically assign the proper number of slots to the monster. These slots will not show up until a spell is added to the casting list. To edit the number of slots available and assign spells by level, click on the `Show Slots` button.

Innate spellcasting groups can be added by clicking the big green `Add New At Will Spell List` button. These groups will not display on the stat block until a spell is added.

Only SRD spells are available by default, but you can add new spells by going to the top left menu and adding a new custom spell. You'll need to provide a name, level, class list, single target damage (optional) and whether or not the spell is a multitarget spell (like fireball). Your spells are automatically saved in the app, and can be exported and imported at will.

### Legendary Actions
Legendary actions are available in the corresponding panel. In order to specify a legendary action, the action must first exist as either an Attack or Action in the builder. You can then designate any of the monsters attacks or actions as legendary. The legendary action text will not render unless the monster has at least one legendary action. If an action can only be used as a legendary action, click the "L" button in the Action's editor.

### What's the difference between Traits and Actions?
Traits are assumed to be "always active" while actions must be specifically used on a monster's turn. Traits that do damage, according to the CR annotations, are assumed to apply that damage at the start of every round (no action required). Actions must be used and will not automatically apply their damage at the start of every round.

### Templates
Templates will add pre-made actions, traits, attacks, etc. to a monster. Find them by clicking on the search bar up at the top of the app. Right now, there aren't too many templates available, and I eventually plan to support using custom templates.

### FAQ
**Can you make it run on mobile?**  
Eventually, probably! I developed it primarily as a desktop app in about a week and didn't add mobile formatting yet, but there's no reason why it wouldn't work.

**Why isn't the ____ trait/action/attack a template?**  
I probably haven't gotten around to it. Feel free to contribute templates, but please try to keep them generally applicable or within the SRD. The default set of templates is intended to provide a broad set of abilities that can be mixed and matched to build new monsters.

**It's broken**  
If it's not working as expected, please file an [issue](https://github.com/ebshimizu/5e-monster-maker/issues) so I can try to fix it!

**The CR calculation seems off**  
There could be a couple reasons for this. Before filing and issue with the core CR calculation, first check that the expected abilities are being included in the CR calculation. This can be checked by hovering over the CR calculation components. Next, validate that the CR calculation matches what you'd get by doing the calculation with the given components by hand. If there's a mismatch there, let me know and I'll try to fix it!

## Developing

This project is written in Vue and uses yarn v1 as its package manager. I'm pretty sure it'd work with npm as well.

Clone the repository and run `yarn install`. The development server can be started with `yarn serve`.