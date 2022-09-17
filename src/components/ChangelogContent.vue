<template>
  <q-timeline color="secondary">
    <q-timeline-entry
      title="v2.1.0"
      subtitle="Update"
      icon="update"
      color="positive"
    >
      <div class="text-body1 q-mb-sm">
        This update brings easier action re-ordering and a number of statblock
        formatting changes that follow recent adjustments in published modules.
        The markdown updater has also been updated for Homebrewery v3.
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
