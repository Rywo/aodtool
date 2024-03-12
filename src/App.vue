<template>
  <main
    id="completewrapper"
    className="grid lg:grid-cols-4 gap-y-12 gap-x-8 2xl:max-w-[1536px] 2xl:mx-auto my-8"
  >
    <section
      ID="factionselector"
      className=" lg:row-start-1 lg:col-span-4 flex mx-auto"
    >
      <div v-if="!playerSettings.mapGenerated">
        <Grid @map-generated='setMapGenerated'/>
      </div>
    
      <div v-if="playerSettings.faction.name == 0 && playerSettings.mapGenerated">
        <h1 class="text-white">Choose your faction</h1>
        <Factions
          v-for="faction in factions"
          :key="faction.name"
          :name="faction.name"
          :capital="faction.capital"
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
          class="flex flex-col w-full lg:flex-row gap-y-4 lg:space-x-2 2xl:space-x-5 justify-center text-white"
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
        class="text-3xl font-bold text-white"
        >Current age: {{ age }}</span
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
        <DominionInv
          v-if="playerSettings.faction.name"
          :units="this.dominionsTaken"
          @delete="removeDominion"
        />
      </div>
      <div className="lg:col-start-1 lg:row-start-3 text-white">
        <BuildingInv
          v-if="playerSettings.faction.name"
          :units="this.units"
          @delete="deleteUnit"
        />
      </div>
      <div className="lg:col-start-1 lg:row-start-3 text-white">
        <UpgradeInv
          v-if="playerSettings.faction.name"
          :upgrades="this.upgradeInv"
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

          <button
            v-if="this.playerSettings.faction.name == 'The Devils'"
            class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
            @click="getFood"
          >
            +1 food for placing producing
          </button>

          <button
            v-if="this.playerSettings.faction.name == 'The Devils'"
            class="px-2 py-3 mt-5 mb-5 shadow-lg bg-blue-500 hover:bg-blue-700"
            @click="getFoodToo"
          >
            +1 food for ending in woods Red bastard
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
          @click="ageUp"
        >
          Age faction
        </button>
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
          Level up ({{ this.levelUpCost }} food)
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
          <h2 class="text-2xl text-white text-left mb-4">Buildings</h2>
          <div
            class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max lg:w-full gap-4 mt-4"
          >
            <Building
              v-for="building in filteredBuildings"
              :key="building.type"
              :type="building.type"
              :subject="building.subject"
              :food-cost="building.foodCost"
              :wood-cost="building.woodCost"
              :gold-cost="building.goldCost"
              :stone-cost="building.stoneCost"
              :age="building.age"
              :need-builder="building.needBuilder"
              :produces-unit="building.producesUnit"
              @buy-building="buyBuilding"
            /></div
        ></el-tab-pane>

                <el-tab-pane label="Dominions">
          <h2 class="text-2xl text-white mb-4 text-center">
            Dominions
          </h2>
          <div
            class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max lg:w-full gap-4 mt-4 mb-10"
          >
            <Dominion
              v-for="(dom, idx) in dominions"
              :key="idx"
              :type="dom.type"
              :subject="dom.subject"
              @buy-building="takeDominion"
            />
          </div>
            <div class="grid lg:grid-cols-3 2xl:grid-cols-4 w-full gap-4">

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(0)"
              >
                Steal First Wood Upgrade
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(1)"
              >
                Steal First Food Upgrade
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(2)"
              >
                Steal First Stone Upgrade
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(3)"
              >
                Steal First Stone Upgrade
              </button>
            </div>
                        <div class="grid lg:grid-cols-3 2xl:grid-cols-4 w-full gap-4 mt-5">

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(0)"
              >
                Steal Second Wood Upgrade
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(1)"
              >
                Steal Second Food Upgrade
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(2)"
              >
                Steal Second Stone Upgrade
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-red-500 hover:bg-red-700 h-full"
                @click="increaseModifier(3)"
              >
                Steal Second Stone Upgrade
              </button>
            </div>
        </el-tab-pane>
        
        <el-tab-pane label="Units">
          <div
            class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max lg:w-full gap-4 mt-8"
          >
            <Building
              v-for="passiveUnit in passiveUnits.filter(
                (s) => s.age <= this.age
              )"
              :key="passiveUnit.type"
              :type="passiveUnit.type"
              :subject="passiveUnit.subject"
              :food-cost="passiveUnit.foodCost"
              :wood-cost="passiveUnit.woodCost"
              :gold-cost="passiveUnit.goldCost"
              :stone-cost="passiveUnit.stoneCost"
              :age="passiveUnit.age"
              :need-builder="passiveUnit.needBuilder"
              @buy-building="buyUnit"
            />
          </div>
          <h2 class="text-2xl text-white text-left mt-8 mb-4">Soldiers</h2>
          <div
            class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max lg:w-full gap-4 mt-8"
          >
            <Building
              v-for="soldier in filteredSoldiers.filter(
                (s) => s.age <= this.age
              )"
              :key="soldier.type"
              :type="soldier.type"
              :subject="soldier.subject"
              :food-cost="soldier.foodCost"
              :wood-cost="soldier.woodCost"
              :gold-cost="soldier.goldCost"
              :stone-cost="soldier.stoneCost"
              :age="soldier.age"
              :need-builder="soldier.needBuilder"
              @buy-building="buyUnit"
            />
          </div>
        </el-tab-pane>

        <el-tab-pane label="Cities">
          <div class="p-8 rounded-xl bg-slate-600/50 shadow-md">
            <h2 class="text-2xl text-white text-left mb-4">Capital</h2>
            <div class="flex space-x-5 mb-5">
              <span class="text-xl text-white">{{ capital.population }}</span>
              <h3 class="text-xl text-white">{{ capital.name }}</h3>

              <button @click="destroyCapital">Destroy</button>
            </div>
            <h2 class="text-2xl text-white text-left mb-4">Cities</h2>
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
        <el-tab-pane label="Trading">
          <div className="p-8 rounded-xl bg-slate-600/50 shadow-md flex gap-2">
            <el-select v-model="tradeOffer" className="my-auto" >
              <el-option 
                v-for="tradeOption in tradeOptions"
                :key="tradeOption.value"
                :label="tradeOption.label"
                :value="tradeOption.value"
              ></el-option>
            </el-select>

            <el-select v-model="tradeReceive" className="my-auto">
              <el-option
                v-for="tradeOption in tradeOptions"
                :key="tradeOption.value"
                :label="tradeOption.label"
                :value="tradeOption.value"
              ></el-option>
            </el-select>

            <button
              v-if="playerSettings.faction.name"
              class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
              @click="trade(tradeOffer, tradeReceive)"
            >
              Trade
            </button>
          </div>
        </el-tab-pane>
        <el-tab-pane label="Upgrades">
          <div
            class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max lg:w-full gap-4 mt-8"
          >
            <Upgrades
              v-for="upgrade in ageUpgrades"
              :key="upgrade.type"
              :type="upgrade.type"
              :base="upgrade.base"
              :bought="upgrade.bought"
              :subject="upgrade.subject"
              :food-cost="upgrade.foodCost"
              :wood-cost="upgrade.woodCost"
              :gold-cost="upgrade.goldCost"
              :stone-cost="upgrade.stoneCost"
              :upgrade-lvl="upgrade.upgradeLvl"
              :age="upgrade.age"
              :need-builder="upgrade.needBuilder"
              @buy-upgrade="buyUpgrade"
            />
          </div>
          <div
            class="grid lg:grid-cols-3 2xl:grid-cols-4 w-max lg:w-full gap-4 mt-8"
          >
            <Upgrades
              v-for="upgrade in filteredUpgrades"
              :key="upgrade.type"
              :type="upgrade.type"
              :base="upgrade.base"
              :bought="upgrade.bought"
              :subject="upgrade.subject"
              :food-cost="upgrade.foodCost"
              :wood-cost="upgrade.woodCost"
              :gold-cost="upgrade.goldCost"
              :stone-cost="upgrade.stoneCost"
              :upgrade-lvl="upgrade.upgradeLvl"
              :age="upgrade.age"
              :need-builder="upgrade.needBuilder"
              @buy-upgrade="buyUpgrade"
            />
          </div>
        </el-tab-pane>
        <el-tab-pane label="Additional">
          <div className="p-8 rounded-xl bg-slate-600/50 shadow-md">
            <h2 class="text-2xl text-white text-left mb-4">Attack others</h2>
            <div class="grid lg:grid-cols-3 2xl:grid-cols-5 w-full gap-4">
              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Normal', 'plunder')"
              >
                Plunder
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Farm', 'plunder')"
              >
                Plunder Farm
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Mine', 'plunder')"
              >
                Plunder Mine
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Lumberyard', 'plunder')"
              >
                Plunder Lumberyard
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Market', 'plunder')"
              >
                Plunder Market
              </button>
            </div>
            <h2 class="text-2xl text-white text-left mt-8 mb-4">
              Getting attacked
            </h2>

            <div class="grid w-full lg:grid-cols-3 2xl:grid-cols-5 gap-4">
              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Normal', 'plundered')"
              >
                Plundered
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="plunder('Farm', 'plundered')"
              >
                Plundered
                <br />
                Farm
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
                @click="plunder('Mine', 'plundered')"
              >
                Plundered
                <br />
                Mine
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
                @click="plunder('Lumberyard', 'plundered')"
              >
                Plundered
                <br />
                Lumberyard
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
                @click="plunder('Market', 'plundered')"
              >
                Plundered
                <br />
                Market
              </button>
            </div>

            <h2 class="text-2xl text-white text-left mt-8 mb-4">
              Getting attacked
            </h2>
            <div class="grid lg:grid-cols-3 2xl:grid-cols-5 w-full gap-4">
              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
                @click="fisheryNextToMarket"
              >
                Fishery next to market
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="increaseModifier(0)"
              >
                Add food +1
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="increaseModifier(1)"
              >
                Add wood +1
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="increaseModifier(2)"
              >
                Add gold +1
              </button>

              <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700 h-full"
                @click="increaseModifier(3)"
              >
                Add stone +1
              </button>
            </div>
            <!-- 
             <button
                v-if="playerSettings.faction.name"
                class="px-2 py-3 shadow-lg bg-blue-500 hover:bg-blue-700"
                @click="getRich"
              >
                Get rich quick
              </button> -->
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </main>
</template>

<script>
import Player from "./components/Player.vue";
import Resources from "./components/Resources.vue";
import Building from "./components/Building.vue";
import Upgrades from "./components/Upgrades.vue";
import Dominion from "./components/Dominion.vue";
import UpgradeInv from "./components/UpgradeInv.vue";
import BuildingInv from "./components/BuildingInv.vue";
import DominionInv from "./components/DominionInv.vue";
import Factions from "./components/Factions.vue";
import City from "./components/City.vue";
import Grid from "./components/Grid.vue";
import cityNames from "./data/cityNames.json";
import unitNames from "./data/unitNames.json";
import factions from "./data/factions.js";
import soldiers from "./data/soldiers.js";
import buildings from "./data/buildings.js";
import upgrades from "./data/upgrades.js";

export default {
  components: {
    Resources,
    Building,
    Factions,
    Player,
    Upgrades,
    BuildingInv,
    Dominion,
    UpgradeInv,
    DominionInv,
    City,
    Grid,
  },
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
        name: "",
        population: 1,
      },
      factions: factions,
      soldiers: soldiers,
      buildings: buildings,
      passiveUnits: [
        {
          type: "Settler",
          subject: "Can settle new city",
          foodCost: 15,
          woodCost: 15,
          goldCost: 15,
          stoneCost: 15,
          needBuilder: false,
          age: 1,
        },
        {
          type: "Builder",
          subject: "Build outside city",
          foodCost: 6,
          woodCost: 0,
          goldCost: 0,
          stoneCost: 0,
          needBuilder: false,
          age: 1,
        },
      ],
      playerSettings: {
        faction: { name: "", color: "", special: "", tiles: 0 },
        population: this.totalPopulation,
        tiles: 0,
        mapGenerated: false,
      },
      levelUpCost: 5,
      dominions: [
        {
          type: "Wood",
          subject: "+1 wood",
        },
        {
          type: "Food",
          subject: "+1 food",
        },
        {
          type: "Stone",
          subject: "+1 stone",
        },
        {
          type: "Gold",
          subject: "+1 gold",
        },
      ],
      ageUpgrades: [
        {
          type: "Urban planning",
          subject: "+1 yield all resources per city",
          base: "Aging",
          bought: false,
          upgradeLvl: 1,
          foodCost: 10,
          woodCost: 10,
          goldCost: 10,
          stoneCost: 10,
          needBuilder: false,
          age: 2,
        },
        {
          type: "Writing and mathematics",
          subject: "+1 yield all resources per city",
          base: "Aging",
          bought: false,
          upgradeLvl: 2,
          foodCost: 30,
          woodCost: 30,
          goldCost: 30,
          stoneCost: 30,
          needBuilder: false,
          age: 3,
        },
      ],
      upgrades: upgrades,
      dominionUpgrades: [
        {
          type: "Advanced dominions",
          subject: "Dominions produce more",
          base: "Dominion",
          bought: false,
          upgradeLvl: 1,
          foodCost: 5,
          woodCost: 5,
          goldCost: 5,
          stoneCost: 5,
          needBuilder: false,
          age: 1,
        }
      ],
      units: [
        {
          name: "SpDevil",
          title: "Sjors",
          id: this.generateRandomId(8),
        },
      ],
      dominionsTaken: [],
      upgradeInv: [],
      cities: [],
      cityNames,
      unitNames,
      buildingUpkeepDetails: [],
      unitUpkeepDetails: [],
      totalBuildingUpkeep: 0,
      totalUnitUpkeep: 0,
      tradeOptions: [
        { label: "Food", value: "Food" },
        { label: "Wood", value: "Wood" },
        { label: "Gold", value: "Gold" },
        { label: "Stone", value: "Stone" },
      ],
      tradeOffer: "",
      tradeReceive: "",
      unitsOwned: 1,
      turn: 1,
      age: 1,
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
    filteredBuildings() {
      const builderIndex = this.units.findIndex(
        (unit) => unit.name === "Builder"
      );
      return this.buildings.filter((building) => {
        // Filter based on age and needBuilder
        if (
          building.age <= this.age &&
          (!building.needBuilder ||
            (builderIndex !== -1 && building.needBuilder))
        ) {
          return true;
        }
        return false;
      });
    },
    filteredSoldiers() {
      return this.soldiers.filter((soldier) => {
        return this.units.some((unit) => unit.producesUnit === soldier.type);
      });
    },
    filteredUpgrades() {
      return this.upgrades.filter((upgrade) => {
        const withinAge = upgrade.age <= this.age;
        const hasBaseUnit = this.units.some(
          (unit) => unit.name === upgrade.base
        );
        const notBought = !upgrade.bought;
        let prevLevelBought = true;
        if (upgrade.upgradeLvl > 1) {
          const prevUpgrade = this.upgrades.find(
            (u) =>
              u.base === upgrade.base && u.upgradeLvl === upgrade.upgradeLvl - 1
          );
          prevLevelBought = prevUpgrade && prevUpgrade.bought;
        }

        return withinAge && hasBaseUnit && notBought && prevLevelBought;
      });
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
    increaseModifier(number) {
      this.resources[number].modifier++;
    },
    setMapGenerated(){
      this.playerSettings.mapGenerated = true;
    },
    ageUp() {
      const ageRequirements = {
        1: 10,
        2: 30,
      };

      const requiredAmount = ageRequirements[this.age];

      if (
        requiredAmount &&
        this.resources.every((resource) => resource.amount >= requiredAmount)
      ) {
        this.resources.forEach(
          (resource) => (resource.amount -= requiredAmount)
        );
        this.age++;
      } else {
        this.showAlert();
      }
    },
    addResources() {
            for (let i = 0; i < this.resources.length; i++) {
        this.resources[i].amount += this.resources[i].modifier;
      }
      this.turn += 1;
    },
    buyUpgrade(type) {
      const currentUpgrade = this.upgrades.find((u) => u.base === type);

      if(this.resources[0].amount >= currentUpgrade.foodCost &&
      this.resources[2].amount >= currentUpgrade.goldCost &&
      this.resources[1].amount >= currentUpgrade.woodCost && 
      this.resources[3].amount >= currentUpgrade.stoneCost){

        const baseTypeToResourceModifier = {
          "Farm": 0,
          "Fishery": 0,
          "Lumberyard": 1,
          "Market": 2,
          "Mine": 3
        };

        if (baseTypeToResourceModifier.hasOwnProperty(currentUpgrade.base)) {
          const resourceModifier = baseTypeToResourceModifier[currentUpgrade.base];
          const unitsOfType = this.units.filter((unit) => unit.title === currentUpgrade.base);
          unitsOfType.forEach(() => {
            this.resources[resourceModifier].modifier += currentUpgrade.age === 3 ? 2 : 1;
          });

          // Apply modifier to each dominion the player has taken
          this.dominionsTaken.forEach((dominion) => {
            if (dominion.type === currentUpgrade.base) {
              // Increase the specific resource modifier based on the upgrade
              if (resourceModifier === 0) {
                dominion.foodMod += 1;
                this.resources[0].modifier += 1;
              } else if (resourceModifier === 1) {
                dominion.woodMod += 1;
                this.resources[1].modifier += 1;
              } else if (resourceModifier === 2) {
                dominion.goldMod += 1;
                this.resources[2].modifier += 1;
              } else if (resourceModifier === 3) {
                dominion.stoneMod += 1;
                this.resources[3].modifier += 1;
              }
            }
          });
        }
        currentUpgrade.bought = true;
        this.upgradeInv.push({
          name: currentUpgrade.type,
          title: currentUpgrade.type,
          base: currentUpgrade.base,
          upgradeLvl: currentUpgrade.upgradeLvl,
        });
      } else {
        this.showAlert();
      }
    },
    buyUnit(foodCost, woodCost, goldCost, stoneCost, unitType) {
      if (this.totalPopulation <= this.unitsOwned) {
        this.showUnitAlert();
        return;
      }
      const resourceIndexMap = { food: 0, wood: 1, gold: 2, stone: 3 };
      const unitCosts = { food: foodCost, wood: woodCost, gold: goldCost, stone: stoneCost };
      for (const resource in unitCosts) {
        const resourceIndex = resourceIndexMap[resource];
        if (this.resources[resourceIndex].amount < unitCosts[resource]) {
          console.log(`Not enough ${resource}. You have ${this.resources[resourceIndex].amount}, but need ${unitCosts[resource]}`);
          this.showAlert();
          return;
        }
      }
      for (const resource in unitCosts) {
        const resourceIndex = resourceIndexMap[resource];
        this.resources[resourceIndex].amount -= unitCosts[resource];
      }
      const randomUnitName = this.unitNames[Math.floor(Math.random() * this.unitNames.length)];
      this.units.push({
        name: unitType,
        title: randomUnitName,
        id: this.generateRandomId(8),
      });
      this.unitsOwned++;
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
          this.levelUpCost = this.levelUpCost + baseCost;
        } else {
          this.resources[0].amount -= this.levelUpCost;
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
          currentCity[0].levelUpCost = currentCity[0].levelUpCost + baseCost;
        } else {
          this.resources[0].amount -= currentCity[0].levelUpCost;

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
      const settlerIndex = this.units.findIndex(unit => unit.name === "Settler");

      if (settlerIndex === -1) {
        this.$swal("You do not own a settler");
        return;
      }

      const randomCityName = this.cityNames[Math.floor(Math.random() * this.cityNames.length)];
      const newCity = {
        name: randomCityName,
        id: this.generateRandomId(8),
        population: 1,
        levelUpCost: 5,
      };

      this.cities.push(newCity);
      this.units.splice(settlerIndex, 1);
      this.unitsOwned--;

      this.playerSettings.population++;
      this.increaseResourceModifiers();
    },

    increaseResourceModifiers() {
      const baseIncrement = this.age === 1 ? 1 : this.age;
      this.resources.forEach(resource => resource.modifier += baseIncrement);
    },
    getForest() {
      if (this.units.includes("Lumberyard")) {
        this.resources[1].modifier++;
      } else {
        this.$swal("You do not have a lumberyard");
      }
    },
    takeDominion(type){
      let foodMod = 0;
      let woodMod = 0;
      let goldMod = 0;
      let stoneMod = 0;

      if(type === 'Food') {
        this.resources[0].modifier++;
        foodMod = this.resources[0].modifier;
      } else if(type === 'Wood') {
        this.resources[1].modifier++;
        woodMod = this.resources[1].modifier;
      } else if(type === 'Gold') {
        this.resources[2].modifier++;
        goldMod = this.resources[2].modifier;
      } else if(type === 'Stone') {
        this.resources[3].modifier++;
        stoneMod = this.resources[3].modifier;
      }

      this.dominionsTaken.push({
        name: type + 'Dominion',
        type: type,
        foodMod: foodMod,
        woodMod: woodMod,
        goldMod: goldMod,
        stoneMod: stoneMod,
        id: this.generateRandomId(8)
      });
    },
    buyBuilding(foodCost, woodCost, goldCost, stoneCost, buildingType, needBuilder, producesUnit) {
      const resourceIndexMap = { food: 0, wood: 1, gold: 2, stone: 3 };
      const buildingToResourceMap = {
        Farm: { resource: 'food', faction: 'The Devils' },
        Fishery: { resource: 'food' },
        Lumberyard: { resource: 'wood' },
        Market: { resource: 'gold', faction: 'The Caws' },
        Mine: { resource: 'stone' },
      };
      const factionBonusMap = {
        'The Literarians': 'Fishery',
        'The Slithers': 'Mine'
      };
      const costs = { food: foodCost, wood: woodCost, gold: goldCost, stone: stoneCost };

      // Check if the player has enough resources to buy the building
      for (const resource in costs) {
        const resourceIndex = resourceIndexMap[resource];
        if (this.resources[resourceIndex].amount < costs[resource]) {
          this.showAlert();
          return;
        }
      }

      // Deduct the cost of the building from the player's resources
      for (const resource in costs) {
        const resourceIndex = resourceIndexMap[resource];
        this.resources[resourceIndex].amount -= costs[resource];
      }

      // Check if there's an upgrade for the building
      const buildingUpgrade = this.upgradeInv.find(upgrade => upgrade.base === buildingType);
      let modifierIncrement = buildingUpgrade ? buildingUpgrade.upgradeLvl + 1 : 1;

      // Increase the resource modifier based on the building type
      const buildingResourceInfo = buildingToResourceMap[buildingType];
      if (buildingResourceInfo) {
        const resourceIndex = resourceIndexMap[buildingResourceInfo.resource];
        this.resources[resourceIndex].modifier += modifierIncrement;
        if (this.playerSettings.faction.name === buildingResourceInfo.faction) {
          this.resources[resourceIndex].modifier++;
        }
      }

      // Check for faction-specific bonuses
      if (this.playerSettings.faction.name in factionBonusMap && buildingType === factionBonusMap[this.playerSettings.faction.name]) {
        const resourceIndex = resourceIndexMap[buildingToResourceMap[buildingType].resource];
        this.resources[resourceIndex].modifier++;
      }

      // Add the building to the player's units
      this.units.push({
        name: buildingType,
        title: buildingType,
        id: this.generateRandomId(8),
        producesUnit: producesUnit,
      });

      // Check if the building type is "Housing" and increment totalPopulation
      if (buildingType === "Housing") {
        this.capital.population++;
      }
    },
    buySpecial(name) {
      const randomUnitName = this.unitNames[Math.floor(Math.random() * this.unitNames.length)];

      if (this.unitsOwned >= this.totalPopulation) {
        this.showUnitAlert();
        return;
      }

      const specialUnits = {
        "The Caws": { name: "SpCaw", costs: [1, 2, 5, 0] },
        "The Devils": { name: "SpDevil", costs: [5, 2, 0, 1] },
        "The Whoolies": { name: "SpWhool", costs: [3, 2, 3, 0] },
        "The Crunchers": { name: "SpCrunch", costs: [2, 4, 0, 2] }
      };

      const specialUnit = specialUnits[name];

      if (!specialUnit) {
        this.showAlert();
        return;
      }

      for (let i = 0; i < this.resources.length; i++) {
        if (this.resources[i].amount < specialUnit.costs[i]) {
          this.showAlert();
          return;
        }
      }

      for (let i = 0; i < this.resources.length; i++) {
        this.resources[i].amount -= specialUnit.costs[i];
      }

      this.units.push({
        name: specialUnit.name,
        title: randomUnitName,
        id: this.generateRandomId(8),
      });
    },
    destroyCity(cityId) {
      this.cities = this.cities.filter((city) => city.id != cityId);
      this.resources[0].modifier--;
      this.resources[1].modifier--;
      this.resources[2].modifier--;
      this.resources[3].modifier--;
      if (this.age == 2) {
        this.resources[0].modifier--;
        this.resources[1].modifier--;
        this.resources[2].modifier--;
        this.resources[3].modifier--;
      } else if (this.age == 3) {
        this.resources[0].modifier - 2;
        this.resources[1].modifier - 2;
        this.resources[2].modifier - 2;
        this.resources[3].modifier - 2;
      }
    },
    destroyCapital() {
      this.capital.name = this.cities[0].name;
      this.capital.population = this.cities[0].population;
      this.levelUpCost = this.cities[0].levelUpCost;
      this.cities.splice(0, 1);
      this.resources[0].modifier--;
      this.resources[1].modifier--;
      this.resources[2].modifier--;
      this.resources[3].modifier--;
    },
    plunder(building, type) {
      let resources;
      let amount;

      switch (building) {
        case "Farm":
          resources = [this.resources[0]];
          amount = 3;
          break;
        case "Lumberyard":
          resources = [this.resources[1]];
          amount = 3;
          break;
        case "Market":
          resources = [this.resources[2]];
          amount = 3;
          break;
        case "Mine":
          resources = [this.resources[3]];
          amount = 3;
          break;
        case "Normal":
          resources = this.resources;
          amount = 1;
          break;
        default:
          return; // invalid building type, do nothing
      }

      resources.forEach((resource) => {
        if (type === "plunder") {
          resource.amount += amount;
        } else if (type === "plundered") {
          if (resource.amount === 0) {
            this.$swal(`You do not have any this resource left.`);
          } else {
            resource.amount = Math.max(resource.amount - amount, 0);
          }
        }
      });
    },
    getFood() {
      this.resources[0].modifier++;
    },
    getFoodToo() {
      this.resources[0].amount++;
    },
    fisheryNextToMarket() {
      if (this.units.some((unit) => unit.name === "Fishery")) {
        this.resources[2].modifier++;
      } else {
        this.$swal(`You do not have a fishery.`);
      }
    },
    removeDominion(domId){
      const foundDom = this.dominionsTaken.filter((dom) => dom.id === domId);

      if(foundDom[0].title === 'Food'){
        this.resources[0].modifier--;
      } else if(foundDom[0].title === 'Wood'){
        this.resources[1].modifier--;
      }
        else if(foundDom[0].title === 'Gold'){
        this.resources[2].modifier--;
      }
        else if(foundDom[0].title === 'Stone'){
        this.resources[3].modifier--;
      }
      this.dominionsTaken = this.dominionsTaken.filter((dom) => dom.id != domId)
    },
    deleteUnit(unitId) {
      const foundUnit = this.units.find((unit) => unit.id == unitId);
      if (!foundUnit) return;

      const unitUpgrade = this.upgradeInv.find(upgrade => upgrade.base === foundUnit.name);

      const buildingToResourceMap = {
        Farm: 0,
        Lumberyard: 1,
        Market: 2,
        Fishery: 0,
        Mine: 3
      };

      const factionBonusMap = {
        'The Devils' : 'Farm',
        'The Caws' : 'Market'
      };

      const resourceIndex = buildingToResourceMap[foundUnit.name];
      if (resourceIndex !== undefined) {
        this.resources[resourceIndex].modifier--;
        if (unitUpgrade) {
          this.resources[resourceIndex].modifier -= unitUpgrade.upgradeLvl;
        }
        if (this.playerSettings.faction.name === factionBonusMap[foundUnit.name]) {
          this.resources[resourceIndex].modifier--;
        }
      }

      this.units = this.units.filter((unit) => unit.id != unitId);
      this.unitsOwned--;
    },
    trade(offer, receive) {
      console.log(offer, receive);

      const hasUpgrade = this.upgradeInv.some(
        (upgrade) => upgrade.name === "Trading routes"
      );
      console.log(hasUpgrade);
      if (offer === receive) {
        // errormessage "You can't trade identical resources"
        return;
      }

      const resourceMap = {
        Food: 0,
        Wood: 1,
        Gold: 2,
        Stone: 3,
      };

      const baseTrade = hasUpgrade ? 6 : 10;

      // Check if the player has enough resources to trade
      if (this.resources[resourceMap[offer]].amount >= baseTrade) {
        this.resources[resourceMap[offer]].amount -= baseTrade;
        this.resources[resourceMap[receive]].amount += 1;
      } else {
        this.$swal("You do not have enough resources for this.");
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
    setFaction(name, color, special, capital) {
      this.playerSettings.faction.name = name;
      this.playerSettings.faction.color = color;
      this.playerSettings.faction.special = special;
      this.playerSettings.faction.capital = capital;
      this.playerSettings.population = 1;
      this.capital.name = this.playerSettings.faction.capital;
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
