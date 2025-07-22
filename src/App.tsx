import React from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import AidaMarketingHook from './components/AidaMarketingHook';
import LeadForm from './components/LeadForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <Header />
      <main>
        <Hero />
        <AidaMarketingHook />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}

export default App;
