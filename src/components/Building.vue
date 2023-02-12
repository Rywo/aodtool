<template>
  <div class="flex w-screen lg:w-full">
    <div class="p-1 py-4 rounded-md shadow-md bg-white grid gap-y-2 w-screen lg:w-full">
      <section className="flex justify-center gap-x-8 max-w-full mx-auto">
      <div className="my-auto text-left ">
      <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">
        {{ type }}
      </h5>
      <h6 class="text-gray-900 font-bold">{{ subject }}</h6>
      </div>
      <img class="h-20" :src="`/assets/img/` + type + `.png`" />
    </section>
      <p class="text-gray-700 text-base">
        This costs the following materials:
      </p>
      <div class="flex justify-center space-x-3">
        <div>
          <h3 class="text-gray-700 text-base mb-2 font-bold">Food</h3>
          <h4 class="text-gray-700 text-base">{{ foodCost }}</h4>
        </div>
        <div>
          <h3 class="text-gray-700 text-base mb-2 font-bold">Wood</h3>
          <h4 class="text-gray-700 text-base">{{ woodCost }}</h4>
        </div>
        <div>
          <h3 class="text-gray-700 text-base mb-2 font-bold">Gold</h3>
          <h4 class="text-gray-700 text-base">{{ goldCost }}</h4>
        </div>
        <div>
          <h3 class="text-gray-700 text-base mb-2 font-bold">Stone</h3>
          <h4 class="text-gray-700 text-base">{{ stoneCost }}</h4>
        </div>
      </div>
      <button
        type="button"
        class="
          inline-block
          px-6
          py-2.5
          bg-blue-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-blue-800 active:shadow-lg
          transition
          duration-150
          ease-in-out
        "
        @click="buyBuilding"
      >
        Buy
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    foodCost: {
      type: Number,
      required: true,
    },
    woodCost: {
      type: Number,
      required: true,
    },
    goldCost: {
      type: Number,
      required: true,
    },
    stoneCost: {
      type: Number,
      required: true,
    },
  },
  methods: {
    buyBuilding() {
      this.$emit(
        "buy-building",
        this.foodCost,
        this.woodCost,
        this.goldCost,
        this.stoneCost,
        this.type
      );
    },
  },
};
</script>