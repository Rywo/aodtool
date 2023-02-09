<template>
  <Player
    v-if="playerSettings.faction.name"
    :name="playerSettings.faction.name"
    :population="playerSettings.population"
    :color="playerSettings.faction.color"
    :special="playerSettings.faction.special"
    :tiles="playerSettings.faction.tiles"
  />

  <div class="absolute left-6 top-[450px]" v-if="playerSettings.faction.name">
    <el-form-item>
      <span class="absolute left-02 bottom-8">Tiles away </span>
      <input class="text-black text-center w-full" v-model="tilesAway" />
    </el-form-item>
    <button
      v-if="playerSettings.faction.name"
      class="px-2 py-3 w-52 shadow-lg bg-slate-900"
      @click="buyTile"
    >
      Buy tile ({{ this.tileCost }})
    </button>
  </div>

  <button
    v-if="playerSettings.faction.name"
    class="absolute left-6 top-[600px] px-2 py-3 w-52 shadow-lg bg-slate-900"
    @click="foundCity"
  >
    Found city
  </button>
  <button
    v-if="playerSettings.faction.name"
    class="absolute left-6 top-[700px] px-2 py-3 w-52 shadow-lg bg-slate-900"
    @click="levelUp"
  >
    Level up ({{ this.levelUpCost }} gold)
  </button>

  <button
    v-if="this.playerSettings.faction.name == 'The Crunchers'"
    class="
      absolute
      left-[300px]
      top-[230px]
      px-2
      py-3
      w-52
      shadow-lg
      bg-slate-900
    "
    @click="getForest"
  >
    +1 wood for building in forest
  </button>
  <BuildingInv v-if="playerSettings.faction.name" :units="this.units" />
  <div v-if="playerSettings.faction.name == 0">
    <h1>Choose your faction</h1>
    <Factions
      v-for="faction in factions"
      :key="faction.name"
      :name="faction.name"
      :special="faction.special"
      :desc="faction.desc"
      :color="faction.color"
      :tags="faction.tags"
      @pick-faction="setFaction"
    />
  </div>
  <div v-if="playerSettings.faction.name">
    <div class="flex space-x-5 justify-center">
      <Resources
        v-for="resource in resources"
        :key="resource.type"
        :type="resource.type"
        :amount="resource.amount"
        :modifier="resource.modifier"
      />
    </div>
    <button
      class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-4
        px-8
        rounded
        my-8
      "
      @click="addResources"
    >
      Next turn
    </button>
    <el-collapse class="buildings">
      <el-collapse-item title="Buildings">
        <div
          class="
            space-x-3
            mt-5
            grid grid-cols-1
            sm:grid-cols-1
            md:grid-cols-4
            lg:grid-cols-4
            xl:grid-cols-4
            gap-5
          "
        >
          <Building
            v-for="building in buildings"
            :key="building.type"
            :type="building.type"
            :subject="building.subject"
            :food-cost="building.foodCost"
            :wood-cost="building.woodCost"
            :gold-cost="building.goldCost"
            :stone-cost="building.stoneCost"
            @buy-building="buyBuilding"
          />
        </div>
      </el-collapse-item>
    </el-collapse>

    <el-collapse class="buildings">
      <el-collapse-item title="Units">
        <div
          class="
            space-x-3
            mt-5
            grid grid-cols-1
            sm:grid-cols-1
            md:grid-cols-4
            lg:grid-cols-4
            xl:grid-cols-4
            gap-5
          "
        >
          <Building
            v-for="soldier in soldiers"
            :key="soldier.type"
            :type="soldier.type"
            :subject="soldier.subject"
            :food-cost="soldier.foodCost"
            :wood-cost="soldier.woodCost"
            :gold-cost="soldier.goldCost"
            :stone-cost="soldier.stoneCost"
            @buy-building="buyUnit"
          />
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import Player from "./components/Player.vue";
import Resources from "./components/Resources.vue";
import Building from "./components/Building.vue";
import BuildingInv from "./components/BuildingInv.vue";
import Factions from "./components/Factions.vue";

export default {
  components: { Resources, Building, Factions, Player, BuildingInv },
  data() {
    return {
      noResources: false,
      tilesAway: 0,
      tileCost: 15,
      resources: [
        { type: "Food", amount: 5, modifier: 1 },
        { type: "Wood", amount: 5, modifier: 1 },
        { type: "Gold", amount: 5, modifier: 1 },
        { type: "Stone", amount: 5, modifier: 1 },
      ],
      factions: [
        {
          name: "The Caws",
          special:
            "Passive: Gain +1 gold per turn for each gold producing facility",
          desc: `A faction filled with crowlike mercenaries, gamblers and other scum. 
Focussed on expanding their reach to earn more, nothing matters more than gold,`,
          color: "yellow",
          tags: [
            { name: "Aggressive", kind: "danger" },
            { name: "Gold oriented", kind: "warning" },
          ],
        },
        {
          name: "The Devils",
          special:
            "Passive: Gain +1 food per turn for each food producing facility",
          desc: `A faction filled with food loving squirrel like creatures.
They love nothing more than scavenging for food, and are quite proficient at it.`,
          color: "red",
          tags: [
            { name: "Passive", kind: "success" },
            { name: "Food oriented", kind: "success" },
          ],
        },
        {
          name: "The Whoolies",
          special: "Passive: Gain +1 population for each city level up",
          desc: `A faction consisting of humanoid teddy bears, cute at a first glance, but deadly when approached without caution 
focussed on growth and mass attack strategies.`,
          color: "saddlebrown",
          tags: [
            { name: "Aggressive", kind: "danger" },
            { name: "Growth focussed", kind: "warning" },
          ],
        },
        {
          name: "The Crunchers",
          special:
            "Passive: Gain +1 wood per turn for every building located in a forest",
          desc: `This faction filled with beaverlike creatures loves only one thing, wood. They sometimes even forget to reproduce because
their eyes are only on the forests around them.`,
          color: "lime",
          tags: [
            { name: "Passive", kind: "success" },
            { name: "Wood oriented", kind: "warning" },
          ],
        },
      ],
      soldiers: [
        {
          type: "Warrior",
          subject: "Strong warrior",
          foodCost: 6,
          woodCost: 1,
          goldCost: 0,
          stoneCost: 2,
        },
        {
          type: "Scout",
          subject: "Strong warrior",
          foodCost: 6,
          woodCost: 2,
          goldCost: 0,
          stoneCost: 2,
        },
        {
          type: "Archer",
          subject: "Strong warrior",
          foodCost: 8,
          woodCost: 3,
          goldCost: 0,
          stoneCost: 1,
        },
        {
          type: "Priest",
          subject: "Strong warrior",
          foodCost: 8,
          woodCost: 3,
          goldCost: 0,
          stoneCost: 1,
        },
        {
          type: "Settler",
          subject: "Strong warrior",
          foodCost: 30,
          woodCost: 30,
          goldCost: 30,
          stoneCost: 30,
        },
        {
          type: "Builder",
          subject: "Strong warrior",
          foodCost: 10,
          woodCost: 0,
          goldCost: 0,
          stoneCost: 0,
        },
      ],
      playerSettings: {
        faction: { name: "", color: "", special: "", tiles: 0 },
        population: 0,
        tiles: 0,
      },
      levelUpCost: 5,
      buildings: [
        {
          type: "Farm",
          subject: "+1 food",
          foodCost: 1,
          woodCost: 4,
          goldCost: 0,
          stoneCost: 2,
        },
        {
          type: "Mine",
          subject: "+1 stone",
          foodCost: 0,
          woodCost: 3,
          goldCost: 0,
          stoneCost: 4,
        },
        {
          type: "Market",
          subject: "+1 gold",
          foodCost: 0,
          woodCost: 4,
          goldCost: 2,
          stoneCost: 1,
        },
        {
          type: "Lumberyard",
          subject: "+1 wood",
          foodCost: 2,
          woodCost: 4,
          goldCost: 0,
          stoneCost: 1,
        },
        {
          type: "Bridge",
          subject: "Reduces movement of units by -1",
          foodCost: 0,
          woodCost: 8,
          goldCost: 0,
          stoneCost: 8,
        },
        {
          type: "Housing",
          subject: "+1 population",
          foodCost: 0,
          woodCost: 7,
          goldCost: 0,
          stoneCost: 7,
        },
        {
          type: "Road",
          subject: "Reduces movement of units by -1",
          foodCost: 4,
          woodCost: 0,
          goldCost: 0,
          stoneCost: 8,
        },
        {
          type: "Watchtower",
          subject: "Defensive tower that can attack enemy unit",
          foodCost: 1,
          woodCost: 4,
          goldCost: 0,
          stoneCost: 4,
        },
        {
          type: "Barracks",
          subject: "Allows the city to train Warrior units",
          foodCost: 3,
          woodCost: 4,
          goldCost: 0,
          stoneCost: 3,
        },
        {
          type: "Archery",
          subject: "Allows the city to train archer units",
          foodCost: 3,
          woodCost: 3,
          goldCost: 0,
          stoneCost: 4,
        },
        {
          type: "Outpost",
          subject: "Allows the city to train scouts",
          foodCost: 6,
          woodCost: 2,
          goldCost: 0,
          stoneCost: 2,
        },
        {
          type: "Church",
          subject: "Allows the city to train Priests",
          foodCost: 3,
          woodCost: 3,
          goldCost: 1,
          stoneCost: 3,
        },
        {
          type: "Fishery",
          subject: "+1 food (+1 gold if next to market)",
          foodCost: 4,
          woodCost: 8,
          goldCost: 2,
          stoneCost: 0,
        },
        {
          type: "Wonder",
          subject:
            "A wonder of research, faith and engineering. After 50 turns, win the game.",
          foodCost: 150,
          woodCost: 150,
          goldCost: 150,
          stoneCost: 150,
        },
      ],
      units: ["Warrior"],
      unitsOwned: 1,
    };
  },
  watch: {
    tilesAway(newValue) {
      this.tileCost = 15 * Math.pow(2, newValue - 1);
    },
  },
  computed: {
    getResources() {
      return this.resources;
    },
  },
  methods: {
    addResources() {
      for (let i = 0; i < this.resources.length; i++) {
        this.resources[i].amount += this.resources[i].modifier;
      }
    },
    buyUnit(food, wood, gold, stone, type) {
      let currentFood = this.resources[0].amount;
      let currentWood = this.resources[1].amount;
      let currentGold = this.resources[2].amount;
      let currentStone = this.resources[3].amount;

      if (this.playerSettings.population > this.unitsOwned) {
        if (
          currentFood >= food &&
          currentWood >= wood &&
          currentGold >= gold &&
          currentStone >= stone
        ) {
          this.units.push(type);
          this.resources[0].amount = currentFood - food;
          this.resources[1].amount -= wood;
          this.resources[2].amount -= gold;
          this.resources[3].amount -= stone;
        }
        this.unitsOwned++;
      } else {
        this.showUnitAlert();
      }
    },
    levelUp() {
      let baseCost = 8;

      if (this.resources[0].amount >= this.levelUpCost) {
        if (this.playerSettings.population <= 1) {
          // cost is 5
          this.resources[0].amount -= 5;
          this.resources[1].amount -= 5;
          this.resources[2].amount -= 5;
          this.resources[3].amount -= 5;
          this.levelUpCost = this.levelUpCost + baseCost;
        } else {
          // cost is the previous level up cost plus the base cost
          this.resources[0].amount -= this.levelUpCost;
          this.resources[1].amount -= this.levelUpCost;
          this.resources[2].amount -= this.levelUpCost;
          this.resources[3].amount -= this.levelUpCost;
          this.levelUpCost = this.levelUpCost + baseCost;
        }

        this.playerSettings.population++;
        if (this.playerSettings.faction.name == "The Whoolies") {
          this.playerSettings.population++;
        }
      } else {
        this.showAlert();
      }
    },
    buyTile() {
      if (this.resources[2].amount >= this.tileCost) {
        this.resources[2].amount -= this.tileCost;
        this.playerSettings.tiles++;
      } else {
        this.showAlert();
      }
    },
    foundCity() {
      if (this.units.includes("Settler")) {
        this.resources[0].modifier++;
        this.resources[1].modifier++;
        this.resources[2].modifier++;
        this.resources[3].modifier++;
        this.playerSettings.population++;
        this.units = this.units.filter((element) => element != "Settler");
      } else {
        this.$swal("You do not own a settler");
      }
    },
    getForest() {
      if (this.units.includes("Lumberyard")) {
        this.resources[1].modifier++;
      } else {
        this.$swal("You do not have a lumberyard");
      }
    },
    buyBuilding(food, wood, gold, stone, type) {
      let currentFood = this.resources[0].amount;
      let currentWood = this.resources[1].amount;
      let currentGold = this.resources[2].amount;
      let currentStone = this.resources[3].amount;

      if (
        currentFood >= food &&
        currentWood >= wood &&
        currentGold >= gold &&
        currentStone >= stone
      ) {
        if (type == "Farm") {
          this.resources[0].modifier++;
          if (this.playerSettings.faction.name == "The Devils") {
            this.resources[0].modifier++;
          }
        } else if (type == "Lumberyard") {
          this.resources[1].modifier++;
        } else if (type == "Market") {
          this.resources[2].modifier++;
          if (this.playerSettings.faction.name == "The Caws") {
            this.resources[2].modifier++;
          }
        } else if (type == "Mine") {
          this.resources[3].modifier++;
        }
        this.units.push(type);
        this.resources[0].amount = currentFood - food;
        this.resources[1].amount -= wood;
        this.resources[2].amount -= gold;
        this.resources[3].amount -= stone;
      } else {
        this.showAlert();
      }
    },
    toggleAlert() {
      this.noResources = !this.noResources;
    },
    showAlert() {
      this.$swal("You do not have enough resources for this.");
    },
    showUnitAlert() {
      this.$swal("You lack the population for this.");
    },
    setFaction(name, color, special) {
      this.playerSettings.faction.name = name;
      this.playerSettings.faction.color = color;
      this.playerSettings.faction.special = special;
      this.playerSettings.population = 1;
    },
  },
};
</script>

<style>
body{
  background-color: #242424;
}
.el-collapse-item__header {
  background-color: #151515 !important;
  border: none !important;
  color: white !important;
  text-align: center !important;
}
.el-collapse-item__wrap {
  background-color: #242424 !important;
}
</style>
