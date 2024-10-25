<template>
  <div class="content">
   <div v-for="item in 20"  class="focus-item"
        focusable="focusable"
        tabindex="-1"
   >
     {{item}}
   </div>
    <div v-for="item in 20"  class="focus-item" style="width:53px;"
         focusable="focusable"
         tabindex="-1"
    >
      {{item}}
    </div>
    <div>
      <div v-for="item in 10"  class="focus-item" style="width:234px;"
           focusable="focusable"
           tabindex="-1"
      >
        {{item}}
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import FocusControllerJs from "focus-controller-js";
import { nextTick } from "vue";
function onKeyDown(event: KeyboardEvent) {
  // stop page scroll
  event.preventDefault();
}
document.removeEventListener("keydown", onKeyDown);
document.addEventListener("keydown", onKeyDown);

const focusController = new FocusControllerJs();

nextTick(()=>{
  const el = document.querySelector('.focus-item')||undefined
  focusController.setFocus(el)
})

</script>

<style scoped>

.focus-item{
  background-color:grey;
  font-size: 30px;
  display: inline-flex;
  width: 100px;
  height: 100px;
  margin:10px;
  align-items: center;
  justify-content: center;
  border: 5px solid transparent;
}

[focused]{
  border-color: darkseagreen;
}
</style>
