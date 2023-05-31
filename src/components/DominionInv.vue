<template>
  <div
    class="
      px-2
      py-3
      rounded-xl
      bg-slate-600/50
      shadow-md
    "
  >
    <h1 class="text-sm">Dominions taken</h1>

    <div class="grid grid-cols-6 justify-center">
      <div class="mt-2" v-for="(unit, idx) in units" :key="idx">
        <el-popover
          placement="bottom"
          :title="unit.title"
          :width="200"
          trigger="hover"
        >
          <template #reference>
            <img class="h-12 m-auto" :src="`/assets/img/` + unit.name + `.png`" @click="deleteUnit(unit.id)"/>
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    units: {
      type: Array,
    },
  },
  methods: {
    deleteUnit(unit){
      this.$emit("delete", unit)
    }
  }
};
</script>