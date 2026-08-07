// GET /api/packages
export const getPackages = async () => {
  await new Promise((resolve) => setTimeout(resolve, 300))
  return [
    { id: 'PKG-01', name: 'Royal Cinematic 4K', price: 850000 },
    { id: 'PKG-02', name: 'Heritage Multi-Day Gold', price: 620000 },
    { id: 'PKG-03', name: 'Destination Luxe Film', price: 1200000 },
    { id: 'PKG-04', name: 'Classic Memories Package', price: 350000 },
    { id: 'PKG-05', name: 'Signature Cinema + Album', price: 580000 }
  ]
}
