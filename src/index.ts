import Camera from './Camera';

import {
  CameraType,
  type CameraApi,
  type CaptureData,
  type FlashMode,
  type FocusMode,
  type TorchMode,
  type ZoomMode,
  type ResizeMode,
} from '../types';

export const Orientation = {
  PORTRAIT: 0, // ⬆️
  LANDSCAPE_LEFT: 1, // ⬅️
  PORTRAIT_UPSIDE_DOWN: 2, // ⬇️
  LANDSCAPE_RIGHT: 3, // ➡️
};

export {Camera, CameraType};
export type {
  TorchMode,
  FlashMode,
  FocusMode,
  ZoomMode,
  CameraApi,
  CaptureData,
  ResizeMode,
};

export default Camera;