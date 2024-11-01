// 扫码会话


import { customScan, scanBarcode, scanCore } from '@kit.ScanKit';
import Logger from '../utils/Logger'
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { common, Context } from '@kit.AbilityKit';
import { RNOHContext } from '@rnoh/react-native-openharmony/ts';
import { CameraProps, TorchMode, ZoomMode } from '../types';
import { isEmptyValue } from '../utils/utils';
import { camera } from '@kit.CameraKit';

const TAG = 'ScanSession';

declare function getContext(component?: Object): Context;

class ScanService {
  private ctx?: RNOHContext;
  private context: common.Context | undefined = getContext(this);
  private maxZoom: number | undefined = 10; //最大缩放值
  private minZoom: number | undefined = 0.5; //最大缩放值
  private zoomMode: ZoomMode = 'on';
  public isScanLine: boolean = false;
  public isStopCamera: boolean = false;
  private initSuccess: boolean = false;

  constructor() {
  }

  setCtx(ctx: RNOHContext) {
    this.ctx = ctx;
  }

  /**
   * 初始化扫描仪
   */
  scanInit(initConfig: {
    options: scanBarcode.ScanOptions, viewControl: customScan.ViewControl,
    getResultCallback: AsyncCallback<Array<scanBarcode.ScanResult>>,
    initSuccessCallBack?: () => void
  }) {
    const { options, viewControl, getResultCallback, initSuccessCallBack } = initConfig
    this.scanRelease();
    Logger.info(TAG, `initScan types:${JSON.stringify(options)}`);
    this.isScanLine = true;
    try {
      customScan.init(options);
      this.initSuccess = true;
      initSuccessCallBack?.();
      Logger.info(TAG, `initScan-success-初始化扫描成功`);
    } catch (error) {
      Logger.error(TAG, `init fail,初始化扫面失败 error:${JSON.stringify(error)}`);
      this.onError(`init fail, error:${JSON.stringify(error)}`)
    }
    this.scanStart(viewControl, getResultCallback);
    Logger.info(TAG, 'initCamera end');
  }

  initProps(props: CameraProps) {
    Logger.info(TAG, `CameraProps:${JSON.stringify(props)}`)
    const { zoom, maxZoom, torchMode, flashMode, zoomMode } = props;
    if (!this.initSuccess) {
      return
    }
    if (!isEmptyValue(zoom)) {
      this.setZoomFn(zoom)
    }
    if (!isEmptyValue(maxZoom)) {
      this.maxZoom = maxZoom;
    }
    if (!isEmptyValue(zoomMode)) {
      this.zoomMode = zoomMode;
    }
    if (!isEmptyValue(torchMode)) {
      this.setTorchFn(torchMode)
    }
    if (isEmptyValue(torchMode) && !isEmptyValue(flashMode)) {
      this.setFlashMode(flashMode)
    }
  }

  setFlashMode(flashMode: camera.FlashMode) {
    try {
      if (flashMode === 3) {
        customScan.openFlashLight();
      } else {
        customScan.closeFlashLight();
      }
    } catch (error) {
      Logger.error(TAG, `The setflashMode call failed. error code: ${error.code}.`);
      this.onError(`The setflashMode call failed. error code: ${error.code}.`)
    }
  }

  /*
   * 启动相机进行扫码
   */
  public scanStart(viewControl: customScan.ViewControl,
    callback: AsyncCallback<Array<scanBarcode.ScanResult>>): void {
    try {
      Logger.info(TAG, 'Start to start camera.');
      this.isStopCamera = false;
      customScan.start(viewControl, callback);
    } catch (error) {
      Logger.error(TAG, `Failed to start customScan. Code: ${error.code}`);
    }
  }


  /*
 * 关闭扫码
 */
  scanStop() {
    if (this.isStopCamera) {
      return
    }
    this.setTorchFn('off')
    this.isScanLine = false;
    this.isStopCamera = true;
    try {
      customScan.off('lightingFlash');
    } catch (error) {
      Logger.error(TAG, `Failed to off lightingFlash. Code: ${error.code}, message: ${error.message}`);
      this.onError(`Failed to off lightingFlash. Code: ${error.code}, message: ${error.message}`)
    }
    try {
      customScan.stop().then(() => {
        Logger.info(TAG, 'stop success!');
      }).catch((error: BusinessError) => {
        Logger.error(TAG, `stop try failed error: ${JSON.stringify(error)}`);
      })
    } catch (error) {
      Logger.error(TAG, `stop catch failed error: ${JSON.stringify(error)}`);
    }
  }

  onZoom(zoom: number) {
    Logger.info(TAG, `emitDeviceEvent onZoom`)
    if (this.ctx) {
      this.ctx.rnInstance?.emitDeviceEvent('onZoom', {
        nativeEvent: {
          zoom: zoom
        }
      });
    }
  }

  onError(message: string) {
    Logger.info(TAG, `emitDeviceEvent onError`)
    if (this.ctx) {
      this.ctx.rnInstance?.emitDeviceEvent('onError', {
        nativeEvent: {
          errorMessage: `${TAG}:${message}`
        }
      });
    }
  }

  // 设置变焦比
  setZoomFn(zoomValue: number) {
    Logger.info(TAG, `setZoom:${JSON.stringify(zoomValue)}`);
    const currentZoom = customScan.getZoom();
    if (currentZoom === zoomValue) {
      return;
    }
    if (this.zoomMode === 'off') {
      return;
    }
    if (this.maxZoom && this.maxZoom <= zoomValue) {
      zoomValue = this.maxZoom
    }
    if (zoomValue <= this.minZoom) {
      zoomValue = this.minZoom;
    }
    try {
      customScan.setZoom(zoomValue);
      this.onZoom(zoomValue)
    } catch (error) {
      Logger.error(TAG, `The setZoom call failed. error code: ${error.code}.`);
      this.onError(`The setZoom call failed. error code: ${error.code}.`)
    }
  }

  getZoomFn(): number {
    try {
      return customScan.getZoom();
    } catch (error) {
      Logger.error(TAG, `The getZoom call failed. error code: ${error.code}.`);
      this.onError(`The getZoom call failed. error code: ${error.code}.`)
    }
  }

  /**
   * 设置焦点
   */
  setFocusPointFn(point: scanBarcode.Point): void {
    // 设置焦点
    try {
      customScan.setFocusPoint(point);
      Logger.info(TAG, `setFocusPoint success point: ${JSON.stringify(point)}`);
    } catch (error) {
      Logger.error(TAG, `The setFocusPoint call failed. error code: ${error.code}.`);
      this.onError(`The setFocusPoint call failed. error code: ${error.code}.`)
    }
  }

  /**
   * 重新扫描
   */
  rescan() {
    try {
      customScan.rescan();
    } catch (error) {
      Logger.error(TAG, `The rescan call failed. error code: ${error.code}.`);
      this.onError(`The rescan call failed. error code: ${error.code}.`)
    }
  }

  //设置手电筒模式
  setTorchFn(mode: TorchMode): void {
    Logger.info(TAG, `setTorch: ${mode}`)
    try {
      if (mode === 'on') {
        customScan.openFlashLight();
      } else {
        customScan.closeFlashLight();
      }
    } catch (error) {
      Logger.error(TAG, `The setTorch call failed. error code: ${error.code}.`);
      this.onError(`The setTorch call failed. error code: ${error.code}.`)
    }
  }

  /**
   * 页面消失或隐藏时，释放相机流
   */
  async scanRelease() {
    this.scanStop();
    this.initSuccess = false;
    try {
      customScan.release().then(() => {
        Logger.info(TAG, 'release success!');
      }).catch((error: BusinessError) => {
        Logger.error(TAG, `release failed error: ${JSON.stringify(error)}`);
        this.onError(`release failed error: ${JSON.stringify(error)}`)
      })
    } catch (error) {
      Logger.error(TAG, `Catch: release error ${JSON.stringify(error)}`);
    }
  }
}

export default new ScanService()