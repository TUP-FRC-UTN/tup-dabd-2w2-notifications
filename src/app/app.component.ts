import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NotificationsComponent } from '../modules/components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule,NotificationsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Notifications';
}




