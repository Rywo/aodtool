<template>
  <div class="border rounded-xl p-5 flex gap-x-4 w-auto h-min">
    <h2>{{ type }}</h2>
    <h2>{{ amount }}</h2>
    <span class="text-yellow-400 w-max">(+{{ modifier }} per turn)</span>
  </div>
</template>

<script>
export default {
  props: {
    modifier: {
      type: Number,
      required: true,
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
