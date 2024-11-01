import CameraService from '../service/CameraService';
import Logger from '../utils/Logger';

const TAG: string = 'SwitchCamerasComponent';

/*
 * 切换摄像头组件
 * */
@Component
export struct SwitchCamerasComponent {
  @Link cameraDeviceIndex: number
  @Prop surfaceId: string;

  async switchCameraChange(): Promise<void> {
    try {
      let cameraIndex = this.cameraDeviceIndex;
      cameraIndex ? cameraIndex = 0 : cameraIndex = 1;
      this.cameraDeviceIndex = cameraIndex;
      CameraService.initCamera({ cameraDeviceIndex: cameraIndex, surfaceId: this.surfaceId })
    } catch (error) {
      Logger.info(TAG, `flashMode: ${JSON.stringify(error)}`);
    }
  }

  build() {

    Row() {
      Button() {
        Image($r('app.media.switch_camera'))
          .width($r('app.string.100px'))
          .height($r('app.string.100px'))
      }
      .width($r('app.string.200px'))
      .height($r('app.string.200px'))
      .borderRadius($r('app.string.100px'))
      .backgroundColor($r('app.color.flash_background_color'))
      .onClick(async () => {
        this.switchCameraChange()
      })
    }
  }
}