<template>
  <div>
    <!-- <p>In Kendo Grid</p> -->
    <nuxt-link :to="'/apps/abhiraj-demo/users'" class="nav-link">
      Users Page
    </nuxt-link>
    <button @click="handleClick">Show Component</button>
    <div>
      <KendoEventBus />
    </div>
    <k-grid
      :style="{ height: 'calc(100vh - 100px)' }"
      :data-items="gridData"
      :columns="gridColumn"
      :row-render="rowRender"
      :loader="isLoading"
    >
    </k-grid>
    <k-popup :show="show" :offset="currentOffset">
      <k-menu
        :items="contextMenuItems"
        :hover-open-delay="0"
        :hover-close-delay="300"
        :vertical="true"
        @select="onSelect"
      >
      </k-menu>
    </k-popup>
  </div>
</template>
<script>
import KendoEventBus from "../../components/KendoEventBus.vue";
import { EventBus } from "../../../events";
export default {
  name: "gridTable",
  layout: "kendo-layout",
  components: { KendoEventBus },

  computed: {
    currentOffset() {
      return this.offSet;
    },
  },
  data() {
    return {
      isShow: false,
      isLoading: false,
      show: false,
      offSet: {
        left: 0,
        top: 0,
      },
      gridData: [],
      contextMenuItems: [{ text: "GenerateBookmarkURL" }, { text: "Delete" }],
      gridColumn: [
        { field: "ORNO", title: "ORNO" },
        { field: "ORTP", title: "ORTP" },
        { field: "CUNO", title: "CUNO" },
        { field: "CUNM", title: "CUNM" },
        { field: "ORSL", title: "ORSL" },
        { field: "ORST", title: "ORST" },
        { field: "WHLO", title: "WHLO" },
        { field: "RLDZ", title: "RLDZ" },
      ],
    };
  },
  async mounted() {
    this.gridData = await this.getGridData();
    document.addEventListener(
      "click",
      function () {
        this.show = false;
      }.bind(this)
    );
  },
  methods: {
    handleClick() {
      console.log("In handle click");
      this.isShow = !this.isShow;
      EventBus.$emit("isShow", this.isShow);
    },
    async getGridData() {
      this.isLoading = true;
      console.log("In getGridData");
      let gridDataAPI = {
        program: "MWZ420MI",
        maxReturnedRecords: 100,
        transactions: [
          {
            transaction: "LstPLAReleaseDL",
            record: {
              KPID: "VPP",
              WHLO: "002",
              LTEQ: 3,
            },
          },
        ],
      };
      console.log(
        "this.$postExec(gridDataAPI) >>",
        await this.$postExec(gridDataAPI)
      );
      let userDetails = await this.$postExec(gridDataAPI)
        .then((response) => {
          console.log("Get USer response >>", response);
          this.isLoading = false;
          return response.results[0].records;
        })
        .catch((err) => {
          console.error("Get USer error", err);
          this.isLoading = false;
        });
      console.log("userDetails postExec>>", userDetails);
      return userDetails;
    },
    editItem(e) {
      // Handle edit action
      console.log("Edit item:", e);
    },
    deleteItem(e) {
      // Handle delete action
      console.log("Delete item:", e);
    },
    handleContextMenu(e, dataItem) {
      e.preventDefault();
      console.log("In context menu dataItem", dataItem);
      console.log("In context menu e", e);
      this.offSet = {
        left: e.clientX,
        top: e.clientY,
      };
      this.show = true;
    },
    onSelect(e) {
      console.log("E", e);
      if (e.item.text === "GenerateBookmarkURL") {
        console.log("Generating bookmark url");
        const bookmarkData = {
          program: "MMS002",
          tablename: "MITBAL",
          keys: {
            MBCONO: "this.usr.CONO",
            MBWHLO: "selectedItem.WHLO",
            MBITNO: "selectedItem.ITNO",
          },
          option: 5,
          panel: "E",
          source: "MForms",
        };
        console.log("bookmarkData: ", bookmarkData);
        const url = this.$generateBookmarkURLGeneric(bookmarkData);
        console.log("bookmarkData URLLLLLL: ", url);
        const close = window.parent.document.getElementById("close");
        if (close) {
          close.click();
        }
        window.parent.launchTask(url);
      }
    },
    rowRender(h, trElement, defaultSlots, props) {
      const contextRow = h(
        "tr",
        {
          on: {
            contextmenu: (e) => this.handleContextMenu(e, props.dataItem),
          },
        },
        defaultSlots
      );
      return contextRow;
    },
  },
};
</script>
