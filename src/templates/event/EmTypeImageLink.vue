<template>
  <div class="event-preview">
    <div
      v-for="group in imageLinkGroups"
      :key="group.id"
      :ref="`image-group-${group.id}`"
      class="image-group"
    >
      <a href="#" @click.prevent style="display:block;">
        <template v-for="(img, imgIdx) in group.images">
          <div
            v-if="img.url"
            :key="img.id"
            :ref="`img-item-${group.id}-${img.id}`"
            class="image-item"
            :class="{ 'image-container-highlighted': selectedImageInfo && selectedImageInfo.imageId === img.id }"
            @click.stop="$emit('select-image', { groupId: group.id, imageId: img.id, imgIndex: imgIdx })"
          >
            <img
              :src="img.url"
              :alt="img.alt || ''"
              class="group-image"
            />
          </div>
        </template>
      </a>
    </div>
  </div>
</template>

<script>
import imageHighlightMixin from '../../utils/imageHighlightMixin'

export default {
  name: 'EmTypeImageLink',
  mixins: [imageHighlightMixin],
  props: {
    data: {
      type: Object,
      required: true
    },
    deviceType: {
      type: String,
      default: 'web'
    },
    selectedId: {
      type: [Number, String],
      default: null
    },
    selectedImageInfo: {
      type: Object,
      default: () => ({ groupId: null, imageId: null })
    }
  },
  computed: {
    imageLinkGroups() {
      return this.data.imageLinkGroups || []
    }
  },
  watch: {
    'selectedImageInfo.timestamp'(val) {
      if (!val) return
      const info = this.selectedImageInfo
      if (!info || !info.groupId || !info.imageId) return
      this.scrollToImageByRef(`img-item-${info.groupId}-${info.imageId}`)
      this.startHighlightTimer(2000)
    }
  }
}
</script>

<style scoped>
.event-preview {
  width: 100%;
}

.image-group {
  width: 100%;
  position: relative;
}

.image-group a {
  display: block;
  width: 100%;
}

.image-item {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.group-image {
  width: 100%;
  display: block;
}
</style>
