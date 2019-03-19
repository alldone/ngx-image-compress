import { Renderer2 } from '@angular/core';
export declare enum DOC_ORIENTATION {
    Up = 1,
    Down = 3,
    Right = 6,
    Left = 8,
    UpMirrored = 2,
    DownMirrored = 4,
    LeftMirrored = 5,
    RightMirrored = 7,
    NotJpeg = -1,
    NotDefined = -2
}
export declare class ImageCompress {
    /**
     * Get the correct Orientation value from tags, in order to write correctly in our canvas
     */
    static getOrientation(file: File, callback: (result: DOC_ORIENTATION) => void): void;
    /**
     * return a promise with the new image data and image orientation
     */
    static uploadFile(render: Renderer2): Promise<{
        image: string;
        orientation: DOC_ORIENTATION;
    }>;
    static compress(imageDataUrlSource: string, orientation: DOC_ORIENTATION, render: Renderer2, ratio?: number, quality?: number): Promise<string>;
    /**
     * helper to evaluate the compression rate
     * @param s the image in base64 string format
     */
    static byteCount(s: string): number;
}
