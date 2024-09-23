import Logger from '../common/utils/Logger';
import CameraService from '../service/CameraService';
import { TorchMode } from '../types/types';

const TAG: string = 'TorchComponent';


// 手电筒组件
@Component
export struct TorchComponent {
  // 对焦模式
  @State torchMode: TorchMode = 'off';
  @State torchModeIconResource: Resource = $r("app.media.torch_off");
  @Prop isScan: boolean | undefined;

  // 设置手电筒模式
  setTorchModeChange(): void {
    this.torchMode = this.torchMode === 'off' ? 'on' : 'off';
    Logger.info(TAG, `torchMode: ${this.torchMode}`);
    if (this.isScan) {
      return
    }
    CameraService.setTorchFn(this.torchMode);
    this.torchModeIconResource = this.torchMode === 'on' ? $r("app.media.torch_on") : $r("app.media.torch_off");
  }

  build() {
    Row() {
      Button() {
        Image(this.torchModeIconResource)
          .width($r('app.string.100px'))
          .height($r('app.string.100px'))
          .fillColor($r('app.color.white'))
      }
      .width($r('app.string.200px'))
      .height($r('app.string.200px'))
      .backgroundColor($r('app.color.flash_background_color'))
      .borderRadius($r('app.string.100px'))
      .onClick(() => {
        this.setTorchModeChange()
      })
    }
  }
}