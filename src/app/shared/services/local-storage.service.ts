import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  /**
   * Gets the value from localstorage if the key is provided.
   * @param key storage key
   */
  get(key: string): any {

    if (this.has(key)) {
      console.log(`%cGetting from localstorage ${key}`, 'color: green');
      return localStorage.getItem(key);
    }
  }

  /**
   * Sets the value with key in the cache
   * Notifies all observers of the new value
   */
  set(key: string, value: any): void {
    localStorage.setItem(key, value);
  }

  /**
   * Checks if the a key exists in cache
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null ? true : false;
  }
}
