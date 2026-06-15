import DeleteButton from '@/components/delete-button';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import hasAnyPermission from '@/lib/utils';
import { Brand, BreadcrumbItem, SharedData } from '@/types';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { BadgeCheck, Edit2Icon, Eye, Globe, Instagram, MapPin, Phone, ShieldOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface Props {
    brand: Brand;
    logoUrl?: string | null;
    coverImageUrl?: string | null;
    flash?: {
        success?: string;
    };
}



export default function BrandShowPage({
    brand,
    logoUrl,
    coverImageUrl,
    flash,
}: Props) {
    const user = usePage<SharedData>().props.auth.user;

    console.log(flash);
    const [shownMessages] = useState(new Set());

    useEffect(() => {
        if (flash?.success && !shownMessages.has(flash.success)) {
            toast.success(flash.success);
            shownMessages.add(flash.success);
        }
    }, [flash?.success]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brands',
            href: '/brands',
        },
        {
            title: brand.name,
            href: `/brands/${brand.id}`,
        },
    ];

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'EO':
                return 'bg-blue-100 text-blue-800';
            case 'WO':
                return 'bg-purple-100 text-purple-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Brand - ${brand.name}`} />
            <div className="space-y-6 p-4">
                {/* Header Section */}
                <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                    <div className="flex-1">
                        <div className="mb-2 flex items-center gap-3 flex-wrap">
                            <h1 className="text-3xl font-bold">{brand.name}</h1>
                            <Badge
                                variant={brand.is_active ? 'default' : 'secondary'}
                                className={brand.is_active ? 'bg-green-600' : 'bg-red-600'}
                            >
                                {brand.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                            {brand.is_verified && (
                                <Badge className="bg-blue-600 gap-1">
                                    <BadgeCheck className="h-3.5 w-3.5" />
                                    Terverifikasi
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-gray-500">
                            Slug:{' '}
                            <span className="font-mono">{brand.slug}</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 flex-wrap">
                        {hasAnyPermission(['brands edit']) && (
                            <>
                                {brand.is_verified ? (
                                    <Button
                                        variant="outline"
                                        className="hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                                        onClick={() => router.post(`/brands/${brand.id}/unverify`)}
                                    >
                                        <ShieldOff className="mr-2 h-4 w-4" />
                                        Cabut Verifikasi
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="hover:border-green-300 hover:bg-green-50 hover:text-green-600"
                                        onClick={() => router.post(`/brands/${brand.id}/verify`)}
                                    >
                                        <BadgeCheck className="mr-2 h-4 w-4" />
                                        Verifikasi Brand
                                    </Button>
                                )}
                            </>
                        )}

                        {hasAnyPermission(['brands edit']) && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href={`/brands/${brand.id}/edit`}>
                                        <Button
                                            variant="outline"
                                            className="hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600"
                                        >
                                            <Edit2Icon className="mr-2 h-4 w-4" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Edit Brand</TooltipContent>
                            </Tooltip>
                        )}

                        {hasAnyPermission(['brands delete']) && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <DeleteButton
                                        id={brand.id}
                                        featured="brands"
                                    />
                                </TooltipTrigger>
                                <TooltipContent>Delete Brand</TooltipContent>
                            </Tooltip>
                        )}

                        <Link href="/brands">
                            <Button variant="outline">Back to List</Button>
                        </Link>
                    </div>
                </div>

                <Separator />

                {/* Images Section */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                    {/* Logo Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Logo</CardTitle>
                        </CardHeader>
                        <CardContent className="flex min-h-[250px] items-center justify-center rounded-md bg-gray-50 p-8">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={brand.name}
                                    className="max-h-[200px] max-w-full object-contain"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p className="text-sm">No logo available</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Cover Image Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Cover Image
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex min-h-[250px] items-center justify-center rounded-md bg-gray-50 p-8">
                            {coverImageUrl ? (
                                <img
                                    src={coverImageUrl}
                                    alt={brand.name}
                                    className="max-h-[200px] max-w-full rounded object-cover"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p className="text-sm">
                                        No cover image available
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Basic Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* Owner */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Owner
                                </label>
                                <div className="rounded-md bg-gray-50 p-3">
                                    <p className="text-sm font-medium">
                                        {brand.user?.name || 'N/A'}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {brand.user?.email || 'N/A'}
                                    </p>
                                </div>
                            </div>

                            {/* Category */}
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Category
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {Array.isArray(brand.category) &&
                                    brand.category.length > 0 ? (
                                        brand.category.map((cat, index) => (
                                            <Badge
                                                key={index}
                                                className={`${getCategoryColor(cat)} border-0`}
                                            >
                                                {cat}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-sm text-gray-500">
                                            No category assigned
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                {brand.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                                {brand.description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Address & Location */}
                {brand.address && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="h-5 w-5" />
                                Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="leading-relaxed whitespace-pre-wrap text-gray-700">
                                {brand.address}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Contact Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            {/* WhatsApp */}
                            {brand.whatsapp_number && (
                                <div className="flex items-start gap-3">
                                    <Phone className="mt-1 h-5 w-5 flex-shrink-0 text-green-600" />
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            WhatsApp
                                        </label>
                                        <a
                                            href={`https://wa.me/${brand.whatsapp_number.replace(/\D/g, '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-green-600 hover:underline"
                                        >
                                            {brand.whatsapp_number}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Instagram */}
                            {brand.instagram && (
                                <div className="flex items-start gap-3">
                                    <Instagram className="mt-1 h-5 w-5 flex-shrink-0 text-pink-600" />
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Instagram
                                        </label>
                                        <a
                                            href={`https://instagram.com/${brand.instagram.replace('@', '')}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-pink-600 hover:underline"
                                        >
                                            {brand.instagram}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* Website */}
                            {brand.website && (
                                <div className="flex items-start gap-3">
                                    <Globe className="mt-1 h-5 w-5 flex-shrink-0 text-blue-600" />
                                    <div>
                                        <label className="mb-1 block text-sm font-medium text-gray-700">
                                            Website
                                        </label>
                                        <a
                                            href={
                                                brand.website.startsWith('http')
                                                    ? brand.website
                                                    : `https://${brand.website}`
                                            }
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium break-all text-blue-600 hover:underline"
                                        >
                                            {brand.website}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {!brand.whatsapp_number &&
                                !brand.instagram &&
                                !brand.website && (
                                    <div className="col-span-full">
                                        <p className="text-sm text-gray-500">
                                            No contact information available
                                        </p>
                                    </div>
                                )}
                        </div>
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-sm">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-gray-600">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <span className="font-medium">Created:</span>{' '}
                                {new Date(brand.created_at).toLocaleString()}
                            </div>
                            <div>
                                <span className="font-medium">Updated:</span>{' '}
                                {new Date(brand.updated_at).toLocaleString()}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
