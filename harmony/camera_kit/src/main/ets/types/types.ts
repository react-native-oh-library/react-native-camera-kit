/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

export enum CameraType {
  Front = 'front',
  Back = 'back',
}

export type CodeFormat =
  | 'code-128'
    | 'code-39'
    | 'code-93'
    | 'codabar'
    | 'ean-13'
    | 'ean-8'
    | 'itf'
    | 'upc-e'
    | 'qr'
    | 'pdf-417'
    | 'aztec'
    | 'data-matrix'
    | 'unknown';

export type TorchMode = 'on' | 'off';

// export type FlashMode = 'on' | 'off' | 'auto';

// export type FocusMode = 'on' | 'off';

export type ZoomMode = 'on' | 'off';

export type ResizeMode = 'cover' | 'contain';

export type CaptureData = {
  uri: string;
  name: string;
  height: number;
  width: number;
  // Android only
  id?: string;
  path?: string;
  // iOS only
  size?: number;
};

export type CameraApi = {
  capture: () => Promise<CaptureData>;
  requestDeviceCameraAuthorization: () => Promise<boolean>;
  checkDeviceCameraAuthorizationStatus: () => Promise<boolean>;
};


export enum FocusMode {
  /**
   * Manual mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FOCUS_MODE_MANUAL = 0,
  /**
   * Continuous auto mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FOCUS_MODE_CONTINUOUS_AUTO = 1,
  /**
   * Auto mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FOCUS_MODE_AUTO = 2,
  /**
   * Locked mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FOCUS_MODE_LOCKED = 3
}


export type CameraError = {}

export interface BoxSizes {
  centerSize: {
    width: number;
    height: number;
  };
  sideSize: {
    width: number;
    height: number;
  };
}