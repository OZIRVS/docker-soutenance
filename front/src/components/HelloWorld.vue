<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
<div class="btn">  
  <button class="boutton">
    cliquez pour test la BDD
  </button>
</div>

</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
.boutton {
  all: unset;
  padding: 10px 20px;
  background: #000;
  color: #fff;
  cursor: pointer;
  border-radius: 20px;
}

.boutton:hover {
  opacity: 0.8;
}
</style>
