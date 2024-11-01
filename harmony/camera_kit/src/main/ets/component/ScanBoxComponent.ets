// 扫码框组件
import { ScanLine } from './ScanLine';

@Component
export struct ScanBoxComponent {
  private mBorderWidth = 1;
  private mRowSize = 40;
  @Prop frameColor: string | Color;
  @Prop laserColor: string | Color;


  build() {
    Stack() {
      // 对焦框
      Flex({ direction: FlexDirection.Column, justifyContent: FlexAlign.SpaceBetween }) {
        Flex({ justifyContent: FlexAlign.SpaceBetween }) {
          Row() {
          }
          .border({
            width: {
              left: this.mBorderWidth,
              top: this.mBorderWidth
            },
            color: this.frameColor,

          })
          .size({ width: this.mRowSize, height: this.mRowSize })

          Row() {
          }
          .border({
            width: {
              right: this.mBorderWidth,
              top: this.mBorderWidth
            },
            color: this.frameColor,

          })
          .size({ width: this.mRowSize, height: this.mRowSize })
        }

        Flex({ justifyContent: FlexAlign.SpaceBetween }) {
          Row() {
          }
          .border({
            width: {
              left: this.mBorderWidth,
              bottom: this.mBorderWidth
            },
            color: this.frameColor,

          })
          .size({ width: this.mRowSize, height: this.mRowSize })

          Row() {
          }
          .border({
            width: {
              right: this.mBorderWidth,
              bottom: this.mBorderWidth
            },
            color: this.frameColor,
          })
          .size({ width: this.mRowSize, height: this.mRowSize })
        }

      }

      ScanLine({ laserColor: this.laserColor})
    }
    .width('75%')
    .height('50%')
    .zIndex(1)
  }
}
