/**
 * STRICH SDK error class
 */
export class SdkError extends Error {
    /**
     * Flag indicating if this error is related to camera access.
     */
    duringCameraAccess: boolean;
    /**
     * A localized error message, if available, otherwise this will contain the non-localized message.
     */
    localizedMessage: string;
    /**
     * An optional underlying error that caused this error.
     */
    cause?: Error;
    /**
     * An optional detail message to display to disambiguate multiple errors (not-translated)
     */
    detailMessage?: string;
    constructor(keyOrMessage: string, cause?: Error);
}
/**
 * Configuration for the frame source (camera).
 */
export interface FrameSourceConfiguration {
    /**
     * Video frame resolution.
     *
     * The default resolution is 720p, which is usually enough for good quality
     * barcodes. You can try higher resolutions if you have very fine or
     * degraded codes, at the expense of higher computational requirements.
     *
     * @default hd
     */
    resolution?: 'hd' | 'full-hd' | 'auto';
}
export function defaultFrameSourceConfiguration(): FrameSourceConfiguration;
/**
 * The region of interest is specified as an inset between screen edge and RoE on each side,
 * expressed as a fractional value (between 0 and 0.5).
 *
 * For instance, to have an area that occupies the middle 80% horizontal area and 50% vertical area, you would
 * specify the region of interest as follows:
 *
 * ```json
 * { left: 0.1, right: 0.1, top: 0.25, bottom: 0.25 }
 * ```
 * (10% width inset on each side, 25% height inset on each side)
 */
export interface RegionOfInterest {
    /**
     * Left inset, relative [0 .. 0.5]
     *
     * @default A default is selected at run-time depending on enabled symbologies.
     */
    left: number;
    /**
     * Top inset, relative [0 .. 0.5]
     *
     * @default A default is selected at run-time depending on enabled symbologies.
     */
    top: number;
    /**
     * Right inset, relative [0 .. 0.5]
     *
     * @default A default is selected at run-time depending on enabled symbologies.
     */
    right: number;
    /**
     * Bottom inset, relative [0 .. 0.5]
     *
     * @default A default is selected at run-time depending on enabled symbologies.
     */
    bottom: number;
}
/**
 * Locator configuration
 */
export interface LocatorConfiguration {
    /**
     * The region of interest in viewport coordinates.
     */
    regionOfInterest?: RegionOfInterest;
    /**
     * Disregard colorful areas, assumes that codes are printed black on white.
     * This is an advanced configuration option, use with care.
     *
     * @default false
     */
    chromaReject?: boolean;
    /**
     * The locator implementation to use. This should normally not be changed, unless it is specifically required
     * to target WebGL 1.
     *
     * @default 'auto'
     */
    impl?: 'auto' | 'webgl1' | 'webgl2';
    /**
     * An advanced option for disabling asynchronous reads from GPU when using 'webgl2'.
     * Some older iOS versions have issues with WebGL2 asynchronous readbacks.
     *
     * @default false
     */
    forceSyncReadback?: boolean;
}
/**
 * The supported symbologies.
 */
export type SymbologyName = 'ean13' | 'ean8' | 'ean5' | 'ean2' | 'upca' | 'upce' | 'databar' | 'databar-exp' | 'code39' | 'code93' | 'code128' | 'i25' | 'codabar' | 'qr' | 'aztec' | 'datamatrix';
/**
 * For variable-length symbologies, min/max length can be specified in addition to the symbology.
 */
export type SymbologySpec = {
    /**
     * The name of the symbology.
     */
    name: SymbologyName;
    /**
     * The minimum length of the barcode, only has an effect for variable-length symbologies.
     */
    minLen?: number;
    /**
     * The maximum length of the barcode, only has an effect for variable-length symbologies.
     */
    maxLen?: number;
};
/**
 * Engine configuration
 */
export interface EngineConfiguration {
    /**
     * The enabled symbologies.
     *
     * It is highly recommended to configure only the symbologies required by
     * your application.
     *
     * An empty array or undefined is interpreted as 'all symbologies enabled'.
     *
     * @default undefined (all symbologies enabled - NOT RECOMMENDED)
     */
    symbologies?: (SymbologyName | SymbologySpec)[];
    /**
     * The number of scanlines to run over a located barcode candidate.
     *
     * @default 10
     */
    numScanlines?: number;
    /**
     * The number of scanlines that need to decodd successfully for a valid
     * decode.
     *
     * Increasing this parameter reduces the possibility of a misread, but
     * makes it more likely for degraded codes to not be read at all.
     *
     * The default value is two scanlines and usually should not be changed.
     *
     * @default 2
     */
    minScanlinesNeeded?: number;
    /**
     * Toggle recognition of inverted barcodes (light print on dark background).
     *
     * @default false
     */
    invertedCodes?: boolean;
    /**
     * Time interval in milliseconds during which multiple detections of the same code are not repeated.
     *
     * The default behavior is to pass through detections as they are detected and not perform any filtering.
     *
     * It is recommended to set a low duplicateInterval as scans are metered in non-Enterprise subscriptions.
     */
    duplicateInterval?: number;
    /**
     * Hysteresis parameterization for 1D barcodes with weak checksums.
     *
     * This parameter sets the minimum threshold for the number of detections of a barcode in the hysteresis
     * window for it to be accepted.
     *
     * Setting this parameter to 0 disables hysteresis (default behavior for versions <= 1.1.0)
     *
     * @default 2
     */
    hysteresisMinCount?: number;
    /**
     * Hysteresis parameterization for 1D barcodes with weak checksums.
     *
     * This parameter sets the size of the hysteresis window in milliseconds.
     *
     * @default 350
     */
    hysteresisInterval?: number;
}
/**
 * Overlay configuration
 */
export interface OverlayConfiguration {
    /**
     * Indicate if a horizontal line should be drawn to aid in positioning 1D barcodes.
     *
     * @default true
     */
    showTargetingLine?: boolean;
    /**
     * Indicate if the overlay should draw the bounding boxes of detected barcodes on top of the camera preview.
     *
     * @default true
     */
    showDetections?: boolean;
    /**
     * Indicate if the camera selector should be shown in the overlay.
     *
     * @default true
     */
    showCameraSelector?: boolean;
    /**
     * Indicate if the flashlight toggle should be shown in the overlay.
     *
     * Flashlight functionality is not supported in some browsers.
     *
     * @default true
     */
    showFlashlight?: boolean;
    /**
     * Override the STRICH logo displayed in the bottom-right corner with a custom image.
     *
     * The image is supplied as a URL (e.g. https://example.com/assets/overlay.png) or inline as a data URL
     * (recommended, avoids network request). The image should have a transparent background (WebP or PNG format
     * recommended) and a recommended size of 140x30 pixels.
     *
     * This is an enterprise-only capability.
     */
    customLogoSrc?: string;
}
/**
 * User feedback configuration
 */
export interface FeedbackConfiguration {
    /**
     * If true, an audible beep will be emitted upon successful scan.
     *
     * @default true
     */
    audio?: boolean;
    /**
     * If true, a vibration will be emitted upon successful scan (where supported by device).
     *
     * @default true
     */
    vibration?: boolean;
}
/**
 * BarcodeReader configuration object.
 */
export interface Configuration {
    /**
     * CSS Selector or reference to the HTML element that will host the visible elements of
     * the BarcodeReader.
     *
     * When using a selector, make sure the selector only matches a single element.
     */
    selector: string | HTMLElement;
    /**
     * Mode: can be 'immediate' (default) for always-on scanning, and 'touch', to only scan when a touch occurs.
     *
     * @default immediate
     */
    mode?: 'immediate' | 'touch';
    /**
     * Frame source configuration
     */
    frameSource?: FrameSourceConfiguration;
    /**
     * Locator configuration
     */
    locator?: LocatorConfiguration;
    /**
     * Engine configuration
     */
    engine?: EngineConfiguration;
    /**
     * Overlay configuration
     */
    overlay?: OverlayConfiguration;
    /**
     * Feedback configuration
     */
    feedback?: FeedbackConfiguration;
}
/**
 * A point in two-dimensional space.
 *
 * The y coordinate origin starts at the top.
 */
export interface Point {
    x: number;
    y: number;
}
/**
 * The size of a bounding box, represented by its width and height.
 */
export interface Size {
    width: number;
    height: number;
}
/**
 * An axis-aligned rectangle in two-dimensional space.
 */
export interface Rect {
    /**
     * The origin of the rectangle.
     */
    origin: Point;
    /**
     * The size of the rectangle.
     */
    size: Size;
}
/**
 * Before the STRICH SDK {@link BarcodeReader} can be used, a one-time initialization of the SDK must be performed.
 */
export class StrichSDK {
    /**
     * Return the version of the STRICH SDK.
     */
    static version(): string;
    /**
     * Return true if the SDK was successfully initialized, false otherwise.
     */
    static isInitialized(): boolean;
    /**
     * One-time initialization of the SDK.
     *
     * @param licenseKey The license key obtained from the Customer Portal.
     */
    static initialize(licenseKey: string): Promise<void>;
    /**
     * Set custom ID for analytics.
     *
     * The custom ID is independent of the device ID, and can be used for custom device
     * identifiers, location identifiers or anonymous user identifiers.
     *
     * USING THE CUSTOM ID TO TRANSMIT PERSONALLY IDENTIFYING DATA IS FORBIDDEN AND
     * CONSTITUTES A BREACH OF THE TERMS OF THE LICENSE AGREEMENT.
     *
     * @param customId The custom ID. Use `null` to unset the custom ID.
     * @default No custom ID is set by default
     */
    static setCustomId(customId: string | null): void;
    /**
     * Override the language that was detected from the browser's language (navigator.language)
     *
     * @param lang ISO language code, e.g. 'en'
     */
    static setLanguage(lang: string): void;
    /**
     * Check if the browser has access to a camera device, which is required for scanning barcodes.
     * This can be used as a check if a BarcodeReader should be presented, or a fallback to a manual input method
     * or error page should be displayed.
     *
     * @return A Promise that resolves to a boolean value indicating if a camera is available. The Promise will reject
     * if the check fails for any reason (including missing/denied permissions).
     */
    static hasCameraDevice(): Promise<boolean>;
}
/**
 * A code detection reported by the STRICH SDK.
 */
export interface CodeDetection {
    /**
     * The textual data contained in the code.
     */
    data: string;
    /**
     * The type of detected code.
     */
    typeName: string;
    /**
     * Supplemental data for this code.
     */
    supplementalData: string | null;
    /**
     * The bounding rectangle in which the code was detected.
     *
     * Note: this might not be precise, especially for 1D barcodes.
     */
    boundingRect: Rect;
    /**
     * The time of detection.
     */
    time: number;
    /**
     * The raw contained bytes contained in the code.
     */
    rawData: Uint8Array;
}
/**
 * BarcodeReader is the primary interface of the STRICH SDK.
 */
export class BarcodeReader {
    /**
     * User-supplied barcode detection handler.
     *
     * This is a synchronous call, so further processing will not happen until the handler returns.
     */
    detected?: (detections: CodeDetection[]) => (void);
    /**
     * Optional user-supplied error callback.
     *
     * This is invoked by the BarcodeReader if an error occurred while processing frames, and is usually not
     * recoverable.
     */
    onError?: (error: Error) => (void);
    /**
     * Create a new BarcodeReader using a Configuration.
     *
     * @param configuration A configuration object.
     */
    constructor(configuration: Configuration);
    /**
     * Initialize the BarcodeReader instance.
     *
     *
     *
     * @return A promise resolving to an initialized BarcodeReader instance, or an error object.
     */
    initialize(): Promise<BarcodeReader>;
    /**
     * Start scanning for barcodes.
     */
    start(): Promise<void>;
    /**
     * Stop the BarcodeReader instance.
     *
     * This will temporarily suspend processing of camera frames / detection of codes.
     */
    stop(): Promise<void>;
    /**
     * Destroy this BarcodeReader instance, making it unusable.
     *
     * This will release all associated resources, and should be called whenever an application no longer needs to
     * scan.
     */
    destroy(): void;
    /**
     * Show/hide the BarcodeReader instance.
     *
     * @param visible True/false for visible/hidden
     */
    setVisible(visible: boolean): Promise<void>;
    /**
     * @return the current visibility of this BarcodeReader instance
     */
    getVisible(): boolean;
}

//# sourceMappingURL=strich.d.ts.map
