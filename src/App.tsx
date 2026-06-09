import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Countdown from './components/Countdown';
import Competition from './components/Competition';
import Details from './components/Details';
import Articles from './components/Articles';
import Registration from './components/Registration';
import Sponsors from './components/Sponsors';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden font-sans">
      <Navbar />
      <main>
        <Hero />
        <Countdown />
        <Competition />
        <Details />        
        <Registration />
        <Articles />
        <Sponsors />
      </main>
      <Footer />
    </div>
  );
}

export default App;
