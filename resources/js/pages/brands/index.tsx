import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, router, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import DeleteButton from '@/components/delete-button';
import { Edit2Icon, EyeIcon, PlusCircle } from 'lucide-react';
import { BreadcrumbItem, SharedData, Brand } from '@/types';
import { toast } from 'sonner';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import hasAnyPermission from '@/lib/utils';
import { Badge } from '@/components/ui/badge';


interface Props {
    brands: {
        data: Brand[];
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
        title: 'Brands',
        href: '/brands',
    },
];

export default function BrandPage({ brands, filters, flash }: Props) {
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
        router.get('/brands', { search }, { preserveState: true });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brands" />

            <div className="p-4 space-y-4">

                {/* Search Bar */}
                <div className='flex space-x-1'>
                    <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-1/3">
                        <Input
                            placeholder="Search brands..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant='outline' type="submit">Search</Button>
                    </form>
                    {hasAnyPermission(["brands create"]) && (
                        <Link href="/brands/create">
                            <Button variant='default' className='group flex items-center'>
                                <PlusCircle className='group-hover:rotate-90 transition-all' />
                                Add Brands
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Brand Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>WhatsApp</TableHead>
                            <TableHead>Instagram</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {brands.data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="h-[65vh] text-center">
                                    Belum Ada Data Brand.
                                </TableCell>
                            </TableRow>
                        ) : (
                            brands.data.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell className="font-medium">{brand.name}</TableCell>
                                    <TableCell className="space-x-1">
                                        {Array.isArray(brand.category) && brand.category.map((cat, i) => (
                                            <Badge key={i} variant={cat === 'EO' ? 'default' : 'secondary'}>
                                                {cat}
                                            </Badge>
                                        ))}
                                    </TableCell>
                                    <TableCell>{brand.whatsapp_number}</TableCell>
                                    <TableCell>{brand.instagram || '-'}</TableCell>
                                    <TableCell>
                                        <Badge variant={brand.is_active ? 'default' : 'destructive'}>
                                            {brand.is_active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="space-x-2">
                                        {hasAnyPermission(["brands edit"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/brands/${brand.id}/edit`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-yellow-200 hover:text-yellow-600'> <Edit2Icon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Edit
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                        {hasAnyPermission(["brands show"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <Link href={`/brands/${brand.id}`}>
                                                        <Button variant="outline" size="sm" className='hover:bg-blue-200 hover:text-blue-600'> <EyeIcon /></Button>
                                                    </Link>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Detail
                                                </TooltipContent>
                                            </Tooltip>
                                        )}

                                        {hasAnyPermission(["brands delete"]) && (
                                            <Tooltip>
                                                <TooltipTrigger>
                                                    <DeleteButton id={brand.id} featured='brands' />
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
                    {brands.links.map((link, i) => (
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
