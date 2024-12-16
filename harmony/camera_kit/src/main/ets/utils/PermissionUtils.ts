/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import abilityAccessCtrl, { Context, PermissionRequestResult } from '@ohos.abilityAccessCtrl';
import { Permissions } from '@ohos.abilityAccessCtrl';
import bundleManager from '@ohos.bundle.bundleManager';
import Logger from './Logger';
import common from '@ohos.app.ability.common';
import { JSON } from '@kit.ArkTS';

const TAG: string = 'PermissionUtils'
declare function getContext(component?: Object): Context;

class PermissionUtils {
  private atManager: abilityAccessCtrl.AtManager;
  private context: common.Context;

  constructor() {
    this.context = getContext(this);
    this.atManager = abilityAccessCtrl.createAtManager();
  }

  checkPermission(permission: Permissions): boolean {
    Logger.info(TAG, `checkAccessToken ${permission} begin`);
    let bundleInfo: bundleManager.BundleInfo = bundleManager.getBundleInfoForSelfSync(
      bundleManager.BundleFlag.GET_BUNDLE_INFO_WITH_APPLICATION
    )
    let appInfo: bundleManager.ApplicationInfo = bundleInfo.appInfo;
    let tokenId = appInfo.accessTokenId;
    let state = this.atManager.checkAccessTokenSync(tokenId, permission);
    Logger.info(TAG, `checkAccessToken permission:${permission} = ${JSON.stringify(state)}`);
    return state === abilityAccessCtrl.GrantStatus.PERMISSION_GRANTED;
  }

  grantPermission(permission: Array<Permissions>): Promise<boolean> {
    return new Promise((resolve, reject) => {
      Logger.info(TAG, `grantPermission ${JSON.stringify(permission)} begin`);
      this.atManager.requestPermissionsFromUser(this.context, permission)
        .then((data: PermissionRequestResult) => {
          Logger.info(TAG,
            `grantPermission  grantPermission ${JSON.stringify(permission)} : ${JSON.stringify(data.authResults)}`);
          resolve(data?.authResults[0] === 0)
        }).catch(() => {
        Logger.error(TAG, `grantPermission-ERROR :`);
        reject(false)
      })
    });

  }
}

export default new PermissionUtils()