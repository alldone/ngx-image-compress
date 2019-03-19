/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Injectable, RendererFactory2 } from '@angular/core';
import { DOC_ORIENTATION, ImageCompress } from './image-compress';
export class NgxImageCompressService {
    /**
     * @param {?} rendererFactory
     */
    constructor(rendererFactory) {
        this.DOC_ORIENTATION = DOC_ORIENTATION;
        this.render = rendererFactory.createRenderer(null, null);
    }
    /**
     * @param {?} image
     * @return {?}
     */
    byteCount(image) {
        return ImageCompress.byteCount(image);
    }
    /**
     * @return {?}
     */
    uploadFile() {
        return ImageCompress.uploadFile(this.render);
    }
    /**
     * @param {?} image
     * @param {?} orientation
     * @param {?=} ratio
     * @param {?=} quality
     * @return {?}
     */
    compressFile(image, orientation, ratio = 50, quality = 50) {
        return ImageCompress.compress(image, orientation, this.render, ratio, quality);
    }
}
NgxImageCompressService.decorators = [
    { type: Injectable }
];
/** @nocollapse */
NgxImageCompressService.ctorParameters = () => [
    { type: RendererFactory2 }
];
if (false) {
    /**
     * @type {?}
     * @private
     */
    NgxImageCompressService.prototype.render;
    /** @type {?} */
    NgxImageCompressService.prototype.DOC_ORIENTATION;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LWltYWdlLWNvbXByZXNzLnNlcnZpY2UuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtYWxsZG9uZS1pbWFnZS1jb21wcmVzcy8iLCJzb3VyY2VzIjpbImxpYi9uZ3gtaW1hZ2UtY29tcHJlc3Muc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQUEsT0FBTyxFQUFDLFVBQVUsRUFBYSxnQkFBZ0IsRUFBQyxNQUFNLGVBQWUsQ0FBQztBQUN0RSxPQUFPLEVBQUMsZUFBZSxFQUFFLGFBQWEsRUFBQyxNQUFNLGtCQUFrQixDQUFDO0FBR2hFLE1BQU0sT0FBTyx1QkFBdUI7Ozs7SUFNbEMsWUFBWSxlQUFpQztRQUZ0QyxvQkFBZSxHQUFHLGVBQWUsQ0FBQztRQUd2QyxJQUFJLENBQUMsTUFBTSxHQUFHLGVBQWUsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQzNELENBQUM7Ozs7O0lBRU0sU0FBUyxDQUFDLEtBQUs7UUFDcEIsT0FBTyxhQUFhLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7Ozs7SUFFTSxVQUFVO1FBQ2YsT0FBTyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUMvQyxDQUFDOzs7Ozs7OztJQUVNLFlBQVksQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLFFBQWdCLEVBQUUsRUFBRSxVQUFrQixFQUFFO1FBQzlFLE9BQU8sYUFBYSxDQUFDLFFBQVEsQ0FBQyxLQUFLLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2pGLENBQUM7OztZQXJCRixVQUFVOzs7O1lBSG9CLGdCQUFnQjs7Ozs7OztJQU03Qyx5Q0FBMEI7O0lBRTFCLGtEQUF5QyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZSwgUmVuZGVyZXIyLCBSZW5kZXJlckZhY3RvcnkyfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7RE9DX09SSUVOVEFUSU9OLCBJbWFnZUNvbXByZXNzfSBmcm9tICcuL2ltYWdlLWNvbXByZXNzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE5neEltYWdlQ29tcHJlc3NTZXJ2aWNlIHtcblxuICBwcml2YXRlIHJlbmRlcjogUmVuZGVyZXIyO1xuXG4gIHB1YmxpYyBET0NfT1JJRU5UQVRJT04gPSBET0NfT1JJRU5UQVRJT047XG5cbiAgY29uc3RydWN0b3IocmVuZGVyZXJGYWN0b3J5OiBSZW5kZXJlckZhY3RvcnkyKSB7XG4gICAgdGhpcy5yZW5kZXIgPSByZW5kZXJlckZhY3RvcnkuY3JlYXRlUmVuZGVyZXIobnVsbCwgbnVsbCk7XG4gIH1cblxuICBwdWJsaWMgYnl0ZUNvdW50KGltYWdlKSB7XG4gICAgcmV0dXJuIEltYWdlQ29tcHJlc3MuYnl0ZUNvdW50KGltYWdlKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGxvYWRGaWxlKCk6UHJvbWlzZTx7aW1hZ2U6IHN0cmluZywgb3JpZW50YXRpb246IERPQ19PUklFTlRBVElPTn0+IHtcbiAgICByZXR1cm4gSW1hZ2VDb21wcmVzcy51cGxvYWRGaWxlKHRoaXMucmVuZGVyKTtcbiAgfVxuXG4gIHB1YmxpYyBjb21wcmVzc0ZpbGUoaW1hZ2UsIG9yaWVudGF0aW9uLCByYXRpbzogbnVtYmVyID0gNTAsIHF1YWxpdHk6IG51bWJlciA9IDUwKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gSW1hZ2VDb21wcmVzcy5jb21wcmVzcyhpbWFnZSwgb3JpZW50YXRpb24sIHRoaXMucmVuZGVyLCByYXRpbywgcXVhbGl0eSk7XG4gIH1cblxufVxuIl19