import { useLang } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
import CitySkyline from '@/components/CitySkylline';

export default function Footer() {
  const { tr } = useLang();

  return (
    <footer className="relative bg-accent text-accent-foreground overflow-hidden">
      {/* City skyline at bottom */}
      <CitySkyline className="absolute bottom-0 left-0 w-full h-64" />

      <div className="container mx-auto px-4 pt-12 pb-20 relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <img src={logo} alt="GetDoIt" className="h-16 mb-4" style={{ filter: 'brightness(0) invert(1)' }} />
            <p className="text-sm opacity-70">{tr.footer.rights}</p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.forClients}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.createTask}</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.categories}</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.howItWorksLink}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.forProviders}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.findTasks}</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.becomeProvider}</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.pricing}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.company}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#" className="hover:opacity-100 transition-opacity">{tr.footer.about}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
