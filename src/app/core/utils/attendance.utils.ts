export const STD_MINUTES = 450; // ۷ ساعت و نیم

export const toMin = (t: string) => {
  const [h, m] = t.split(':').map(Number);
  return h * 60 + m;
};

const pad = (n: number) => String(n).padStart(2, '0');

export const nowHM = (d = new Date()) =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}`;

export const ymd = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const clock = (min: number) =>
  `${pad(Math.floor(min / 60) % 24)}:${pad(((min % 60) + 60) % 60)}`;

export const dur = (min: number) => {
  const a = Math.abs(Math.round(min));
  const h = Math.floor(a / 60);
  const m = a % 60;
  if (h === 0) return `${m} دقیقه`;
  return m === 0 ? `${h} ساعت` : `${h} ساعت و ${m} دقیقه`;
};

export const fa = (s: string | number) =>
  String(s).replace(/\d/g, (d) => '۰۱۲۳۴۵۶۷۸۹'[+d]);

/** سال-ماه شمسی برای گروه‌بندی ماهانه */
export const jalaliYM = (iso: string) =>
  new Intl.DateTimeFormat('en-US-u-ca-persian', {
    year: 'numeric',
    month: 'numeric',
  })
    .formatToParts(new Date(iso + 'T12:00:00'))
    .filter((p) => p.type === 'year' || p.type === 'month')
    .map((p) => p.value)
    .join('-');

/** مجموع حضور خالص؛ اگر liveMin بدهی، ورود بازمانده تا همان لحظه حساب می‌شود */
export function dayNet(times: string[], liveMin?: number) {
  let sum = 0;
  for (let i = 0; i + 1 < times.length; i += 2) {
    sum += toMin(times[i + 1]) - toMin(times[i]);
  }
  if (times.length % 2 === 1 && liveMin !== undefined) {
    sum += liveMin - toMin(times[times.length - 1]);
  }
  return sum;
}
