/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import { RNPackage, TurboModulesFactory, } from "@rnoh/react-native-openharmony/ts";
import type { TurboModule, TurboModuleContext, } from "@rnoh/react-native-openharmony/ts";
import { RTNCameraKitTurboModule } from './RTNCameraKitTurboModule';
import { RTNCamerakitModuleSpec, RTNCamerakitViewSpec } from './types';

class RTNCameraKitTurboModulesFactory extends TurboModulesFactory {
  createTurboModule(name: string): TurboModule | null {
    if (name === RTNCamerakitModuleSpec.NAME) {
      return new RTNCameraKitTurboModule(this.ctx);
    }
    return null;
  }

  hasTurboModule(name: string): boolean {
    return name === RTNCamerakitModuleSpec.NAME;
  }
}


export class RTNCameraKitPackage extends RNPackage {
  createTurboModulesFactory(ctx: TurboModuleContext): TurboModulesFactory {
    return new RTNCameraKitTurboModulesFactory(ctx);
  }

  createDescriptorWrapperFactoryByDescriptorType() {
    return {
      [RTNCamerakitViewSpec.NAME]: (ctx) => new RTNCamerakitViewSpec.DescriptorWrapper(ctx.descriptor)
    }
  }
}

