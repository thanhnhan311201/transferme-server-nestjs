import {
  UseInterceptors,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToInstance } from 'class-transformer';

interface ClassConstructor {
  // eslint-disable-next-line no-unused-vars
  new (...args: any[]): object;
}

export class SerializeInterceptor implements NestInterceptor {
  // eslint-disable-next-line no-unused-vars
  constructor(private dto: ClassConstructor) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by
    // by the request handler

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent our

        console.log(
          plainToInstance(this.dto, data.data.user, {
            excludeExtraneousValues: true,
          }),
        );
        return data;
        // return plainToInstance(this.dto, data, {
        //   excludeExtraneousValues: true,
        // });
      }),
    );
  }
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}
