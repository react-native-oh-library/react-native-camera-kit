/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

import {
  Descriptor as ComponentDescriptor,
  ViewBaseProps,
  ViewRawProps,
  ViewDescriptorWrapperBase,
  ColorValue,
  Color,
  RNInstance,
  Tag,
  RNComponentCommandReceiver,
  ViewPropsSelector,
} from "@rnoh/react-native-openharmony/ts"


export namespace RTNCamerakitViewSpec {
  export const NAME = "RTNCamerakitView" as const

  export interface DirectRawProps {
    flashMode?: 0 | 1 | 2 | 3;
    zoomMode?: 'on' | 'off';
    torchMode?: 'on' | 'off';
    maxZoom?: number;
    zoom?: number;
    cameraType?: 'front' | 'back';
    scanBarcode?: boolean;
    showFrame?: boolean;
    laserColor?: string;
    frameColor?: string;
    ratioOverlay?: string;
    ratioOverlayColor?: string;
    resetFocusTimeout?: number;
    resizeMode?: 'cover' | 'contain';
    scanThrottleDelay?: number;
    shutterPhotoSound?: boolean;
    buttonText?: string;
    text?: string;
  }

  export interface Props extends ViewBaseProps {}

  export interface State {}

  export interface RawProps extends ViewRawProps, DirectRawProps {}

  export class PropsSelector extends ViewPropsSelector<Props, RawProps> {
    get flashMode() {
      return this.rawProps.flashMode ?? 0;
    }

    get zoomMode() {
      return this.rawProps.zoomMode ?? 'on';
    }

    get torchMode() {
      return this.rawProps.torchMode ?? 'off';
    }

    get maxZoom() {
      return this.rawProps.maxZoom ?? 0;
    }

    get zoom() {
      return this.rawProps.zoom ?? 0;
    }

    get cameraType() {
      return this.rawProps.cameraType ?? 'back';
    }

    get scanBarcode() {
      return this.rawProps.scanBarcode ?? false;
    }

    get showFrame() {
      return this.rawProps.showFrame ?? false;
    }

    get laserColor() {
      return this.rawProps.laserColor ?? 'red';
    }

    get frameColor() {
      return this.rawProps.frameColor ?? 'yellow';
    }

    get ratioOverlay() {
      return this.rawProps.ratioOverlay ?? '16:9';
    }

    get ratioOverlayColor() {
      return this.rawProps.ratioOverlayColor ?? '#ffffff77';
    }

    get resetFocusTimeout() {
      return this.rawProps.resetFocusTimeout ?? 5000;
    }

    get resizeMode() {
      return this.rawProps.resizeMode ?? 'cover';
    }

    get scanThrottleDelay() {
      return this.rawProps.scanThrottleDelay ?? 3000;
    }

    get shutterPhotoSound() {
      return this.rawProps.shutterPhotoSound ?? false;
    }

    get buttonText() {
      return this.rawProps.buttonText;
    }

    get text() {
      return this.rawProps.text;
    }
  }

  export type Descriptor = ComponentDescriptor<typeof NAME,
  Props,
  State,
  RawProps>;

  export class DescriptorWrapper extends ViewDescriptorWrapperBase<typeof NAME,
  Props,
  State,
  RawProps,
  PropsSelector> {
    protected createPropsSelector() {
      return new PropsSelector(this.descriptor.props, this.descriptor.rawProps)
    }
  }

  export interface EventPayloadByName {
    "orientationChange": { orientation: string }
    "zoom": { zoom: number }
    "error": { errorMessage: string }
    "readCode": { codeStringValue: string, codeFormat: 'code-128' | 'code-39' | 'code-93' | 'codabar' | 'ean-13' | 'ean-8' | 'itf' | 'upc-e' | 'qr' | 'pdf-417' | 'aztec' | 'data-matrix' | 'unknown' }
    "captureButtonPressIn": {}
    "captureButtonPressOut": {}
    "buttonClick": { isButtonClick: boolean, type: string }
  }

  export class EventEmitter {
    constructor(private rnInstance: RNInstance, private tag: Tag) {
    }

    emit<TEventName extends keyof EventPayloadByName>(eventName: TEventName, payload: EventPayloadByName[TEventName]) {
      this.rnInstance.emitComponentEvent(this.tag, eventName, payload)
    }
  }

  export interface CommandArgvByName {
    "takePhoto": []
    "requestDeviceCameraAuthorization": []
    "checkDeviceCameraAuthorizationStatus": []
  }

  export class CommandReceiver {
    private listenersByCommandName = new Map<string, Set<(...args: any[]) => void>>()
    private cleanUp: (() => void) | undefined = undefined

    constructor(private componentCommandReceiver: RNComponentCommandReceiver, private tag: Tag) {
    }

    subscribe<TCommandName extends keyof CommandArgvByName>(commandName: TCommandName,
      listener: (argv: CommandArgvByName[TCommandName]) => void) {
      if (!this.listenersByCommandName.has(commandName)) {
        this.listenersByCommandName.set(commandName, new Set())
      }
      this.listenersByCommandName.get(commandName)!.add(listener)
      const hasRegisteredCommandReceiver = !!this.cleanUp
      if (!hasRegisteredCommandReceiver) {
        this.cleanUp =
          this.componentCommandReceiver.registerCommandCallback(this.tag, (commandName: string, argv: any[]) => {
            if (this.listenersByCommandName.has(commandName)) {
              const listeners = this.listenersByCommandName.get(commandName)!
              listeners.forEach(listener => {
                listener(argv)
              })
            }
          })
      }

      return () => {
        this.listenersByCommandName.get(commandName)?.delete(listener)
        if (this.listenersByCommandName.get(commandName)?.size ?? 0 === 0) {
          this.listenersByCommandName.delete(commandName)
        }
        if (this.listenersByCommandName.size === 0) {
          this.cleanUp?.()
        }
      }
    }
  }

}
