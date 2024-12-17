/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */


import { Tag } from "@rnoh/react-native-openharmony/ts"

export namespace RTNCamerakitModuleSpec {
  export const NAME = 'RTNCamerakit' as const

  export interface Spec {
    requestDeviceCameraAuthorization(): Promise<boolean>;

    checkDeviceCameraAuthorizationStatus(): boolean;

  }
}
