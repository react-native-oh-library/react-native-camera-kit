/*
 * Copyright (c) 2024 Huawei Device Co., Ltd. All rights reserved
 * Use of this source code is governed by a MIT license that can be
 * found in the LICENSE file.
 */

// 扫码框组件
import { ScanLine } from './ScanLine';

@Component
export struct ScanBoxComponent {
  private mBorderWidth = 1;
  private mRowSize = 40;
  @Prop frameColor: string | Color;
  @Prop laserColor: string | Color;


  build() {
    Stack() {
      // 对焦框
      Flex({ direction: FlexDirection.Column, justifyContent: FlexAlign.SpaceBetween }) {
        Flex({ justifyContent: FlexAlign.SpaceBetween }) {
          Row() {
          }
          .border({
            width: {
              left: this.mBorderWidth,
              top: this.mBorderWidth
            },
            color: this.frameColor,

          })
          .size({ width: this.mRowSize, height: this.mRowSize })

          Row() {
          }
          .border({
            width: {
              right: this.mBorderWidth,
              top: this.mBorderWidth
            },
            color: this.frameColor,

          })
          .size({ width: this.mRowSize, height: this.mRowSize })
        }

        Flex({ justifyContent: FlexAlign.SpaceBetween }) {
          Row() {
          }
          .border({
            width: {
              left: this.mBorderWidth,
              bottom: this.mBorderWidth
            },
            color: this.frameColor,

          })
          .size({ width: this.mRowSize, height: this.mRowSize })

          Row() {
          }
          .border({
            width: {
              right: this.mBorderWidth,
              bottom: this.mBorderWidth
            },
            color: this.frameColor,
          })
          .size({ width: this.mRowSize, height: this.mRowSize })
        }

      }

      ScanLine({ laserColor: this.laserColor})
    }
    .width('75%')
    .height('50%')
    .zIndex(1)
  }
}
