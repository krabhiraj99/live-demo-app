<template>
  <div v-if="isShow">In kendo Event Bus</div>
</template>
<script>
import { EventBus } from "../../events";
export default {
  name: "kendo-event-bus",
  components: {},
  mixins: [],
  props: {},
  data() {
    return {
      isShow: false,
    };
  },
  computed: {},
  watch: {},
  mounted() {
    EventBus.$on("isShow", (val) => {
      this.isShow = val;
    });
  },
  methods: {},
};
</script>
<style lang="" scoped></style>
