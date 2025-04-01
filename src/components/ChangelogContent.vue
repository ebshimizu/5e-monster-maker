<template>
  <q-timeline color="secondary">
    <q-timeline-entry
      title="v2.3.6"
      subtitle="Hotfix - 4/1/2025"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>Hotfix: update schema table to validate v10 monsters.</li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.3.5"
      subtitle="Minor Update - 3/31/2025"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="152" /> Add alternate XP/CR value to note
            XP when fighting a monster under certain conditions (in a lair, for
            instance).
          </li>
          <li>
            <github-issue-link :issue="153" /> Add monster nickname. A Nickname
            will override the default value of the {NAME} token, allowing you to
            use a shorter name to reference the monster in the stat block text.
            The full name can always be accessed with {monster.name}.
          </li>
          <li>
            <github-issue-link :issue="154" /> Add Toll the Dead to the SRD
            spells.
          </li>
          <li>
            Added notes about input fields that are actually fully customizable
            even though they look like dropdowns.
          </li>
          <li>
            Added note about PNG export support while using Firefox. Two column
            stat blocks still occasionally have rendering issues.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.3.4"
      subtitle="Minor Update - 3/19/2025"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="148" /> Bugfix: 2024 immunities now
            properly puts a comma between the damage and condition sections.
          </li>
          <li>
            Changing the number of columns will automatically resize the stat
            block view to fit the changed format.
          </li>
          <li>
            Multiattack actions can now have an entirely custom renderer
            (including the "Multiattack" label). Additionally, the first time
            the custom renderer is opened, the field will pre-fill with the
            default text (so that at least something renders in the stat block).
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.3.3"
      subtitle="Minor Update - 2/23/2025"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            Bugfix: 2024 formatted statblocks will now show condition immunities
            in the immunities section when there are also no damage immunities.
          </li>
          <li>
            Updated default damage type and status condition text to be
            capitalized, to match new stat block formatting. This will apply to
            both 2014 and 2024 formats. Note that you can still type in any text
            to those fields, in case you want to adjust how those statuses are
            displayed.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.3.2"
      subtitle="Minor Update - 2/23/2025"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="144" /> Traits section no longer renders
            header when there are no traits and the 2024 format is being used.
          </li>
          <li>
            <github-issue-link :issue="143" /> 2014 formatting now converts text
            back to 2014 versions (specifically around attack language and
            spellcasting).
          </li>
          <li>
            <github-issue-link :issue="145" /> Adjust inventory location in the
            2024 stat block format (now called Gear and located in the top half
            of the stat block).
          </li>
          <li>
            2024 format: Remove "Damage" from the immunities, resistances, and
            vulnerability title. Also consolidated condition immunities and
            damage immunities, as per 2024 format.
          </li>
          <li>
            2024 format: Removed "Innate" from the rendered innate spellcasting
            action title.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.3.1"
      subtitle="Hotfix - 12/21/2024"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            Fixed issue with default initiative adding stat score instead of
            stat modifier.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.3.0"
      subtitle="Major Update - 12/20/2023"
      icon="update"
      color="positive"
    >
      <div class="text-body1 q-mb-sm">
        This update is a bit in advance of the full 2024 Monster Manual release,
        and lays the foundation for anticipated stat block updates in the 2024
        rules. These updates are based on changes observed in the 2024 Player's
        Handbook. I anticipate a (hopefully) small update once the full Monster
        Manual is released to catch the remainder of the formatting updates,
        probably as they relate to Legendary Actions.
      </div>
      <q-separator class="q-my-sm" />
      <div class="text-overline text-uppercase q-mb-sm">New Features</div>
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="128" /> The web renderer stat block can
            now toggle between the 2014 stat block style and the new 2024 stat
            block style. New data fields have been added to the monster stat
            block format to accommodate the new style. The data fields are fully
            backwards compatible.
          </li>
          <li>
            <github-issue-link :issue="131" />Actions that utilize saving throws
            have been overhauled in the 2024 format. Save-based actions can now
            indicate the stat used for the DC (with an optional override), the
            range of the action, and can now explicitly list out the results for
            succeeding, failing, or satisfying some other more complex condition
            on the save (e.g. failing by more than 5). The stat block renderer
            will format this for you. If you do not wish to use this new
            formatting, just leave the save stat as 'none'. This formatting can
            be used in both 2014 and 2024 styles.
          </li>
          <li>
            <github-issue-link :issue="132" /> Reactions now have an explicit
            "Trigger" and a "Response." They can also now have limited uses
            (like normal actions). This formatting will only appear if the
            "Trigger" field has text in it, so to keep using the 2014
            formatting, leave that field blank. This formatting can be used in
            both 2014 and 2024 styles.
          </li>
          <li>
            <github-issue-link :issue="130" /> The 2024 style for the stat block
            has been added. Toggle between 2024 and 2014 styles with the
            settings menu (gear icon, top right). The 2024 style primarily
            affects the header, which has a new table for displaying stats and
            saves, and removes some of the dividers in there. Exports to other
            formats (markdown, LaTeX) should function as they did before.
          </li>
          <li>
            Added Initiative as a skill. Due to the 2024 stat block explicitly
            showing Initiative in the top right of the stat block, Initiative is
            now a skill you can add, give proficiency for, and override as with
            any other skill. In the 2014 stat block, this will appear in the
            Skills section. In the 2024 stat block, this will be omitted from
            the Skills section, as it has its own dedicated location.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.11"
      subtitle="Bugfix - 12/19/2024"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="138" /> Fixed infinite loop in CR
            calculation when legendary action cost was 0. The UI should also now
            prevent you from setting a cost of 0.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.10"
      subtitle="Bugfix - 11/26/2024"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="136" /> Fixed issue where legendary and
            mythic actions menus were not updating after new actions or attacks
            were added.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.9"
      subtitle="Maintenance Update - 10/21/2024"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            Updating contact methods because I've been missing messages on
            Twitter.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.8"
      subtitle="Maintenance Update - 4/25/24"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            Just hopping in to update some packages. This shouldn't affect app
            functionality, and if it does let me know!
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.7"
      subtitle="Minor Update - 10/10/23"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="111" /> Added an inventory field in case
            you want to write down what additional items or loot your monster
            has. Note that the values written in this field do not affect the
            monster's actual stats.
          </li>
          <li>
            <github-issue-link :issue="115" /> Added XP tokens to better support
            the Mythic Actions preamble. You can now type {XP:[cr]} to render
            the XP corresponding to the listed CR. Adding a + at the end adds
            the specified XP total to the monster's listed CR XP. See the new
            default Mythic Actions preamble to see the tokens in action.
          </li>
          <li>
            <github-issue-link :issue="116" /> The renderer no longer displays
            the die or bonus if you are using 0 dice or a d1 to compute flat
            damage.
          </li>
          <li>
            <github-issue-link :issue="117" /> Bugfix: fixes a crash caused by
            setting the monster's CR to undefined (really, this should be
            disallowed by Quasar but you can apparently make any dropdown null
            by hitting backspace).
          </li>
          <li>
            Dev chores: updated packages, tightened some typescript typedefs.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.6"
      subtitle="Bugfix - 7/10/23"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="112" /> Bugfix: loosened file type filter
            when opening files from disk. There were some reports of being
            unable to open the .5emm.json files.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.5"
      subtitle="Bugfix - 5/23/23"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="107" /> Bugfix: Notes written in the
            additional damage field of an attack now render properly.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.4"
      subtitle="Minor Update - 4/10/23"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="102" /> Bugfix: corrected issue where the
            passive perception override value did not work.
          </li>
          <li>
            <github-issue-link :issue="104" /> Added "Turn" and "Round" ability
            recharge times.
          </li>
          <li>
            <github-issue-link :issue="105" /> Added monster name (v2 format) to
            the monster tokens shortcut menu.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.3"
      subtitle="Bugfix - 3/28/23"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="100" /> The Markdown renderers
            (Homebrewery v3 and Legacy) now use the correct resistances and
            immunities. Additionally, an error in the display of the Homebrewery
            v3 Condition Immunities section has been fixed. Thanks to
            @PrlfcIllithic on Twitter for catching this one.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.2"
      subtitle="Minor Update - 3/19/23"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="97" /> A notes field has been added to
            the senses list. You can use token replacements (such as "blind
            beyond {monster.senses.blindsight}" to link the note with the sense
            value) in this field.
          </li>
          <li>
            The save schema has been updated to version 7, and an error was
            corrected regarding the data type of the ehpMultiplier field.
          </li>
          <li>
            <github-issue-link :issue="98" />
            [Unresolved] The PNG export does not always work correctly in
            two-column mode on Firefox. This appears to be due to a problem with
            the underlying library used to perform the export. For now,
            switching to a different browser is advised (apologies for the
            inconvenience).
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.1"
      subtitle="Bugfix - 1/24/23"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="95" /> Transparent redirect of v1 links
            to the proper v2 route.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.2.0"
      subtitle="Major Update - 1/13/2023"
      icon="update"
      color="positive"
    >
      <div class="text-body1 q-mb-sm">
        Hey! Before we get to the changes in this update, I want to take a
        moment to highlight Wizards of the Coast's efforts to undermine the OGL
        1.0 upon which so much homebrew content (like the stuff you're making!)
        relies on. Please visit
        <a href="https://www.opendnd.games" target="_blank">opendnd.games</a>
        for more info, and add your name to the open letter.
        <br />
        <br />
        As for how the OGL 1.1 would affect this site, I wouldn't worry about it
        too much. I'll keep the site up and open source for as long as possible.
        <br />
        - Falindrith
      </div>
      <q-separator class="q-my-sm" />
      <div class="text-body1 q-mb-sm">
        Ever want to edit a monster but don't want to type it all in? This
        update brings support for importing monsters from the
        <a href="https://open5e.com/">Open5e API</a>, which contains all of the
        monsters in the SRD and a bunch of other monsters licensed under the
        OGL. The importer covers most cases, however it's a bit tricky to
        convert plain text to the Monster Maker format. Please read the warning
        messages carefully, and
        <a
          href="https://github.com/ebshimizu/5e-monster-maker/issues/new"
          target="_blank"
          >file a bug report</a
        >
        if there are larger issues with it.
      </div>
      <q-separator />
      <div class="text-overline text-uppercase q-mb-sm">New Features</div>
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="77" /> A new importer for the
            <a href="https://open5e.com/">Open5e API</a>
            has been added. You can access this feature by clicking on the cloud
            icon next to the template search bar.
          </li>
        </ul>
      </div>
      <div class="text-overline text-uppercase q-mb-sm">Bug Fixes</div>
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="93" /> The Tarrasque.io JSON exporter no
            longer inadvertently creates a regular spellcasting list if only
            innate spellcasting is active.
          </li>
          <li>
            Text Rendering: the {NAME} token will now properly capitalize the
            "The" if it occurs as the start of a sentence.
          </li>
          <li>Text Rendering: plain line breaks tags (br) are now allowed.</li>
          <li>
            Text Rendering: if a monster has a +0 modifier to its HP, the +0
            will no longer be rendered.
          </li>
          <li>
            Text Rendering: an innate spellcasting list with an "At Will" number
            of uses will no longer render the number of uses before the "At
            Will" label.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.1.5"
      subtitle="Minor Update - 12/29/22"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="76" /> A new export format has been added
            for
            <a href="https://www.improved-initiative.com/" target="_blank"
              >Improved Initiative.</a
            >
          </li>
          <li>
            Tooling: Moved the project from webpack to vite. This is a technical
            change that shouldn't affect site operations.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.1.4"
      subtitle="Minor Update - 12/4/22"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="86" /> The Offensive CR estimator now
            accounts for limited use actions in the multiattack damage
            calculations. Recharge abilities are treated as single use actions
            for the purposes of the simulated 3-round combat.
          </li>
          <li>
            <github-issue-link :issue="85" /> Reactions can now be saved as
            custom templates.
          </li>
          <li>
            An issue causing lowercase template titles to appear out of order in
            the templates list has been resolved.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.1.3"
      subtitle="Bugfix - 11/20/22"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="83" /> Fixed issue with Saving Throws not
            resetting the UI after monster reset.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.1.2"
      subtitle="Bugfix - 11/12/22"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="81" /> Fixed issue with Speeds and Skills
            not resetting the UI.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.1.1"
      subtitle="Minor Update - 11/12/22"
      icon="update"
      color="primary"
    >
      <div class="text-body2">
        <ul>
          <li>
            Updated the fonts to a closer match of published book formatting
          </li>
          <li>
            <github-issue-link :issue="79" />,
            <github-issue-link :issue="80" /> Attempted to resolve rendering
            issues with the CHA stat getting bumped to a new line by forcing
            "no-wrap" on the container.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.1.0"
      subtitle="Update - 9/17/22"
      icon="update"
      color="positive"
    >
      <div class="text-body1 q-mb-sm">
        This update brings easier action re-ordering and a number of statblock
        formatting changes that follow recent adjustments in published modules.
        The markdown exporter has also been updated for Homebrewery v3.
      </div>
      <q-separator />
      <div class="text-overline text-uppercase q-mb-sm">New Features</div>
      <div class="text-body2">
        <ul>
          <li>
            <github-issue-link :issue="74" />
            A new export option for Homebrewery v3 has been added. The v2
            renderer will continue to be supported until the Homebrewery removes
            their legacy mode.
          </li>
          <li>
            <github-issue-link :issue="66" />
            Actions, attacks, reactions, lair actions, regional effects, and
            traits (if they're not being automatically sorted) can now be
            re-ordered by using the buttons inside of each accordion header.
          </li>
        </ul>
        <ul>
          <li>
            <github-issue-link :issue="67" />
            Actions can now be marked as bonus actions. Bonus actions will show
            up in a separate section that gets placed after actions but before
            legendary actions. Additionally, traits are automatically sorted by
            default. You can change this behavior in the Stat Block Settings.
          </li>
          <li>
            <github-issue-link :issue="70" />
            Allow anything to be input as the CR. Note that this custom value is
            just visual, it does not affect the CR calculations.
          </li>
          <li>
            <github-issue-link :issue="72" />
            Reduced spacing around monster name
          </li>
        </ul>
      </div>
      <div class="text-overline text-uppercase q-mb-sm">Bug Fixes</div>
      <div class="text-body2">
        <ul>
          <li>Fixed a couple issues with the Homebrewery v2 Exporter.</li>
          <li>
            Some localization strings have been added to the web renderer.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.0.1"
      subtitle="Bugfix - 9/3/22"
      icon="build"
      color="primary"
    >
      <div class="text-body2">
        <a
          href="https://github.com/ebshimizu/5e-monster-maker/issues/73"
          target="_blank"
          >#73</a
        >
        Fixed issue with the Attack editor's Additional Damage field not
        displaying the selected value in the dropdown.
      </div>
    </q-timeline-entry>
    <q-timeline-entry
      title="v2.0.0"
      subtitle="Major Update"
      icon="update"
      color="positive"
    >
      <div class="text-body1 q-mb-sm">
        Welcome to Version 2! This update is a complete rewrite of the monster
        maker application. All of your old saved monsters will still work (if
        they don't, let me know and I'll get it working)! Additionally, all
        functionality from version 1 should still be present, and you should be
        able to convert your data from v1 to v2.
        <strong
          >The app will prompt you to make backups before upgrading, so please
          take the chance to do so.</strong
        >
        If you encounter issues with this process, please let me know on GitHub.
      </div>
      <q-separator />
      <div class="text-overline text-uppercase q-mb-sm">New Features</div>
      <div class="text-body2">
        <ul>
          <li>
            <strong
              ><a
                href="https://github.com/ebshimizu/5e-monster-maker/issues/38"
                target="_blank"
                >#38</a
              >
              More Text Customization Options</strong
            >: The text rendering system has been re-written to allow the use of
            tokens for accessing monster data in almost every feature
            description. Practically, this means that you'll notice new controls
            for re-writing how your features get rendered, preambles for common
            actions, and more. Some tokens commonly used in each feature have
            been added to a dropdown menu in the next text renderer sections.
          </li>
          <li>
            <strong>Automatic CR Estimation for Arbitrary Features</strong>: Any
            monster feature that has a CR Estimator (Actions and Traits) now has
            the option to automatically infer the CR from the text of the
            feature description. This is a very simplistic estimate that looks
            for dice roll, attack modifier, and save DC tokens and inserts the
            maximum of those values into the CR estimate. This feature is
            enabled by default and can be turned off or overriden as needed.
          </li>
          <li>
            <strong>Input Restrictions Lifted</strong>: The list of resistances,
            immunities, vulnerabilities, and condition immunities is no longer a
            static list. You can now add your own values to these fields. Also,
            spellcasting classes no longer have to be one of the SRD classes,
            just type in your own class and hit enter.
          </li>
          <li>
            <strong
              ><a
                href="https://github.com/ebshimizu/5e-monster-maker/issues/16"
                target="_blank"
                >#16</a
              >
              Statblock Formatting Options</strong
            >: At long last, you can make the statblock flow over two columns!
            You can also choose whether or not the {NAME} token renders a "the"
            before the monster name or not. Hopefully this makes your templates
            more reuseable, as you won't need to change every description when
            working on a singular monster versus a general one. These settings
            are monster-specific and can be found under the gear icon in the top
            right.
          </li>
          <li>
            <strong>Statblock Formatting Changes</strong>: In accordance with
            changes in recent D&amp;D books, the proficiency bonus is now
            displayed on the statblock and spellcasting sections have been moved
            to actions. More adjustments will occur in future updates as UA for
            One D&amp;D come out.
          </li>
          <li>
            <strong>Simplified Export</strong>: Related to statblock formatting,
            the markdown and LaTeX exporters now use the statblock columns
            option to decide if the statblock gets exported in one or two column
            format.
          </li>
          <li>
            <strong>Custom Spells and Templates Editors</strong>: Spells and
            Custom templates can now be managed with a tabular interfaces.
            Templates can also be assigned a custom icon.
          </li>
          <li>
            <strong>Changelog</strong>: A changelog (this) has been added to the
            app. It will show once whenever a new update occurs. I'll try not to
            be too annoying with this and will only force a notice when
            something major changes.
          </li>
          <li>
            <strong>i18n</strong>: Most of the strings in the app are now in an
            i18n file, meaning that the app can be more easily translated. If
            anyone is interested in helping out with that let me know!
          </li>
        </ul>
      </div>
      <div class="text-overline text-uppercase">Bugfixes</div>
      <div class="text-body2">
        <ul>
          <li>
            <strong
              ><a
                href="https://github.com/ebshimizu/5e-monster-maker/issues/32"
                target="_blank"
                >#32</a
              >
              CR Calculation Option</strong
            >: Under certain circumstances, the CR estimation can fluctuate
            wildly, as the defensive CR estimate is based off of the offensive
            CR estimate. If you know what CR you're aiming for, you can tell the
            CR calculator to use the monster's assigned CR instead of estimating
            it with the new toggle button in the CR footer.
          </li>
          <li>
            <strong>Error Handling</strong>: Sometimes the app crashes due to
            corrupted data. A global error handler has been added to redirect to
            a page allowing the front-end to clear out that data. Options have
            also been provided on this page to backup the corrupted data, as it
            can usually be salvaged. This page can be accessed at
            <router-link to="reset">/reset</router-link>.
          </li>
        </ul>
      </div>
      <div class="text-overline text-uppercase">Adjustments</div>
      <div class="text-body2">
        <ul>
          <li>
            <strong>App Name Change</strong>: Since 5e might not be called "5e"
            for that much longer, I've re-titled the app.
          </li>
          <li>
            <strong>Resizeable Statblock</strong>: Grab the vertical bar to
            resize the statblock.
          </li>
          <li>
            <strong>Development QoL</strong>: The app has been re-written
            entirely in Typescript with Quasar as the front-end framework. This
            will hopefully make adding and adjusting new features easier, as
            well as making the app less error-prone.
          </li>
        </ul>
      </div>
    </q-timeline-entry>
  </q-timeline>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import GithubIssueLink from './GithubIssueLink.vue'

export default defineComponent({
  name: 'ChangelogContent',
  components: { GithubIssueLink },
})
</script>
