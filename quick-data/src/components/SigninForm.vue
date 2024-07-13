<template>
  <div class="grid grid-col-1 md:grid-cols-2 md:grid-rows-1 grid-rows-2">
    <WelcomePlace />
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-16 space-y-6 bg-white rounded shadow-md">
        <h2 class="text-2xl font-bold text-center">Sign Up</h2>
        <form @submit.prevent="signin">
          <div class="mb-4">
            <label class="block mb-1 text-gray-700">Username</label>
            <input
              type="text"
              v-model="username"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div class="mb-4">
            <label class="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              v-model="email"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <div class="mb-6">
            <label class="block mb-1 text-gray-700">Password</label>
            <input
              type="password"
              v-model="password"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            Sign up
          </button>
        </form>
        <div class="text-center">
          <router-link to="/login" class="text-blue-500 hover:underline">Already have an account? Please Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WelcomePlace from './Welcome.vue'
import { useToast } from 'vue-toastification'
import axios from 'axios'

export default {
  name: 'SigninForm',
  data() {
    return {
      username: '',
      email: '',
      password: '',
    }
  },
  components: {
    WelcomePlace
  },
  methods: {
    async signin() {
      const toast = useToast()
      try {
        const BASE_URL = process.env.BACKEND_BASE_URL;
        const response = await axios.post(`${BASE_URL}/api/users/`, {
          name: this.username,
          email: this.email,
          password: this.password,
        })
        toast.success(response.data.message || 'Sign up successful!')
        this.$router.push('/login')
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            toast.error(err.msg)
          })
        } else {
          console.log(error)
          console.log(error.message)
          toast.error('An error occurred during Sign up.')
        }
      }
    },
  },
}
</script>

<style scoped>
/* Add any scoped styles if necessary */
</style>
