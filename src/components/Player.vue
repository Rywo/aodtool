<template>
  <div
    class="px-2 py-8 rounded-3xl bg-slate-900 shadow-lg flex flex-col gap-y-2
    "
  >
    <h1 class="text-gray-500 text-2xl font-bold">Population</h1>
    <div
      class="relative m-auto mt-2 rounded-full w-32 h-32"
      :style="`background-color: ${color}`"
    >
      <span class="absolute top-10 left-[55px] text-4xl text-gray-500">{{
        population
      }}</span>
    </div>
    <h1 class="text-gray-500 text-3xl mt-2">{{ name }}</h1>
    <span>{{ special }}</span>

    <button :style="`background-color: ${color}`" class="w-1/2 m-auto mt-5 text-gray-500" @click="buySpecial">Buy special unit</button>
  </div>
</template>

<script>
export default {
  props: {
    population: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    special: {
      type: String,
      required: true,
    },
    tiles: {
      type: Number,
      required: true,
    },
  },
  methods: {
    buySpecial(){
      this.$emit("buy-special", this.name);
    }
  }
};
</script>