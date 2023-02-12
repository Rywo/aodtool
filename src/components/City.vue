<template>
<div class="flex space-x-5 mb-5">

    <span class="text-xl text-white">{{population}}</span>
    <h3 class="text-xl text-white">{{name}}</h3>
    
    <button @click="increasePopulation">
        Level up ({{ level }})
    </button>
</div>
</template>

<script>

export default {
    props: {
        name: {
            type: String,
            required: true,
        },
        population: {
            type: Number,
            required: true,
        },
        level: {
            type: Number,
            required: true,
        }
    },
    methods: {
        increasePopulation(){
            this.$emit("lvl-city", this.name);
        }
    }
}
</script>