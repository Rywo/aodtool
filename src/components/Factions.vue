<template>
  <div class="p-4 hover:scale-105 duration-500" @click="pickFaction">
    <div class="flex items-center justify-between p-4 rounded-lg bg-slate-800">
      <div>
        <h2 class="text-gray-900 text-lg font-bold" :style="`color: ${color}`">
          {{ name }}
        </h2>
        <h3 class="mt-2 text-xl font-bold text-left" :style="`color: ${color}`">
          {{ special }}
        </h3>
        <p class="text-sm font-semibold text-gray-50">
          {{ desc }}
        </p>
        <div class="p-2">
          <el-tag
            v-for="tag in tags"
            :key="tag.name"
            :type="tag.kind"
            size="large"
            class="mr-6"
            >{{ tag.name }}</el-tag
          >
        </div>
      </div>
      <div
        class="w-32 h-32 rounded-full flex justify-center items-center"
        :style="`background-color: ${color}`"
      >
        <div>
          <h1 class="text-slate-800 text-2xl">{{ name }}</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true,
    },
    special: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    tags: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    pickFaction() {
      this.$emit("pick-faction", this.name, this.color, this.special);
    },
  },
};
</script>