<script setup>
import AppFormFieId from "../components/AppFormFieId.vue";
import { ref } from "vue";


const formRef = ref(null);
const test = (value) => {
  console.log("value", value);
  // alert(value);
  formRef.value.resetForm();
};
</script>

<template>
      <!-- <VForm  ref="formRef"  v-slot="{ errors, meta ,resetForm}" @submit="test"> -->
        <VForm ref="formRef" v-slot="{ errors, meta, resetForm }" @submit="test">
        <!-- <VField name="email" type="email" rules="required|email" /> -->
        <!-- <ErrorMessage name="email" class="form-error"/> -->
        <AppFormFieId name="email" lable="email" rules="required|email"></AppFormFieId>
        <!-- <VField name="password" type="password" rules="required|min:6" as="textarea" /> -->
        <VField name="password" type="password" rules="required|min:6" />

        <ErrorMessage name="password" />
        <br/>
        <!-- <VField name="Sex" type="radio" id="one" value="One" rules="required|included:One,Two" /> -->
        <!-- <VField name="Sex" type="radio" id="one" value="One" :rules="(value) => {
            if (value && value.trim()) return true;
            else return 'NO';
          }" />
        <label for="one">One</label>
        <VField name="Sex" type="radio" id="two" value="Two"  />
        <label for="two">Two</label>
        <ErrorMessage name="Sex" /> -->
        <button type="submit" >送出</button>
        <button type="button" @click="resetForm">重設</button>
      </VForm>

      <!-- 也可以寫這樣 -->
      <!-- <VForm
        ref="formRef"
        @submit="test"
        :validation-schema="{
          password: (value) => {
            if (value && value.trim()) return true;
            else return 'NO';
          },
          email: (value) => {
            if (value && value.trim()) return true;
            else return 'NO';
          },
        }"
      >
        <VField name="email" type="email" rules="required|email" />
        <ErrorMessage name="email" />
        <VField name="password" type="password" rules="required|min:6" />
        <ErrorMessage name="password" />
        <button type="submit">送出</button>

        <button type="button" @click="resetForm">重設</button>
      </VForm> -->
</template>
  
  <style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
  