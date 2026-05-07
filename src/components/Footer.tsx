import { useLang } from '@/contexts/LanguageContext';
import logo from '@/assets/logo.png';
import CitySkyline from '@/components/CitySkylline';

export default function Footer() {
  const { tr } = useLang();

  return (
    <footer className="relative bg-accent text-accent-foreground overflow-hidden">
      <CitySkyline className="absolute bottom-0 left-0 w-full h-80" />

      <div className="container mx-auto px-4 pt-12 pb-24 relative z-10">
        <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div>
           <img src={logo} alt="GetDoIt" className="h-20 w-auto mb-4 brightness-0 invert" />
            <p className="text-sm opacity-70">{tr.footer.rights}</p>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.forClients}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#/create-task" className="hover:opacity-100 transition-opacity">{tr.footer.createTask}</a></li>
              <li><a href="#/categories" className="hover:opacity-100 transition-opacity">{tr.footer.categories}</a></li>
              <li><a href="#how-it-works" className="hover:opacity-100 transition-opacity">{tr.footer.howItWorksLink}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.forProviders}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#/tasks" className="hover:opacity-100 transition-opacity">{tr.footer.findTasks}</a></li>
              <li><a href="#/auth" className="hover:opacity-100 transition-opacity">{tr.footer.becomeProvider}</a></li>
              <li><a href="#/categories" className="hover:opacity-100 transition-opacity">{tr.footer.pricing}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.blog}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#/blog/best-provider" className="hover:opacity-100 transition-opacity">{tr.footer.blogPost1}</a></li>
              <li><a href="#/blog/first-task" className="hover:opacity-100 transition-opacity">{tr.footer.blogPost2}</a></li>
              <li><a href="#/blog/online-safety" className="hover:opacity-100 transition-opacity">{tr.footer.blogPost3}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-display font-bold text-sm mb-3">{tr.footer.help}</h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li><a href="#/faq" className="hover:opacity-100 transition-opacity">{tr.footer.faq}</a></li>
              <li><a href="#/contact" className="hover:opacity-100 transition-opacity">{tr.footer.contact}</a></li>
              <li><a href="#/terms" className="hover:opacity-100 transition-opacity">{tr.footer.terms}</a></li>
              <li><a href="#/privacy" className="hover:opacity-100 transition-opacity">{tr.footer.privacy}</a></li>
              <li><a href="#/about" className="hover:opacity-100 transition-opacity">{tr.footer.about}</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
