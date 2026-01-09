import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { filter } from 'rxjs/operators';

export interface ModalConfig {
  id: string;
  type: 'confirm' | 'prompt';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  inputPlaceholder?: string;
  inputValue?: string;
}

export interface ModalResult {
  id: string;
  confirmed: boolean;
  value?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modal$ = new BehaviorSubject<ModalConfig | null>(null);
  private result$ = new BehaviorSubject<ModalResult | null>(null);

  getModal() {
    return this.modal$.asObservable();
  }

  async confirm(title: string, message: string, confirmText = 'Confirm', cancelText = 'Cancel'): Promise<boolean> {
    const id = Date.now().toString();

    const config: ModalConfig = {
      id,
      type: 'confirm',
      title,
      message,
      confirmText,
      cancelText
    };

    this.modal$.next(config);

    const result = await firstValueFrom(
      this.result$.pipe(filter(r => r !== null && r.id === id))
    );

    this.modal$.next(null);
    this.result$.next(null);

    return result.confirmed;
  }

  async prompt(title: string, message: string, placeholder = '', defaultValue = '', confirmText = 'OK', cancelText = 'Cancel'): Promise<string | null> {
    const id = Date.now().toString();

    const config: ModalConfig = {
      id,
      type: 'prompt',
      title,
      message,
      confirmText,
      cancelText,
      inputPlaceholder: placeholder,
      inputValue: defaultValue
    };

    this.modal$.next(config);

    const result = await firstValueFrom(
      this.result$.pipe(filter(r => r !== null && r.id === id))
    );

    this.modal$.next(null);
    this.result$.next(null);

    return result.confirmed ? (result.value || '') : null;
  }

  resolve(id: string, confirmed: boolean, value?: string) {
    this.result$.next({ id, confirmed, value });
  }

  close() {
    if (this.modal$.value) {
      this.result$.next({ id: this.modal$.value.id, confirmed: false });
    }
  }
}
