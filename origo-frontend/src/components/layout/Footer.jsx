export function Footer() {
  return (
    <footer className="bg-bg-secondary/30 border-t border-white/5 pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Origo</h3>
            <p className="text-text-tertiary text-sm leading-relaxed">
              Where students meet, hang out & build real connections. Smart socialising for campus life.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-text-tertiary">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Features</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Safety</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Communities</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Download</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-text-tertiary">
              <li><a href="#" className="hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-text-tertiary">
              <li><a href="#" className="hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-primary-400 transition-colors">Guidelines</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-tertiary text-sm">© 2025 Origo. Built with ❤️ by students.</p>
          <div className="flex gap-4">
            {/* Social Icons Placeholder */}
            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">𝕏</div>
            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">Ig</div>
            <div className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center cursor-pointer transition-colors">Li</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
