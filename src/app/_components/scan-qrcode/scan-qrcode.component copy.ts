// import { Component, Inject } from '@angular/core';
// import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
// import { LookupComponent } from '../lookup/lookup.component';
// import { BarcodeFormat } from '@zxing/library';
// import { BehaviorSubject } from 'rxjs';
// import { MatSnackBar } from '@angular/material/snack-bar';
// @Component({
//   selector: 'app-scan-qrcode',
//   templateUrl: './scan-qrcode.component.html',
//   styleUrls: ['./scan-qrcode.component.scss']
// })
// export class ScanQrcodeComponent {
//   title = '';
//   availableDevices!: MediaDeviceInfo[];
//   availableDevicesSelect!: MediaDeviceInfo[];
//   currentDevice!: MediaDeviceInfo | undefined;

//   currentCameraType = '1';
//   availableCameraType = [
//     { id: '1', name: 'Barcode' },
//     { id: '2', name: 'QR code' }
//   ];

//   formatsEnabled: BarcodeFormat[] = [
//     BarcodeFormat.CODE_128,
//     BarcodeFormat.DATA_MATRIX,
//     BarcodeFormat.EAN_13,
//     BarcodeFormat.QR_CODE,
//   ];

//   hasDevices!: boolean;
//   hasPermission = true;

//   qrResultString!: string;

//   torchEnabled = false;
//   torchAvailable$ = new BehaviorSubject<boolean>(false);
//   tryHarder = true;

//   constructor(
//     public dialogRef: MatDialogRef<LookupComponent>,
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     private snackBar: MatSnackBar,
//   ) {
//     this.title = '';
//   }
//   onScanSuccess(result: any): void {
//     // this.dialogRef.close(result.getText());
//     console.log('QR code result:', result.getText());
//   }
//   onClickDelete() {
//     this.dialogRef.close();
//   }
//   onClickClose() {
//     this.dialogRef.close();
//   }

//   clearResult(): void {
//     this.qrResultString = '';
//   }

//   onCamerasFound(devices: MediaDeviceInfo[]): void {
//     this.availableDevices = devices;
//     this.hasDevices = Boolean(devices && devices.length);
//     if (devices.length) {
//       this.currentDevice = devices[0];
//     }
//     this.availableDevicesSelect = [{
//       deviceId: '', groupId: '', kind: 'audioinput', label: 'Chọn máy ảnh', toJSON() {
//         return '';
//       },
//     }, ...this.availableDevices];
//   }

//   onCodeResult(resultString: string) {
//     this.snackBar.open(resultString);
//     // this.dialogRef.close(resultString);
//     // console.log(resultString);

//     // this.qrResultString = resultString;
//   }

//   onDeviceSelectChange($event: string) {
//     const selected = $event;
//     // const device = this.availableDevices.find(x => x.deviceId === selected);
//     // if (device !== undefined) {
//     //   if (device.deviceId == '') {
//     //     this.currentDevice = device || undefined;
//     //   }
//     //   else {
//     //     this.currentDevice = device;
//     //   }
//     // }
//     const device = this.availableDevices.find((x) => x.deviceId === selected);
//     this.currentDevice = device || undefined;
//   }
//   onTypeCameraSelectChange($event: string) {
//     this.currentCameraType = $event;
//   }

//   openFormatsDialog() {
//     const data = {
//       formatsEnabled: this.formatsEnabled,
//     };

//     // this._dialog
//     //   .open(FormatsDialogComponent, { data })
//     //   .afterClosed()
//     //   .subscribe(x => { if (x) { this.formatsEnabled = x; } });
//   }

//   onHasPermission(has: boolean) {
//     this.hasPermission = has;
//   }

//   openInfoDialog() {
//     const data = {
//       hasDevices: this.hasDevices,
//       hasPermission: this.hasPermission,
//     };

//     // this._dialog.open(AppInfoDialogComponent, { data });
//   }

//   onTorchCompatible(isCompatible: boolean): void {
//     this.torchAvailable$.next(isCompatible || false);
//   }

//   toggleTorch(): void {
//     this.torchEnabled = !this.torchEnabled;
//   }

//   toggleTryHarder(): void {
//     this.tryHarder = !this.tryHarder;
//   }
// }
