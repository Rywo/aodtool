<template>
  <div class="px-2 py-3 rounded-xl bg-slate-600/50 shadow-md">
    <h1 class="text-sm">Upgrades</h1>

    <div class="grid grid-cols-6 justify-center">
      <div class="mt-2" v-for="(upgrade, idx) in upgrades" :key="idx">
        <el-popover
          placement="bottom"
          :title="upgrade.title"
          :width="200"
          trigger="hover"
        >
          <template #reference>
            <img class="h-12 m-auto bg-orange-300 p-5 rounded-md" />
          </template>
        </el-popover>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    upgrades: {
      type: Array,
    },
  },
  methods: {
    deleteUpgrade(upgrade) {
      this.$emit("delete", upgrade);
    },
  },
};
</script>