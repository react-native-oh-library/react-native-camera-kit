/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { Permissions } from '@kit.AbilityKit';

export class Constants {
  static readonly VIDEO_BITRATE: number = 512000;
  static readonly AUDIO_BITRATE: number = 48000;
  static readonly AUDIO_CHANNELS: number = 2;

  /**
   * VIDEO_FRAME.
   */
  static readonly MAX_VIDEO_FRAME: number = 60;
  /**
   * AUDIO_SAMPLE_RATE.
   */
  static readonly AUDIO_SAMPLE_RATE: number = 48000;

  // aspect ratio: width/height
  static readonly MIN_ASPECT_RATIO = 3 / 4; // 预览比例
  // device type
  static readonly TABLET = 'tablet';
  static readonly DEFAULT = 'default';
  static readonly PHONE = 'phone';
  static readonly FULL_WIDTH: string = '100%';
  static readonly FULL_HEIGHT: string = '100%';

  static readonly TACK_PHOTO: string = 'takePhoto';
  static readonly REQUEST_DEVICE_CAMERA_AUTHOR: string = 'requestDeviceCameraAuthorization';
  static readonly CHECK_DEVICE_CAMERA_AUTHOR: string = 'checkDeviceCameraAuthorizationStatus';
  /**
   * The full percentage of component.
   */
  static readonly FULL_PERCENT: string = '100%';
  /**
   * The seventy percent of the components.
   */
  static readonly SEVENTY_PERCENT: string = '70%';
  /**
   * The fifteen percent of the bottom of the margin.
   */
  static readonly FIFTEEN_PERCENT: string = '15%';
  /**
   * Surface width in xComponent.
   */
  static readonly X_COMPONENT_SURFACE_WIDTH = 1920;
  /**
   * Surface height in xComponent.
   */
  static readonly X_COMPONENT_SURFACE_HEIGHT = 1080;
  static readonly PERMISSION_LIST: Array<Permissions> =
    [
      "ohos.permission.CAMERA"
    ]
}
;

export class SettingDataObj {
  mirrorBol = false; // Mirror Enable -> Off
  videoStabilizationMode = 0; // Video Anti Shake -> Off
  exposureMode = 1; // Exposure mode -> Automatic
  focusMode = 2; // 2:Focus mode -> Automatic
  photoQuality = 1; // Photo quality -> medium
  locationBol = false; // Show Geographic Location -> Off
  photoFormat = 1; // Photo Format -> JPG
  photoOrientation = 0; // Photo direction -> 0
  photoResolution = 0; // Photo resolution -> 1920 * 1080
  videoResolution = 0; // Photo resolution -> 1920 * 1080
  videoFrame = 0; // Recording frame rate -> 15
  referenceLineBol = false; // Divider -> Off
}
;