import React from 'react';
import { Button, Typography, Tooltip } from '@material-tailwind/react';
import { Squares2X2Icon, TagIcon } from '@heroicons/react/24/outline';

interface CategorySidebarProps {
    categories: any[];
    selectedCategory: string | null;
    onSelectCategory: (categoryId: string | null) => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div className="w-24 lg:w-28 bg-[#0b1120] border-r border-white/5 flex flex-col items-center py-6 gap-6 overflow-y-auto h-full shadow-2xl z-30 shrink-0 relative scrollbar-hide">
            {/* Logo area */}
            <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={() => onSelectCategory(null)}>
                <div className={`p-3.5 rounded-[1.25rem] transition-all duration-500 relative ${selectedCategory === null ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] text-white scale-110' : 'bg-slate-800/40 text-slate-500 group-hover:bg-slate-700/60 group-hover:text-blue-400 group-hover:scale-105'}`}>
                    <Squares2X2Icon className="h-6 w-6" />
                    {selectedCategory === null && (
                        <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                    )}
                </div>
                <span className={`text-[9px] font-black uppercase tracking-[0.15em] mt-2 transition-colors ${selectedCategory === null ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>Todos</span>
            </div>

            <div className="w-8 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

            {/* Categories */}
            <div className="flex flex-col items-center gap-7 w-full px-2">
                {categories.map((category) => (
                    <div
                        key={category.id}
                        className="flex flex-col items-center gap-2 group cursor-pointer w-full"
                        onClick={() => onSelectCategory(category.id)}
                    >
                        <div className={`p-3.5 rounded-[1.25rem] transition-all duration-500 relative ${selectedCategory === category.id ? 'bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.4)] text-white scale-110' : 'bg-slate-800/40 text-slate-500 group-hover:bg-slate-700/60 group-hover:text-blue-400 group-hover:scale-105'}`}>
                            <TagIcon className="h-6 w-6" />
                            {selectedCategory === category.id && (
                                <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
                            )}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-[0.1em] text-center px-1 transition-colors ${selectedCategory === category.id ? 'text-blue-400' : 'text-slate-600 group-hover:text-slate-400'}`}>
                            {category.name}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategorySidebar;
