<template>
  <v-expansion-panel>
    <v-expansion-panel-header>Mythic Actions</v-expansion-panel-header>
    <v-expansion-panel-content class="mt-2">
      <v-row>
        <v-col cols="6">
          <v-text-field
            label="Mythic Trait Trigger Name"
            v-model="name"
          ></v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            label="Mythic Trait Recharge Condition"
            v-model="recharge"
          ></v-text-field>
        </v-col>
        <v-col cols="6"></v-col>
        <v-col cols="12">
          <v-textarea
            label="Mythic trait Trigger Description"
            v-model="description"
            hint="What happens when the mythic trigger happens. Monsters will often recharge legendary resistances and automatically recharge actions that have a recharge property."
            persistent-hint
            outlined
          ></v-textarea>
        </v-col>
        <v-col cols="12">
          <v-textarea
            label="Mythic Actions Preamble"
            v-model="preamble"
            hint="This text gets displayed before the Mythic Actions are listed"
            outlined
            persistent-hint
          ></v-textarea>
        </v-col>
      </v-row>
      <v-row align="center">
        <v-col cols="2">
          <v-text-field
            type="number"
            v-model.number="count"
            min="0"
            label="Actions"
            @input="update"
          ></v-text-field>
        </v-col>
        <v-col>
          <v-menu offset-y max-height="300px">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="green" small block v-on="on" v-bind="attrs"
                >Add Mythic Action</v-btn
              >
            </template>
            <v-list>
              <v-list-item
                v-for="action in availableActions"
                :key="action.id"
                @click="addAction(action.id)"
              >
                <v-list-item-content>
                  <v-list-item-title>{{ action.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ action.type }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-col
          cols="12"
          v-for="(action, index) in mythicActions"
          :key="action.id"
        >
          <v-row no-gutters align="center">
            <v-col cols="8">
              <v-subheader color="white">{{
                actionName(action.actionId)
              }}</v-subheader></v-col
            >
            <v-col cols="3">
              <v-text-field
                type="number"
                min="1"
                label="Cost"
                v-model.number="mythicActions[index].cost"
                @input="update"
              ></v-text-field>
            </v-col>
            <v-col cols="1" class="pa-2">
              <v-btn
                fab
                x-small
                color="red"
                class="ma-auto"
                @click="removeAction(index)"
                ><v-icon>mdi-close</v-icon></v-btn
              >
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-expansion-panel-content>
  </v-expansion-panel>
</template>

<script>
import { MUTATION } from '../../data/ACTIONS'
import { v4 as uuidv4 } from 'uuid'

export default {
  name: 'MythicActions',
  computed: {
    mythicActions() {
      return this.$store.getters.validMythicActions
    },
    description: {
      get() {
        return this.$store.state.monster.mythicActions.triggerDescription
      },
      set(val) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'mythicActions',
          value: {
            ...this.$store.state.monster.mythicActions,
            triggerDescription: val,
          },
        })
      },
    },
    name: {
      get() {
        return this.$store.state.monster.mythicActions.triggerName
      },
      set(val) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'mythicActions',
          value: {
            ...this.$store.state.monster.mythicActions,
            triggerName: val,
          },
        })
      },
    },
    recharge: {
      get() {
        return this.$store.state.monster.mythicActions.triggerRecharge
      },
      set(val) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'mythicActions',
          value: {
            ...this.$store.state.monster.mythicActions,
            triggerRecharge: val,
          },
        })
      },
    },
    preamble: {
      get() {
        return this.$store.state.monster.mythicActions.preamble
      },
      set(val) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'mythicActions',
          value: {
            ...this.$store.state.monster.mythicActions,
            preamble: val,
          },
        })
      },
    },
    count: {
      get() {
        return this.$store.state.monster.mythicActions.count
      },
      set(val) {
        this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
          key: 'mythicActions',
          value: {
            ...this.$store.state.monster.mythicActions,
            count: val,
            actions: this.mythicActions,
          },
        })
      },
    },
    availableActions() {
      return this.$store.state.monster.actions
        .filter((a) => !this.mythicActions.find((la) => la.actionId === a.id))
        .map((a) => {
          return { type: 'action', ...a }
        })
        .concat(
          this.$store.state.monster.attacks
            .filter(
              (a) => !this.mythicActions.find((la) => la.actionId === a.id)
            )
            .map((a) => {
              return { type: 'attack', ...a }
            })
        )
    },
  },
  methods: {
    update() {
      this.$store.commit(MUTATION.SET_SIMPLE_PROP, {
        key: 'mythicActions',
        value: {
          ...this.$store.state.monster.mythicActions,
          actions: this.mythicActions,
        },
      })
    },
    addAction(id) {
      this.mythicActions.push({
        id: uuidv4(),
        actionId: id,
        cost: 1,
      })
      this.update()
    },
    actionName(actionId) {
      const action = this.$store.getters.attackOrActionFromId(actionId)
      return action.name
    },
    removeAction(index) {
      this.mythicActions.splice(index, 1)
      this.update()
    },
  },
}
</script>
