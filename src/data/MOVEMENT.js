export const MOVEMENT = {
  FLY: "fly",
  WALK: "walk",
  BURROW: "burrow",
  CLIMB: "climb",
  SWIM: "swim"
}

export const MOVEMENT_SELECT = Object.keys(MOVEMENT).map(k => { return { text: MOVEMENT[k], value: MOVEMENT[k] } });

export default MOVEMENT
