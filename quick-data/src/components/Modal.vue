<!-- Modal.vue -->
<template>
  <div class="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
    <div class="bg-white p-4 rounded-lg shadow-lg w-full max-w-md">
      <div class="flex justify-between items-center">
        <h3 class="text-xl font-semibold">{{ title }}</h3>
        <button @click="$emit('close')" class="text-gray-700">&times;</button>
      </div>
      <div class="mt-4">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ModalView',
  props: {
    title: String
  }
}
</script>

<style scoped>
/* Add any scoped styles if necessary */
</style>
