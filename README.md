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
  - Sharable Link: Send a direct link to your monster in the 5emm app. [Check it out!](http://ebshimizu.github.io/5emm?data=eyJuYW1lIjoiS2FuaSBEb2xsIiwic2F2ZVZlcnNpb24iOjEsInNpemUiOiJUaW55IiwidHlwZSI6ImNvbnN0cnVjdCIsImFsaWdubWVudCI6InVuYWxpZ25lZCIsIkFDIjoxNCwiQUNUeXBlIjoiIiwiQ1IiOjMsInByb2ZpY2llbmN5IjoyLCJIUCI6eyJIRCI6MTUsInR5cGUiOjQsIm1vZGlmaWVyIjowfSwic3BlZWRzIjpbeyJpZCI6ImI4MTNmYmVmLTM2NjctNDE2Ni04MDBiLTUyMDMwZWM3N2MwNSIsInR5cGUiOiJ3YWxrIiwic3BlZWQiOjIwLCJub3RlIjoiIn1dLCJzdGF0cyI6eyJTVFIiOjEsIkRFWCI6MTgsIkNPTiI6MTAsIklOVCI6NiwiV0lTIjoxMCwiQ0hBIjozfSwic2F2ZXMiOnsiU1RSIjp7InByb2ZpY2llbnQiOmZhbHNlLCJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjB9LCJERVgiOnsicHJvZmljaWVudCI6dHJ1ZSwib3ZlcnJpZGUiOmZhbHNlLCJvdmVycmlkZVZhbHVlIjowfSwiQ09OIjp7InByb2ZpY2llbnQiOmZhbHNlLCJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjB9LCJJTlQiOnsicHJvZmljaWVudCI6ZmFsc2UsIm92ZXJyaWRlIjpmYWxzZSwib3ZlcnJpZGVWYWx1ZSI6MH0sIldJUyI6eyJwcm9maWNpZW50IjpmYWxzZSwib3ZlcnJpZGUiOmZhbHNlLCJvdmVycmlkZVZhbHVlIjowfSwiQ0hBIjp7InByb2ZpY2llbnQiOmZhbHNlLCJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjB9fSwic2tpbGxzIjpbeyJza2lsbCI6eyJzdGF0IjoiREVYIiwia2V5IjoiQWNyb2JhdGljcyJ9LCJwcm9maWNpZW50Ijp0cnVlLCJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjB9XSwicmVzaXN0YW5jZXMiOltdLCJpbW11bml0aWVzIjpbXSwidnVsbmVyYWJpbGl0aWVzIjpbXSwiY29uZGl0aW9ucyI6W10sInNlbnNlcyI6eyJibGluZHNpZ2h0IjowLCJkYXJrdmlzaW9uIjowLCJ0cmVtb3JzZW5zZSI6MCwidHJ1ZXNpZ2h0IjowfSwicGFzc2l2ZVBlcmNlcHRpb24iOnsib3ZlcnJpZGUiOmZhbHNlLCJvdmVycmlkZVZhbHVlIjowfSwibGFuZ3VhZ2VzIjoiIiwiYXR0YWNrcyI6W3sibmFtZSI6IkF0dGFjaCIsImlkIjoiNDEyY2VlMGItNjYyMy00YzY1LTg5NDYtOGU5ZDc2Y2RlNTRmIiwiZGlzdGFuY2UiOiJNZWxlZSIsImtpbmQiOiJXZWFwb24iLCJtb2RpZmllciI6eyJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjAsInN0YXQiOiJERVgiLCJwcm9maWNpZW50Ijp0cnVlfSwicmFuZ2UiOnsic3RhbmRhcmQiOjAsImxvbmciOjAsInJlYWNoIjo1fSwidGFyZ2V0cyI6MSwiZGFtYWdlIjp7ImRpY2UiOjQsImNvdW50IjoxLCJtb2RpZmllciI6eyJvdmVycmlkZSI6dHJ1ZSwib3ZlcnJpZGVWYWx1ZSI6MCwic3RhdCI6IkRFWCJ9LCJ0eXBlIjoicGllcmNpbmcifSwiYWx0ZXJuYXRlRGFtYWdlIjp7ImRpY2UiOjEwLCJjb3VudCI6MSwibW9kaWZpZXIiOnsib3ZlcnJpZGUiOmZhbHNlLCJvdmVycmlkZVZhbHVlIjowLCJzdGF0IjoiU1RSIn0sInR5cGUiOiJzbGFzaGluZyIsImNvbmRpdGlvbiI6IiIsImFjdGl2ZSI6ZmFsc2V9LCJhZGRpdGlvbmFsRGFtYWdlIjpbeyJpZCI6Ijg5NGQ5MjViLThhZGMtNDUyOS1iMmEzLWZiN2E0MDA0MzRiZCIsImRpY2UiOjYsImNvdW50IjoxLCJ0eXBlIjoibmVjcm90aWMiLCJub3RlIjoiIn1dLCJzYXZlIjowLCJkZXNjcmlwdGlvbiI6Ik9uIGhpdCwgdGhlIHRhcmdldCBjcmVhdHVyZSdzIG1heGltdW0gaGl0IHBvaW50cyBhcmUgcmVkdWNlZCBieSBhbiBhbW91bnQgZXF1YWwgdG8gdGhlIG5lY3JvdGljIGRhbWFnZSBkZWFsdC4gVGhlIHtOQU1FfSBhdHRhY2hlcyBpdHNlbGYgdG8gdGhlIHRhcmdldCBjcmVhdHVyZS4gV2hpbGUgYXR0YWNoZWQsIHRoZSB7TkFNRX0gY2FuIHVzZSBhbiBhY3Rpb24gdG8gZGVhbCB0aGUgbmVjcm90aWMgZGFtYWdlIG9mIHRoaXMgYXR0YWNrLCByZWR1Y2luZyB0aGUgY3JlYXR1cmUncyBtYXhpbXVtIGhpdCBwb2ludHMuIFRoZSB7TkFNRX0gY2FuIGJlIHJlbW92ZWQgd2l0aCBhIHN1Y2Nlc3NmdWwgZ3JhcHBsZSBjaGVjayBhZ2FpbnN0IGl0LiIsImxlZ2VuZGFyeU9ubHkiOmZhbHNlfV0sIm11bHRpYXR0YWNrcyI6W10sInNwZWxsY2FzdGluZyI6eyJzdGF0IjoiSU5UIiwic2F2ZSI6eyJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjB9LCJtb2RpZmllciI6eyJvdmVycmlkZSI6ZmFsc2UsIm92ZXJyaWRlVmFsdWUiOjB9LCJhdHRhY2siOnsib3ZlcnJpZGUiOmZhbHNlLCJvdmVycmlkZVZhbHVlIjowfSwiY2xhc3MiOiIiLCJsZXZlbCI6MSwic2xvdHMiOlswLDAsMCwwLDAsMCwwLDAsMF0sImF0V2lsbCI6W10sInN0YW5kYXJkIjpbXSwibm90ZXMiOiIiLCJhdFdpbGxOb3RlcyI6IiJ9LCJ0cmFpdHMiOlt7Im5hbWUiOiJTY2FtcGVyIiwiaWQiOiI3NTk4Mjk5OC1iYmQ3LTRjZjAtYjg4Zi1lMTRmNmI0Y2JiZTMiLCJkZXNjcmlwdGlvbiI6IlRoZSB7TkFNRX0gY2FuIHVzZSB0aGUgZGFzaCBhY3Rpb24gYXMgYSBib251cyBhY3Rpb24uIiwibGltaXRlZFVzZSI6eyJjb3VudCI6MywicmF0ZSI6ImRheSJ9LCJjckFubm90YXRpb24iOnsibWF4RGFtYWdlIjowLCJtYXhTYXZlIjowLCJtYXhNb2RpZmllciI6MCwibXVsdGl0YXJnZXQiOmZhbHNlLCJlaHBNdWx0aXBsaWVyIjoxLCJlaHBNb2RpZmllciI6MCwiYWNNb2RpZmllciI6MCwiaW5jbHVkZSI6dHJ1ZX19XSwiYWN0aW9ucyI6W10sImxlZ2VuZGFyeUFjdGlvbnMiOnsiY291bnQiOjAsImFjdGlvbnMiOltdfSwicmVhY3Rpb25zIjpbXX0=)
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