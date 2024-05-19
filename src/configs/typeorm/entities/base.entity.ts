import { plainToInstance } from 'class-transformer';
import {
	CreateDateColumn,
	DeleteDateColumn,
	PrimaryGeneratedColumn,
	UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@CreateDateColumn({
		name: 'create_at',
	})
	createAt: Date;

	@UpdateDateColumn({
		name: 'updated_at',
	})
	updatedAt: Date;

	@DeleteDateColumn({
		name: 'deleted_at',
	})
	deletedAt: Date;

	static mapToEntity<T>(this: new (...args: any[]) => T, obj: T): T {
		return plainToInstance(this, obj, { excludeExtraneousValues: true });
	}
}
