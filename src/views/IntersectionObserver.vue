<template>
  <div>
    <div v-for="(image, index) in 5" :key="index">
      <img
        :key="index"
        :data-src="`https://picsum.photos/600/400/?random${image}`"
        :ref="setImageRef"
      />
      <p>
        Lorem ipsum dolor sit amet, nec no recteque principes, expetenda
        consectetuer eos ut. Duo eu prima nominati gloriatur, prima noluisse est
        eu. Per enim libris rationibus te, est putent expetendis id. Elit
        phaedrum deseruisse sit et, mel cu vivendo luptatum oporteat. Per
        suscipit vivendum no. Quo te verterem consetetur. Eruditi urbanitas per
        ad, his odio imperdiet et, vidit habeo vocibus sea et. Eu facer
        ullamcorper vim. Consul euismod noluisse id ius, vidit mandamus perpetua
        id mel. Et his autem assum vituperatoribus, his atqui gubergren
        eloquentiam cu, his cu quas cetero. Sed error gloriatur ad. Has eu
        convenire explicari honestatis. Ei eos audiam urbanitas, ludus nostrud
        sed te. An augue interpretaris quo, sint debet ornatus est te, mea
        diceret probatus facilisis et. Et vix labore salutandi. Mei inermis
        vocibus salutandi ut, vitae ridens putant ea has. Malis mollis est ei.
        Te aeque ullamcorper eam. Noster admodum mei cu. Cetero legendos
        inimicus qui an, malis cetero deleniti mei ut, ne est mutat reformidans.
        Mollis dissentiet deterruisset ex duo, vis et dicta menandri. Sumo falli
        intellegat vel an, vocent democritum consequuntur ius id. Est solum
        recusabo ut, an pro incorrupte mediocritatem, simul solet inimicus te
        vis. Vel at copiosae phaedrum, ne nam commodo accusam. Et congue nostrud
        sea, in nec numquam laboramus. Nihil prodesset mnesarchum eum ex, qui ne
        omnesque petentium gubergren.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";


const imageRefs = ref([]);
const setImageRef = (el) => {
  if (el) {
    imageRefs.value.push(el);
  }
};

const observer = ref(null);

onMounted(() => {
  // imageRefs.value = [];
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const dataSrc = img.getAttribute("data-src");
        img.setAttribute("src", dataSrc);
        observer.unobserve(img);
      }
    });
  };
  observer.value = new IntersectionObserver(callback);
  imageRefs.value.forEach((img) => observer.value.observe(img));
});
</script>

<style scoped>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
