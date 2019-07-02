<template>
  <div class="page-header">
    <div class="page-header-index-wide">
      <s-breadcrumb />
    </div>
  </div>
</template>

<script>
import Breadcrumb from '@/components/tools/Breadcrumb';

export default {
  name: 'PageHeader',
  components: {
    's-breadcrumb': Breadcrumb
  }
};
</script>

<style lang="scss" scoped>
.page-header {
  background: #fff;
  padding: 16px 24px 0;
  // padding: 16px 32px 0;
  border-bottom: 1px solid #e8e8e8;

  .breadcrumb {
    margin-bottom: 16px;
  }
}
</style>
