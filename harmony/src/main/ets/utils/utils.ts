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
    let num1 = parseInt(parts[0], 10);
    let num2 = parseInt(parts[1], 10);
    const max = Math.max(num1, num2);
    const min = Math.min(num1, num2);
    result = max / min;
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