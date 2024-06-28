import { Component, OnInit } from '@angular/core';
import { AuthenticationService, NotificationService } from '@app/_services';
import { MessagingService } from '@app/_services/message.service';

@Component({ template: '' })
export class LogoutComponent implements OnInit {
  constructor(private authService: AuthenticationService,
    private messagingService: MessagingService,
    private notificationService: NotificationService) { }

  ngOnInit() {
    this.notificationService.deleteToken().subscribe((res) => {
      this.authService.logout();
    });
    // window.location.href = '/login';

  }
}
