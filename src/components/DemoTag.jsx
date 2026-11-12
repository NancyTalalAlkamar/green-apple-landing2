// علامة "محتوى تجريبي" فوق الأقسام اللي فيها بيانات مش حقيقية لسا.
// لما يوصل المحتوى الحقيقي، منشيل <DemoTag> من App.jsx وبيضل القسم لحاله.
export default function DemoTag({ children, label = 'محتوى تجريبي · رح يتبدّل بالمحتوى الحقيقي من لوحة التحكم' }) {
  return (
    <div className="relative">
      <div className="pointer-events-none absolute -top-5 inset-x-0 z-20 flex justify-center px-4">
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-3.5 py-1.5 text-center text-xs font-semibold text-amber-800 shadow-sm">
          <span className="size-2 shrink-0 rounded-full bg-amber-500" />
          {label}
        </span>
      </div>
      {children}
    </div>
  )
}