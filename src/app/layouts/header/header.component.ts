import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, HostBinding, inject } from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { ProfileImageService } from '@app/core/services/profile-image.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @HostBinding('class') hostClass =
    'header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500 shadow-sm dark:border-b dark:border-b-coal-100';
  @HostBinding('attr.role') hostRole = 'banner';
  @HostBinding('attr.data-sticky') dataSticky = 'true';
  @HostBinding('attr.data-sticky-name') dataStickyName = 'header';
  @HostBinding('id') hostId = 'header';

  private profileImageService = inject(ProfileImageService);
  private store = inject(Store);

  public usuario$ = this.store.select(selectCurrentUser);
  public profileImageThumbnail = this.profileImageService.profileImageThumbnail;
  // public contenedorNombre$: Observable<string>;

  public menuItems: any[] = [
    {
      titulo: 'Perfil',
      icono: 'ki-filled ki-user',
      link: '/perfil',
    },
  ];

  // constructor() {
  //   super();
  // }

  // getUserImageUrl() {
  //   return this.usuario$?.pipe(map((usuario) => {
  //     if(usuario?.imagen.includes('defecto')){
  //       return usuario?.imagen;
  //     } else {
  //       return `${usuario?.imagen}?${new Date().getTime()}`;
  //     }
  //   }));
  // }

  // ngOnInit(): void {
  //   this.contenedorNombre$ = this.store.select(obtenerContenedorNombre);
  // }
}
