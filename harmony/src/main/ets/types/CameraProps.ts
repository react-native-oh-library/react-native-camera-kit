import {
  CameraType,
  type FocusMode,
  type ZoomMode,
  type TorchMode,
  type ResizeMode,
  type CodeFormat,
} from './types';
import { camera } from '@kit.CameraKit';


export const Orientation = {
  PORTRAIT: 0, // ⬆️
  LANDSCAPE_LEFT: 1, // ⬅️
  PORTRAIT_UPSIDE_DOWN: 2, // ⬇️
  LANDSCAPE_RIGHT: 3, // ➡️
};


export type OnReadCodeData = {
  nativeEvent: {
    codeStringValue: string;
    codeFormat: CodeFormat;
  };
};

export type OnOrientationChangeData = {
  nativeEvent: {
    orientation: typeof Orientation;
  };
};

export type OnZoom = {
  nativeEvent: {
    zoom: number;
  };
}

export interface CameraProps{
  // Behavior
  flashMode?: camera.FlashMode; //闪光灯模式
  focusMode?: camera.FocusMode; //对焦模式
  /**
   * Enable or disable the pinch gesture handler
   * Example:
   * ```
   * <Camera zoomMode="on" />
   * ```
   */
  zoomMode?: ZoomMode; //是否启用变焦功能，默认开启
  /**
   * Controls zoom. Higher values zooms in.
   * Default zoom is `1.0`, relative to 'wide angle' camera.
   * Examples of minimum/widest zoom:
   * - iPhone 6S Plus minimum is `1.0`
   * - iPhone 14 Pro Max minimum `0.5`
   * - Google Pixel 7 minimum is `0.7`
   * ## Example
   * ```
   * const [zoom, setZoom] = useState(1.0);
   * <Button onPress={() => setZoom(1.0)} title="Reset" />
   * <Camera
   *   zoom={zoom}
   *   onZoom={(e) => {
   *     setZoom(e.nativeEvent.zoom);
   *     console.log('zoom', e.nativeEvent.zoom);
   *   }}
   * />
   * ```
   */
  zoom?: number; // 变焦倍数
  /**
   * Limits the maximum zoom factor to something smaller than the camera's maximum.
   * You cannot go beyond the camera's maximum, only below.
   * The purpose of limiting zoom is because some modern iPhones report max zoom of 150+
   * which is probably beyond what you want. See documentation for the `zoom` prop for more info.
   * Example:
   * ```
   * <Camera
   *   maxZoom={15.0}
   * />
   * ```
   */
  maxZoom?: number; // 允许的最大变焦（但不超过相机允许的范围）。默认：
  torchMode?: TorchMode;// 手电模式
  cameraType?: CameraType; // 相机类型
  onOrientationChange?: (event: OnOrientationChangeData) => void; // 物理设备方向更改时回调。返回的事件包含
  /**
   * Callback triggered when user pinches to zoom and on startup.
   * Example:
   * ```
   * <Camera
   *   onZoom={(e) => {
   *     console.log('zoom', e.nativeEvent.zoom);
   *   }}
   * />
   * ```
   */
  onZoom?: (event: OnZoom) => void; // 变焦时的回调
  /** **Android only**. Triggered when camera fails to initialize */
  onError?: (event: { nativeEvent: { errorMessage: string } }) => void; // 错误信息的回调
  // Barcode only
  scanBarcode?: boolean; // 是否启用扫描模式，默认不启用
  showFrame?: boolean;
  laserColor?: number | string;
  frameColor?: number | string;
  onReadCode?: (event: OnReadCodeData) => void;
  // Specific to iOS
  ratioOverlay?: string;
  ratioOverlayColor?: number | string;
  resetFocusTimeout?: number;
  resetFocusWhenMotionDetected?: boolean;
  resizeMode?: ResizeMode;
  /** **iOS Only**. Throttle how often the barcode scanner triggers a new scan */
  scanThrottleDelay?: number;
  /** **Android only**. Play a shutter capture sound when capturing a photo */
  shutterPhotoSound?: boolean;
  onCaptureButtonPressIn?: ({ nativeEvent: {} }) => void;
  onCaptureButtonPressOut?: ({ nativeEvent: {} }) => void;
}
