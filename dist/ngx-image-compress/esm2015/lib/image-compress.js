/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @enum {number} */
const DOC_ORIENTATION = {
    Up: 1,
    Down: 3,
    Right: 6,
    Left: 8,
    UpMirrored: 2,
    DownMirrored: 4,
    LeftMirrored: 5,
    RightMirrored: 7,
    NotJpeg: -1,
    NotDefined: -2,
};
export { DOC_ORIENTATION };
DOC_ORIENTATION[DOC_ORIENTATION.Up] = 'Up';
DOC_ORIENTATION[DOC_ORIENTATION.Down] = 'Down';
DOC_ORIENTATION[DOC_ORIENTATION.Right] = 'Right';
DOC_ORIENTATION[DOC_ORIENTATION.Left] = 'Left';
DOC_ORIENTATION[DOC_ORIENTATION.UpMirrored] = 'UpMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.DownMirrored] = 'DownMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.LeftMirrored] = 'LeftMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.RightMirrored] = 'RightMirrored';
DOC_ORIENTATION[DOC_ORIENTATION.NotJpeg] = 'NotJpeg';
DOC_ORIENTATION[DOC_ORIENTATION.NotDefined] = 'NotDefined';
export class ImageCompress {
    /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     * @param {?} file
     * @param {?} callback
     * @return {?}
     */
    static getOrientation(file, callback) {
        /** @type {?} */
        const reader = new FileReader();
        try {
            reader.onload = function ($event) {
                /** @type {?} */
                const view = new DataView((/** @type {?} */ (reader.result)));
                if (view.getUint16(0, false) !== 0xFFD8) {
                    return callback(-2);
                }
                /** @type {?} */
                const length = view.byteLength;
                /** @type {?} */
                let offset = 2;
                while (offset < length) {
                    /** @type {?} */
                    const marker = view.getUint16(offset, false);
                    offset += 2;
                    if (marker === 0xFFE1) {
                        if (view.getUint32(offset += 2, false) !== 0x45786966) {
                            return callback(-1);
                        }
                        /** @type {?} */
                        const little = view.getUint16(offset += 6, false) === 0x4949;
                        offset += view.getUint32(offset + 4, little);
                        /** @type {?} */
                        const tags = view.getUint16(offset, little);
                        offset += 2;
                        for (let i = 0; i < tags; i++) {
                            if (view.getUint16(offset + (i * 12), little) === 0x0112) {
                                return callback(view.getUint16(offset + (i * 12) + 8, little));
                            }
                        }
                    }
                    else if ((marker & 0xFF00) !== 0xFF00) {
                        break;
                    }
                    else {
                        offset += view.getUint16(offset, false);
                    }
                }
                return callback(-1);
            };
            reader.readAsArrayBuffer(file);
        }
        catch (e) {
            return callback(0);
        }
    }
    /**
     * return a promise with the new image data and image orientation
     * @param {?} render
     * @return {?}
     */
    static uploadFile(render) {
        /** @type {?} */
        const promise = new Promise(function (resolve, reject) {
            /** @type {?} */
            const inputElement = render.createElement('input');
            render.setStyle(inputElement, 'display', 'none');
            render.setProperty(inputElement, 'type', 'file');
            render.setProperty(inputElement, 'accept', 'image/*');
            render.listen(inputElement, 'click', ($event) => {
                // javascript teachable moment
                console.log('MouseEvent:', $event);
                console.log('Input:', $event.target);
                $event.target.value = null;
            });
            render.listen(inputElement, 'change', ($event) => {
                /** @type {?} */
                const file = $event.target.files[0];
                /** @type {?} */
                const myReader = new FileReader();
                myReader.onloadend = (e) => {
                    try {
                        ImageCompress.getOrientation(file, orientation => {
                            resolve({ image: (/** @type {?} */ (myReader.result)), orientation });
                        });
                    }
                    catch (e) {
                        //console.log(`ERROR ${e}`);
                        reject(e);
                    }
                };
                try {
                    myReader.readAsDataURL(file);
                }
                catch (e) {
                    console.log(`ERROR - probably no file have been selected: ${e}`);
                    reject("No file selected");
                }
            });
            inputElement.click();
        });
        return promise;
    }
    /**
     * @param {?} imageDataUrlSource
     * @param {?} orientation
     * @param {?} render
     * @param {?=} ratio
     * @param {?=} quality
     * @return {?}
     */
    static compress(imageDataUrlSource, orientation, render, ratio = 50, quality = 50) {
        /** @type {?} */
        const promise = new Promise(function (resolve, reject) {
            quality = quality / 100;
            ratio = ratio / 100;
            /** @type {?} */
            const sourceImage = new Image();
            // important for safari: we need to wait for onload event
            sourceImage.onload = function () {
                /** @type {?} */
                const canvas = render.createElement('canvas');
                /** @type {?} */
                const ctx = canvas.getContext('2d');
                /** @type {?} */
                let w;
                /** @type {?} */
                let h;
                w = sourceImage.naturalWidth;
                h = sourceImage.naturalHeight;
                if (orientation === DOC_ORIENTATION.Right || orientation === DOC_ORIENTATION.Left) {
                    /** @type {?} */
                    const t = w;
                    w = h;
                    h = t;
                }
                canvas.width = w * ratio;
                canvas.height = h * ratio;
                /** @type {?} */
                const TO_RADIANS = Math.PI / 180;
                if (orientation === DOC_ORIENTATION.Up) {
                    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                }
                else if (orientation === DOC_ORIENTATION.Right) {
                    ctx.save();
                    ctx.rotate(90 * TO_RADIANS);
                    ctx.translate(0, -canvas.width);
                    ctx.drawImage(sourceImage, 0, 0, canvas.height, canvas.width);
                    ctx.restore();
                }
                else if (orientation === DOC_ORIENTATION.Left) {
                    ctx.save();
                    ctx.rotate(-90 * TO_RADIANS);
                    ctx.translate(-canvas.width, 0);
                    ctx.drawImage(sourceImage, 0, 0, canvas.height, canvas.width);
                    ctx.restore();
                }
                else if (orientation === DOC_ORIENTATION.Down) {
                    ctx.save();
                    ctx.rotate(180 * TO_RADIANS);
                    ctx.translate(-canvas.width, -canvas.height);
                    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                    ctx.restore();
                }
                else {
                    console.error('Wrong orientation value');
                    // same as default UP
                    ctx.drawImage(sourceImage, 0, 0, canvas.width, canvas.height);
                }
                /** @type {?} */
                const mime = imageDataUrlSource.substr(5, imageDataUrlSource.split(';')[0].length - 5);
                // TODO test on mime
                /** @type {?} */
                const result = canvas.toDataURL(mime, quality);
                resolve(result);
            };
            sourceImage.src = imageDataUrlSource;
        });
        return promise;
    }
    /**
     * helper to evaluate the compression rate
     * @param {?} s the image in base64 string format
     * @return {?}
     */
    static byteCount(s) {
        return encodeURI(s).split(/%..|./).length - 1;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtY29tcHJlc3MuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9uZ3gtYWxsZG9uZS1pbWFnZS1jb21wcmVzcy8iLCJzb3VyY2VzIjpbImxpYi9pbWFnZS1jb21wcmVzcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFHRSxLQUFNO0lBQ04sT0FBUTtJQUNSLFFBQVM7SUFDVCxPQUFRO0lBQ1IsYUFBYztJQUNkLGVBQWdCO0lBQ2hCLGVBQWdCO0lBQ2hCLGdCQUFpQjtJQUNqQixXQUFZO0lBQ1osY0FBZTs7Ozs7Ozs7Ozs7OztBQUlqQixNQUFNLE9BQU8sYUFBYTs7Ozs7OztJQU14QixNQUFNLENBQUMsY0FBYyxDQUFDLElBQVUsRUFBRSxRQUEyQzs7Y0FDckUsTUFBTSxHQUFHLElBQUksVUFBVSxFQUFFO1FBQy9CLElBQUk7WUFDRixNQUFNLENBQUMsTUFBTSxHQUFHLFVBQVUsTUFBTTs7c0JBQ3hCLElBQUksR0FBRyxJQUFJLFFBQVEsQ0FBQyxtQkFBQSxNQUFNLENBQUMsTUFBTSxFQUFlLENBQUM7Z0JBQ3ZELElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssTUFBTSxFQUFFO29CQUFFLE9BQU8sUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQUU7O3NCQUMzRCxNQUFNLEdBQUcsSUFBSSxDQUFDLFVBQVU7O29CQUMxQixNQUFNLEdBQUcsQ0FBQztnQkFDZCxPQUFPLE1BQU0sR0FBRyxNQUFNLEVBQUU7OzBCQUNoQixNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxDQUFDO29CQUM1QyxNQUFNLElBQUksQ0FBQyxDQUFDO29CQUNaLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRTt3QkFDckIsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLEtBQUssVUFBVSxFQUFFOzRCQUFFLE9BQU8sUUFBUSxDQUFDLENB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LE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUVsQixDQUFDLENBQUM7WUFFRixXQUFXLENBQUMsR0FBRyxHQUFHLGtCQUFrQixDQUFDO1FBRXZDLENBQUMsQ0FBQztRQUVGLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7Ozs7OztJQU9ELE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBUztRQUN4QixPQUFPLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztJQUNoRCxDQUFDO0NBRUYiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1JlbmRlcmVyMn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmV4cG9ydCBlbnVtIERPQ19PUklFTlRBVElPTiB7XG4gIFVwID0gMSxcbiAgRG93biA9IDMsXG4gIFJpZ2h0ID0gNixcbiAgTGVmdCA9IDgsXG4gIFVwTWlycm9yZWQgPSAyLFxuICBEb3duTWlycm9yZWQgPSA0LFxuICBMZWZ0TWlycm9yZWQgPSA1LFxuICBSaWdodE1pcnJvcmVkID0gNyxcbiAgTm90SnBlZyA9IC0xLFxuICBOb3REZWZpbmVkID0gLTJcbn1cblxuXG5leHBvcnQgY2xhc3MgSW1hZ2VDb21wcmVzcyB7XG5cblxuICAvKipcbiAgICogR2V0IHRoZSBjb3JyZWN0IE9yaWVudGF0aW9uIHZhbHVlIGZyb20gdGFncywgaW4gb3JkZXIgdG8gd3JpdGUgY29ycmVjdGx5IGluIG91ciBjYW52YXNcbiAgICovXG4gIHN0YXRpYyBnZXRPcmllbnRhdGlvbihmaWxlOiBGaWxlLCBjYWxsYmFjazogKHJlc3VsdDogRE9DX09SSUVOVEFUSU9OKSA9PiB2b2lkKSB7XG4gICAgY29uc3QgcmVhZGVyID0gbmV3IEZpbGVSZWFkZXIoKTtcbiAgICB0cnkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uICgkZXZlbnQpIHtcbiAgICAgICAgY29uc3QgdmlldyA9IG5ldyBEYXRhVmlldyhyZWFkZXIucmVzdWx0IGFzIEFycmF5QnVmZmVyKTtcbiAgICAgICAgaWYgKHZpZXcuZ2V0VWludDE2KDAsIGZhbHNlKSAhPT0gMHhGRkQ4KSB7IHJldHVybiBjYWxsYmFjaygtMik7IH1cbiAgICAgICAgY29uc3QgbGVuZ3RoID0gdmlldy5ieXRlTGVuZ3RoO1xuICAgICAgICBsZXQgb2Zmc2V0ID0gMjtcbiAgICAgICAgd2hpbGUgKG9mZnNldCA8IGxlbmd0aCkge1xuICAgICAgICAgIGNvbnN0IG1hcmtlciA9IHZpZXcuZ2V0VWludDE2KG9mZnNldCwgZmFsc2UpO1xuICAgICAgICAgIG9mZnNldCArPSAyO1xuICAgICAgICAgIGlmIChtYXJrZXIgPT09IDB4RkZFMSkge1xuICAgICAgICAgICAgaWYgKHZpZXcuZ2V0VWludDMyKG9mZnNldCArPSAyLCBmYWxzZSkgIT09IDB4NDU3ODY5NjYpIHsgcmV0dXJuIGNhbGxiYWNrKC0xKTsgfVxuICAgICAgICAgICAgY29uc3QgbGl0dGxlID0gdmlldy5nZXRVaW50MTYob2Zmc2V0ICs9IDYsIGZhbHNlKSA9PT0gMHg0OTQ5O1xuICAgICAgICAgICAgb2Zmc2V0ICs9IHZpZXcuZ2V0VWludDMyKG9mZnNldCArIDQsIGxpdHRsZSk7XG4gICAgICAgICAgICBjb25zdCB0YWdzID0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBsaXR0bGUpO1xuICAgICAgICAgICAgb2Zmc2V0ICs9IDI7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRhZ3M7IGkrKykge1xuICAgICAgICAgICAgICBpZiAodmlldy5nZXRVaW50MTYob2Zmc2V0ICsgKGkgKiAxMiksIGxpdHRsZSkgPT09IDB4MDExMikge1xuICAgICAgICAgICAgICAgIHJldHVybiBjYWxsYmFjayh2aWV3LmdldFVpbnQxNihvZmZzZXQgKyAoaSAqIDEyKSArIDgsIGxpdHRsZSkpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIGlmICgobWFya2VyICYgMHhGRjAwKSAhPT0gMHhGRjAwKSB7IGJyZWFrOyB9IGVsc2UgeyBvZmZzZXQgKz0gdmlldy5nZXRVaW50MTYob2Zmc2V0LCBmYWxzZSk7IH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gY2FsbGJhY2soLTEpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihmaWxlKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICByZXR1cm4gY2FsbGJhY2soMCk7XG4gICAgfVxuXG4gIH1cblxuXG4gIC8qKlxuICAgKiByZXR1cm4gYSBwcm9taXNlIHdpdGggdGhlIG5ldyBpbWFnZSBkYXRhIGFuZCBpbWFnZSBvcmllbnRhdGlvblxuICAgKi9cbiAgc3RhdGljIHVwbG9hZEZpbGUocmVuZGVyOiBSZW5kZXJlcjIpOlByb21pc2U8e2ltYWdlOiBzdHJpbmcsIG9yaWVudGF0aW9uOiBET0NfT1JJRU5UQVRJT059PiB7XG5cbiAgICBjb25zdCBwcm9taXNlOiBQcm9taXNlPHtpbWFnZTogc3RyaW5nLCBvcmllbnRhdGlvbjogRE9DX09SSUVOVEFUSU9OfT4gPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcblxuICAgICAgY29uc3QgaW5wdXRFbGVtZW50ID0gcmVuZGVyLmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgICByZW5kZXIuc2V0U3R5bGUoaW5wdXRFbGVtZW50LCAnZGlzcGxheScsICdub25lJyk7XG4gICAgICByZW5kZXIuc2V0UHJvcGVydHkoaW5wdXRFbGVtZW50LCAndHlwZScsICdmaWxlJyk7XG4gICAgICByZW5kZXIuc2V0UHJvcGVydHkoaW5wdXRFbGVtZW50LCAnYWNjZXB0JywgJ2ltYWdlLyonKTtcblxuICAgICAgcmVuZGVyLmxpc3RlbihpbnB1dEVsZW1lbnQsICdjbGljaycsICgkZXZlbnQpID0+IHtcbiAgICAgICAgLy8gamF2YXNjcmlwdCB0ZWFjaGFibGUgbW9tZW50XG4gICAgICAgIGNvbnNvbGUubG9nKCdNb3VzZUV2ZW50OicsICRldmVudCk7XG4gICAgICAgIGNvbnNvbGUubG9nKCdJbnB1dDonLCAkZXZlbnQudGFyZ2V0KTtcbiAgICAgICAgJGV2ZW50LnRhcmdldC52YWx1ZSA9IG51bGw7XG4gICAgICB9KTtcblxuXG4gICAgICByZW5kZXIubGlzdGVuKGlucHV0RWxlbWVudCwgJ2NoYW5nZScsICgkZXZlbnQpID0+IHtcbiAgICAgICAgY29uc3QgZmlsZTogRmlsZSA9ICRldmVudC50YXJnZXQuZmlsZXNbMF07XG5cbiAgICAgICAgY29uc3QgbXlSZWFkZXI6IEZpbGVSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuXG4gICAgICAgIG15UmVhZGVyLm9ubG9hZGVuZCA9IChlKSA9PiB7XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIEltYWdlQ29tcHJlc3MuZ2V0T3JpZW50YXRpb24oZmlsZSwgb3JpZW50YXRpb24gPT4ge1xuICAgICAgICAgICAgICByZXNvbHZlKHtpbWFnZTpteVJlYWRlci5yZXN1bHQgYXMgc3RyaW5nLCBvcmllbnRhdGlvbn0pO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhgRVJST1IgJHtlfWApO1xuICAgICAgICAgICAgcmVqZWN0KGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICB0cnkge1xuICAgICAgICAgIG15UmVhZGVyLnJlYWRBc0RhdGFVUkwoZmlsZSk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhgRVJST1IgLSBwcm9iYWJseSBubyBmaWxlIGhhdmUgYmVlbiBzZWxlY3RlZDogJHtlfWApO1xuICAgICAgICAgIHJlamVjdChcIk5vIGZpbGUgc2VsZWN0ZWRcIik7XG4gICAgICAgIH1cblxuICAgICAgfSk7XG4gICAgICBpbnB1dEVsZW1lbnQuY2xpY2soKTtcblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHByb21pc2U7XG4gIH1cblxuXG4gIHN0YXRpYyBjb21wcmVzcyhpbWFnZURhdGFVcmxTb3VyY2U6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgIG9yaWVudGF0aW9uOiBET0NfT1JJRU5UQVRJT04sXG4gICAgICAgICAgICAgICAgICByZW5kZXI6IFJlbmRlcmVyMixcbiAgICAgICAgICAgICAgICAgIHJhdGlvOiBudW1iZXIgPSA1MCxcbiAgICAgICAgICAgICAgICAgIHF1YWxpdHk6IG51bWJlciA9IDUwKTogUHJvbWlzZTxzdHJpbmc+IHtcblxuICAgIGNvbnN0IHByb21pc2U6IFByb21pc2U8c3RyaW5nPiA9IG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuXG4gICAgICBxdWFsaXR5ID0gcXVhbGl0eSAvIDEwMDtcbiAgICAgIHJhdGlvID0gcmF0aW8gLyAxMDA7XG4gICAgICBjb25zdCBzb3VyY2VJbWFnZSA9IG5ldyBJbWFnZSgpO1xuXG4gICAgICAvLyBpbXBvcnRhbnQgZm9yIHNhZmFyaTogd2UgbmVlZCB0byB3YWl0IGZvciBvbmxvYWQgZXZlbnRcbiAgICAgIHNvdXJjZUltYWdlLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCA9IHJlbmRlci5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY29uc3QgY3R4OiBDYW52YXNSZW5kZXJpbmdDb250ZXh0MkQgPSBjYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICBsZXQgdywgaDtcbiAgICAgICAgdyA9IHNvdXJjZUltYWdlLm5hdHVyYWxXaWR0aDtcbiAgICAgICAgaCA9IHNvdXJjZUltYWdlLm5hdHVyYWxIZWlnaHQ7XG5cbiAgICAgICAgaWYgKG9yaWVudGF0aW9uID09PSBET0NfT1JJRU5UQVRJT04uUmlnaHQgfHwgb3JpZW50YXRpb24gPT09IERPQ19PUklFTlRBVElPTi5MZWZ0KSB7XG4gICAgICAgICAgY29uc3QgdCA9IHc7XG4gICAgICAgICAgdyA9IGg7XG4gICAgICAgICAgaCA9IHQ7XG4gICAgICAgIH1cblxuICAgICAgICBjYW52YXMud2lkdGggPSB3ICogcmF0aW87XG4gICAgICAgIGNhbnZhcy5oZWlnaHQgPSBoICogcmF0aW87XG5cblxuICAgICAgICBjb25zdCBUT19SQURJQU5TID0gTWF0aC5QSSAvIDE4MDtcblxuICAgICAgICBpZiAob3JpZW50YXRpb24gPT09IERPQ19PUklFTlRBVElPTi5VcCkge1xuXG4gICAgICAgICAgY3R4LmRyYXdJbWFnZShzb3VyY2VJbWFnZSwgMCwgMCwgY2FudmFzLndpZHRoLCBjYW52YXMuaGVpZ2h0KTtcblxuICAgICAgICB9IGVsc2UgaWYgKG9yaWVudGF0aW9uID09PSBET0NfT1JJRU5UQVRJT04uUmlnaHQpIHtcblxuICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgY3R4LnJvdGF0ZSg5MCAqIFRPX1JBRElBTlMpO1xuICAgICAgICAgIGN0eC50cmFuc2xhdGUoMCwgLWNhbnZhcy53aWR0aCk7XG4gICAgICAgICAgY3R4LmRyYXdJbWFnZShzb3VyY2VJbWFnZSwgMCwgMCwgY2FudmFzLmhlaWdodCwgY2FudmFzLndpZHRoKTtcbiAgICAgICAgICBjdHgucmVzdG9yZSgpO1xuXG4gICAgICAgIH0gZWxzZSBpZiAob3JpZW50YXRpb24gPT09IERPQ19PUklFTlRBVElPTi5MZWZ0KSB7XG5cbiAgICAgICAgICBjdHguc2F2ZSgpO1xuICAgICAgICAgIGN0eC5yb3RhdGUoLTkwICogVE9fUkFESUFOUyk7XG4gICAgICAgICAgY3R4LnRyYW5zbGF0ZSgtY2FudmFzLndpZHRoLCAwKTtcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHNvdXJjZUltYWdlLCAwLCAwLCBjYW52YXMuaGVpZ2h0LCBjYW52YXMud2lkdGgpO1xuICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAgICAgfSBlbHNlIGlmIChvcmllbnRhdGlvbiA9PT0gRE9DX09SSUVOVEFUSU9OLkRvd24pIHtcblxuICAgICAgICAgIGN0eC5zYXZlKCk7XG4gICAgICAgICAgY3R4LnJvdGF0ZSgxODAgKiBUT19SQURJQU5TKTtcbiAgICAgICAgICBjdHgudHJhbnNsYXRlKC1jYW52YXMud2lkdGgsIC1jYW52YXMuaGVpZ2h0KTtcbiAgICAgICAgICBjdHguZHJhd0ltYWdlKHNvdXJjZUltYWdlLCAwLCAwLCBjYW52YXMud2lkdGgsIGNhbnZhcy5oZWlnaHQpO1xuICAgICAgICAgIGN0eC5yZXN0b3JlKCk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmVycm9yKCdXcm9uZyBvcmllbnRhdGlvbiB2YWx1ZScpO1xuICAgICAgICAgIC8vIHNhbWUgYXMgZGVmYXVsdCBVUFxuICAgICAgICAgIGN0eC5kcmF3SW1hZ2Uoc291cmNlSW1hZ2UsIDAsIDAsIGNhbnZhcy53aWR0aCwgY2FudmFzLmhlaWdodCk7XG4gICAgICAgIH1cblxuXG4gICAgICAgIGNvbnN0IG1pbWUgPSBpbWFnZURhdGFVcmxTb3VyY2Uuc3Vic3RyKDUsIGltYWdlRGF0YVVybFNvdXJjZS5zcGxpdCgnOycpWzBdLmxlbmd0aCAtIDUpO1xuICAgICAgICAvLyBUT0RPIHRlc3Qgb24gbWltZVxuICAgICAgICBjb25zdCByZXN1bHQgPSBjYW52YXMudG9EYXRhVVJMKG1pbWUsIHF1YWxpdHkpO1xuXG4gICAgICAgIHJlc29sdmUocmVzdWx0KTtcblxuICAgICAgfTtcblxuICAgICAgc291cmNlSW1hZ2Uuc3JjID0gaW1hZ2VEYXRhVXJsU291cmNlO1xuXG4gICAgfSk7XG5cbiAgICByZXR1cm4gcHJvbWlzZTtcbiAgfVxuXG5cbiAgLyoqXG4gICAqIGhlbHBlciB0byBldmFsdWF0ZSB0aGUgY29tcHJlc3Npb24gcmF0ZVxuICAgKiBAcGFyYW0gcyB0aGUgaW1hZ2UgaW4gYmFzZTY0IHN0cmluZyBmb3JtYXRcbiAgICovXG4gIHN0YXRpYyBieXRlQ291bnQoczogc3RyaW5nKTogbnVtYmVyIHtcbiAgICByZXR1cm4gZW5jb2RlVVJJKHMpLnNwbGl0KC8lLi58Li8pLmxlbmd0aCAtIDE7XG4gIH1cblxufVxuIl19