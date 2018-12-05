define(['vue', 'previewimage', 'utils/upload', 'utils/muiview'], (Vue, previewimage, upload, muiview) => {
  let uploadImg = () => {
    Vue.component('upload-img', {
      props: {
        data: {
          type: Array,
          default: []
        },
        config: Object
      },
      template: `<div class="flex flex-wrap img-upload">
        <div class="img-box show-image" :class="{hasimg: item.url}" v-for="(item, index) in data" :key="index">
          <img :src="item.url" data-preview-src="" data-preview-group="1" />
          <div class="delete-round" @click.stop="deleteImg(index)">
            <i class="iconfont icon-del"></i>
          </div>
        </div>
        <div class="img-box add-image" @click="triggerUpload()">
          <i class="el-icon-plus"></i>
        </div>
  		</div>`,
      created () {
        mui.previewImage()
      },
      methods: {
        triggerUpload () {
          upload.choose(this.config.key, (code, res) => {
            if (code > 0) {
              this.data.push(res)
            }
            // this.$emit('uploadafter', code,  this.imgList)
          })
        },
        deleteImg (index) {
          muiview.confirm({
            message: '确定删除此图片？',
            onClose: (code) => {
              if (code) {
                this.data.splice(index, 1)
                // this.$emit('uploadafter', 1,  this.imgList)
              }
            }
          })
        }
      }
    })
  }
  return uploadImg
})
