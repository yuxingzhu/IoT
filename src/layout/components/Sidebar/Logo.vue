<template>
  <div class="sidebar-logo-container" :class="{ collapse: collapse }">
    <transition name="sidebarLogoFade">
      <router-link
        v-if="collapse"
        key="collapse"
        class="sidebar-logo-link"
        to="/"
      >
        <img v-if="logo" :src="logoPic" class="sidebar-logo" />
        <h1 v-else class="sidebar-title" style="margin-left: -11px"></h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logoPic" class="sidebar-logo" />
        <h1 class="sidebar-title" style="margin-left: -11px">
          {{ titleName }}
        </h1>
      </router-link>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getList } from "@/api/overall";
import Cookies from "js-cookie";
export default {
  name: "SidebarLogo",
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    setLogo() {
      return this.$store.state.settings.setLogo;
    },
    title() {
      return this.$store.state.user.titleName;
    },
  },
  data() {
    return {
      logo: false,
      titleName: "AloT平台",
      logoPic: '/eco_ftp/' + 'logo.png'
    };
  },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      getList().then((response) => {
        if (response.success) {
          this.titleConfig = response.data;
          this.logo = this.titleConfig.showIcon;
        } else {
          this.logo = "";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #2b2f3a;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 700;
      line-height: 50px;
      font-size: 15px;
      font-family: "Microsoft YaHei", Avenir, Helvetica Neue, Arial, Helvetica,
        sans-serif;
      vertical-align: middle;
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: -5px;
    }
  }
}
</style>
