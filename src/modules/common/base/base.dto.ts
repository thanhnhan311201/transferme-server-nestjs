import { plainToInstance } from 'class-transformer';

export abstract class BaseDto {
	static mapToDto<T>(this: new (...args: any[]) => T, obj: T): T {
		return plainToInstance(this, obj, { excludeExtraneousValues: true });
	}
}
