<template>
  <div class="border rounded-xl px-5 py-2.5 flex gap-x-1 w-auto h-min bg-gray-800">
    <h2>{{ type }}</h2>
    <h2>{{ amount }}</h2>
    <span class="text-yellow-400 w-max">(+{{ modifier }} per turn)</span>
    <!-- <span class="text-red-400 w-max" v-if="type === 'Gold'">(-{{ buildingUpkeep }} per turn)</span>
    <span class="text-red-400 w-max" v-if="type === 'Food'">(-{{ unitUpkeep }} per turn)</span> -->
  </div>
</template>

<script>
export default {
  props: {
    modifier: {
      type: Number,
      required: true,
    },
    unitUpkeep: {
      type: Number,
      default: 0,
    },
    buildingUpkeep: {
      type: Number,
      default: 0,
    },
    type: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
};
</script>