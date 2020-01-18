import { Pipe, PipeTransform } from '@angular/core';
import { AuthserviceService } from '../services/auth/authservice.service';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {

  constructor(public authService: AuthserviceService) {}

  transform(val: number): any {
    return parseInt(this.authService.user.role, 10) <= val ? true : false;
  }

}
