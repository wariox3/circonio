import { Component, HostBinding, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @HostBinding('class') hostClass =
    'sidebar h-100 dark:bg-coal-600 bg-light border-r border-r-gray-200 dark:border-r-coal-100 fixed z-20 lg:flex flex-col items-stretch shrink-0';
  @HostBinding('style') style = { height: '100% !important' };
  @HostBinding('attr.data-drawer') drawer = 'true';
  @HostBinding('attr.data-drawer-class') drawerClass = 'drawer drawer-start top-0 bottom-0';
  @HostBinding('attr.data-drawer-enable') drawerEnable = 'true|lg:false';
  @HostBinding('attr.id') id = 'sidebar';

  private router = inject(Router);

  public sidebarMenu: any[] = [
    {
      nombre: 'Perfil',
      link: '/perfil',
      iconoClase: 'ki-filled ki-user',
      activo: false,
    },
    {
      nombre: 'Seguridad',
      link: '/seguridad',
      iconoClase: 'ki-filled ki-lock',
      activo: false,
    },
    {
      nombre: 'Contenedores',
      link: '/contenedor',
      iconoClase: 'ki-filled ki-abstract-26',
      activo: false,
    },
    {
      nombre: 'Socio',
      link: '/socio',
      iconoClase: 'ki-filled ki-people',
      activo: false,
    },
    // {
    //   nombre: 'Titulo',
    //   link: '',
    //   iconoClase: 'ki-filled ki-setting-2',
    //   activo: false,
    //   tipoAcordion: true,
    //   children: [
    //     {
    //       nombre: 'Sub',
    //       link: '/administracion/vehiculo/lista',
    //     },
    //   ],
    // },
  ];

  isActive(link: string): boolean {
    return this.router.url === link;
  }
}
