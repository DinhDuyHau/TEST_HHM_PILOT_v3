import { Component, EventEmitter, Inject, Output, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LookupComponent } from '../../../_components/lookup/lookup.component';
import { Observable, Subject } from 'rxjs';
import { WebcamImage, WebcamInitError } from 'ngx-webcam';
@Component({
  selector: 'app-webcam',
  templateUrl: './webcam.component.html',
  styleUrls: ['./webcam.component.scss'],
})
export class CameraComponent {
  title = '';


  facingMode: string = 'environment'; //Set rear camera 
  // facingMode: string = 'user';  //Set front camera
  allowCameraSwitch = false;

  trigger: Subject<void> = new Subject();
  imageData = {
    previewImage: '',
    dataBase64: '',
  }

  get $trigger(): Observable<void> {
    return this.trigger.asObservable();
  }

  snapshot(event: WebcamImage) {
    this.imageData.previewImage = event.imageAsDataUrl;
    this.imageData.dataBase64 = event.imageAsBase64;
  }
  constructor(
    public dialogRef: MatDialogRef<LookupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.title = '';
  }

  handleClick() {
    // console.log(123132321);
  }

  public get videoOptions(): MediaTrackConstraints {
    const result: MediaTrackConstraints = {};
    if (this.facingMode && this.facingMode !== '') {
      result.facingMode = { ideal: this.facingMode };
    }
    return result;
  }

  // Camera
  public handleInitError(error: WebcamInitError): void {
    if (error.mediaStreamError && error.mediaStreamError.name === "NotAllowedError") {
      console.warn("Camera access was not allowed by user!");
    }
  }

  handleCaptureImage() {
    this.trigger.next();
  }

  handleCaptureImageAgain() {
    this.imageData.previewImage = '';
    this.imageData.dataBase64 = '';
  }

  onClickClose() {
    this.dialogRef.close(this.imageData);
  }
}
