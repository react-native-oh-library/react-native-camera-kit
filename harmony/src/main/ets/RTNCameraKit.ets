import { RNComponentContext, RNViewBase } from '@rnoh/react-native-openharmony';
import { BoxSizes, RTNCamerakitViewSpec } from './types';
import { abilityAccessCtrl, common } from '@kit.AbilityKit';
import Logger from './utils/Logger';
import { display } from '@kit.ArkUI';
import { Constants } from './common/Constants';
import DisplayCalculator from './common/DisplayCalculator';
import CameraService from './service/CameraService'
import ScanService from './service/ScanService';
import { camera } from '@kit.CameraKit';
import {
  FlashingLightComponent,
  FocusAreaComponent,
  RatioOverlayView,
  ScanBoxComponent,
  ScanLine,
  SwitchCamerasComponent,
  TakePictureComponent,
  TorchComponent
} from './component';
import { CameraProps } from '../ets/types/CameraProps'
import { FocusComponent } from './component/FocusComponent';
import { CameraError, CameraType } from './types';
import { scanBarcode, scanCore } from '@kit.ScanKit';
import CameraManager from './service/CameraManager';
import { getRatioOverlay, getTypeStr, getViewSize, isEmptyValue } from './utils/utils';
import { AsyncCallback, BusinessError } from '@kit.BasicServicesKit';
import { window } from '@kit.ArkUI';
import { audio } from '@kit.AudioKit';
import AVPlayerService from './service/AVPlayerService'


const TAG: string = 'RTNCameraKitView';
let timerId: number | null;


@Component
export struct RTNCameraKitView {
  public static readonly NAME = RTNCamerakitViewSpec.NAME
  public ctx!: RNComponentContext
  public tag: number = 0
  private audioManager = audio.getAudioManager();
  private audioVolumeManager = this.audioManager.getVolumeManager();
  //
  @State cameraDeviceIndex: number = 0; // 后置相机
  @State surfaceId: string = '';
  @State onShow: boolean = false;
  @State private descriptorWrapper: RTNCamerakitViewSpec.DescriptorWrapper =
    {} as RTNCamerakitViewSpec.DescriptorWrapper
  @StorageLink('defaultAspectRatio') @Watch('setDisplay') defaultAspectRatio: number
    = Constants.MIN_ASPECT_RATIO;
  @State flashMode: camera.FlashMode = camera.FlashMode.FLASH_MODE_CLOSE; // 关闭对焦
  @State focusPointBol: boolean = false; // 是否对焦标志
  @State focusPointVal: Array<number> = [0, 0]; // 曝光区域手指点击坐标
  @State scaleValue: number = 1 //变焦初始值
  @State pinchValue: number = 1;
  //
  private eventEmitter: RTNCamerakitViewSpec.EventEmitter | undefined = undefined
  private cleanUpCallbacks: (() => void)[] = []
  private appContext: common.Context | undefined = getContext(this);
  private windowClass: window.Window | undefined = undefined;
  //
  @State screenWidth: number = 0 // 屏幕宽带
  @State screenHeight: number = 0 //屏幕高度
  @State displayHeight: number = 0 // 显示高度，单位vp
  @State displayWidth: number = 0 // 显示宽度，单位vp
  @State cameraHeight: number = 640 // 设置预览流高度，默认单位：vp
  @State cameraWidth: number = 360 // 设置预览流宽度，默认单位：vp
  @State cameraOffsetX: number = 0 // 设置预览流x轴方向偏移量，默认单位：vp
  @State cameraOffsetY: number = 0 // 设置预览流y轴方向偏移量，默认单位：vp
  @State scanResult: Array<scanBarcode.ScanResult> | undefined = undefined;
  @State isScan: boolean | undefined = undefined; //是否扫码
  @State isScanned: boolean = false;
  @State tipShow: boolean = false;
  @State isInitSuccess: boolean = false;
  @State currentProps: CameraProps = {};
  @State viewSize: BoxSizes = {
    centerSize: {
      width: 0,
      height: 0
    },
    sideSize: {
      width: 0,
      height: 0
    }
  }
  mXComponentController: XComponentController = new XComponentController();
  atManager = abilityAccessCtrl.createAtManager();
  private scanOptions: scanBarcode.ScanOptions = {
    // 扫码类型，可选参数
    scanTypes: [scanCore.ScanType.ALL],
    // 是否开启多码识别，可选参数
    enableMultiMode: true,
    // 是否开启相册扫码，可选参数
    enableAlbum: true,
  }

  async aboutToAppear() {
    this.eventEmitter = new RTNCamerakitViewSpec.EventEmitter(this.ctx.rnInstance, this.tag)
    this.onDescriptorWrapperChange(this.ctx.descriptorRegistry.findDescriptorWrapperByTag<RTNCamerakitViewSpec.DescriptorWrapper>(this.tag)!)
    this.cleanUpCallbacks.push(this.ctx.descriptorRegistry.subscribeToDescriptorChanges(this.tag,
      (_descriptor, newDescriptorWrapper) => {
        this.onDescriptorWrapperChange(newDescriptorWrapper! as RTNCamerakitViewSpec.DescriptorWrapper)
      }
    ))
    this.getLastWindow();
    this.subscribeToLifecycleEvents();
    await this.requestPermissionsFn();
    this.registerCommandCallback();
    this.audioVolumeChange();
    this.setDisplay();
  }

  audioVolumeChange() {
    this.audioVolumeManager.on('volumeChange', (volumeEvent: audio.VolumeEvent) => {
      console.info(`volumeChange-VolumeType of stream: ${volumeEvent.volumeType} `);
      console.info(`volumeChange-Volume level: ${volumeEvent.volume} `);
      console.info(`volumeChange-Whether to updateUI: ${volumeEvent.updateUi} `);
      this.onCaptureButtonPressIn();
    });
  }

  getLastWindow() {
    window.getLastWindow(this.appContext).then((lastWindow) => {
      this.windowClass = lastWindow;
    })
  }

  setDisplay() {
    // 默认竖屏
    const props = this.descriptorWrapper.props as CameraProps;
    const width = this.descriptorWrapper.width;
    const height = this.descriptorWrapper.height;
    const ratioOverlay = getRatioOverlay(props.ratioOverlay);
    if (ratioOverlay) {
      Logger.info(TAG, `ratioOverlay: ${JSON.stringify(ratioOverlay)}`);
      this.defaultAspectRatio = ratioOverlay;
    }
    let displayClass = display.getDefaultDisplaySync(); //获取屏幕信息
    this.screenWidth = px2vp(displayClass.width);
    this.screenHeight = px2vp(displayClass.height)
    this.displayHeight = height || this.screenHeight; // 屏幕宽度
    this.displayWidth = width || this.screenWidth; // 屏幕高度

    this.cameraHeight = this.displayHeight;
    this.cameraWidth = this.displayWidth;
    this.viewSize = getViewSize(this.displayWidth, this.displayHeight, this.defaultAspectRatio);
    console.log('viewSize', JSON.stringify(this.viewSize))
  }

  async initSession() {
    this.isInitSuccess = false;
    this.surfaceId = this.mXComponentController.getXComponentSurfaceId();
    this.isScan = this.currentProps.scanBarcode;
    if (this.isScan) {
      // 启用扫码服务
      ScanService.setCtx(this.ctx);
      ScanService.scanInit({
        options: this.scanOptions,
        viewControl: { width: this.cameraWidth, height: this.cameraHeight, surfaceId: this.surfaceId },
        getResultCallback: this.customCallbackScan,
        initSuccessCallBack: () => {
          this.isInitSuccess = true;
        }
      });
      this.isScanned = true;
      this.startTimer();
    } else {
      // 拍照服务
      CameraService.setCtx(this.ctx);
      await CameraService.initCamera({
        surfaceId: this.surfaceId,
        cameraDeviceIndex: this.cameraDeviceIndex,
        cameraProps: this.currentProps,
        initSuccessCallBack: () => {
          this.isInitSuccess = true;
        }
      }
      );
    }
  }

  clearTimer() {
    if (timerId !== null) {
      clearTimeout(timerId);
      timerId = null;
      this.tipShow = false;
    }
  }

  startTimer() {
    this.clearTimer();
    timerId = setTimeout(() => {
      if (!this.scanResult) {
        this.tipShow = true;
      }
    }, this.currentProps.scanThrottleDelay || 5000);
  }

  customCallbackScan: AsyncCallback<scanBarcode.ScanResult[]> =
    async (error: BusinessError, result: scanBarcode.ScanResult[]) => {
      if (error) {
        Logger.error(TAG, `An error is returned during customCallbackScan. Code: ${error.code}`);
      }
      this.scanResult = result;
      this.isScanned = false;
      ScanService.scanStop();
      this.clearTimer();
      this.handleScanResult(result);
    }

  /**
   * 订阅生命周期监听事件
   */
  subscribeToLifecycleEvents() {
    Logger.info(TAG, `subscribeToLifecycleEvents start`);
    this.ctx.rnInstance.subscribeToLifecycleEvents("FOREGROUND", () => {
      Logger.info(TAG, `subscribeToLifecycleEvents FOREGROUND`);
      const props = this.descriptorWrapper['descriptor'].rawProps as CameraProps;
      if (props.scanBarcode) {
        ScanService.scanInit({
          options: this.scanOptions,
          viewControl: { width: this.cameraWidth, height: this.cameraHeight, surfaceId: this.surfaceId },
          getResultCallback: this.customCallbackScan,
          initSuccessCallBack: () => {
            this.isInitSuccess = true;
          }
        })
      } else {
        CameraService.initCamera({
          surfaceId: this.surfaceId,
          cameraDeviceIndex: this.cameraDeviceIndex,
          cameraProps: this.currentProps,
          initSuccessCallBack: () => {
            this.isInitSuccess = true;
          }
        }
        );
      }
    })
    this.ctx.rnInstance.subscribeToLifecycleEvents("BACKGROUND", async () => {
      Logger.info(TAG, `subscribeToLifecycleEvents BACKGROUND`);
      this.handleRelease();
    })
    this.ctx.rnInstance.subscribeToLifecycleEvents("CONFIGURATION_UPDATE", () => {
      Logger.info(TAG, `subscribeToLifecycleEvents CONFIGURATION_UPDATE`);
    })
    this.ctx.rnInstance.subscribeToLifecycleEvents("JS_BUNDLE_EXECUTION_FINISH", () => {
      Logger.info(TAG, `subscribeToLifecycleEvents JS_BUNDLE_EXECUTION_FINISH`);
    })
    this.ctx.rnInstance.subscribeToLifecycleEvents("RELOAD", () => {
      Logger.info(TAG, `subscribeToLifecycleEvents RELOAD`);
    })
    this.ctx.rnInstance.subscribeToLifecycleEvents("WINDOW_SIZE_CHANGE", () => {
      Logger.info(TAG, `subscribeToLifecycleEvents WINDOW_SIZE_CHANGE`);
    })
    Logger.info(TAG, `subscribeToLifecycleEvents end`);
  }

  /*
   *订阅事件回调
   * */
  registerCommandCallback() {
    if (this.ctx) {
      this.ctx.componentCommandReceiver.registerCommandCallback(
        this.tag,
        (command: string, args: (string | number | boolean | object)[]) => {
          Logger.info(TAG, `command:${JSON.stringify(command)}}`);
          if (command === Constants.TACK_PHOTO) {
            this.takePhoto();
            Logger.info(TAG, `command-takePhoto`);
          }
          if (command === Constants.REQUEST_DEVICE_CAMERA_AUTHOR) {
            this.requestDeviceCameraAuthorization();
            Logger.info(TAG, `command-takePhoto`);
          }
          if (command === Constants.CHECK_DEVICE_CAMERA_AUTHOR) {
            this.checkDeviceCameraAuthorizationStatus();
            Logger.info(TAG, `command-checkDeviceCameraAuthorizationStatus`);
          }
        });
    }
  }

  /*
   * 请求相机授权
   * */
  async requestDeviceCameraAuthorization() {
    const result = await CameraManager.requestDeviceCameraAuthorization()
    console.log('requestDeviceCameraAuthorization-res', result)
    this.ctx.rnInstance.emitDeviceEvent('requestDeviceCameraAuthorization', result);
  }

  /*
 * 检查相机授权
 * */
  async checkDeviceCameraAuthorizationStatus() {
    const result = CameraManager.checkDeviceCameraAuthorizationStatus()
    console.log('checkDeviceCameraAuthorizationStatus-res', result)
    this.ctx.rnInstance.emitDeviceEvent('checkDeviceCameraAuthorizationStatus', result);
  }

  /*
  * 获取权限
  * */
  private async requestPermissionsFn() {
    Logger.info(TAG, `requestPermissionsFn entry`);
    try {
      this.atManager.requestPermissionsFromUser(this.appContext, Constants.PERMISSION_LIST).then(() => {
        Logger.info(TAG, `request Permissions success!`);
        this.onShow = true;
      });
    } catch (err) {
      Logger.error(TAG, `requestPermissionsFromUser call Failed! error: ${err.code}`);
    }
  }

  private onDescriptorWrapperChange(descriptorWrapper: RTNCamerakitViewSpec.DescriptorWrapper) {
    this.descriptorWrapper = descriptorWrapper;
    const descriptorBase = descriptorWrapper['descriptor'];
    const props = descriptorBase.rawProps as CameraProps;
    this.currentProps = props;
    this.updateProps(props);
  }

  private updateProps(props: CameraProps) {
    this.isScan = props.scanBarcode;
    this.setDisplay();
    Logger.info(TAG, `updateProps:${JSON.stringify(props)}`);
    if (!this.isInitSuccess) {
      return;
    }
    if (this.isScan) {
      ScanService.initProps(props);
    } else {
      CameraService.initProps(props);
    }
  }

  async aboutToDisappear() {
    this.cleanUpCallbacks.forEach(cb => cb())
    this.flashMode = camera.FlashMode.FLASH_MODE_CLOSE;
    this.handleRelease();
  }

  handleRelease() {
    CameraService.releaseCamera();
    ScanService.scanRelease();
    this.clearTimer();
    this.isScanned = false;
    this.tipShow = false;
    this.isInitSuccess = false;
  }

  scaleValueChange(): void {
    if (this.isScan) {
      let zoom = ScanService.getZoomFn()
      this.pinchValue = this.scaleValue * zoom;
      let zoomValue = Number(this.pinchValue.toFixed((2)));
      ScanService.setZoomFn(zoomValue)
    } else {
      let zoom = CameraService.getZoomRatioFn();
      this.pinchValue = this.scaleValue * zoom;
      let zoomValue = Number(this.pinchValue.toFixed((2)));
      CameraService.setZoomRatioFn(zoomValue)
    }
  }

  onError(cameraError: CameraError) {
    Logger.info(TAG, `emitDeviceEvent onError`)
    this.ctx.rnInstance.emitDeviceEvent('onError', cameraError);
  }

  onCaptureButtonPressIn(): void {
    if (this.isInitSuccess && !this.isScan) {
      if (this.ctx) {
        this.ctx.rnInstance.emitDeviceEvent('onCaptureButtonPressIn', {});
      }
    }
  }

  /*
   * */
  handleScanResult(scanResult: Array<scanBarcode.ScanResult> | undefined) {
    Logger.info(TAG, `scanResult: ${JSON.stringify(scanResult)}`)
    if (this.ctx && scanResult) {
      this.ctx.rnInstance.emitDeviceEvent('onReadCode', {
        nativeEvent: {
          codeStringValue: scanResult[0].originalValue,
          codeFormat: getTypeStr(scanResult[0].scanType)
        }
      });
    }
  }

  async takePhoto(): Promise<void> {
    if (this.isInitSuccess && !this.isScan) {
      if (this.currentProps.shutterPhotoSound) {
        AVPlayerService.avPlayerFdSrc();
      }
      const photoAsset = await CameraService.takePicture()
      Logger.info(TAG, `takePhoto_photoAsset: ${JSON.stringify(photoAsset)}`)
      if (this.ctx && photoAsset) {
        this.ctx.rnInstance.emitDeviceEvent('onTaskPhoto', photoAsset);
      }
    }
  }

  @Builder
  ActionBtnBuilder() {
    if (!this.isScan) {
      Row() {
        // 切换闪光灯
        FlashingLightComponent({
          flashMode: $flashMode,
        })
        // 切换镜头
        SwitchCamerasComponent({
          surfaceId: this.surfaceId,
          cameraDeviceIndex: $cameraDeviceIndex,
        })
        // 手电筒
        TorchComponent({ isScan: this.isScan, })
      }
      .position({ top: 0, left: 0 })
      .zIndex(10)
      .width(Constants.FULL_WIDTH)
      .justifyContent(FlexAlign.SpaceAround)
      .padding({ top: 10 })
    }
  }

  @Builder
  TakePictureBuilder() {
    Row() {
      TakePictureComponent()
    }
    .position({ bottom: 10, left: 0 })
    .width(Constants.FULL_WIDTH)
    .justifyContent(FlexAlign.Center)
  }

  @Builder
  FocusBuilder() {
    //对焦框
    FocusComponent({
      focusPointBol: $focusPointBol,
      focusPointVal: $focusPointVal,
      focusColor: Color.Yellow,
    })
    // 曝光对焦手指点击区域
    FocusAreaComponent({
      focusPointBol: $focusPointBol,
      focusPointVal: $focusPointVal,
      xComponentWidth: this.cameraWidth,
      xComponentHeight: this.cameraHeight,
      focusFrameDisplayDuration: this.currentProps.resetFocusTimeout ?? 5000,
      isScan: this.isScan,
      cameraOffsetX: this.cameraOffsetX,
      cameraOffsetY: this.cameraOffsetY
    })
  }

  @Builder
  tipContainer() {
    Row() {
      Text($r('app.string.Scan_diaLog_not_found'))
        .fontSize($r('sys.float.ohos_id_text_size_body2'))
        .fontFamily('HarmonyHeiTi')
        .fontColor($r('sys.color.ohos_id_color_text_secondary'))
    }
    .margin({
      top: 16
    })
    .padding(8)
    .backgroundColor($r('sys.color.ohos_id_blur_style_component_ultra_thick_color'))
    .borderRadius($r('sys.float.corner_radius_level10'))
  }

  @Builder
  XComponentBuilder() {
    XComponent({
      id: 'componentId',
      type: 'surface',
      controller: this.mXComponentController
    })
      .onLoad(async () => {
        this.initSession();
      })
      .backgroundColor(Color.Black)
      .height(this.cameraHeight)
      .width(this.cameraWidth)
  }

  build() {
    RNViewBase({ ctx: this.ctx, tag: this.tag }) {
      Stack() {
        if (this.onShow) {
          // this.ActionBtnBuilder();
          this.XComponentBuilder();
          this.FocusBuilder();
          // this.TakePictureBuilder();
          if (this.isScanned && this.isScan) {
            if (this.currentProps.showFrame) {
              ScanBoxComponent({
                frameColor: this.currentProps.frameColor || Color.Yellow,
                laserColor: this.currentProps?.laserColor ?? Color.Red
              })
            }
            // ScanLine({ laserColor: this.currentProps?.laserColor ?? Color.Red })
            if (this.tipShow) {
              this.tipContainer()
            }
          }
          if (this.currentProps.ratioOverlay) {
            RatioOverlayView({
              ratioOverlayColor: this.currentProps.ratioOverlayColor ?? Color.Black,
              viewSize: this.viewSize,
              displayWidth: this.displayWidth,
              displayHeight: this.displayHeight
            })
          }
        }
      }
      .height(this.displayHeight)
      .width(this.displayWidth)
      .backgroundColor(Color.Black)
      .gesture(
        PinchGesture({ fingers: 2 })
          .onActionStart((event: GestureEvent) => {
            Logger.info('Pinch start')
          })
          .onActionUpdate((event: GestureEvent) => {
            if (event) {
              this.scaleValue = event.scale;
              Logger.info(TAG, `scaleValue${this.scaleValue}`)
            }
          })
          .onActionEnd((event: GestureEvent) => {
            this.scaleValueChange()
          })
      )
    }
  }
}