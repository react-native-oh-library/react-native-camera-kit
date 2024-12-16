/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

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