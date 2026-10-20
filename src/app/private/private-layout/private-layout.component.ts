import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-private-layout',
  standalone: true,
  imports: [SidebarComponent, HeaderComponent, RouterModule],
  templateUrl: './private-layout.component.html',
  styleUrl: './private-layout.component.scss',
})
export class PrivateLayoutComponent {
  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}
  onSidebarToggle(isExpanded: boolean) {
    // optional: adjust main content margin if needed
  }

  handleLogout() {
    this.authService.logout();
  }
}
