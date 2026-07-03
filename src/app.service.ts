import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'API EPQ en línea - Version 2.0';
  }
}
