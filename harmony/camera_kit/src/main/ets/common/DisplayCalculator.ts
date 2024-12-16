/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { Constants } from './Constants';

interface Size {
  width: number,
  height: number
}

export default class DisplayCalculator {
  public static calcSurfaceDisplaySize(screenWidth: number, screenHeight: number, defaultAspectRatio: number): Size {
    const displaySize: Size = {
      width: 1920,
      height: 1080
    };
    if (AppStorage.get<string>('deviceType') === Constants.TABLET || screenWidth > screenHeight) {
      if (screenWidth / screenHeight > defaultAspectRatio) {
        displaySize.width = Math.floor(screenHeight * defaultAspectRatio);
        displaySize.height = Math.floor(screenHeight);
      } else {
        displaySize.width = Math.floor(screenWidth);
        displaySize.height = Math.floor(screenWidth / defaultAspectRatio);
      }
    } else {
      if (screenWidth / screenHeight > defaultAspectRatio) {
        displaySize.width = Math.floor(screenHeight / defaultAspectRatio);
        displaySize.height = Math.floor(screenHeight);
      } else {
        displaySize.width = Math.floor(screenWidth);
        displaySize.height = Math.floor(screenWidth * defaultAspectRatio);
      }
    }
    return displaySize;
  }
}