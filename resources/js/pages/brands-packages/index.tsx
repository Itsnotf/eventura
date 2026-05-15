import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import { Edit2Icon, EyeIcon, PlusCircle } from 'lucide-react';
import { BreadcrumbItem, SharedData, BrandPackage } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface Props {
    brandsPackages: {
        data: BrandPackage[];
        links: any[];
    };
    filters: {
        search?: string;
    };
    flash?: {
        success?: string;
    };
}


const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Brand Packages',
        href: '/brand-packages',
    },
];

export default function BrandPackagesPage({ brandsPackages, filters, flash }: Props) {
    const user = usePage<SharedData>().props.auth.user;

    const [search, setSearch] = useState(filters.search || '');
    const [shownMessages] = useState(new Set());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/brand-packages', { search }, { preserveState: true });
    };

    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brand Packages" />

            <div className="p-4 space-y-4">

                {/* Search Bar */}
                <div className='flex space-x-1'>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            placeholder="Search packages..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='outline' type="submit">Search</Button>
                    </form>
                    {hasAnyPermission(["brands packages create"]) && (
                        <Link href="/brand-packages/create">
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Add Package
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Brand Packages Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Package Name</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Price Range</TableHead>
                            <TableHead>Featured</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {brandsPackages.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-[65vh] text-center">
                                    Belum Ada Data Brand Package.
                                </TableCell>
                            </TableRow>
                        ) : (
                            brandsPackages.data.map((brandPackage) => (
                                <TableRow key={brandPackage.id}>
                                    <TableCell className="font-medium">{brandPackage.name}</TableCell>
                                    <TableCell>{brandPackage.brand?.name || '-'}</TableCell>
                                    <TableCell>
                                        {formatPrice(brandPackage.price_start)} - {formatPrice(brandPackage.price_end)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={brandPackage.is_featured ? 'default' : 'secondary'}>
                                            {brandPackage.is_featured ? 'Featured' : 'Regular'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["brands packages edit"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/brand-packages/${brandPackage.id}/edit`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-yellow-200 hover:text-yellow-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Edit
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(["brands packages show"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/brand-packages/${brandPackage.id}`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <EyeIcon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Detail
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["brands packages delete"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={brandPackage.id} featured='brand-packages' />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Delete
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )))}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {brandsPackages.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`px-3 py-1 flex justify-center items-center border rounded-md ${link.active ? 'bg-black text-white text-sm' : 'text-sm'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>

            </div>
        </AppLayout>
    );
}
