<template>
  <div class="flex flex-col items-center min-h-screen">
    <h1 class="text-2xl font-bold mb-4 ">Welcome</h1>
    <button @click="startFlow" class="w-[40%] px-4 py-2 my-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600">
      Buy Data
    </button>

    <button @click="logout" class="absolute right-4 w-[15%] px-4 py-2 my-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600 ">
      Log out
    </button>

    <div class="flex flex-col items-center min-h-screen w-full">
      <h1 class="text-2xl font-bold mb-4 justify-self-start mt-2">Data History</h1>
      <div v-if="userHistory.length === 0">No data History yet </div>
      <div class="container mx-auto p-6 w-[50%]">
        <div v-for="(transaction) in userHistory" :key="transaction._id" class="bg-white shadow-md rounded-lg p-6 mb-6">
          <p class="mb-2"><strong>Data Type:</strong> {{ transaction.dataType }}</p>
          <p class="mb-2"><strong>Date:</strong> {{ transaction.date }}</p>
          <p class="mb-2"><strong>Network:</strong> {{ transaction.network === "1" ? "MTN" : "Other Network" }}</p>
          <p class="mb-2"><strong>Phone Number:</strong> {{ transaction.phoneNumber }}</p>
          <p class="mb-2"><strong>Reference:</strong> {{ transaction.reference }}</p>
          <p class="mb-2"><strong>Status:</strong> <span>{{ transaction.status }}</span></p>
          
        </div>
      </div>
    </div>  

    <!-- Modals for each step -->
    <ModalView v-if="step === 2" title="Select Network" @close="closeModal">
      <div v-for="network in networks" :key="network.networkId">
        <button
          @click.prevent="selectNetwork(network)"
          class="w-full px-4 py-2 my-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
        >
          {{ network.network }}
        </button>
      </div>
    </ModalView>

    <ModalView v-if="step === 3" title="Select Data Type" @close="closeModal">
      <div v-for="dataType in dataTypes" :key="dataType.name">
        <button
          @click.prevent="selectDataType(dataType)"
          class="w-full px-4 py-2 my-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
        >
          {{ dataType.name }}
        </button>
      </div>
    </ModalView>

    <ModalView v-if="step === 4" title="Select Data Plan" @close="closeModal">
      <div v-for="plan in dataPlans" :key="plan.planId">
        <button
          @click.prevent="selectDataPlan(plan)"
          class="w-full px-4 py-2 my-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
        >
          {{ plan.planName }} - {{ plan.price }} NGN
        </button>
      </div>
    </ModalView>

    <ModalView v-if="step === 5" title="Confirm Details" @close="closeModal">
      <p><strong>Network:</strong> {{ selectedNetwork.network }}</p>
      <p><strong>Data Type:</strong> {{ selectedDataType.name }}</p>
      <p><strong>Data Plan:</strong> {{ selectedDataPlan.planName }}</p>
      <div class="mb-4">
        <label class="block mb-1 text-gray-700">Phone Number</label>
        <input
          type="text"
          v-model="phoneNumber"
          class="w-full px-4 py-2 border rounded focus:outline-none focus:ring"
          required
        />
      </div>
      
      <button
        @click.prevent="confirmDetails"
        class="w-full px-4 py-2 text-white bg-blue-500 rounded-xl hover:bg-blue-600"
      >
        Confirm and Get Data
      </button>
    </ModalView>
  </div>
</template>

<script>
import axios from 'axios'
import { useToast } from 'vue-toastification'
import ModalView from './Modal.vue'

export default {
  name: 'DashBoard',
  components: {
    ModalView
  },
  data() {
    return {
      userToken: '',
      userHistory: [],
      step: 1,
      networks: [],
      dataTypes: [],
      dataPlans: [],
      selectedNetwork: null,
      selectedDataType: null,
      selectedDataPlan: null,
      phoneNumber: '',
      API_KEY: process.env.API_KEY, // Replace with your actual API key
      baseUrl: process.env.DATA_URL,
      backendUrl: process.env.BACKEND_URL_FOR_DATA,
    }
  },
  mounted(){
    this.userToken = localStorage.getItem('quick-tkn')
    this.getUserHistory()
  },
  setup() {
    const toast = useToast()
    return { toast }
  },
  methods: {
    generateReference() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      hours = hours % 12 || 12; 
      hours = String(hours).padStart(2, '0');
      return `${year}${month}${day}${hours}${minutes}${seconds}`
    },
    async getUserHistory() {
      console.log(this.userToken)
      const response = await axios.get(`${this.backendUrl}/purchases`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'x-auth-token': `${this.userToken}`
        }
      })
      console.log('User history:', response.data)
      this.userHistory = response.data
    },
    async startFlow() {
      const loadingToast = this.toast.info('Loading networks...', { timeout: false })
      try {
        // First request to get networks
        const networksResponse = await axios.post(`${this.baseUrl}/v1/topup/load/networks`, {
          networks: 'all'
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          }
        })

        console.log('Networks response:', networksResponse.data)
        this.networks = networksResponse.data.data.product
        console.log('Networks:', this.networks)
        this.step = 2

        // Remove loading toast
        this.toast.dismiss(loadingToast)
      } catch (error) {
        // Remove loading toast
        this.toast.dismiss(loadingToast)

        // Show error toast
        this.toast.error('An error occurred while loading networks.')
        console.error('Error loading networks:', error)
      }
    },
    async selectNetwork(network) {
      const loadingToast = this.toast.info('Loading data types...', { timeout: false })
      try {
        this.selectedNetwork = network
        
        console.log('Selected network:', network.networkId)
        // Second request to get data types
        const dataTypesResponse = await axios.post(`${this.baseUrl}/v1/topup/load/data-types`, {
          network: String(network.networkId)
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          }
        })

        console.log('Data types response:', dataTypesResponse.data)
        this.dataTypes = dataTypesResponse.data.data.product
        console.log('Data types:', this.dataTypes)
        this.step = 3

        // Remove loading toast
        this.toast.dismiss(loadingToast)
      } catch (error) {
        // Remove loading toast
        this.toast.dismiss(loadingToast)

        // Show error toast
        this.toast.error('An error occurred while loading data types.')
        console.error('Error loading data types:', error)
      }
    },
    async selectDataType(dataType) {
      const loadingToast = this.toast.info('Loading data plans...', { timeout: false })
      try {
        this.selectedDataType = dataType

        // Third request to get data plans
        const dataPlansResponse = await axios.post(`${this.baseUrl}/v1/topup/load/data`, {
          network: String(this.selectedNetwork.networkId),
          dataType: dataType.name
        }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          }
        })

        console.log('Data plans response:', dataPlansResponse.data)
        this.dataPlans = dataPlansResponse.data.data.product
        console.log('Data plans:', this.dataPlans)
        this.step = 4

        // Remove loading toast
        this.toast.dismiss(loadingToast)
      } catch (error) {
        // Remove loading toast
        this.toast.dismiss(loadingToast)

        // Show error toast
        this.toast.error('An error occurred while loading data plans.')
        console.error('Error loading data plans:', error)
      }
    },
    async selectDataPlan(plan) {
      this.selectedDataPlan = plan
      this.step = 5
    },
    async confirmDetails() {
      const loadingToast = this.toast.info('Submitting final request...', { timeout: false })
      try {
        const payload = {
          network: String(this.selectedNetwork.networkId),
          dataType: this.selectedDataType.name,
          planId: this.selectedDataPlan.planId,
          phone: this.phoneNumber,
          reference: `${this.generateReference()}${new Date().getMilliseconds()}-QUICKDATA` 
        }

        console.log(payload);
        const finalResponse = await axios.post(`${this.baseUrl}/v1/topup/data`, payload, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.API_KEY}`
          }
        })
        console.log('Final response:', finalResponse)

        const backendResponse = await axios.post(`${this.backendUrl}/purchase`, 
          {
            ...payload, 
            status: finalResponse.data.status,
            phoneNumber: this.phoneNumber,
          }, {
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'x-auth-token': `${this.userToken}`
          }
        })

        // Remove loading toast
        console.log('Backend response:', backendResponse)
        this.toast.dismiss(loadingToast)

        // Show success toast
        this.toast.success(finalResponse.data.data.message || 'Your request has been submitted.')
      } catch (error) {
        // Remove loading toast
        this.toast.dismiss(loadingToast)

        // Show error toast
        this.toast.error('An error occurred during the final request.')
        console.error('Error during final request:', error)
      }
    },
    closeModal() {
      this.step = 1
    },
    logout() {
      localStorage.removeItem('quick-tkn')
      this.$router.push('/login')
    }

  }
}
</script>

<style scoped>
/* Add any scoped styles if necessary */
</style>
