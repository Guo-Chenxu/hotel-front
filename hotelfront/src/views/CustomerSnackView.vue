
<template>
  <div>
    <h2>Customer Snack View</h2>

    <CustomerSnack />
  </div>
</template>

<script>
// @ is an alias to /src
import CustomerSnack from '../components/CustomerSnack.vue'

export default {
  name: 'CustomerSnackView',
  components: {
    CustomerSnack
  }
}
</script>
