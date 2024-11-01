import { TurboModule } from '@rnoh/react-native-openharmony/ts';
import { RTNCamerakitModuleSpec } from './types';
import CameraManager from './service/CameraManager'


export class RTNCameraKitTurboModule extends TurboModule implements RTNCamerakitModuleSpec.Spec {
  requestDeviceCameraAuthorization(): Promise<boolean> {
    return CameraManager.requestDeviceCameraAuthorization();
  }
  checkDeviceCameraAuthorizationStatus(): boolean {
    return CameraManager.checkDeviceCameraAuthorizationStatus();
  }
}