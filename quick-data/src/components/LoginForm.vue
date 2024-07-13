<template>
  <div class="grid grid-cols-1 md:grid-cols-2 grid-rows-2 md:grid-rows-1">
    <WelcomePlace />
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="w-full max-w-md p-16 space-y-6 bg-white rounded shadow-md">
        <h2 class="text-2xl font-bold text-center">Login</h2>
        <form @submit.prevent="login">
          <div class="mb-4">
            <label class="block mb-1 text-gray-700">Email</label>
            <input
              type="email"
              icon="mail"
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
              icon="lock"
              class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
              required
            />
          </div>
          <button
            type="submit"
            class="w-full px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
          >
            Login
          </button>
        </form>
        <div class="text-center">
          <router-link to="/signin" class="text-blue-500 hover:underline">Don't have an account? Sign in</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WelcomePlace from './Welcome.vue';
import axios from 'axios'
import { useToast } from 'vue-toastification'

export default {
  name: 'LoginForm',
  data() {
    return {
      email: '',
      password: '',
    }
  },
  components: {
    WelcomePlace
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    async login() {
      try {
        const BASE_URL = process.env.BACKEND_BASE_URL;
        const response = await axios.post(`${BASE_URL}/api/auth`, {
          email: this.email,
          password: this.password
        })

        localStorage.setItem('quick-tkn', response.data.token);
        
        this.toast.success(response.data.message || 'Login successful!')
        this.$router.push('/dashboard')
      } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
          error.response.data.errors.forEach(err => {
            this.toast.error(err.msg)
          })
        } else {
          this.toast.error('An error occurred during login.')
        }
      }
    }
  }
}
</script>

<style scoped>
/* Add any scoped styles if necessary */
</style>
