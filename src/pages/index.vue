<template>
  <div>
    <h1>
      Component:
    </h1>
    <VueDateTimePicker
      v-model="date"
    />
  </div>
</template>

<script>
  import VueDateTimePicker from '../VueDateTimePicker'

  export default {
    components: {
      VueDateTimePicker
    },
    data () {
      return {
        date: null
      }
    }
  }
</script>
