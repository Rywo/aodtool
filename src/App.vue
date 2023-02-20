<template>
  <main
    id="completewrapper"
    className="grid lg:grid-cols-4 gap-y-12 gap-x-8 2xl:max-w-[1536px] 2xl:mx-auto"
  >
    <section ID="factionselector" className="lg:col-span-4 flex mx-auto">
      <div v-if="playerSettings.faction.name == 0">
        <h1 class="text-white">Choose your faction</h1>
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
    </section>
    <div
      id="resourcebargridplaceholder"
      className="hidden lg:block lg:row-start-1 h-[60px]"
    ></div>
    <div
      id="Resourcebar"
      className="w-max lg:row-start-1 lg:col-span-4 mx-auto lg:mt-4"
      v-if="playerSettings.faction.name"
    >
      <section
        className="lg:fixed lg:left-[50%] z-10 lg:transform lg:-translate-x-[50%] flex flex-col lg:flex-row gap-y-4 lg:gap-x-2 xl:gap-x-5"
      >
        <div
          class="
            flex flex-col
            w-full
            lg:flex-row
            gap-y-4
            lg:space-x-2
            2xl:space-x-5
            justify-center
            text-white
          "
        >
          <Resources
            v-for="resource in resources"
            :key="resource.type"
            :type="resource.type"
            :amount="resource.amount"
            :modifier="resource.modifier"
          />
        </div>
        <button
          className="
        bg-blue-500
        hover:bg-blue-700
        text-white
        font-bold
        rounded-lg
        w-[200px]
      "
          @click="addResources"
        >
          Next turn
        </button>
      </section>
    </div>

    <section
      id="playerinfobox"
      className="lg:col-start-1 lg:row-start-2 flex flex-col gap-y-8"
    >
      <span
        v-if="playerSettings.faction.name"
        class="text-2xl font-bold text-white"
        >Turn: {{ turn }}</span
      >

      <div id="FactionIndicator" className="lg:col-start-1 lg:row-start-2">
        <Player
          v-if="playerSettings.faction.name"
          :name="playerSettings.faction.name"
          :population="totalPopulation"
          :color="playerSettings.faction.color"
          :special="playerSettings.faction.special"
          :tiles="playerSettings.faction.tiles"
          @buy-special="buySpecial"
        />
      </div>

      <div className="lg:col-start-1 lg:row-start-3 text-white">
        <BuildingInv
          v-if="playerSettings.faction.name"
          :units="this.units"
          @delete="deleteUnit"
        />
      </div>

      <section
        id="Civ, buy tile, found city and level city section"
        className="lg:col-start-1 lg:row-start-4 flex flex-col gap-y-8"
      >
        <div class="" v-if="playerSettings.faction.name">
          <button
            v-if="this.playerSettings.faction.name == 'The Crunchers'"
            class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
            @click="getForest"
          >
            +1 wood for building in forest
          </button>

          <el-form-item>
            <span class="text-white">Tiles away </span>
            <input class="text-black text-center w-full" v-model="tilesAway" />
          </el-form-item>
          <button
            v-if="playerSettings.faction.name"
            class="px-2 py-3 w-full shadow-lg bg-blue-500 hover:bg-blue-700"
            @click="buyTile"
          >
            Buy tile ({{ this.tileCost }})
          </button>
        </div>

        <button
          v-if="playerSettings.faction.name"
          class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
          @click="foundCity"
        >
          Found city
        </button>
        <button
          v-if="playerSettings.faction.name"
          class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
          @click="levelUp"
        >
          Level up ({{ this.levelUpCost }} gold)
        </button>
      </section>
    </section>
    <!-- In de toekomst zou ik hier graag twee losse tabs voor hebben (dus dat je als je op de link van het units tab klikt, 
    dat de buildings verdwijnen en in dezelfde plaats de units voorkomen, dan is het allemaal makkelijk te zien zonder scroll ) -->
    <div
      id="Buildings"
      className="lg:col-start-2 lg:row-start-2 w-full lg:col-span-3"
      v-if="playerSettings.faction.name"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="Buildings">
          <div
            class="
              grid
              lg:grid-cols-3
              2xl:grid-cols-4
              w-max
              lg:w-full
              gap-4
              mt-4
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
            /></div
        ></el-tab-pane>
        <el-tab-pane label="Units">
          <div class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max gap-4 mt-8">
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
        </el-tab-pane>
        <el-tab-pane label="Cities">
          <div class="px-2 py-3 rounded-xl bg-slate-600/50 shadow-md">
            <h2 class="text-2xl text-white">Capital</h2>
            <div class="flex space-x-5 mb-5">
              <span class="text-xl text-white">{{ capital.population }}</span>
              <h3 class="text-xl text-white">{{ capital.name }}</h3>
            </div>

            <h2 class="text-2xl text-white">Cities</h2>
            <City
              v-for="(city, idx) in cities"
              :key="idx"
              :name="city.name"
              :population="city.population"
              :id="city.id"
              :level="city.levelUpCost"
              @lvl-city="cityLevelUp"
              @destroy-city="destroyCity"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Additional">
          <button
            v-if="playerSettings.faction.name"
            class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
          >
            Plunder
          </button>
          <button
            v-if="playerSettings.faction.name"
            class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
            @click="getRich"
          >
            Get rick quick
          </button>
        </el-tab-pane>
      </el-tabs>
    </div>
  </main>
</template>

<script>
import Player from "./components/Player.vue";
import Resources from "./components/Resources.vue";
import Building from "./components/Building.vue";
import BuildingInv from "./components/BuildingInv.vue";
import Factions from "./components/Factions.vue";
import City from "./components/City.vue";

export default {
  components: { Resources, Building, Factions, Player, BuildingInv, City },
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
      capital: {
        name: "Ayo",
        population: 1,
      },
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
        population: this.totalPopulation,
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
          subject: "After 50 turns, win the game.",
          foodCost: 150,
          woodCost: 150,
          goldCost: 150,
          stoneCost: 150,
        },
      ],
      units: [
        { name: "Warrior", title: "Sjors", id: this.generateRandomId(8) },
      ],
      cities: [],
      cityNames: [
        "Owuocok",
        "Eflark",
        "Ezeoplarc",
        "Okrens",
        "Axathe",
        "Ejeiksea",
        "Duckstad",
        "Uprathe",
        "Oteahgas",
        "Ifluudille",
        "Hylia",
        "Eyrane",
        "Resembool",
        "Steelbarrow",
        "Eldrida",
        "Ravenhold",
        "Dunmere",
        "Kingsreach",
        "Frosthold",
        "Wolfswood",
        "Stormhaven",
        "Dragonfall",
        "Blackwater",
        "Silvershire",
        "Greenhaven",
        "Stonewall",
        "Moonstone",
        "Ironwood",
        "Goldcrest",
        "Crownsguard",
        "Ravenwood",
        "Whiterun",
        "Winterfell",
        "Dragonstone",
        "Riverrun",
        "The Twins",
        "Highgarden",
        "Casterly Rock",
        "Storm's End",
        "Pyke",
        "Oldtown",
        "Braavos",
        "Meereen",
        "Volantis",
        "Qarth",
        "Astapor",
        "Lys",
        "Tyrosh",
        "Pentos",
        "Baldur's Gate",
        "Waterdeep",
        "Neverwinter",
        "Icewind Dale",
        "Sharn",
        "Stormreach",
        "Korthos",
        "Eveningstar",
        "Cormyr",
        "Sembia",
        "Thay",
        "Amn",
        "Calimshan",
        "Zakhara",
        "Al-Qadim",
      ],
      unitNames: [
        "William",
        "Richard",
        "Henry",
        "Edward",
        "John",
        "Robert",
        "Thomas",
        "Geoffrey",
        "Roger",
        "Stephen",
        "Philip",
        "Walter",
        "Gilbert",
        "Bartholomew",
        "Simon",
        "Godfrey",
        "Baldwin",
        "Hugh",
        "Alan",
        "Reginald",
      ],
      unitsOwned: 1,
      turn: 1,
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
    totalPopulation() {
      let totalPopulation = this.capital.population; // initialize total population to 0
      for (let i = 0; i < this.cities.length; i++) {
        totalPopulation += this.cities[i].population; // add the population of each city to the total population
      }
      return totalPopulation;
    },
  },
  methods: {
    addResources() {
      for (let i = 0; i < this.resources.length; i++) {
        this.resources[i].amount += this.resources[i].modifier;
      }
      this.turn += 1;
    },
    buyUnit(food, wood, gold, stone, type) {
      let currentFood = this.resources[0].amount;
      let currentWood = this.resources[1].amount;
      let currentGold = this.resources[2].amount;
      let currentStone = this.resources[3].amount;
      const randomUnitName =
        this.unitNames[Math.floor(Math.random() * this.cityNames.length)];

      if (this.totalPopulation > this.unitsOwned) {
        if (
          currentFood >= food &&
          currentWood >= wood &&
          currentGold >= gold &&
          currentStone >= stone
        ) {
          this.units.push({
            name: type,
            title: randomUnitName,
            id: this.generateRandomId(8),
          });
          this.resources[0].amount = currentFood - food;
          this.resources[1].amount -= wood;
          this.resources[2].amount -= gold;
          this.resources[3].amount -= stone;
          this.unitsOwned++;
        } else {
          this.showAlert();
        }
      } else {
        this.showUnitAlert();
      }
    },
    generateRandomId(length) {
      const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let result = "";
      for (let i = 0; i < length; i++) {
        result += characters.charAt(
          Math.floor(Math.random() * characters.length)
        );
      }
      return result;
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
          this.resources[0].amount -= this.levelUpCost;
          this.resources[1].amount -= this.levelUpCost;
          this.resources[2].amount -= this.levelUpCost;
          this.resources[3].amount -= this.levelUpCost;
          this.levelUpCost = this.levelUpCost + baseCost;
        }

        this.capital.population++;
        if (this.playerSettings.faction.name == "The Whoolies") {
          this.capital.population++;
        }
      } else {
        this.showAlert();
      }
    },
    getRich() {
      this.resources[0].amount = 9999;
      this.resources[1].amount = 9999;
      this.resources[2].amount = 9999;
      this.resources[3].amount = 9999;
    },
    cityLevelUp(id) {
      const currentCity = this.cities.filter((city) => city.id == id);
      const baseCost = 8;
      if (this.resources[0].amount >= currentCity[0].levelUpCost) {
        if (currentCity.population <= 1) {
          // cost is 5
          this.resources[0].amount -= 5;
          this.resources[1].amount -= 5;
          this.resources[2].amount -= 5;
          this.resources[3].amount -= 5;
          currentCity[0].levelUpCost = currentCity[0].levelUpCost + baseCost;
        } else {
          this.resources[0].amount -= currentCity[0].levelUpCost;
          this.resources[1].amount -= currentCity[0].levelUpCost;
          this.resources[2].amount -= currentCity[0].levelUpCost;
          this.resources[3].amount -= currentCity[0].levelUpCost;
          currentCity[0].levelUpCost = currentCity[0].levelUpCost + baseCost;
        }
        currentCity[0].population++;
        if (this.playerSettings.faction.name == "The Whoolies") {
          currentCity[0].population++;
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
      const randomCityName =
        this.cityNames[Math.floor(Math.random() * this.cityNames.length)];

      const settlerIndex = this.units.findIndex(
        (unit) => unit.name === "Settler"
      );

      if (settlerIndex !== -1) {
        this.resources[0].modifier++;
        this.resources[1].modifier++;
        this.resources[2].modifier++;
        this.resources[3].modifier++;
        this.playerSettings.population++;
        this.units.splice(settlerIndex, 1);
        this.cities.push({
          name: randomCityName,
          id: this.generateRandomId(8),
          population: 1,
          levelUpCost: 5,
        });
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
        this.units.push({
          name: type,
          title: type,
          id: this.generateRandomId(8),
        });
        this.resources[0].amount = currentFood - food;
        this.resources[1].amount -= wood;
        this.resources[2].amount -= gold;
        this.resources[3].amount -= stone;
      } else {
        this.showAlert();
      }
    },
    buySpecial(name) {
      const randomUnitName =
        this.unitNames[Math.floor(Math.random() * this.cityNames.length)];
      if (this.unitsOwned < this.totalPopulation) {
        if (
          name == "The Caws" &&
          this.resources[0].amount >= 1 &&
          this.resources[1].amount >= 2 &&
          this.resources[2].amount >= 5 &&
          this.resources[3].amount >= 0
        ) {
          this.resources[0].amount -= 1;
          this.resources[1].amount -= 2;
          this.resources[2].amount -= 5;
          this.resources[3].amount -= 0;
          this.units.push({
            name: "SpCaw",
            title: randomUnitName,
            id: this.generateRandomId(8),
          });
        } else if (
          name == "The Devils" &&
          this.resources[0].amount >= 5 &&
          this.resources[1].amount >= 2 &&
          this.resources[2].amount >= 0 &&
          this.resources[3].amount >= 1
        ) {
          this.resources[0].amount -= 5;
          this.resources[1].amount -= 2;
          this.resources[2].amount -= 0;
          this.resources[3].amount -= 1;
          this.units.push({
            name: "SpDevil",
            title: randomUnitName,
            id: this.generateRandomId(8),
          });
        } else if (
          name == "The Whoolies" &&
          this.resources[0].amount >= 3 &&
          this.resources[1].amount >= 2 &&
          this.resources[2].amount >= 3 &&
          this.resources[3].amount >= 0
        ) {
          this.resources[0].amount -= 3;
          this.resources[1].amount -= 2;
          this.resources[2].amount -= 3;
          this.resources[3].amount -= 0;
          this.units.push({
            name: "SpWhool",
            title: randomUnitName,
            id: this.generateRandomId(8),
          });
        } else if (
          name == "The Crunchers" &&
          this.resources[0].amount >= 2 &&
          this.resources[1].amount >= 4 &&
          this.resources[2].amount >= 0 &&
          this.resources[3].amount >= 2
        ) {
          this.resources[0].amount -= 2;
          this.resources[1].amount -= 4;
          this.resources[2].amount -= 0;
          this.resources[3].amount -= 2;
          this.units.push({
            name: "SpCrunch",
            title: randomUnitName,
            id: this.generateRandomId(8),
          });
        } else {
          this.showAlert();
        }
      } else {
        this.showUnitAlert();
      }
    },
    destroyCity(cityId) {
      this.cities = this.cities.filter((city) => city.id != cityId);
    },
    deleteUnit(unitId) {
      const foundUnit = this.units.filter((unit) => unit.id == unitId);
      const isBuilding = this.units.some((unit) => {
        return this.buildings.some((building) => {
          return unit.name === building.type;
        });
      });

      if (foundUnit[0].name == "Farm") {
        this.resources[0].modifier--;
        this.resources[0].amount -= 8;
        if (this.playerSettings.faction.name == "The Devils") {
          this.resources[0].modifier--;
        }
      } else if (foundUnit[0].name == "Lumberyard") {
        this.resources[1].modifier--;
        this.resources[1].amount -= 8;
      } else if (foundUnit[0].name == "Market") {
        this.resources[2].modifier--;
        this.resources[2].amount -= 8;
        if (this.playerSettings.faction.name == "The Caws") {
          this.resources[2].modifier--;
        }
      } else if (foundUnit[0].name == "Mine") {
        this.resources[3].modifier--;
        this.resources[3].amount -= 8;
      } else if (isBuilding) {
        this.resources[0].amount -= 2;
        this.resources[1].amount -= 2;
        this.resources[2].amount -= 2;
        this.resources[3].amount -= 2;
      }
      this.units = this.units.filter((unit) => unit.id != unitId);
      this.unitsOwned--;
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
body {
  background-color: #242424;
}
.el-collapse-item__header {
  background-color: #151515 !important;
  border: none !important;
  color: white !important;
  text-align: center !important;
}
.el-tabs--border-card {
  border: none !important;
}
.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active {
  background-color: #3b3b3b !important;
  color: white !important;
  font-weight: bold;
  border: none;
}
.el-tabs__nav-wrap {
  background-color: #131313;
}
.el-tabs__content {
  background-color: #242424;
}
.el-collapse-item__wrap {
  background-color: #242424 !important;
}
</style>
