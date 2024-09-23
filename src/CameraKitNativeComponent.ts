import {
  HostComponent,
  requireNativeComponent,
  ViewProps,  // Fabric
} from 'react-native';
import type {
  BubblingEventHandler,
  DirectEventHandler,
  Int32,
  WithDefault
} from "react-native/Libraries/Types/CodegenTypes";
import codegenNativeCommands from 'react-native/Libraries/Utilities/codegenNativeCommands';
import codegenNativeComponent from "react-native/Libraries/Utilities/codegenNativeComponent";


export type OnButtonClickEventData = Readonly<{
  isButtonClick: boolean,
  type: string,
}>;
export enum FlashMode {
  /**
   * Close mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FLASH_MODE_CLOSE = 0,
  /**
   * Open mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FLASH_MODE_OPEN = 1,
  /**
   * Auto mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FLASH_MODE_AUTO = 2,
  /**
   * Always open mode.
   *
   * @syscap SystemCapability.Multimedia.Camera.Core
   * @since 10
   */
  FLASH_MODE_ALWAYS_OPEN = 3
}

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

export interface NativeCameraProps extends ViewProps {
  flashMode?: WithDefault<0 | 1 | 2 | 3 ,0>;
  zoomMode?: WithDefault<'on' | 'off','on'>;
  torchMode?: WithDefault<'on' | 'off' ,'off'>;
  maxZoom?: Int32; // 允许的最大变焦（但不超过相机允许的范围）。默认： (待定)
  zoom?: Int32; // 变焦倍数 
  cameraType?: WithDefault<'front' | 'back','back'>;//默认后置相机
  scanBarcode?: WithDefault<boolean,false>;
  showFrame?: WithDefault<boolean,false>;
  laserColor?: WithDefault<string,'red'>;
  frameColor?: WithDefault<string,'yellow'>;
  ratioOverlay?: WithDefault<string,'16:9'>;
  ratioOverlayColor?: WithDefault< string,'#ffffff77'>;
  resetFocusTimeout?: WithDefault<Int32,5000>; //自动取消聚焦时间
  resizeMode?: WithDefault<'cover' | 'contain','cover'>;
  scanThrottleDelay?:WithDefault<Int32,3000>; //自动取消聚焦时间
  shutterPhotoSound?: WithDefault<boolean,false>;
  onOrientationChange?: BubblingEventHandler<{ orientation: string }>;
  onZoom?: BubblingEventHandler<{ zoom: Int32 }>;
  onError?: BubblingEventHandler<{ errorMessage: string }>;
  onReadCode?: BubblingEventHandler<{ codeStringValue: string; codeFormat:'code-128'
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
  | 'unknown' }>;
  onCaptureButtonPressIn?: BubblingEventHandler<{ }>;
  onCaptureButtonPressOut?: BubblingEventHandler<{ }>;
  //
  buttonText?: string;
  text?: string,
  onButtonClick?: DirectEventHandler<OnButtonClickEventData>;
}


export default codegenNativeComponent<NativeCameraProps>(
  'RTNCamerakitView',
) as HostComponent<NativeCameraProps>;


// export interface Point 
export type CameraComponentType = HostComponent<NativeCameraProps>
export interface VisionCameraCommandsType {

  takePhoto: (viewRef: React.ElementRef<CameraComponentType>,) => Promise<any>;
  requestDeviceCameraAuthorization: (viewRef: React.ElementRef<CameraComponentType>,) => Promise<boolean>;
  checkDeviceCameraAuthorizationStatus: (viewRef: React.ElementRef<CameraComponentType>,) => Promise<boolean>;
}

export const CameraCommands: VisionCameraCommandsType = codegenNativeCommands<VisionCameraCommandsType>({
  supportedCommands: [
    'takePhoto',
    'requestDeviceCameraAuthorization',
    'checkDeviceCameraAuthorizationStatus'
  ],
});