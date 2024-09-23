import {type ViewProps} from 'react-native';
import {
  CameraType,
  type FlashMode,
  type FocusMode,
  type ZoomMode,
  type TorchMode,
  type ResizeMode,
  type CodeFormat,
} from './types';

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
};
export type OnError = {
  nativeEvent: {
    errorMessage: string;
  };
};

export type OnCaptureButtonPressInData = {
  nativeEvent: {};
};
export type OnCaptureButtonPressOutData = {
  nativeEvent: {};
};

export interface CameraProps extends ViewProps {
  // Behavior
  flashMode?: FlashMode; //闪光灯模式
  focusMode?: FocusMode; //对焦模式
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
  maxZoom?: number; // 允许的最大变焦（但不超过相机允许的范围）。默认： (待定)
  torchMode?: TorchMode; // 手电模式
  cameraType?: CameraType; // 相机类型
  onOrientationChange?: (event: OnOrientationChangeData) => void; // 物理设备方向更改时回调。返回的事件包含   (待定)
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
  onError?: (event: OnError) => void; // 错误信息的回调
  // Barcode only
  scanBarcode?: boolean; // 是否启用扫描模式，默认不启用
  showFrame?: boolean; //  扫码显示帧率(待定)
  laserColor?: string; //  (待定)
  frameColor?: string; //  (待定)
  onReadCode?: (event: OnReadCodeData) => void;  // 扫码成功的回调
  // Specific to iOS
  ratioOverlay?: string;  //相机预览比例 默认16：9
  ratioOverlayColor?: string; //  (待定)
  resetFocusTimeout?: number; //  (待定)
  resetFocusWhenMotionDetected?: boolean; //  (待定) 检测到物体运动自动取消聚焦
  resizeMode?: ResizeMode; //  (待定)
  /** **iOS Only**. Throttle how often the barcode scanner triggers a new scan */
  scanThrottleDelay?: number; //  (待定)
  /** **Android only**. Play a shutter capture sound when capturing a photo */
  shutterPhotoSound?: boolean; //  (待定)
  onCaptureButtonPressIn?: (event: OnCaptureButtonPressInData) => void; //  (待定)
  onCaptureButtonPressOut?: (event: OnCaptureButtonPressOutData) => void; //  (待定)
}
