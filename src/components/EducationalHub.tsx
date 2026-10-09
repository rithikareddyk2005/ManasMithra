import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Tag,
  Clock,
  Sparkles,
  ArrowRight,
  X,
  Share2,
  Bookmark,
  CheckCircle,
} from 'lucide-react';
import { EDUCATIONAL_ARTICLES } from '../data/mockData';
import { Article } from '../types';

export const EducationalHub: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);

  const categories = ['All', 'Mental Awareness', 'Emotional Well-Being', 'Healthy Habits', 'Social Well-Being', 'Preventive Support'];

  const filtered = EDUCATIONAL_ARTICLES.filter((art) => {
    const matchesCat = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.keyTakeaway.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-emerald-900 text-white p-6 rounded-3xl shadow-lg">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
          📚 UN SDG 3 Evidence-Informed Knowledge
        </div>
        <h2 className="text-xl font-bold">Well-Being Knowledge & Psychoeducation Hub</h2>
        <p className="text-emerald-100 text-xs mt-1 max-w-2xl">
          Understanding the biology and psychology of well-being transforms abstract health into actionable daily self-care.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search guides, topics, tips..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs focus:outline-emerald-600 bg-white"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto w-full sm:w-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((art) => (
          <div
            key={art.id}
            onClick={() => setActiveArticle(art)}
            className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {art.category}
                </span>
                <span className="text-stone-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {art.readTime}
                </span>
              </div>

              <h3 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors">
                {art.title}
              </h3>

              <p className="text-xs text-stone-500 leading-relaxed line-clamp-2">
                {art.summary}
              </p>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-100 text-[11px] text-stone-700">
                <span className="font-bold text-emerald-800">Key takeaway: </span>
                {art.keyTakeaway}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-emerald-700 font-semibold mt-3">
              <span className="text-[10px] text-stone-400 font-medium">{art.sdgTag}</span>
              <span className="inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Guide <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Article Modal */}
      {activeArticle && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-800 text-white p-6 relative shrink-0">
              <button
                onClick={() => setActiveArticle(null)}
                className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/30 text-emerald-100 border border-emerald-400/30 mb-2">
                {activeArticle.sdgTag}
              </div>
              <h2 className="text-lg sm:text-xl font-bold pr-8">{activeArticle.title}</h2>
              <p className="text-emerald-100 text-xs mt-1">{activeArticle.subtitle}</p>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-medium">
                <strong className="block text-emerald-900 font-bold mb-1">💡 Core Takeaway:</strong>
                {activeArticle.keyTakeaway}
              </div>

              {activeArticle.content.map((paragraph, i) => (
                <p key={i} className="leading-relaxed">
                  {paragraph}
                </p>
              ))}

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Category: <strong>{activeArticle.category}</strong></span>
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
                >
                  Done Reading
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
