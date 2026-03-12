import './App.css'
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import Landing from '@/pages/Landing';
import Products from '@/pages/Products';
import ProductDetail from '@/pages/ProductDetail';
import Calculator from '@/pages/Calculator';
import Documentation from '@/pages/Documentation';
import Impressum from '@/pages/Impressum';
import Datenschutz from '@/pages/Datenschutz';
import NotFound from '@/pages/NotFound';


function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/products" element={<Products />} />
          <Route path="/productdetail" element={<ProductDetail />} />
          <Route path="/calculator" element={<Calculator />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/impressum" element={<Impressum />} />
          <Route path="/datenschutz" element={<Datenschutz />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
      <Toaster />
    </BrowserRouter>
  )
}

export default App
