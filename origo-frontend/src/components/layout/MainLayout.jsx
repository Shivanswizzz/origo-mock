import { Navbar } from './Navbar';
import { Footer } from './Footer';

export function MainLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <Footer />
    </div>
  );
}
