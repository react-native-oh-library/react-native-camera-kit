export function getTypeStr(type: number): string {
  switch (type) {
    case 0:
      return 'FORMAT_UNKNOWN';
    case 1:
      return 'AZTEC_CODE';
    case 2:
      return 'CODABAR_CODE';
    case 3:
      return 'CODE39_CODE';
    case 4:
      return 'CODE93_CODE';
    case 5:
      return 'CODE128_CODE';
    case 6:
      return 'DATAMATRIX_CODE';
    case 7:
      return 'EAN8_CODE';
    case 8:
      return 'EAN13_CODE';
    case 9:
      return 'ITF14_CODE';
    case 10:
      return 'PDF417_CODE';
    case 11:
      return 'QR_CODE';
    case 12:
      return 'UPC_A_CODE';
    case 13:
      return 'UPC_E_CODE';
    case 14:
      return 'MULTIFUNCTIONAL_CODE';
    case 100:
      return 'ONE_D_CODE';
    case 101:
      return 'TWO_D_CODE';
    default:
      return '';
  }
}

export function getRatioOverlay(ratioOverlay: string) {
  let result = 16 / 9;
  if (ratioOverlay) {
    let parts = ratioOverlay.split(":");
    if (parts.length === 2) {
      let inputHeight = parseInt(parts[0], 10);
      let inputWidth = parseInt(parts[1], 10);
      result = inputWidth / inputHeight;
    }
  }
  return result;
}

export function isEmptyValue(value: any): boolean {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  if (typeof value === 'number' && (isNaN(value))) {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

interface ViewSize {
  width: number;
  height: number;
}

export const getViewSize = (screenWidth: number, screenHeight: number, ratio: number) => {
  let centerSize: ViewSize = {
    width: 0,
    height: 0
  };
  let sideSize: ViewSize = {
    width: 0,
    height: 0
  };
  if (screenWidth < screenHeight) {
    centerSize.width = screenWidth
    centerSize.height = screenHeight * ratio;
    sideSize.width = centerSize.width
    sideSize.height = (screenHeight - centerSize.height) / 2.0
  } else if (screenWidth > screenHeight) {
    centerSize.width = screenWidth / ratio
    centerSize.height = screenHeight

    sideSize.width = (screenWidth - centerSize.width) / 2.0
    sideSize.height = centerSize.height

  } else { // ratio is 1:1
    centerSize.width = screenWidth
    centerSize.height = screenHeight

    sideSize.width = centerSize.width
    sideSize.height = (screenHeight - centerSize.height) / 2.0
  }

  return {
    centerSize: { width: Math.floor(centerSize.width), height: Math.floor(centerSize.height) },
    sideSize: { width: Math.floor(sideSize.width), height: Math.floor(sideSize.height) }
  }
}