import { Layout } from 'antd';

const { Footer: AntFooter } = Layout;

export function Footer() {
  return (
    <AntFooter className="bg-transparent text-slate-500 flex justify-between items-center px-8 py-6 text-[10px] font-bold tracking-widest font-label uppercase border-t border-slate-100">
      <div>© 2024 FISIO ÉLITE. THE CLINICAL ATELIER.</div>
      <div className="flex gap-8 text-teal-700">
        <a href="#" className="hover:text-teal-900 transition-colors">Support</a>
        <a href="#" className="hover:text-teal-900 transition-colors">Privacy Policy</a>
        <a href="#" className="hover:text-teal-900 transition-colors">Terms of Service</a>
      </div>
    </AntFooter>
  );
}
