import { camera } from '@kit.CameraKit';
import Logger from '../common/utils/Logger';
import CameraService from '../service/CameraService';

const TAG: string = 'FlashingLightComponent';


// 闪关灯灯组件
@Component
export struct FlashingLightComponent {
  // 闪光灯模式
  @Link flashMode: camera.FlashMode;
  @State flashIconResource: Resource = $r("app.media.flash_off");

  // 设置闪光灯模式
  setFlashModeChange(): void {
    this.flashMode = (this.flashMode + 1) % 4;
    Logger.info(TAG, `flashMode: ${this.flashMode}`);
    CameraService.setFlashModeFn(this.flashMode)
    switch (this.flashMode) {
      case camera.FlashMode.FLASH_MODE_OPEN:
        this.flashIconResource = $r('app.media.ic_camera_public_flash_on');
        break;
      case camera.FlashMode.FLASH_MODE_AUTO:
        this.flashIconResource = $r('app.media.ic_camera_public_flash_auto');
        break;
      case camera.FlashMode.FLASH_MODE_ALWAYS_OPEN:
        this.flashIconResource = $r('app.media.flash_always_on');
        break;
      case camera.FlashMode.FLASH_MODE_CLOSE:
      default:
        this.flashIconResource = $r('app.media.ic_camera_public_flash_off');
    }
  }

  build() {

    Row() {
      Button() {
        Image(this.flashIconResource)
          .width($r('app.string.100px'))
          .height($r('app.string.100px'))
          .fillColor($r('app.color.white'))
      }
      .width($r('app.string.200px'))
      .height($r('app.string.200px'))
      .backgroundColor($r('app.color.flash_background_color'))
      .borderRadius($r('app.string.100px'))
      .onClick(() => {
        this.setFlashModeChange()
      })
    }
  }
}
