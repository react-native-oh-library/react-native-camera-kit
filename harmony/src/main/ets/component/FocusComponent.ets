// 曝光选择组件

@Component
export struct FocusComponent {
  @Link focusPointBol: boolean;
  @Link focusPointVal: Array<number>;
  private mBorderWidth = 1.6;
  private mBorderRadius = 10;
  private mRowSize = 20;
  private mFocusPoint = 40;
  private focusFrameSize = 80;
  @Prop frameColor: Color | string;

  build() {
    if (this.focusPointBol) {
      Row() {
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
              radius: { topLeft: this.mBorderRadius }
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
              radius: { topRight: this.mBorderRadius }
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
              radius: { bottomLeft: this.mBorderRadius }
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
              radius: { bottomRight: this.mBorderRadius }
            })
            .size({ width: this.mRowSize, height: this.mRowSize })
          }
        }
        .width(this.focusFrameSize)
        .height(this.focusFrameSize)
        .position({
          x: this.focusPointVal[0] - this.mFocusPoint,
          y: this.focusPointVal[1] - this.mFocusPoint
        })
      }
      .zIndex(1)
    }
  }
}
