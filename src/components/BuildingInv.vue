<template>
  <div
    class="
      absolute
      left-72
      top-6
      w-96
      h-48
      px-2
      py-3
      rounded-xl
      bg-slate-600/50
      shadow-md
    "
  >
    <h1 class="text-sm">Inventory</h1>

    <div class="flex justify-center">
      <div class="mt-2" v-for="(unit, idx) in units" :key="idx">
        <el-popover
          placement="bottom"
          :title="unit"
          :width="200"
          trigger="hover"
        >
          <template #reference>
            <img class="h-12 m-auto" :src="`/assets/img/` + unit + `.png`" />
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
};
</script>