import PermissionUtils from '../utils/PermissionUtils'
import { Constants } from '../common/Constants';
import Logger from '../utils/Logger'

/*
 * 相机管理器
 * */

const TAG: string = 'CameraManager';

class CameraManager {
  constructor() {
    Logger.info(TAG, 'checkDeviceCameraAuthorizationStatus')
  }

  /*
   * 检查相机权限
   * */
  checkDeviceCameraAuthorizationStatus(): boolean {
    let status = false;
    Logger.info(TAG, 'checkDeviceCameraAuthorizationStatus')
    try {
      status = PermissionUtils.checkPermission(Constants.PERMISSION_LIST[0]);
      Logger.info(TAG, `checkDeviceCameraAuthorizationStatus-success`)
    } catch (error) {
      Logger.error(TAG, `checkDeviceCameraAuthorizationStatus-fail：${JSON.stringify(error)}`)
    }
    return status;
  }

  /*
   * 请求设备摄像头授权
   * */
  async requestDeviceCameraAuthorization() {
    let status = false;
    Logger.info(TAG, 'requestDeviceCameraAuthorization')
    try {
      status = await PermissionUtils.grantPermission([Constants.PERMISSION_LIST[0]]);
    } catch (error) {
      Logger.error(TAG, `requestDeviceCameraAuthorization-fail：${JSON.stringify(error)}`)
    }
    return status
  }
}

export default new CameraManager();