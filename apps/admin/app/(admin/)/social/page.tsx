'use client';

import React, { useState } from 'react';
import {
    Search,
    MoreVertical,
    Send,
    Paperclip,
    Phone,
    Video,
    Info,
    User,
    MessageSquare,
    Instagram,
    Facebook,
    CreditCard,
    ShoppingBag,
    AlertCircle
} from 'lucide-react';
import {
    Card as MTCard,
    Typography,
    Input,
    Button as MTButton,
    IconButton as MTIconButton,
    Avatar as MTAvatar,
    Badge,
    Chip
} from "@material-tailwind/react";

const Card = MTCard as any;
const Button = MTButton as any;
const IconButton = MTIconButton as any;
const Avatar = MTAvatar as any;

// Mock Data for UI development
const MOCK_CONVERSATIONS = [
    {
        id: '1',
        name: 'Juan Pérez',
        lastMessage: 'Hola, me gustaría saber si tienen stock del producto...',
        time: '10:30 AM',
        unreadCount: 2,
        platform: 'WHATSAPP',
        avatar: 'https://i.pravatar.cc/150?u=juan',
        status: 'online',
        financialStatus: 'green' // Semáforo financiero
    },
    {
        id: '2',
        name: 'Maria García',
        lastMessage: '¿Cuándo llega mi pedido?',
        time: 'Ayer',
        unreadCount: 0,
        platform: 'INSTAGRAM',
        avatar: 'https://i.pravatar.cc/150?u=maria',
        status: 'offline',
        financialStatus: 'yellow'
    },
];

export default function SocialInboxPage() {
    const [selectedConversation, setSelectedConversation] = useState(MOCK_CONVERSATIONS[0]);
    const [activeTab, setActiveTab] = useState<'context' | 'products'>('context');

    const MOCK_PRODUCTS = [
        { id: '1', name: 'Taladro Bosch GSB 13 RE', sku: 'BSH-001', price: 89990, stock: 15, image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=100' },
        { id: '2', name: 'Set de Brocas 15pzs', sku: 'BSH-SEC-15', price: 14990, stock: 42, image: 'https://images.unsplash.com/photo-1540103390170-1793796cb509?auto=format&fit=crop&q=80&w=100' },
    ];

    return (
        <div className="flex h-[calc(100vh-64px)] bg-[#0f172a] text-white overflow-hidden">

            {/* Column 1: Conversations List */}
            <div className="w-[350px] border-r border-white/10 flex flex-col bg-[#111c2d]/50 backdrop-blur-xl">
                <div className="p-4 border-b border-white/10">
                    <Typography variant="h5" className="mb-4 font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">
                        Social Inbox
                    </Typography>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <input
                            type="text"
                            placeholder="Buscar chats..."
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {MOCK_CONVERSATIONS.map((conv) => (
                        <div
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-4 flex gap-3 cursor-pointer transition-all border-b border-white/5 hover:bg-white/5 ${selectedConversation?.id === conv.id ? 'bg-blue-500/10 border-r-4 border-r-blue-500' : ''}`}
                        >
                            <div className="relative">
                                <Avatar
                                    src={conv.avatar}
                                    size="md"
                                    className="border border-white/10 shadow-lg"
                                    placeholder=""
                                    onPointerEnterCapture={() => { }}
                                    onPointerLeaveCapture={() => { }}
                                />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a2537] ${conv.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <Typography className="font-bold truncate text-[15px]">
                                        {conv.name}
                                    </Typography>
                                    <Typography className="text-[11px] text-white/40 whitespace-nowrap">
                                        {conv.time}
                                    </Typography>
                                </div>
                                <div className="flex justify-between items-center">
                                    <Typography className="text-sm text-white/60 truncate italic">
                                        {conv.lastMessage}
                                    </Typography>
                                    {conv.unreadCount > 0 && (
                                        <div className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/5 text-white/60 flex items-center gap-1">
                                        {conv.platform === 'WHATSAPP' ? <MessageSquare className="h-2.5 w-2.5 text-green-400" /> : <Instagram className="h-2.5 w-2.5 text-pink-400" />}
                                        {conv.platform}
                                    </span>
                                    <div className={`w-2 h-2 rounded-full mt-1.5 ${conv.financialStatus === 'green' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'}`} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Column 2: Chat Window */}
            <div className="flex-1 flex flex-col bg-[#0f172a] relative">
                {selectedConversation ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-[64px] border-b border-white/10 flex items-center justify-between px-6 bg-[#111c2d]/50 backdrop-blur-md z-10">
                            <div className="flex items-center gap-3">
                                <Avatar
                                    src={selectedConversation.avatar}
                                    size="sm"
                                    placeholder=""
                                    onPointerEnterCapture={() => { }}
                                    onPointerLeaveCapture={() => { }}
                                />
                                <div>
                                    <Typography className="font-bold text-[16px] leading-tight">{selectedConversation.name}</Typography>
                                    <Typography className="text-[12px] text-green-400 font-medium">Escribiendo...</Typography>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconButton variant="text" color="white" className="rounded-full h-9 w-9">
                                    <Phone className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" color="white" className="rounded-full h-9 w-9">
                                    <Video className="h-5 w-5" />
                                </IconButton>
                                <IconButton variant="text" color="white" className="rounded-full h-9 w-9">
                                    <MoreVertical className="h-5 w-5" />
                                </IconButton>
                            </div>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre-big.png')] bg-fixed">
                            <div className="flex justify-center mb-6">
                                <Chip value="Hoy" variant="ghost" className="bg-white/5 text-white/40 text-[10px] normal-case" />
                            </div>

                            {/* Message Left */}
                            <div className="flex justify-start items-end gap-2 max-w-[80%]">
                                <Avatar src={selectedConversation.avatar} size="xs" className="mb-1" />
                                <div className="bg-white/10 backdrop-blur-lg border border-white/10 p-3 rounded-2xl rounded-bl-none shadow-xl">
                                    <Typography className="text-sm">
                                        Hola, ví una publicación en Instagram sobre el taladro Bosch. ¿Aún lo tienen disponible?
                                    </Typography>
                                    <Typography className="text-[10px] text-white/30 text-right mt-1">10:30 AM</Typography>
                                </div>
                            </div>

                            {/* Message Right */}
                            <div className="flex justify-end items-end gap-2 max-w-[80%] ml-auto">
                                <div className="bg-blue-600/80 backdrop-blur-lg p-3 rounded-2xl rounded-br-none shadow-xl shadow-blue-900/20">
                                    <Typography className="text-sm">
                                        ¡Hola! Sí, aún tenemos stock. ¿Te gustaría que te envíe un link de pago para reservarlo?
                                    </Typography>
                                    <Typography className="text-[10px] text-white/60 text-right mt-1 font-medium">10:32 AM ✓✓</Typography>
                                </div>
                            </div>
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-[#111c2d]/80 backdrop-blur-xl border-t border-white/10">
                            <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl p-2 px-4 focus-within:ring-2 focus-within:ring-blue-500/40 transition-all">
                                <IconButton variant="text" color="white" className="rounded-full h-9 w-9 shrink-0">
                                    <Paperclip className="h-5 w-5 opacity-60" />
                                </IconButton>
                                <input
                                    placeholder="Escribe un mensaje..."
                                    className="bg-transparent border-none flex-1 text-sm focus:outline-none placeholder:text-white/20"
                                />
                                <Button color="blue" size="sm" className="rounded-xl flex items-center gap-2 px-4 shadow-lg shadow-blue-500/20">
                                    <span className="hidden sm:inline">Enviar</span>
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-white/20">
                        <MessageSquare className="h-20 w-20 mb-4 opacity-5" />
                        <Typography variant="h6">Selecciona una conversación</Typography>
                    </div>
                )}
            </div>

            {/* Column 3: Context Sidebar */}
            <div className="w-[300px] border-l border-white/10 bg-[#111c2d]/50 backdrop-blur-xl flex flex-col hidden lg:flex">
                <div className="p-4 flex gap-2 border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('context')}
                        className={`flex-1 py-1 px-3 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'context' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Contexto
                    </button>
                    <button
                        onClick={() => setActiveTab('products')}
                        className={`flex-1 py-1 px-3 text-[11px] font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'products' ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' : 'text-white/40 hover:bg-white/5'}`}
                    >
                        Catálogo
                    </button>
                </div>

                <div className="p-6 flex flex-col items-center border-b border-white/10">
                    <Avatar src={selectedConversation?.avatar} size="xl" className="mb-4 border-2 border-blue-500/20 p-1" />
                    <Typography variant="h6" className="font-bold">{selectedConversation?.name}</Typography>
                    <div className="flex items-center gap-1 mt-1">
                        <div className={`w-2.5 h-2.5 rounded-full ${selectedConversation?.financialStatus === 'green' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <Typography className="text-xs uppercase tracking-widest font-bold text-white/40">Cliente Platinum</Typography>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {activeTab === 'context' ? (
                        <>
                            {/* CRM Data */}
                            <div>
                                <Typography variant="small" className="uppercase text-[11px] font-bold text-blue-400 mb-3 tracking-widest">Contexto CRM</Typography>
                                <div className="space-y-3">
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                        <Typography className="text-[11px] text-white/40 uppercase mb-1">Empresa</Typography>
                                        <Typography className="text-sm font-medium">Construcciones S.A.</Typography>
                                    </div>
                                    <div className="bg-white/5 rounded-xl p-3 border border-white/5">
                                        <Typography className="text-[11px] text-white/40 uppercase mb-1">Total Compras</Typography>
                                        <Typography className="text-sm font-bold text-green-400">$1,240,000 CLP</Typography>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div>
                                <Typography variant="small" className="uppercase text-[11px] font-bold text-blue-400 mb-3 tracking-widest">Acciones Rápidas</Typography>
                                <div className="grid grid-cols-1 gap-2">
                                    <Button size="sm" variant="gradient" color="blue" className="normal-case flex items-center justify-center gap-2 rounded-xl shadow-blue-500/20">
                                        <CreditCard className="h-4 w-4" /> Generar Link de Pago
                                    </Button>
                                    <Button size="sm" variant="outlined" color="white" className="normal-case border-white/10 flex items-center justify-center gap-2 rounded-xl hover:bg-white/5">
                                        <ShoppingBag className="h-4 w-4" /> Ver Historial Pedidos
                                    </Button>
                                </div>
                            </div>

                            {/* Pending Alerts */}
                            <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                                    <Typography className="text-sm font-bold text-yellow-500">Alerta Financiera</Typography>
                                </div>
                                <Typography className="text-[13px] text-yellow-100/70">
                                    Tiene una factura vencida hace 3 días. Considere cobrar antes de cerrar nueva venta.
                                </Typography>
                            </div>
                        </>
                    ) : (
                        <>
                            {/* Products Search */}
                            <div>
                                <Typography variant="small" className="uppercase text-[11px] font-bold text-blue-400 mb-3 tracking-widest">Buscador Catálogo</Typography>
                                <div className="relative mb-4">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                                    <input
                                        type="text"
                                        placeholder="Buscar por SKU o Nombre..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-white"
                                    />
                                </div>

                                <div className="space-y-3">
                                    {MOCK_PRODUCTS.map(product => (
                                        <div key={product.id} className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-pointer group">
                                            <div className="flex gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden flex-shrink-0">
                                                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <Typography className="text-[13px] font-bold truncate">{product.name}</Typography>
                                                    <Typography className="text-[10px] text-white/40 uppercase">{product.sku}</Typography>
                                                    <div className="flex items-center justify-between mt-1">
                                                        <Typography className="text-[12px] font-bold text-green-400">
                                                            ${product.price.toLocaleString('es-CL')}
                                                        </Typography>
                                                        <Chip
                                                            value={`${product.stock} un.`}
                                                            size="sm"
                                                            variant="ghost"
                                                            className={`text-[9px] px-1.5 py-0 ${product.stock > 10 ? 'bg-green-500/10 text-green-500' : 'bg-yellow-500/10 text-yellow-500'}`}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <Button
                                                size="sm"
                                                color="blue"
                                                variant="text"
                                                className="w-full mt-3 flex items-center justify-center gap-2 border border-blue-500/20 rounded-lg normal-case text-[11px]"
                                            >
                                                <Send className="h-3 w-3" /> Enviar al Chat
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    );
}
