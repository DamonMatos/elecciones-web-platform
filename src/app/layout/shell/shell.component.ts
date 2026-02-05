import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbsComponent } from '../breadcrumbs/breadcrumbs.component';
import { FooterComponent } from '../footer/footer/footer.component';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SidebarComponent, BreadcrumbsComponent, FooterComponent],
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.css'],
})
export class ShellComponent {

  currentYear = new Date().getFullYear();

}
