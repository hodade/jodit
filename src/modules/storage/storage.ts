/*!
 * Jodit Editor (https://xdsoft.net/jodit/)
 * Licensed under GNU General Public License version 2 or later or a commercial license or MIT;
 * For GPL see LICENSE-GPL.txt in the project root for license information.
 * For MIT see LICENSE-MIT.txt in the project root for license information.
 * For commercial licenses see https://xdsoft.net/jodit/commercial/
 * Copyright (c) 2013-2019 Valeriy Chupurnov. All rights reserved. https://xdsoft.net
 */

import { IStorage, StorageValueType } from '../../types';
import { camelCase } from '../helpers/string';
import { canUsePersistentStorage, LocalStorageProvider } from './localStorageProvider';
import { MemoryStorageProvider } from './memoryStorageProvider';

export const StorageKey: string = 'Jodit_';

export class Storage<T = StorageValueType> implements IStorage<T> {
	readonly prefix = StorageKey;

	set(key: string, value: T) {
		this.provider.set(camelCase(this.prefix + key), value);
	}

	get<R = T>(key: string): R | void {
		return this.provider.get<R>(camelCase(this.prefix + key));
	}

	exists(key: string): boolean {
		return this.provider.exists(camelCase(this.prefix + key));
	}

	clear(): void {
		return this.provider.clear();
	}

	protected constructor(readonly provider: IStorage<T>, suffix ?: string) {
		if (suffix) {
			this.prefix += suffix;
		}
	}

	static makeStorage(persistent: boolean = false, suffix?: string): IStorage {
		let provider;

		if (persistent && canUsePersistentStorage()) {
			provider = new LocalStorageProvider(StorageKey + suffix);
		}

		if (!provider) {
			provider = new MemoryStorageProvider();
		}

		return new Storage(provider, suffix);
	}
}
