import AppLayout from '@/layouts/app-layout';
import { isMapsEmbed } from '@/lib/utils';
import { Brand, BrandPackage, BrandPortfolio, BreadcrumbItem, User } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { Building2, CalendarDays, ClipboardList, Eye, Heart, Images, MessageCircle, Package, PlusCircle, SendHorizontal, Star, TrendingUp, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: '/dashboard' },
];

interface AdminStats {
    totalBrands: number;
    totalUsers: number;
    totalPackages: number;
    totalPortfolios: number;
    totalViews: number;
    totalWaClicks: number;
}

interface BrandOwnerStats {
    totalPackages: number;
    totalPortfolios: number;
    featuredPackages: number;
}

interface TopPortfolio {
    id: number;
    title: string;
    event_type: string;
    event_date: string;
    views: number;
}

interface TopBrand {
    brand: { id: number; name: string; slug: string } | null;
    views: number;
}

interface Analytics {
    profileViews: number;
    whatsappClicks: number;
    portfolioViews: number;
    topPortfolios: TopPortfolio[];
    dailyViews: Record<string, number>;
}

interface CustomerInquiry {
    id: number;
    event_type: string;
    status: 'pending' | 'read' | 'responded' | 'closed';
    created_at: string;
    brand: { id: number; name: string; slug: string };
}

interface PendingApplication {
    id: number;
    brand_name: string;
    applicant_name: string;
    category: string;
    created_at: string;
}

interface PendingInquiry {
    id: number;
    event_type: string;
    created_at: string;
    user: { id: number; name: string };
}

interface Props {
    role?: 'admin' | 'vendor' | 'user';
    isAdmin?: boolean;
    stats?: AdminStats | BrandOwnerStats | null;
    recentBrands?: (Brand & { user?: User })[];
    recentUsers?: (User & { roles?: { name: string }[] })[];
    brand?: Brand | null;
    recentPackages?: BrandPackage[];
    recentPortfolios?: BrandPortfolio[];
    analytics?: Analytics | null;
    topBrands?: TopBrand[];
    // admin extras
    pendingApplications?: number;
    recentApplications?: PendingApplication[];
    // vendor extras
    pendingInquiries?: number;
    recentPendingInquiries?: PendingInquiry[];
    unmoderatedTestimonials?: number;
    // customer extras
    plansCount?: number;
    favoritesCount?: number;
    recentInquiries?: CustomerInquiry[];
}

function StatCard({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) {
    return (
        <Card>
            <CardContent className="flex items-center gap-4 pt-6">
                <div className={`rounded-full p-3 ${color}`}>
                    <Icon className="h-5 w-5 text-white" />
                </div>
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </CardContent>
        </Card>
    );
}

const inquiryStatusLabel: Record<string, string> = {
    pending: 'Menunggu',
    read: 'Dibaca',
    responded: 'Direspons',
    closed: 'Selesai',
};

const inquiryStatusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    read: 'bg-blue-100 text-blue-800',
    responded: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-700',
};

function AdminDashboard({ stats, recentBrands, recentUsers, topBrands, pendingApplications, recentApplications }: {
    stats: AdminStats;
    recentBrands: Props['recentBrands'];
    recentUsers: Props['recentUsers'];
    topBrands: Props['topBrands'];
    pendingApplications?: number;
    recentApplications?: PendingApplication[];
}) {
    return (
        <div className="space-y-6 p-4">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
                <StatCard icon={Building2} label="Total Brands" value={stats.totalBrands} color="bg-blue-500" />
                <StatCard icon={Users} label="Total Users" value={stats.totalUsers} color="bg-purple-500" />
                <StatCard icon={Package} label="Total Packages" value={stats.totalPackages} color="bg-green-500" />
                <StatCard icon={Images} label="Total Portfolios" value={stats.totalPortfolios} color="bg-orange-500" />
                <StatCard icon={Eye} label="Views (30 hari)" value={stats.totalViews} color="bg-sky-500" />
                <StatCard icon={MessageCircle} label="WA Clicks (30 hari)" value={stats.totalWaClicks} color="bg-emerald-500" />
            </div>

            {!!pendingApplications && pendingApplications > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="flex items-center justify-between pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <ClipboardList className="h-5 w-5 text-yellow-700" />
                            <p className="text-sm font-semibold text-yellow-800">
                                {pendingApplications} lamaran vendor menunggu review
                            </p>
                        </div>
                        <Link href="/vendor-applications">
                            <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-800 hover:bg-yellow-100">
                                Review Sekarang
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2 grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Brand Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Brand</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentBrands?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">Belum ada brand.</TableCell>
                                    </TableRow>
                                ) : recentBrands?.map((brand) => (
                                    <TableRow key={brand.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/brands/${brand.id}`} className="hover:underline">{brand.name}</Link>
                                        </TableCell>
                                        <TableCell>{brand.user?.name ?? '-'}</TableCell>
                                        <TableCell>
                                            <Badge variant={brand.is_active ? 'default' : 'secondary'}>
                                                {brand.is_active ? 'Aktif' : 'Nonaktif'}
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">User Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentUsers?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">Belum ada user.</TableCell>
                                    </TableRow>
                                ) : recentUsers?.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>
                                            {user.roles && user.roles.length > 0
                                                ? <Badge variant="outline">{user.roles[0].name}</Badge>
                                                : <span className="text-muted-foreground text-sm">-</span>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" /> Top Brand (30 hari)
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Brand</TableHead>
                                    <TableHead className="text-right">Views</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {!topBrands?.length ? (
                                    <TableRow>
                                        <TableCell colSpan={2} className="text-center text-muted-foreground text-sm">Belum ada data.</TableCell>
                                    </TableRow>
                                ) : topBrands.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell className="font-medium text-sm">{row.brand?.name ?? '—'}</TableCell>
                                        <TableCell className="text-right">
                                            <Badge variant="secondary">{row.views}</Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {recentApplications && recentApplications.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <ClipboardList className="h-4 w-4" /> Lamaran Vendor Terbaru
                        </CardTitle>
                        <Link href="/vendor-applications">
                            <Button size="sm" variant="ghost">Lihat Semua</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Brand</TableHead>
                                    <TableHead>Pelamar</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentApplications.map(app => (
                                    <TableRow key={app.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/vendor-applications/${app.id}`} className="hover:underline">{app.brand_name}</Link>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">{app.applicant_name}</TableCell>
                                        <TableCell><Badge variant="outline">{app.category}</Badge></TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(app.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function BrandOwnerDashboard({ brand, stats, recentPackages, recentPortfolios, analytics, pendingInquiries, recentPendingInquiries, unmoderatedTestimonials }: {
    brand: Brand;
    stats: BrandOwnerStats;
    recentPackages: Props['recentPackages'];
    recentPortfolios: Props['recentPortfolios'];
    analytics: Analytics | null | undefined;
    pendingInquiries?: number;
    recentPendingInquiries?: PendingInquiry[];
    unmoderatedTestimonials?: number;
}) {
    const formatPrice = (price: string | number) =>
        new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(price));

    return (
        <div className="space-y-6 p-4">
            <Card>
                <CardContent className="flex flex-col gap-2 pt-6 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h2 className="text-xl font-bold">{brand.name}</h2>
                        <p className="text-sm text-muted-foreground">{brand.address && !isMapsEmbed(brand.address) ? brand.address : '-'}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                            {brand.category?.map((cat) => (
                                <Badge key={cat} variant="outline">{cat}</Badge>
                            ))}
                        </div>
                    </div>
                    <Badge variant={brand.is_active ? 'default' : 'secondary'} className="w-fit">
                        {brand.is_active ? 'Aktif' : 'Nonaktif'}
                    </Badge>
                </CardContent>
            </Card>

            {!!pendingInquiries && pendingInquiries > 0 && (
                <Card className="border-yellow-200 bg-yellow-50">
                    <CardContent className="flex items-center justify-between pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <MessageCircle className="h-5 w-5 text-yellow-700" />
                            <p className="text-sm font-semibold text-yellow-800">
                                {pendingInquiries} inquiry baru belum dibaca
                            </p>
                        </div>
                        <Link href="/inquiries">
                            <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-800 hover:bg-yellow-100">
                                Buka Inbox
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            {!!unmoderatedTestimonials && unmoderatedTestimonials > 0 && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="flex items-center justify-between pt-4 pb-4">
                        <div className="flex items-center gap-3">
                            <Star className="h-5 w-5 text-blue-700" />
                            <p className="text-sm font-semibold text-blue-800">
                                {unmoderatedTestimonials} testimoni menunggu moderasi
                            </p>
                        </div>
                        <Link href="/testimonials">
                            <Button size="sm" variant="outline" className="border-blue-400 text-blue-800 hover:bg-blue-100">
                                Moderasi
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}

            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={Package} label="Total Packages" value={stats.totalPackages} color="bg-green-500" />
                <StatCard icon={Images} label="Total Portfolios" value={stats.totalPortfolios} color="bg-orange-500" />
                <StatCard icon={Star} label="Featured Packages" value={stats.featuredPackages} color="bg-yellow-500" />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Package Terbaru</CardTitle>
                        <Link href="/brand-packages/create">
                            <Button size="sm" variant="outline" className="group flex items-center gap-1">
                                <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-all" />
                                Tambah
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nama Package</TableHead>
                                    <TableHead>Harga</TableHead>
                                    <TableHead>Featured</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPackages?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">Belum ada package.</TableCell>
                                    </TableRow>
                                ) : recentPackages?.map((pkg) => (
                                    <TableRow key={pkg.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/brand-packages/${pkg.id}`} className="hover:underline">{pkg.name}</Link>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {formatPrice(pkg.price_start)}
                                        </TableCell>
                                        <TableCell>
                                            {pkg.is_featured
                                                ? <Badge>Featured</Badge>
                                                : <Badge variant="secondary">Regular</Badge>
                                            }
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base">Portfolio Terbaru</CardTitle>
                        <Link href="/brand-portfolios/create">
                            <Button size="sm" variant="outline" className="group flex items-center gap-1">
                                <PlusCircle className="h-4 w-4 group-hover:rotate-90 transition-all" />
                                Tambah
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Judul</TableHead>
                                    <TableHead>Event</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPortfolios?.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} className="text-center text-muted-foreground">Belum ada portfolio.</TableCell>
                                    </TableRow>
                                ) : recentPortfolios?.map((portfolio) => (
                                    <TableRow key={portfolio.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/brand-portfolios/${portfolio.id}`} className="hover:underline">{portfolio.title}</Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline">{portfolio.event_type}</Badge>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(portfolio.event_date).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            {recentPendingInquiries && recentPendingInquiries.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> Inquiry Baru
                        </CardTitle>
                        <Link href="/inquiries">
                            <Button size="sm" variant="ghost">Lihat Semua</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Dari</TableHead>
                                    <TableHead>Jenis Acara</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentPendingInquiries.map(inq => (
                                    <TableRow key={inq.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/inquiries/${inq.id}`} className="hover:underline">{inq.user.name}</Link>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{inq.event_type}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(inq.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}

            {analytics && (
                <div className="space-y-4">
                    <h3 className="text-base font-semibold text-muted-foreground px-1">Analytics — 30 Hari Terakhir</h3>
                    <div className="grid gap-4 md:grid-cols-3">
                        <StatCard icon={Eye} label="Profile Dilihat" value={analytics.profileViews} color="bg-sky-500" />
                        <StatCard icon={MessageCircle} label="Klik WhatsApp" value={analytics.whatsappClicks} color="bg-emerald-500" />
                        <StatCard icon={TrendingUp} label="Portfolio Dilihat" value={analytics.portfolioViews} color="bg-violet-500" />
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Views 7 Hari Terakhir</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {Object.keys(analytics.dailyViews).length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">Belum ada data views.</p>
                                ) : (
                                    <div className="flex items-end gap-1 h-20">
                                        {(() => {
                                            const days: string[] = [];
                                            for (let i = 6; i >= 0; i--) {
                                                const d = new Date();
                                                d.setDate(d.getDate() - i);
                                                days.push(d.toISOString().slice(0, 10));
                                            }
                                            const max = Math.max(1, ...days.map(d => analytics.dailyViews[d] ?? 0));
                                            return days.map(date => {
                                                const val = analytics.dailyViews[date] ?? 0;
                                                const pct = Math.max(4, Math.round((val / max) * 100));
                                                const label = new Date(date).toLocaleDateString('id-ID', { weekday: 'short' });
                                                return (
                                                    <div key={date} className="flex flex-col items-center gap-1 flex-1">
                                                        <span className="text-[10px] text-muted-foreground">{val || ''}</span>
                                                        <div className="w-full rounded-sm bg-primary/20 relative" style={{ height: '56px' }}>
                                                            <div className="absolute bottom-0 w-full rounded-sm bg-primary transition-all" style={{ height: `${pct}%` }} />
                                                        </div>
                                                        <span className="text-[10px] text-muted-foreground">{label}</span>
                                                    </div>
                                                );
                                            });
                                        })()}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Top Portfolio Dilihat</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Event</TableHead>
                                            <TableHead className="text-right">Views</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {analytics.topPortfolios.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={3} className="text-center text-muted-foreground text-sm">Belum ada data.</TableCell>
                                            </TableRow>
                                        ) : analytics.topPortfolios.map((p) => (
                                            <TableRow key={p.id}>
                                                <TableCell className="font-medium text-sm max-w-[160px] truncate">{p.title}</TableCell>
                                                <TableCell><Badge variant="outline" className="text-xs">{p.event_type}</Badge></TableCell>
                                                <TableCell className="text-right"><Badge variant="secondary">{p.views}</Badge></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
}

function CustomerDashboard({ plansCount, favoritesCount, recentInquiries }: {
    plansCount?: number;
    favoritesCount?: number;
    recentInquiries?: CustomerInquiry[];
}) {
    const hasActivity = (plansCount ?? 0) > 0 || (favoritesCount ?? 0) > 0 || (recentInquiries?.length ?? 0) > 0;

    if (!hasActivity) {
        return (
            <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center p-6">
                <Users className="h-12 w-12 text-muted-foreground/50" />
                <h2 className="text-xl font-semibold">Selamat datang!</h2>
                <p className="text-muted-foreground max-w-md">
                    Jelajahi vendor event dan wedding organizer terbaik, simpan favorit, buat rencana acara, dan kirim inquiry — semua dalam satu platform.
                </p>
                <div className="flex gap-3">
                    <Link href="/"><Button>Jelajahi Vendor</Button></Link>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 p-4">
            <div className="grid gap-4 md:grid-cols-3">
                <StatCard icon={CalendarDays} label="Rencana Acara" value={plansCount ?? 0} color="bg-blue-500" />
                <StatCard icon={Heart} label="Favorit" value={favoritesCount ?? 0} color="bg-pink-500" />
                <StatCard icon={SendHorizontal} label="Inquiry Dikirim" value={recentInquiries?.length ?? 0} color="bg-green-500" />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                <Link href="/event-plans">
                    <Button variant="outline" className="w-full gap-2">
                        <CalendarDays className="h-4 w-4" /> Rencana Acara Saya
                    </Button>
                </Link>
                <Link href="/favorites">
                    <Button variant="outline" className="w-full gap-2">
                        <Heart className="h-4 w-4" /> Vendor Favorit
                    </Button>
                </Link>
                <Link href="/">
                    <Button className="w-full gap-2">
                        <Building2 className="h-4 w-4" /> Jelajahi Vendor
                    </Button>
                </Link>
            </div>

            {recentInquiries && recentInquiries.length > 0 && (
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                            <SendHorizontal className="h-4 w-4" /> Inquiry Terakhir
                        </CardTitle>
                        <Link href="/my-inquiries">
                            <Button size="sm" variant="ghost">Lihat Semua</Button>
                        </Link>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Vendor</TableHead>
                                    <TableHead>Acara</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Tanggal</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {recentInquiries.map(inq => (
                                    <TableRow key={inq.id} className={inq.status === 'responded' ? 'bg-green-50' : ''}>
                                        <TableCell className="font-medium">
                                            <Link href={`/brand/${inq.brand.slug}`} className="hover:underline">{inq.brand.name}</Link>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">{inq.event_type}</TableCell>
                                        <TableCell>
                                            <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${inquiryStatusColor[inq.status]}`}>
                                                {inquiryStatusLabel[inq.status]}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {new Date(inq.created_at).toLocaleDateString('id-ID')}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function NoBrandState() {
    return (
        <div className="flex h-[70vh] flex-col items-center justify-center gap-4 text-center">
            <Building2 className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-lg text-muted-foreground">Anda belum memiliki brand, silahkan buat terlebih dahulu.</p>
            <Link href="/brands/create">
                <Button>Buat Brand</Button>
            </Link>
        </div>
    );
}

export default function Dashboard({
    role, isAdmin, stats, recentBrands, recentUsers, brand, recentPackages, recentPortfolios, analytics, topBrands,
    pendingApplications, recentApplications,
    pendingInquiries, recentPendingInquiries, unmoderatedTestimonials,
    plansCount, favoritesCount, recentInquiries,
}: Props) {
    const effectiveRole = role ?? (isAdmin ? 'admin' : 'vendor');

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />

            {effectiveRole === 'admin' ? (
                <AdminDashboard
                    stats={stats as AdminStats}
                    recentBrands={recentBrands}
                    recentUsers={recentUsers}
                    topBrands={topBrands}
                    pendingApplications={pendingApplications}
                    recentApplications={recentApplications}
                />
            ) : effectiveRole === 'user' ? (
                <CustomerDashboard
                    plansCount={plansCount}
                    favoritesCount={favoritesCount}
                    recentInquiries={recentInquiries}
                />
            ) : brand ? (
                <BrandOwnerDashboard
                    brand={brand}
                    stats={stats as BrandOwnerStats}
                    recentPackages={recentPackages}
                    recentPortfolios={recentPortfolios}
                    analytics={analytics}
                    pendingInquiries={pendingInquiries}
                    recentPendingInquiries={recentPendingInquiries}
                    unmoderatedTestimonials={unmoderatedTestimonials}
                />
            ) : (
                <NoBrandState />
            )}
        </AppLayout>
    );
}
