<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { POST } from '../scripts/web_helper';

  const router = useRouter();
  let group_name = ref("");

  async function submit_group() {
    let group_data = {
      group_name: group_name.value
    };
    let result = await POST("https://characteristics-metropolitan-analyze-decor.trycloudflare.com/api/create_group", group_data);
    console.log(result);
    router.push("/session/" + group_name.value);
  }
</script>

<template>
  <div class="content">
    <h1>Login</h1>
    <input v-model="group_name" placeholder="Group Name">
    <Transition name="fade">  
      <button v-if="group_name.length > 2" @click="submit_group()">Submit</button>
    </Transition>
  </div>
</template>

<style scoped>
  .content {
    margin-top: 30vh;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  button {
    display: block;
    margin: 15px auto 15px;
    padding: 15px 100px;
    border-style: solid;
    border-radius: 15px;
    text-align: center;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
  }
  button:active {
    background-color: #457299;
    border-color: #457299;
    color: #ffffff;
  }

  input {
    display: block;
    margin: 15px auto 15px;
    padding: 15px 30px;
    border-style: solid;
    border-radius: 15px;
    font-size: 1em;
    font-weight: 500;
    font-family: inherit;
  }
  
</style>
