<script setup>
import axios from 'axios'
import { onMounted } from 'vue';


const cja = () => {
  axios.get('api/v1/opendata/t187ap05_P')
    .then((response) => {
      if (response.status == 200) { console.log(response) }
    })
    .catch((error) =>
      console.log(error)
    );
};


// 生命周期钩子
onMounted(() => {
  // console.log(`The initial count is 123.`)
  // cja();
});
</script>


<template>
  <div class="twse">
    <h1>This is an about page</h1>
    <div >
      <p> Dolor enim velit vero sit duis no magna tempor ut nonumy ipsum. Amet sea et gubergren justo eros ipsum
        lobortis
        stet ea sadipscing ipsum at elitr diam accumsan elitr. Ad sit rebum sit. Hendrerit consequat et at amet. No sed
        consectetuer et no tation dolores elitr eros molestie voluptua et est aliquyam ex rebum euismod. Vel facer
        placerat delenit eirmod at ipsum. Eu vel ut duis amet ipsum at ea est eos gubergren in lorem et magna. Luptatum
        nonumy elitr dolores sea zzril dolore at takimata tempor sea iusto luptatum clita. Lobortis facilisis dolore
        sadipscing. Nonumy aliquyam ipsum ut no feugait at nulla ex labore sit tempor accusam sed. Hendrerit ea ad no
        sit.
        Feugiat assum placerat sed dolore duis veniam justo eirmod ea esse voluptua erat kasd dignissim nibh et elitr.
        Lorem est nonumy vero magna justo soluta at congue clita est gubergren invidunt. Erat dolore te aliquyam labore
        sanctus voluptua. Sea ut qui lobortis eos sed stet rebum ut wisi no sed eu.</p>

      <p> Dolor enim velit vero sit duis no magna tempor ut nonumy ipsum. Amet sea et gubergren justo eros ipsum
        lobortis
        stet ea sadipscing ipsum at elitr diam accumsan elitr. Ad sit rebum sit. Hendrerit consequat et at amet. No sed
        consectetuer et no tation dolores elitr eros molestie voluptua et est aliquyam ex rebum euismod. Vel facer
        placerat delenit eirmod at ipsum. Eu vel ut duis amet ipsum at ea est eos gubergren in lorem et magna. Luptatum
        nonumy elitr dolores sea zzril dolore at takimata tempor sea iusto luptatum clita. Lobortis facilisis dolore
        sadipscing. Nonumy aliquyam ipsum ut no feugait at nulla ex labore sit tempor accusam sed. Hendrerit ea ad no
        sit.
        Feugiat assum placerat sed dolore duis veniam justo eirmod ea esse voluptua erat kasd dignissim nibh et elitr.
        Lorem est nonumy vero magna justo soluta at congue clita est gubergren invidunt. Erat dolore te aliquyam labore
        sanctus voluptua. Sea ut qui lobortis eos sed stet rebum ut wisi no sed eu.</p>

      <p> Dolor enim velit vero sit duis no magna tempor ut nonumy ipsum. Amet sea et gubergren justo eros ipsum
        lobortis
        stet ea sadipscing ipsum at elitr diam accumsan elitr. Ad sit rebum sit. Hendrerit consequat et at amet. No sed
        consectetuer et no tation dolores elitr eros molestie voluptua et est aliquyam ex rebum euismod. Vel facer
        placerat delenit eirmod at ipsum. Eu vel ut duis amet ipsum at ea est eos gubergren in lorem et magna. Luptatum
        nonumy elitr dolores sea zzril dolore at takimata tempor sea iusto luptatum clita. Lobortis facilisis dolore
        sadipscing. Nonumy aliquyam ipsum ut no feugait at nulla ex labore sit tempor accusam sed. Hendrerit ea ad no
        sit.
        Feugiat assum placerat sed dolore duis veniam justo eirmod ea esse voluptua erat kasd dignissim nibh et elitr.
        Lorem est nonumy vero magna justo soluta at congue clita est gubergren invidunt. Erat dolore te aliquyam labore
        sanctus voluptua. Sea ut qui lobortis eos sed stet rebum ut wisi no sed eu.</p>

      <p> Dolor enim velit vero sit duis no magna tempor ut nonumy ipsum. Amet sea et gubergren justo eros ipsum
        lobortis
        stet ea sadipscing ipsum at elitr diam accumsan elitr. Ad sit rebum sit. Hendrerit consequat et at amet. No sed
        consectetuer et no tation dolores elitr eros molestie voluptua et est aliquyam ex rebum euismod. Vel facer
        placerat delenit eirmod at ipsum. Eu vel ut duis amet ipsum at ea est eos gubergren in lorem et magna. Luptatum
        nonumy elitr dolores sea zzril dolore at takimata tempor sea iusto luptatum clita. Lobortis facilisis dolore
        sadipscing. Nonumy aliquyam ipsum ut no feugait at nulla ex labore sit tempor accusam sed. Hendrerit ea ad no
        sit.
        Feugiat assum placerat sed dolore duis veniam justo eirmod ea esse voluptua erat kasd dignissim nibh et elitr.
        Lorem est nonumy vero magna justo soluta at congue clita est gubergren invidunt. Erat dolore te aliquyam labore
        sanctus voluptua. Sea ut qui lobortis eos sed stet rebum ut wisi no sed eu.</p>
      <p id="start">
        <a class="" href="#start" aria-label="">#​</a>
        Dolor enim velit vero sit duis no magna tempor ut nonumy ipsum. Amet sea et gubergren justo eros ipsum lobortis
        stet ea sadipscing ipsum at elitr diam accumsan elitr. Ad sit rebum sit. Hendrerit consequat et at amet. No sed
        consectetuer et no tation dolores elitr eros molestie voluptua et est aliquyam ex rebum euismod. Vel facer
        placerat delenit eirmod at ipsum. Eu vel ut duis amet ipsum at ea est eos gubergren in lorem et magna. Luptatum
        nonumy elitr dolores sea zzril dolore at takimata tempor sea iusto luptatum clita. Lobortis facilisis dolore
        sadipscing. Nonumy aliquyam ipsum ut no feugait at nulla ex labore sit tempor accusam sed. Hendrerit ea ad no
        sit.
        Feugiat assum placerat sed dolore duis veniam justo eirmod ea esse voluptua erat kasd dignissim nibh et elitr.
        Lorem est nonumy vero magna justo soluta at congue clita est gubergren invidunt. Erat dolore te aliquyam labore
        sanctus voluptua. Sea ut qui lobortis eos sed stet rebum ut wisi no sed eu.
      </p>

    </div>


  </div>
</template>

<style scoped>
p:nth-child(even) {
  background-color: antiquewhite;
}


@media (min-width: 1024px) {}
</style>
