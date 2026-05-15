import DeleteButton from '@/components/delete-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { BrandPortfolio, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit2Icon, EyeIcon, PlusCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    brandPortfolios: {
        data: BrandPortfolio[];
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
        title: 'Brand Portfolios',
        href: '/brand-portfolios',
    },
];

export default function BrandPortfoliosPage({
    brandPortfolios,
    filters,
    flash,
}: Props) {
    const user = usePage<SharedData>().props.auth.user;

    const [search, setSearch] = useState(filters?.search || '');
    const [shownMessages] = useState(new Set());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        router.get('/brand-portfolios', { search }, { preserveState: true });
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Brand Portfolios" />

            <div className="space-y-4 p-4">
                {/* Search Bar */}
                <div className="flex space-x-1">
                    <form
                        onSubmit={handleSearch}
                        className="flex w-full gap-2 md:w-1/3"
                    >
                        <Input
                            placeholder="Search portfolios..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="outline" type="submit">
                            Search
                        </Button>
                    </form>
                    {hasAnyPermission(['brands portfolios create']) && (
                        <Link href="/brand-portfolios/create">
                            <Button
                                variant="default"
                                className="group flex items-center"
                            >
                                <PlusCircle className="transition-all group-hover:rotate-90" />
                                Add Portfolio
                            </Button>
                        </Link>
                    )}
                </div>

                {/* Brand Portfolios Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Brand</TableHead>
                            <TableHead>Event Type</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {brandPortfolios.data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={6}
                                    className="h-[65vh] text-center"
                                >
                                    Belum Ada Data Brand Portfolio.
                                </TableCell>
                            </TableRow>
                        ) : (
                            brandPortfolios.data.map((portfolio) => (
                                <TableRow key={portfolio.id}>
                                    <TableCell className="font-medium">
                                        {portfolio.title}
                                    </TableCell>
                                    <TableCell>
                                        {portfolio.brand?.name || '-'}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {portfolio.event_type}
                                        </Badge>
                                </TableCell>
                                    <TableCell className="flex gap-2">
                                        {hasAnyPermission([
                                            'brands portfolios show',
                                        ]) && (
                                            <Link
                                                href={`/brand-portfolios/${portfolio.id}`}
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-blue-200 hover:text-blue-600"
                                                        >
                                                            {' '}
                                                            <EyeIcon />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        View
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Link>
                                        )}
                                        {hasAnyPermission([
                                            'brands portfolios edit',
                                        ]) && (
                                            <Link
                                                href={`/brand-portfolios/${portfolio.id}/edit`}
                                            >
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="hover:bg-yellow-200 hover:text-yellow-600"
                                                        >
                                                            {' '}
                                                            <Edit2Icon />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        Edit
                                                    </TooltipContent>
                                                </Tooltip>
                                            </Link>
                                        )}

                                        {hasAnyPermission([
                                            'brands portfolios delete',
                                        ]) && (
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <DeleteButton
                                                        id={portfolio.id}
                                                        featured="brand-portfolios"
                                                    />
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    Delete
                                                </TooltipContent>
                                            </Tooltip>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

                <div className="flex gap-1">
                    {brandPortfolios.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            className={`flex items-center justify-center rounded-md border px-3 py-1 ${link.active ? 'bg-black text-sm text-white' : 'text-sm'}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}
