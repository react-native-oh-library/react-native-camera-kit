import type {TurboModule} from 'react-native/Libraries/TurboModule/RCTExport';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  requestDeviceCameraAuthorization(): Promise<boolean>;
  checkDeviceCameraAuthorizationStatus(): boolean;
}

export default TurboModuleRegistry.get<Spec>('RTNCamerakit') as Spec | null;
