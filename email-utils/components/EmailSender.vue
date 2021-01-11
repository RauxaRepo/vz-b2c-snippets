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
        :type="addAttempted && !sendEmail ? 'is-danger' : ''"
        :message="addAttempted && !sendEmail ? 'Email is required' : ''"
      >
        <b-input
          v-model="sendEmail"
          rounded
          placeholder="Email address"
          icon="magnify"
          clearable
        >
        </b-input>
        <b-button class="button merge-button secondary" @click="handleAddEmail">
          Add
        </b-button>
      </b-field>
      <section v-if="emailList.length > 0" class="columns">
        <b-field
          v-for="listItem in emailList"
          :key="listItem.email"
          class="column is-one-third"
        >
          <b-checkbox v-model="listItem.checked">
            {{ listItem.email }}
          </b-checkbox>
          <b-button
            @click="deleteEmail(listItem.email)"
            type="is-danger"
            icon-right="delete"
          />
        </b-field>
      </section>
      <b-field
        :type="
          sendAttempted && this.checkedEmailList.length === 0 ? 'is-danger' : ''
        "
        :message="
          sendAttempted && this.checkedEmailList.length === 0
            ? 'At least one Email is required'
            : ''
        "
      >
        <div class="control">
          <b-checkbox v-model="rememberEmail">
            Remember New Emails
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
      addAttempted: false,
      savedEmails: [],
      emailList: []
    };
  },
  computed: {
    checkedEmailList() {
      return this.emailList.filter(option => option.checked);
    }
  },
  mounted: function() {
    // Saved emails
    this.savedEmails = [];
    try {
      const saveEmailsItem = localStorage.getItem("savedEmails");
      if (saveEmailsItem) {
        this.savedEmails = JSON.parse(saveEmailsItem).savedEmails;
        this.emailList = this.savedEmails.map(email => ({
          checked: true,
          email
        }));
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
    deleteEmail: function(email) {
      this.savedEmails = this.savedEmails.filter(item => item != email);
      this.emailList = this.emailList.filter(item => item.email != email);
    },
    handleSendEmail: function() {
      this.sendAttempted = true;
      if (this.checkedEmailList.length > 0) {
        this.loading = true;
        if (this.rememberEmail) {
          this.savedEmails = [
            ...this.savedEmails,
            ...this.checkedEmailList
              .map(item => item.email)
              .filter(email => !this.savedEmails.includes(email))
          ];
          localStorage.setItem(
            "savedEmails",
            JSON.stringify({
              savedEmails: this.savedEmails
            })
          );
        }
        this.checkedEmailList.forEach(item => {
          axios
            .post("/api/send-email", {
              email: item.email.toLowerCase(),
              name: this.name,
              html: this.html
            })
            .then(response => {
              this.$buefy.toast.open({
                duration: 5000,
                message: `Email successfully sent to ${item.email}!`,
                position: "is-bottom",
                type: "is-success"
              });
            })
            .catch(error => {
              console.log(error);
              this.$buefy.toast.open({
                duration: 5000,
                message: `Error sending the email to ${item.email}`,
                position: "is-bottom",
                type: "is-danger"
              });
            })
            .finally(() => {
              this.loading = false;
              this.isEmailModalActive = false;
            });
        });
      }
    },
    handleAddEmail: function() {
      this.addAttempted = true;
      if (this.sendEmail) {
        this.emailList = [
          {
            checked: true,
            email: this.sendEmail
          },
          ...this.emailList
        ];
        this.sendEmail = "";
        this.addAttempted = false;
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
  .primary {
    margin-bottom: 2rem;
  }
  section.columns {
    border: black dashed 1px;
    padding: 1rem 1rem 0;
    margin: 1rem 0;
    flex-wrap: wrap;
    button {
      background: none;
      color: red;
    }
  }
  .button-container {
    .button {
      max-width: 250px;
      width: 100%;
      margin-bottom: 0;
    }
  }
}
</style>
