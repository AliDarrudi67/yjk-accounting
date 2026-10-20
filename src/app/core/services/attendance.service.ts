import { Injectable, effect, signal } from '@angular/core';

export interface Punch {
  id: number;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

@Injectable({ providedIn: 'root' })
export class AttendanceService {
  private readonly KEY = 'attendance_punches';

  readonly punches = signal<Punch[]>(
    JSON.parse(localStorage.getItem(this.KEY) ?? '[]'),
  );

  constructor() {
    effect(() =>
      localStorage.setItem(this.KEY, JSON.stringify(this.punches())),
    );
  }

  add(date: string, time: string) {
    this.punches.update((l) => [...l, { id: Date.now(), date, time }]);
  }

  update(id: number, time: string) {
    this.punches.update((l) =>
      l.map((p) => (p.id === id ? { ...p, time } : p)),
    );
  }

  remove(id: number) {
    this.punches.update((l) => l.filter((p) => p.id !== id));
  }
}
