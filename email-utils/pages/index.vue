<template>
  <section class="section">
    <EmailSender />
  </section>
</template>

<script>
import EmailSender from '~/components/EmailSender'

export default {
  name: 'HomePage',

  components: {
    EmailSender
  }
}
</script>
