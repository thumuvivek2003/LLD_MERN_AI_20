export default function MailBody({ body }) {
  return (
    <div className="whitespace-pre-wrap px-6 pb-6 text-[15px] leading-relaxed text-slate-700">
      {body}
    </div>
  );
}
