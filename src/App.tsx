import { NuqsAdapter } from 'nuqs/adapters/react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ScrollToTop from './components/ui/ScrollToTop';
import Services from './pages/Services';
import Document from './pages/Document';
import Government from './pages/Government';
import Search from './pages/Search';
import About from './pages/About';
import NotFound from './pages/NotFound';
import ComingSoon from './pages/ComingSoon';
import { COMING_SOON } from './config/launch';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  if (COMING_SOON) {
    return (
      <HelmetProvider>
        <ComingSoon />
      </HelmetProvider>
    );
  }

  return (
    <HelmetProvider>
      <Router>
        <NuqsAdapter>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/search" element={<Search />} />
              <Route path="/services/:category" element={<Services />} />
              <Route path="/services" element={<Services />} />
              <Route
                path="/services/:category/:documentSlug"
                element={<Document categoryType="service" />}
              />
              <Route path="/government/:category" element={<Government />} />
              <Route path="/government" element={<Government />} />
              <Route
                path="/government/:category/:documentSlug"
                element={<Document categoryType="government" />}
              />
              {/*
                The former catch-alls, /:lang/:documentSlug and /:documentSlug,
                were removed rather than kept. Document requires a category and
                a categoryType to resolve a file, and neither route supplied
                either, so both fell straight through to the "No document
                specified" error every time. They could not serve a document,
                only make a dead URL look like a broken page. Unmatched paths
                now land on a real 404 instead.
              */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
          </div>
        </NuqsAdapter>
      </Router>
    </HelmetProvider>
  );
}

export default App;
