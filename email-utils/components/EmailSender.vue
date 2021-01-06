<template>
  <div>
    <div v-if="!html">
      <h3>Please select your email:</h3>
      <b-field>
        <b-upload drag-drop @input="handleInput">
          <section class="section">
            <div class="content has-text-centered">
              <p>
                <b-icon icon="upload" size="is-large"></b-icon>
              </p>
              <p>Drop your files here or click to upload</p>
            </div>
          </section>
        </b-upload>
      </b-field>
    </div>
    <div v-if="html" class="send-email">
      <b-button
        v-if="!loading"
        class="button merge-button primary"
        @click="html = ''"
      >
        Select other file
      </b-button>
      <b-field
        label="Send email to:"
        :type="sendAttempted && !sendEmail ? 'is-danger' : ''"
        :message="sendAttempted && !sendEmail ? 'Email is required' : ''"
      >
        <b-autocomplete
          v-model="sendEmail"
          rounded
          :data="filteredSavedEmails"
          placeholder="Email address"
          icon="magnify"
          clearable
          @select="option => (selected = option)"
        >
          <template slot="empty">
            <span>No results found</span>
          </template>
        </b-autocomplete>
      </b-field>
      <b-field>
        <div class="control">
          <b-checkbox v-model="rememberEmail">
            Remember Email
          </b-checkbox>
        </div>
      </b-field>
      <div class="button-container">
        <b-button
          v-if="!loading"
          class="button merge-button secondary"
          @click="handleSendEmail"
        >
          Send
        </b-button>

        <b-button v-else loading class="merge-button secondary">
          Loading
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "EmailSender",
  data() {
    return {
      loading: false,
      html: "",
      name: "",
      sendEmail: "",
      rememberEmail: true,
      sendAttempted: false,
      savedEmails: []
    };
  },
  computed: {
    filteredSavedEmails() {
      return this.savedEmails.filter(option =>
        option
          .toString()
          .toLowerCase()
          .includes(this.sendEmail.toLowerCase())
      );
    }
  },
  mounted: function() {
    // Saved emails
    this.savedEmails = [];
    try {
      const saveEmailsItem = localStorage.getItem("savedEmails");
      if (saveEmailsItem) {
        this.savedEmails = JSON.parse(saveEmailsItem).savedEmails;
      }
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    handleInput(file, name) {
      const reader = new FileReader();
      const value = this.value;
      reader.readAsText(file);
      reader.onloadend = () => {
        this.html = reader.result;
        this.name = file.name;
      };
    },
    handleSendEmail: function() {
      this.sendAttempted = true;
      if (this.sendEmail) {
        this.loading = true;
        axios
          .post("/api/send-email", {
            email: this.sendEmail.toLowerCase(),
            name: this.name,
            html: this.html
          })
          .then(response => {
            if (
              this.rememberEmail &&
              !this.savedEmails.includes(this.sendEmail.toLowerCase())
            ) {
              this.savedEmails = [
                ...this.savedEmails,
                this.sendEmail.toLowerCase()
              ];
              localStorage.setItem(
                "savedEmails",
                JSON.stringify({
                  savedEmails: this.savedEmails
                })
              );
            } else {
              this.savedEmails = this.savedEmails.filter(
                email => email !== this.sendEmail.toLowerCase()
              );
              localStorage.setItem(
                "savedEmails",
                JSON.stringify({
                  savedEmails: this.savedEmails
                })
              );
            }
            this.$buefy.toast.open({
              duration: 5000,
              message: "Email successfully sent!",
              position: "is-bottom",
              type: "is-success"
            });
          })
          .catch(error => {
            console.log(error);
            this.$buefy.toast.open({
              duration: 5000,
              message: "Error sending the email",
              position: "is-bottom",
              type: "is-danger"
            });
          })
          .finally(() => {
            this.loading = false;
            this.isEmailModalActive = false;
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
h3 {
  margin-bottom: 1rem;
}
.send-email {
  max-width: 400px;
  .primary {
    margin-bottom: 2rem;
  }
  .button-container {
    text-align: center;
    .button {
      max-width: 250px;
      margin: 0 auto;
      width: 100%;
      margin-bottom: 0;
    }
  }
}
</style>
