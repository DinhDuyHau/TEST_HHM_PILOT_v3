import { AfterViewInit, Component, Inject, NgZone, OnDestroy } from '@angular/core';
import { BarcodeReader, CodeDetection, Configuration, SdkError } from './library/strich';
import { Router } from '@angular/router';

import { ScannerService } from './service/scanner.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { LookupComponent } from '../lookup/lookup.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { generateStringDate } from '@app/_common/commonFunction';

@Component({
  selector: 'app-scan-qrcode',
  templateUrl: './scan-qrcode.component.html',
  styleUrls: ['./scan-qrcode.component.scss']
})
export class ScanQrcodeComponent implements AfterViewInit, OnDestroy {

  errorMessage?: string;
  barcodeReader?: BarcodeReader;
  codeDetection?: CodeDetection;
  now = generateStringDate(new Date());
  constructor(private ngZone: NgZone,
    private router: Router,
    public dialogRef: MatDialogRef<LookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private snackBar: MatSnackBar,
    public scanner: ScannerService) {
  }

  ngAfterViewInit() {

    // BarcodeReader initialization in AfterViewInit (ensures that host element is present and layouted)
    try {
      const barcodeReader = new BarcodeReader(this.scanner.configuration);
      barcodeReader.initialize()
        .then(result => {
          this.barcodeReader = result;
          // register detection hook, run it in the Angular zone so change detection works
          this.barcodeReader.detected = (detections) => {
            this.ngZone.run(() => {
              this.codeDetection = detections[0];

              // // also keep track of detections (to show "last code detected" in home)
              // this.scanner.onCodeDetected(detections[0]);
              this.dialogRef.close(detections[0].data);
            });
          };

          // start reading codes
          this.barcodeReader.start().then(() => {
            //
          }).catch(err => {
            this.errorMessage = `BarcodeReader failed to start: ${err}`;
          });
        })
        .catch(err => {
          this.errorMessage = `BarcodeReader failed to initialize: ${err}`;
        });
    } catch (err) {
      if (err instanceof SdkError) {
        this.errorMessage = err.message;
      } else {
        this.errorMessage = 'An unknown error occurred';
      }
    }
  }

  ngOnDestroy() {
    // release BarcodeReader, freeing up camera
    this.barcodeReader?.destroy();
  }

  dismissDetection() {
    this.codeDetection = undefined;
  }

  finishScanning() {
    this.dialogRef.close();
    // return this.router.navigate(['/home']);
  }

  // goToSingleScanning() {
  //   return this.router.navigate(['/scan-single']);
  // }
}
