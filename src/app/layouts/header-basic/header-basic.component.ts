import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header-basic',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './header-basic.component.html',
  styleUrl: './header-basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBasicComponent {
  @HostBinding('class') hostClass =
    'fixed py-4 top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500 shadow-sm dark:border-b dark:border-b-coal-100';
  @HostBinding('attr.role') hostRole = 'banner';
  @HostBinding('attr.data-sticky') dataSticky = 'true';
  @HostBinding('attr.data-sticky-name') dataStickyName = 'header';
  @HostBinding('id') hostId = 'header';

  private store = inject(Store);

  public usuario$ = this.store.select(selectCurrentUser);
  public contenedorNombre$: Observable<string>;

  public menuItems: any[] = [
    {
      titulo: 'Perfil',
      icono: 'ki-filled ki-user',
      link: '/perfil',
    },
    {
      titulo: 'Mis contenedores',
      icono: 'ki-filled ki-abstract-26',
      link: '/contenedor/lista',
    },
    {
      titulo: 'Facturación',
      icono: 'ki-cheque ki-abstract-26',
      link: '/facturacion/lista',
    },
  ];

  constructor() {}

  private imageTimestamp = Date.now();

  getUserImageUrl() {
    return this.usuario$?.pipe(
      map(usuario => {
        if (usuario?.imagen.includes('defecto')) {
          return usuario?.imagen;
        } else {
          return `${usuario?.imagen}?${new Date().getTime()}`;
        }
      })
    );
  }
}
