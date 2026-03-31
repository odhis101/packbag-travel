'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { API_URL } from '@/lib/config';

// ─── Comprehensive world cities list ─────────────────────────────────────────
const WORLD_CITIES = [
  // Africa
  'Cape Town, South Africa', 'Johannesburg, South Africa', 'Durban, South Africa',
  'Pretoria, South Africa', 'Port Elizabeth, South Africa', 'Bloemfontein, South Africa',
  'Nairobi, Kenya', 'Mombasa, Kenya', 'Cairo, Egypt', 'Marrakech, Morocco',
  'Casablanca, Morocco', 'Lagos, Nigeria', 'Accra, Ghana', 'Addis Ababa, Ethiopia',
  'Dar es Salaam, Tanzania', 'Zanzibar, Tanzania', 'Kampala, Uganda',
  'Kigali, Rwanda', 'Luanda, Angola', 'Tunis, Tunisia', 'Algiers, Algeria',
  'Windhoek, Namibia', 'Gaborone, Botswana', 'Maputo, Mozambique',
  'Lusaka, Zambia', 'Harare, Zimbabwe', 'Victoria Falls, Zimbabwe',
  // Europe
  'London, United Kingdom', 'Paris, France', 'Rome, Italy', 'Barcelona, Spain',
  'Madrid, Spain', 'Amsterdam, Netherlands', 'Berlin, Germany', 'Vienna, Austria',
  'Prague, Czech Republic', 'Budapest, Hungary', 'Lisbon, Portugal', 'Athens, Greece',
  'Santorini, Greece', 'Dubrovnik, Croatia', 'Istanbul, Turkey', 'Zürich, Switzerland',
  'Geneva, Switzerland', 'Brussels, Belgium', 'Copenhagen, Denmark', 'Stockholm, Sweden',
  'Oslo, Norway', 'Helsinki, Finland', 'Reykjavik, Iceland', 'Warsaw, Poland',
  'Krakow, Poland', 'Bucharest, Romania', 'Sofia, Bulgaria', 'Valletta, Malta',
  'Monaco, Monaco', 'Luxembourg City, Luxembourg', 'Edinburgh, United Kingdom',
  // Americas
  'New York, USA', 'Los Angeles, USA', 'Miami, USA', 'Las Vegas, USA',
  'Chicago, USA', 'San Francisco, USA', 'New Orleans, USA', 'Washington DC, USA',
  'Cancún, Mexico', 'Mexico City, Mexico', 'Havana, Cuba', 'Cartagena, Colombia',
  'Bogotá, Colombia', 'Lima, Peru', 'Machu Picchu, Peru', 'Buenos Aires, Argentina',
  'Rio de Janeiro, Brazil', 'São Paulo, Brazil', 'Santiago, Chile',
  'Montevideo, Uruguay', 'Quito, Ecuador', 'La Paz, Bolivia',
  'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada',
  'Punta Cana, Dominican Republic', 'Nassau, Bahamas', 'San José, Costa Rica',
  // Asia
  'Dubai, UAE', 'Abu Dhabi, UAE', 'Doha, Qatar', 'Riyadh, Saudi Arabia',
  'Bangkok, Thailand', 'Phuket, Thailand', 'Chiang Mai, Thailand',
  'Singapore, Singapore', 'Bali, Indonesia', 'Jakarta, Indonesia',
  'Kuala Lumpur, Malaysia', 'Tokyo, Japan', 'Kyoto, Japan', 'Osaka, Japan',
  'Seoul, South Korea', 'Beijing, China', 'Shanghai, China', 'Hong Kong',
  'Taipei, Taiwan', 'Manila, Philippines', 'Hanoi, Vietnam', 'Ho Chi Minh City, Vietnam',
  'Hoi An, Vietnam', 'Kathmandu, Nepal', 'Mumbai, India', 'Delhi, India',
  'Goa, India', 'Jaipur, India', 'Maldives', 'Colombo, Sri Lanka',
  'Tbilisi, Georgia', 'Almaty, Kazakhstan',
  // Middle East
  'Jerusalem, Israel', 'Tel Aviv, Israel', 'Amman, Jordan', 'Petra, Jordan',
  'Muscat, Oman', 'Beirut, Lebanon',
  // Oceania
  'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia',
  'Gold Coast, Australia', 'Perth, Australia', 'Auckland, New Zealand',
  'Queenstown, New Zealand', 'Fiji', 'Bora Bora, French Polynesia',
].sort();

const TIERS = ['Luxury', 'Mid-Range', 'Budget'] as const;

interface Restaurant { name: string; cuisine: string; description: string; }
interface Attraction { name: string; description: string; }

interface Package {
  _id: string;
  title: string;
  city: string;
  tier: string;
  destination: string;
  description: string;
  price: number;
  duration: string;
  images: string[];
  included: string[];
  restaurants: Restaurant[];
  attractions: Attraction[];
  isActive: boolean;
}

const emptyRestaurant = (): Restaurant => ({ name: '', cuisine: '', description: '' });
const emptyAttraction = (): Attraction => ({ name: '', description: '' });

export default function AdminPackages() {
  const router = useRouter();
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPackage, setEditingPackage] = useState<Package | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [city, setCity] = useState('Cape Town, South Africa');
  const [citySearch, setCitySearch] = useState('Cape Town, South Africa');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [tier, setTier] = useState<string>('Luxury');
  const [destination, setDestination] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [includedItems, setIncludedItems] = useState<string[]>([]);
  const [includedInput, setIncludedInput] = useState('');
  const [restaurants, setRestaurants] = useState<Restaurant[]>([emptyRestaurant()]);
  const [attractions, setAttractions] = useState<Attraction[]>([emptyAttraction()]);

  // Image upload
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) { router.push('/admin/login'); return; }
    fetchPackages();
  }, []);

  useEffect(() => {
    return () => { previewUrls.forEach((u) => URL.revokeObjectURL(u)); };
  }, [previewUrls]);

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/packages`);
      const data = await res.json();
      setPackages(data.packages ?? []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const filteredCities = WORLD_CITIES.filter((c) =>
    c.toLowerCase().includes(citySearch.toLowerCase())
  ).slice(0, 8);

  const selectCity = (c: string) => {
    setCity(c);
    setCitySearch(c);
    setShowCityDropdown(false);
  };

  const addFiles = (files: File[]) => {
    const imgs = files.filter((f) => f.type.startsWith('image/'));
    setSelectedFiles((p) => [...p, ...imgs]);
    setPreviewUrls((p) => [...p, ...imgs.map((f) => URL.createObjectURL(f))]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    addFiles(Array.from(e.target.files ?? []));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(Array.from(e.dataTransfer.files));
  };

  const removeNewImage = (i: number) => {
    URL.revokeObjectURL(previewUrls[i]);
    setSelectedFiles((p) => p.filter((_, j) => j !== i));
    setPreviewUrls((p) => p.filter((_, j) => j !== i));
  };

  const removeExistingImage = (i: number) =>
    setExistingImages((p) => p.filter((_, j) => j !== i));

  const addIncluded = () => {
    const val = includedInput.trim();
    if (val && !includedItems.includes(val)) {
      setIncludedItems((p) => [...p, val]);
      setIncludedInput('');
    }
  };

  const uploadImages = async (token: string): Promise<string[]> => {
    if (!selectedFiles.length) return [];
    setUploading(true);
    try {
      const form = new FormData();
      selectedFiles.forEach((f) => form.append('images', f));
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const text = await res.text();
      console.log('Upload response:', res.status, text);
      const data = JSON.parse(text);
      return data.urls ?? [];
    } catch (e) {
      console.error('Upload failed:', e);
      return [];
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const token = localStorage.getItem('token') ?? '';
    try {
      const uploadedUrls = await uploadImages(token);
      const allImages = [...existingImages, ...uploadedUrls];
      console.log('Submitting — city:', city, '| images:', allImages, '| uploadedUrls:', uploadedUrls, '| selectedFiles:', selectedFiles.length);
      const payload = {
        title, city, tier, destination, description,
        price: Number(price), duration,
        images: allImages,
        included: includedItems,
        restaurants: restaurants.filter((r) => r.name.trim()),
        attractions: attractions.filter((a) => a.name.trim()),
      };
      const url = editingPackage
        ? `${API_URL}/api/packages/${editingPackage._id}`
        : `${API_URL}/api/packages`;
      const res = await fetch(url, {
        method: editingPackage ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      console.log('Save response:', res.status, text);
      if (res.ok) {
        fetchPackages(); setShowModal(false); resetForm();
      } else {
        try {
          const d = JSON.parse(text);
          alert(d.message || 'Save failed');
        } catch {
          alert('Save failed: ' + text);
        }
      }
    } catch (e) {
      console.error('Submit error:', e);
      alert('Something went wrong. Check the console.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this package?')) return;
    const token = localStorage.getItem('token') ?? '';
    setDeletingId(id);
    try {
      await fetch(`${API_URL}/api/packages/${id}`, {
        method: 'DELETE', headers: { Authorization: `Bearer ${token}` },
      });
      fetchPackages();
    } finally { setDeletingId(null); }
  };

  const handleEdit = (pkg: Package) => {
    setEditingPackage(pkg);
    setTitle(pkg.title);
    setCity(pkg.city || '');
    setCitySearch(pkg.city || '');
    setTier(pkg.tier || 'Luxury');
    setDestination(pkg.destination || '');
    setDescription(pkg.description);
    setPrice(String(pkg.price));
    setDuration(pkg.duration);
    setIncludedItems(pkg.included || []);
    setRestaurants(pkg.restaurants?.length ? pkg.restaurants : [emptyRestaurant()]);
    setAttractions(pkg.attractions?.length ? pkg.attractions : [emptyAttraction()]);
    setExistingImages(pkg.images || []);
    setSelectedFiles([]); setPreviewUrls([]);
    setShowModal(true);
  };

  const DEFAULT_CITY = 'Cape Town, South Africa';

  const resetForm = () => {
    setEditingPackage(null);
    setTitle(''); setCity(DEFAULT_CITY); setCitySearch(DEFAULT_CITY); setTier('Luxury');
    setDestination(''); setDescription(''); setPrice(''); setDuration('');
    setIncludedItems([]); setIncludedInput('');
    setRestaurants([emptyRestaurant()]); setAttractions([emptyAttraction()]);
    previewUrls.forEach((u) => URL.revokeObjectURL(u));
    setSelectedFiles([]); setPreviewUrls([]); setExistingImages([]);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); localStorage.removeItem('user');
    router.push('/admin/login');
  };

  const packagesByCity = (packages ?? []).reduce<Record<string, Package[]>>((acc, pkg) => {
    const c = pkg.city || 'Uncategorized';
    (acc[c] = acc[c] || []).push(pkg);
    return acc;
  }, {});

  const resolveImg = (url: string) =>
    url.startsWith('/uploads') ? `${API_URL}${url}` : url;

  if (loading) {
    return (
      <div className="blue-gradient min-h-screen flex flex-col items-center justify-center">
        <div className="w-10 h-10 border-4 border-white/30 border-t-white rounded-full animate-spin mb-3" />
        <p className="text-white/70">Loading...</p>
      </div>
    );
  }

  return (
    <div className="blue-gradient min-h-screen">
      {/* Nav */}
      <nav className="bg-white/10 backdrop-blur-sm px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-white text-2xl font-bold">PackBag Admin</h1>
          <div className="flex gap-6">
            <Link href="/admin/packages" className="text-white hover:text-white/70 transition text-sm">Packages</Link>
            <Link href="/admin/bookings" className="text-white hover:text-white/70 transition text-sm">Bookings</Link>
            <button onClick={handleLogout} className="text-white/60 hover:text-white transition text-sm">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-white text-4xl font-bold">Manage Packages</h2>
          <button
            onClick={() => { resetForm(); setShowModal(true); }}
            className="px-6 py-3 rounded-xl bg-white text-blue-900 font-semibold hover:bg-white/90 transition-all shadow-lg"
          >
            + Add Package
          </button>
        </div>

        {Object.keys(packagesByCity).length === 0 ? (
          <div className="bg-white/10 rounded-2xl p-16 text-center">
            <p className="text-white/50">No packages yet. Click &quot;+ Add Package&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {Object.entries(packagesByCity).map(([c, pkgs]) => (
              <div key={c}>
                <h3 className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-3">{c}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {pkgs.map((pkg) => (
                    <div key={pkg._id} className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden group">
                      <div className="relative h-36 overflow-hidden">
                        {pkg.images?.length ? (
                          <img src={resolveImg(pkg.images[0])} alt={pkg.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        ) : (
                          <div className="w-full h-full bg-white/5 flex items-center justify-center">
                            <span className="text-white/20 text-xs">No image</span>
                          </div>
                        )}
                        <span className="absolute top-2 right-2 text-xs px-2 py-0.5 rounded-full bg-black/40 text-white/80 backdrop-blur-sm">{pkg.tier}</span>
                      </div>
                      <div className="p-4">
                        <p className="text-white font-semibold mb-0.5">{pkg.title}</p>
                        <p className="text-white/50 text-sm mb-3">${pkg.price.toLocaleString()} · {pkg.duration}</p>
                        <div className="flex gap-2">
                          <button onClick={() => handleEdit(pkg)} className="flex-1 py-1.5 rounded-lg bg-white/10 text-white text-sm hover:bg-white/20 transition">Edit</button>
                          <button onClick={() => handleDelete(pkg._id)} disabled={deletingId === pkg._id} className="flex-1 py-1.5 rounded-lg bg-red-500/20 text-red-300 text-sm hover:bg-red-500/30 transition disabled:opacity-40">
                            {deletingId === pkg._id ? '...' : 'Delete'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Modal ───────────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0f1f3d] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl">

            {/* Modal header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-white/10">
              <div>
                <h3 className="text-white text-xl font-bold">{editingPackage ? 'Edit Package' : 'New Package'}</h3>
                <p className="text-white/40 text-sm mt-0.5">Fill in the details below</p>
              </div>
              <button onClick={() => { setShowModal(false); resetForm(); }} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 hover:text-white transition">
                ✕
              </button>
            </div>

            {/* Scrollable body */}
            <form onSubmit={handleSubmit} className="overflow-y-auto flex-1 px-8 py-6 space-y-6">

              {/* Package title */}
              <div>
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Package Title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Cape Town Summer Escape"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition"
                  required
                />
              </div>

              {/* City + Tier */}
              <div className="grid grid-cols-2 gap-4">
                {/* City searchable */}
                <div className="relative" ref={cityInputRef as React.RefObject<HTMLDivElement>}>
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">City / Destination</label>
                  <input
                    value={citySearch}
                    onChange={(e) => { setCitySearch(e.target.value); setCity(e.target.value); setShowCityDropdown(true); }}
                    onFocus={() => setShowCityDropdown(true)}
                    onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
                    placeholder="Search city..."
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition"
                    required
                  />
                  {showCityDropdown && citySearch && filteredCities.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-[#1a2d52] border border-white/10 rounded-xl overflow-hidden z-10 shadow-xl">
                      {filteredCities.map((c) => (
                        <button
                          key={c}
                          type="button"
                          onMouseDown={() => selectCity(c)}
                          className="w-full text-left px-4 py-2.5 text-white/80 text-sm hover:bg-white/10 transition"
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tier */}
                <div>
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Tier</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {TIERS.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setTier(t)}
                        className={`py-3 rounded-xl text-xs font-semibold transition ${tier === t ? 'bg-white text-blue-900' : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Area */}
              <div>
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Specific Area <span className="text-white/30 normal-case">(optional)</span></label>
                <input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Waterfront, V&A"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what makes this package special..."
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition h-28 resize-none"
                  required
                />
              </div>

              {/* Price + Duration */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Price per Person</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 font-semibold">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0"
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Duration</label>
                  <input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="e.g. 5 days"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition"
                    required
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">Images</label>

                {/* Thumbnails row */}
                {(existingImages.length > 0 || previewUrls.length > 0) && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {existingImages.map((url, i) => (
                      <div key={`ex-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden group">
                        <img src={resolveImg(url)} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeExistingImage(i)} className="absolute inset-0 bg-black/60 text-white text-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">×</button>
                      </div>
                    ))}
                    {previewUrls.map((url, i) => (
                      <div key={`new-${i}`} className="relative w-20 h-20 rounded-xl overflow-hidden group ring-2 ring-blue-400/50">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button type="button" onClick={() => removeNewImage(i)} className="absolute inset-0 bg-black/60 text-white text-xl opacity-0 group-hover:opacity-100 flex items-center justify-center transition">×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full rounded-xl border-2 border-dashed py-8 flex flex-col items-center justify-center cursor-pointer transition ${dragOver ? 'border-blue-400 bg-blue-500/10' : 'border-white/15 hover:border-white/30 hover:bg-white/5'}`}
                >
                  <svg className="w-8 h-8 text-white/20 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-white/40 text-sm">Drag & drop or <span className="text-blue-400">click to browse</span></p>
                  <p className="text-white/30 text-xs mt-1">JPG, PNG, WEBP — up to 10 MB each</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
              </div>

              {/* What's Included */}
              <div>
                <label className="text-white/50 text-xs font-medium uppercase tracking-wider block mb-2">What&apos;s Included</label>
                <div className="flex gap-2 mb-2">
                  <input
                    value={includedInput}
                    onChange={(e) => setIncludedInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addIncluded(); } }}
                    placeholder="Type an item and press Enter"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 outline-none focus:border-white/30 transition text-sm"
                  />
                  <button type="button" onClick={addIncluded} className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm hover:bg-white/20 transition">Add</button>
                </div>
                {includedItems.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {includedItems.map((item, i) => (
                      <span key={i} className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm">
                        {item}
                        <button type="button" onClick={() => setIncludedItems((p) => p.filter((_, j) => j !== i))} className="text-white/40 hover:text-white transition leading-none">×</button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Restaurants */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Restaurants</label>
                  <button type="button" onClick={() => setRestaurants((p) => [...p, emptyRestaurant()])} className="text-blue-400 text-xs hover:text-blue-300 transition">+ Add</button>
                </div>
                <div className="space-y-3">
                  {restaurants.map((r, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          value={r.name}
                          onChange={(e) => setRestaurants((p) => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                          placeholder="Restaurant name"
                          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition"
                        />
                        <input
                          value={r.cuisine}
                          onChange={(e) => setRestaurants((p) => p.map((x, j) => j === i ? { ...x, cuisine: e.target.value } : x))}
                          placeholder="Cuisine type"
                          className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          value={r.description}
                          onChange={(e) => setRestaurants((p) => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                          placeholder="Short description"
                          className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition"
                        />
                        {restaurants.length > 1 && (
                          <button type="button" onClick={() => setRestaurants((p) => p.filter((_, j) => j !== i))} className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition">×</button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Attractions */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-white/50 text-xs font-medium uppercase tracking-wider">Attractions</label>
                  <button type="button" onClick={() => setAttractions((p) => [...p, emptyAttraction()])} className="text-blue-400 text-xs hover:text-blue-300 transition">+ Add</button>
                </div>
                <div className="space-y-2">
                  {attractions.map((a, i) => (
                    <div key={i} className="flex gap-2">
                      <input
                        value={a.name}
                        onChange={(e) => setAttractions((p) => p.map((x, j) => j === i ? { ...x, name: e.target.value } : x))}
                        placeholder="Attraction name"
                        className="w-1/3 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition"
                      />
                      <input
                        value={a.description}
                        onChange={(e) => setAttractions((p) => p.map((x, j) => j === i ? { ...x, description: e.target.value } : x))}
                        placeholder="Description"
                        className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-white/20 text-sm outline-none focus:border-white/30 transition"
                      />
                      {attractions.length > 1 && (
                        <button type="button" onClick={() => setAttractions((p) => p.filter((_, j) => j !== i))} className="px-3 py-2 rounded-lg bg-red-500/15 text-red-400 text-sm hover:bg-red-500/25 transition">×</button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons — inside form so type="submit" works natively */}
              <div className="flex gap-3 pt-2 pb-2">
                <button
                  type="button"
                  onClick={() => { setShowModal(false); resetForm(); }}
                  className="flex-1 py-3 rounded-xl bg-white/10 text-white/60 font-medium hover:bg-white/15 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="flex-1 py-3 rounded-xl bg-white text-blue-900 font-semibold hover:bg-white/90 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {(saving || uploading) && <span className="w-4 h-4 border-2 border-blue-900/30 border-t-blue-900 rounded-full animate-spin" />}
                  {saving || uploading ? 'Saving...' : editingPackage ? 'Save Changes' : 'Create Package'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
}
