export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-4">À propos</h3>
            <p className="text-sm">
              Votre boutique en ligne propulsée par PrestaShop
            </p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/products" className="hover:text-white">Produits</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-4">Contact</h3>
            <p className="text-sm">Email: contact@example.com</p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          © {new Date().getFullYear()} PrestaShop Next.js. Tous droits réservés.
        </div>
      </div>
    </footer>
  );
}
