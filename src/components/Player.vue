<template>
  <div
    class="
      absolute
      left-6
      top-6
      px-2
      py-3
      w-52
      h-96
      rounded-3xl
      border-
      bg-slate-900
      shadow-lg
    "
  >
    <h1 class="text-gray-500 text-base mt-2">Population</h1>
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
};
</script>