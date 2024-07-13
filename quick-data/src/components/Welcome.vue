
<template>
  <div class="flex flex-col container mx-auto p-4 justify-center items-center">
    <img :src="logoImage" alt="logo-image" class="w-64 h-64" />
    <p class="font-semibold text-[70px]"> Welcome to Quick Data! </p>
    <p> Please login or sign in to continue. </p>
    <p> This is an application for your data purchase </p>
  </div>
</template>

<script>
import logoImage from '../assets/new_logo.png';
export default {

 name: 'WelcomePlace',
  data() {
    return {
      logoImage
    }
  }
 
}
</script>