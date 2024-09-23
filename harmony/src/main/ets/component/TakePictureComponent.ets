import Logger from '../common/utils/Logger';
import CameraService from '../service/CameraService';


const TAG: string = 'TakePictureComponent';


// 拍照组件
@Component
export struct TakePictureComponent {
  build() {
    Row() {
      Button() {
        Text()
          .width($r('app.string.120px'))
          .height($r('app.string.120px'))
          .borderRadius($r('app.string.40px'))
          .backgroundColor(Color.White)
      }
      .border({
        width: 3,
        color: $r('app.color.border_color'),
        radius: 70
      })
      .width($r('app.string.200px'))
      .height($r('app.string.200px'))
      .backgroundColor(Color.Black)
      .onClick(async () => {
        Logger.info(TAG, 'start TakePicture')
        CameraService.takePicture()
      })
    }
  }
}