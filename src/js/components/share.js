define(['vue', 'qrcode', 'utils/muiview', 'config/router', 'utils/share'], (Vue, qrcode, muiview, defineRouter, share) => {
  let shareView = () => {
    Vue.component('share-sheet', {
      props: {
        shareopts: Object
      },
      template: `<div :id="idKey" class="mui-popover mui-popover-action mui-popover-bottom">
        <div class="mui-content">
          <ul class="share-list hg-flex flex-wrap">
            <li class="share-item" v-for="item in services" :key="item.key" @tap="doItem(item)">
              <div class="icon" :class="'icon-' + item.key"></div>
              <span class="description">{{item.description}}</span>
            </li>
          </ul>
          <div class="mui-button" @tap="closeSheet">取消</div>
  			</div>
  		</div>`,
      data () {
        return {
          idKey: 'share-sheet',
          services: []
        }
      },
      created () {
        this.getServices()
      },
      methods: {
        getServices () {
          share.getServices((services) => {
            this.services = services
          })
        },
        doItem (item) {
          switch (item.id) {
            case 'copy': {
              muiview.copyToClip(this.shareopts.href)
              break
            }
            case 'qrcode': {
              break
            }
            default: {
              this.goShare(item)
            }
          }
        },
        goShare (item) {
          if (item.scene) {
            this.shareopts.extra = {
              scene: item.scene
            }
          } else {
            delete this.shareopts.extra
          }
          if (item.send && item.send instanceof Function) {
            item.send(this.shareopts, (res) => {
              muiview.toast({
                message: '分享成功',
                onClose: () => {
                  this.closeSheet()
                }
              })
            }, (rej) => {
              console.error('rej', JSON.stringify(rej))
              muiview.toast({
                message: rej.code === -2 ? '已取消分享' : '分享失败',
                onClose: () => {
                  this.closeSheet()
                }
              })
            })
          } else {
            muiview.toast({
              message: '不支持该种分享方式'
            })
          }
        },
        closeSheet () {
          mui('#' + this.idKey).popover('toggle')
        }
      }
    })
  }
  return shareView
})
