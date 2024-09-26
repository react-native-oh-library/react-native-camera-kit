//比例叠加视图组件
import { BoxSizes } from '../types';

interface ViewSize {
  width: number;
  height: number;
}

@Component
export struct RatioOverlayView {
  @Prop ratioOverlayColor: string | Color = Color.Black
  @Prop viewSize: BoxSizes
  @Prop displayHeight: number;
  @Prop displayWidth: number;

  build() {
    Flex({ direction: FlexDirection.Column }) {
      //topView
      Column() {
      }
      .width(this.viewSize.sideSize.width)
      .height(this.viewSize.sideSize.height)
      .backgroundColor(this.ratioOverlayColor)
      .opacity(0.3)

      //centerView
      Column() {
      }
      .width(this.viewSize.centerSize.width)
      .height(this.viewSize.centerSize.height)

      // .backgroundColor(Color.White)

      //bottomView
      Column() {
      }
      .width(this.viewSize.sideSize.width)
      .height(this.viewSize.sideSize.height)
      .backgroundColor(this.ratioOverlayColor)
      .opacity(0.3)
    }
    .height(this.displayHeight)
    .width(this.displayWidth)
  }
}
