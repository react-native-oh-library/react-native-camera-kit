import React from 'react';
import {DeviceEventEmitter} from 'react-native';
import {
  CameraApi,
  CameraProps,
  CaptureData,
  OnCaptureButtonPressInData,
  OnCaptureButtonPressOutData,
  OnError,
  OnOrientationChangeData,
  OnReadCodeData,
  OnZoom,
} from '../types';
import NativeCamera, {CameraCommands} from './CameraKitNativeComponent';

const Camera = React.forwardRef<CameraApi, CameraProps>((props, ref) => {
  const {
    onOrientationChange,
    onZoom,
    onError,
    onReadCode,
    onCaptureButtonPressIn,
    onCaptureButtonPressOut,
    ...rest
  } = props;
  const nativeRef = React.useRef(null);

  const capture = (): Promise<CaptureData> => {
    return new Promise(resolve => {
      const onTaskPhotoListener = DeviceEventEmitter.addListener(
        'onTaskPhoto',
        (data: CaptureData) => {
          resolve(data);
          onTaskPhotoListener.remove();
        },
      );
      if (!nativeRef.current) throw new Error('nativeRef.current is NaN');
      CameraCommands.takePhoto(nativeRef.current);
    });
  };

  const requestDeviceCameraAuthorization = (): Promise<boolean> => {
    return new Promise(resolve => {
      const onRequestDeviceCameraAuthorization = DeviceEventEmitter.addListener(
        'requestDeviceCameraAuthorization',
        (data: boolean) => {
          resolve(data);
          onRequestDeviceCameraAuthorization.remove();
        },
      );
      if (!nativeRef.current) throw new Error('nativeRef.current is NaN');
      CameraCommands.requestDeviceCameraAuthorization(nativeRef.current);
    });
  };

  const checkDeviceCameraAuthorizationStatus = (): Promise<boolean> => {
    return new Promise(resolve => {
      const onCheckDeviceCameraAuthorizationStatus =
        DeviceEventEmitter.addListener(
          'checkDeviceCameraAuthorizationStatus',
          (data: boolean) => {
            resolve(data);
            onCheckDeviceCameraAuthorizationStatus.remove();
          },
        );
      if (!nativeRef.current) throw new Error('nativeRef.current is NaN');
      CameraCommands.checkDeviceCameraAuthorizationStatus(nativeRef.current);
    });
  };

  DeviceEventEmitter.addListener('onZoom', (zoom: OnZoom) => {
    onZoom?.(zoom);
  });
  DeviceEventEmitter.addListener('onError', (error: OnError) => {
    onError?.(error);
  });
  DeviceEventEmitter.addListener(
    'onOrientationChange',
    (orientation: OnOrientationChangeData) => {
      onOrientationChange?.(orientation);
    },
  );
  DeviceEventEmitter.addListener('onReadCode', (code: OnReadCodeData) => {
    onReadCode?.(code);
  });

  DeviceEventEmitter.addListener(
    'onCaptureButtonPressIn',
    (pressIn: OnCaptureButtonPressInData) => {
      onCaptureButtonPressIn?.(pressIn);
    },
  );

  DeviceEventEmitter.addListener(
    'onCaptureButtonPressOut',
    (pressOut: OnCaptureButtonPressOutData) => {
      // 添加事件处理
      onCaptureButtonPressOut?.(pressOut);
    },
  );

  React.useImperativeHandle(ref, () => ({
    capture,
    requestDeviceCameraAuthorization,
    checkDeviceCameraAuthorizationStatus,
  }));

  return (
    <>
      <NativeCamera ref={nativeRef} {...rest} />
    </>
  );
});

export default Camera;
