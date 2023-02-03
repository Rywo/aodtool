<template>
  <div class="flex space-x-5 justify-center">
    <Resources
      v-for="resource in resources"
      :key="resource.type"
      :type="resource.type"
      :amount="resource.amount"
      :modifier="resource.modifier"
    />
  </div>

  <div>
    <button
      class="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        py-2
        px-4
        rounded
        mt-2
      "
      @click="addResources"
    >
      Next turn
    </button>
  </div>
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
</template>

<script>
import Resources from "./components/Resources.vue";
import Building from "./components/Building.vue";

export default {
  components: { Resources, Building },
  data() {
    return {
      resources: [
        { type: "Food", amount: 5, modifier: 1 },
        { type: "Wood", amount: 5, modifier: 1 },
        { type: "Gold", amount: 5, modifier: 1 },
        { type: "Stone", amount: 5, modifier: 1 },
      ],
      buildings: [
        {
          type: "Farm",
          subject: "+1 food",
          foodCost: 5,
          woodCost: 7,
          goldCost: 0,
          stoneCost: 2,
        },
        {
          type: "Mine",
          subject: "+1 stone",
          foodCost: 0,
          woodCost: 4,
          goldCost: 0,
          stoneCost: 10,
        },
        {
          type: "Market",
          subject: "+1 gold",
          foodCost: 0,
          woodCost: 4,
          goldCost: 4,
          stoneCost: 6,
        },
        {
          type: "Lumberyard",
          subject: "+1 wood",
          foodCost: 8,
          woodCost: 4,
          goldCost: 0,
          stoneCost: 4,
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
          stoneCost: 10,
        },
        {
          type: "Watchtower",
          subject: "Defensive tower that can attack enemy unit",
          foodCost: 8,
          woodCost: 3,
          goldCost: 0,
          stoneCost: 1,
        },
        {
          type: "Barracks",
          subject: "Allows the city to train Warrior units",
          foodCost: 10,
          woodCost: 8,
          goldCost: 0,
          stoneCost: 8,
        },
        {
          type: "Archery",
          subject: "Allows the city to train archer units",
          foodCost: 10,
          woodCost: 10,
          goldCost: 0,
          stoneCost: 6,
        },
        {
          type: "Outpost",
          subject: "Allows the city to train scouts",
          foodCost: 6,
          woodCost: 10,
          goldCost: 0,
          stoneCost: 8,
        },
        {
          type: "Church",
          subject: "Allows the city to train Priests",
          foodCost: 6,
          woodCost: 10,
          goldCost: 0,
          stoneCost: 8,
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
          foodCost: 200,
          woodCost: 200,
          goldCost: 200,
          stoneCost: 200,
        },
      ],
      ownedBuildings: [],
    };
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
        console.log(type);
        if (type == "Farm") {
          this.resources[0].modifier++;
        } else if (type == "Lumberyard") {
          this.resources[1].modifier++;
        } else if (type == "Market") {
          this.resources[2].modifier++;
        } else if (type == "Mine") {
          this.resources[3].modifier++;
        }
        this.ownedBuildings.push(type);
        this.resources[0].amount = currentFood - food;
        this.resources[1].amount -= wood;
        this.resources[2].amount -= gold;
        this.resources[3].amount -= stone;
      } else {
        console.log("Not enough resources");
      }
    },
  },
};
</script>

<style scoped>
</style>
