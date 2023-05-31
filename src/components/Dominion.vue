<template>
  <div class="flex w-screen lg:w-full">
    <div
      class="p-1 py-4 rounded-md shadow-md bg-white grid gap-y-2 w-screen lg:w-full"
    >
      <div class="m-auto">
        <img class="h-28" :src="`/assets/img/` + type + `Dominion.png`" />
      </div>
      <section className="flex justify-center gap-x-8 max-w-full mx-auto">
        <div className="my-auto text-left ">
          <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">
            {{ type }}
          </h5>
        </div>
      </section>
      <p class="text-gray-700 text-base">
        This dominion provides {{ subject }}
      </p>
      <button
        type="button"
        class="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
        @click="buyBuilding"
      >
        Take
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
  },
  methods: {
    buyBuilding() {
      this.$emit(
        "buy-building",
        this.type,
      );
    },
  },
};
</script>