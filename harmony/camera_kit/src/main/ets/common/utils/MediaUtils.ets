/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { common } from '@kit.AbilityKit';
import { photoAccessHelper } from '@kit.MediaLibraryKit';
import { fileIo } from '@kit.CoreFileKit';
import Logger from './Logger';

let context = getContext(this) as common.Context;

interface Result {
  prefix: string,
  suffix: string
}

export default class MediaUtils {
  private tag: string = 'MediaUtils';

  public static getInstance() {
    let instance: MediaUtils = new MediaUtils()
    if (instance === undefined) {
      instance = new MediaUtils();
    }
    return instance;
  }

  async createAndGetUri(mediaType: number) {
    let phAccessHelper = photoAccessHelper.getPhotoAccessHelper(context);
    Logger.info(this.tag, `createAndGetUri`);
    let photoType: photoAccessHelper.PhotoType = mediaType;
    let info = this.getInfoFromType(mediaType)
    let extension: string = info.suffix;
    // Return the created media resource.
    return await phAccessHelper.createAsset(photoType, extension)
  }

  async getFdPath(uri: string) {
    let file = fileIo.openSync(uri, fileIo.OpenMode.READ_WRITE);
    let fd = file.fd;
    Logger.info(this.tag, `fd = ${fd}`);
    return fd;
  }

  getInfoFromType(mediaType: number) {
    let result: Result = {
      prefix: '',
      suffix: ''
    };
    switch (mediaType) {
      case photoAccessHelper.PhotoType.IMAGE:
        result.prefix = 'IMG_';
        result.suffix = 'jpg';
        break;
      case photoAccessHelper.PhotoType.VIDEO:
        result.prefix = 'VID_';
        result.suffix = 'mp4';
        break;
    }
    return result;
  }
}