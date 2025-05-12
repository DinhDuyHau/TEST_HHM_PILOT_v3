import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { environment } from '@environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private connection!: signalR.HubConnection;
  private isConnected = false;

  // Khởi tạo kết nối SignalR
  public startConnection(): void {
    if (this.isConnected) return;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiBankUrl}/paymentHub`) // Đúng route backend mapHub
      .withAutomaticReconnect()
      .build();

    this.connection.start()
      .then(() => {
        // console.log('[SignalR] Connected');
        this.isConnected = true;
      })
      .catch(err => {
        console.error('[SignalR] Connection error:', err);
      });
  }

  // Lắng nghe message từ 'ReceivePaymentStatus' server
  public onPaymentReceived(callback: (data: any) => void): void {
    this.connection.on('ReceivePaymentStatus', callback);
  }

  // Dừng connection
  public stopConnection(): void {
    if (this.connection && this.isConnected) {
      this.connection.stop();
      this.isConnected = false;
    }
  }
}
