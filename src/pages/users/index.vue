<template>
  <div>
    <p>In users Page</p>
    {{ $t('apps:abhiraj-demo.menu.dashboard') }}
    
  </div>
</template>
<script>
import { EventBus } from "../../../events";
export default {
  layout: "demo-layout",
  data() {
    return {
      gridData: [],
    };
  },
  mounted() {
    console.log("Grid data in eventbus >>");

    EventBus.$on("gridData", (data) => {
      this.gridData = data;
      console.log("Grid data in eventbus >>", data);
    });
  },
};
</script>
