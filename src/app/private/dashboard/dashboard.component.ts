import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  AttendanceService,
  Punch,
} from '../../core/services/attendance.service';
import {
  clock,
  dayNet,
  dur,
  fa,
  jalaliYM,
  nowHM,
  STD_MINUTES,
  toMin,
  ymd,
} from '../../core/utils/attendance.utils';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private svc = inject(AttendanceService);

  readonly fa = fa;
  readonly dur = dur;

  now = signal(new Date());
  editingId = signal<number | null>(null);
  editTime = signal('');

  constructor() {
    const t = setInterval(() => this.now.set(new Date()), 30_000);
    inject(DestroyRef).onDestroy(() => clearInterval(t));
  }

  today = computed(() => ymd(this.now()));
  nowMin = computed(() => toMin(nowHM(this.now())));

  todayDate = computed(() =>
    new Intl.DateTimeFormat('fa-IR', { dateStyle: 'full' }).format(this.now()),
  );

  todayPunches = computed(() =>
    this.svc
      .punches()
      .filter((p) => p.date === this.today())
      .sort((a, b) => a.time.localeCompare(b.time)),
  );

  /** ردیف‌ها: زوج‌ها ورود، فردها خروج؛ برای هر خروج فاصله تا ورود بعدی */
  rows = computed(() => {
    const list = this.todayPunches();
    return list.map((p, i) => {
      const isIn = i % 2 === 0;
      const next = list[i + 1];
      let gap: number | null = null;
      let live = false;
      if (!isIn) {
        if (next) gap = toMin(next.time) - toMin(p.time);
        else {
          gap = this.nowMin() - toMin(p.time);
          live = true;
        }
      }
      return { ...p, isIn, gap, live };
    });
  });

  times = computed(() => this.todayPunches().map((p) => p.time));
  isInside = computed(() => this.times().length % 2 === 1);

  /** حضور خالص امروز (با احتساب زمان جاری اگر داخل هستی) */
  netToday = computed(() => dayNet(this.times(), this.nowMin()));

  /** ساعت خروج پیشنهادی */
  exitInfo = computed(() => {
    const t = this.times();
    const remaining = STD_MINUTES - this.netToday();
    if (t.length === 0) {
      return {
        label: 'اگر همین الان وارد شوی',
        time: clock(this.nowMin() + STD_MINUTES),
        done: false,
      };
    }
    if (this.isInside()) {
      if (remaining <= 0)
        return { label: 'ساعت کاری امروز کامل شده', time: '', done: true };
      return {
        label: 'ساعت خروج',
        time: clock(this.nowMin() + remaining),
        done: false,
      };
    }
    if (remaining <= 0)
      return { label: 'ساعت کاری امروز کامل شده', time: '', done: true };
    return {
      label: 'اگر همین الان وارد شوی',
      time: clock(this.nowMin() + remaining),
      done: false,
    };
  });

  /** کسری / اضافه‌کار ماه شمسی جاری */
  monthBalance = computed(() => {
    const ym = jalaliYM(this.today());
    const byDate = new Map<string, string[]>();
    for (const p of [...this.svc.punches()].sort((a, b) =>
      a.time.localeCompare(b.time),
    )) {
      if (jalaliYM(p.date) !== ym) continue;
      byDate.set(p.date, [...(byDate.get(p.date) ?? []), p.time]);
    }
    let balance = 0;
    byDate.forEach((times, date) => {
      const live = date === this.today() ? this.nowMin() : undefined;
      balance += dayNet(times, live) - STD_MINUTES;
    });
    return { balance, days: byDate.size };
  });

  register() {
    this.svc.add(this.today(), nowHM());
  }

  startEdit(p: Punch) {
    this.editingId.set(p.id);
    this.editTime.set(p.time);
  }

  saveEdit() {
    const id = this.editingId();
    if (id !== null && this.editTime()) this.svc.update(id, this.editTime());
    this.editingId.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  remove(id: number) {
    if (confirm('این تردد حذف شود؟')) this.svc.remove(id);
  }
}
