import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { Link, Head, usePage } from '@inertiajs/react';
import { BreadcrumbItem, BrandPackage, SharedData } from '@/types';
import { Edit2Icon, Trash2Icon, Star, Package } from 'lucide-react';
import hasAnyPermission from '@/lib/utils';
import DeleteButton from '@/components/delete-button';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface Props {
    brandPackage: BrandPackage;
    coverImageUrl?: string | null;
}

export default function BrandPackageShowPage({ brandPackage, coverImageUrl }: Props) {
    const user = usePage<SharedData>().props.auth.user;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Brand Packages',
            href: '/brand-packages',
        },
        {
            title: brandPackage.name,
            href: `/brand-packages/${brandPackage.id}`,
        },
    ];

    const formatPrice = (price: string | number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(Number(price));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Package - ${brandPackage.name}`} />

            <div className="p-4 space-y-6">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <Package className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold">{brandPackage.name}</h1>
                            {brandPackage.is_featured && (
                                <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                    <Star className="w-3 h-3 mr-1 fill-current" />
                                    Featured
                                </Badge>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm ml-11">
                            Package ID: <span className="font-mono text-gray-700">{brandPackage.id}</span>
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                        {hasAnyPermission(["brands packages edit"]) && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <Link href={`/brand-packages/${brandPackage.id}/edit`}>
                                        <Button
                                            variant="outline"
                                            className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                                        >
                                            <Edit2Icon className="w-4 h-4 mr-2" />
                                            Edit
                                        </Button>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent>Edit Package</TooltipContent>
                            </Tooltip>
                        )}

                        {hasAnyPermission(["brands packages delete"]) && (
                            <Tooltip>
                                <TooltipTrigger>
                                    <DeleteButton id={brandPackage.id} featured="brand-packages" />
                                </TooltipTrigger>
                                <TooltipContent>Delete Package</TooltipContent>
                            </Tooltip>
                        )}

                        <Link href="/brand-packages">
                            <Button variant="outline">Back to List</Button>
                        </Link>
                    </div>
                </div>

                <Separator />

                {/* Cover Image Section */}
                {coverImageUrl && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Package Image</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center bg-gray-50 rounded-md p-8 min-h-[300px]">
                            <img
                                src={coverImageUrl}
                                alt={brandPackage.name}
                                className="max-w-full max-h-[250px] object-cover rounded-lg shadow-sm"
                            />
                        </CardContent>
                    </Card>
                )}

                {/* Price Information Card */}
                <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">💰</span>
                            Price Range
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Price Start */}
                            <div className="bg-white rounded-lg p-4 border border-blue-100">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Starting Price</label>
                                <p className="text-lg font-bold text-blue-600">
                                    {formatPrice(brandPackage.price_start)}
                                </p>
                            </div>

                            {/* Price End */}
                            <div className="bg-white rounded-lg p-4 border border-blue-100">
                                <label className="block text-sm font-medium text-gray-600 mb-2">Maximum Price</label>
                                <p className="text-lg font-bold text-blue-600">
                                    {formatPrice(brandPackage.price_end)}
                                </p>
                            </div>
                        </div>

                        {/* Price Note */}
                        <div className="text-sm text-gray-600 border-t border-blue-100 pt-4">
                            <p className="text-center">
                                Price range: <span className="font-semibold text-gray-800">{formatPrice(brandPackage.price_start)} - {formatPrice(brandPackage.price_end)}</span>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Brand Information */}
                <Card>
                    <CardHeader>
                        <CardTitle>Associated Brand</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <p className="font-semibold text-lg text-gray-900">{brandPackage.brand?.name || 'N/A'}</p>
                                <p className="text-sm text-gray-500">
                                    Slug: <span className="font-mono">{brandPackage.brand?.slug || '-'}</span>
                                </p>
                            </div>
                            {hasAnyPermission(["brands show"]) && (
                                <Link href={`/brands/${brandPackage.brand_id}`}>
                                    <Button variant="outline" size="sm">View Brand</Button>
                                </Link>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Description */}
                {brandPackage.description && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Package Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {brandPackage.description}
                            </p>
                        </CardContent>
                    </Card>
                )}

                {/* Package Details Grid */}
                <Card>
                    <CardHeader>
                        <CardTitle>Package Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                <div className="flex items-center gap-2">
                                    {brandPackage.is_featured ? (
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            <Star className="w-3 h-3 mr-1 fill-current" />
                                            Featured Package
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                            Regular Package
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Brand Link */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Brand ID</label>
                                <div className="p-3 bg-gray-50 rounded-md">
                                    <p className="text-sm font-mono">{brandPackage.brand_id}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Metadata */}
                <Card className="bg-gray-50">
                    <CardHeader>
                        <CardTitle className="text-sm">Metadata</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs text-gray-600">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <span className="font-medium text-gray-800">Created:</span>
                                <p className="text-gray-600">{new Date(brandPackage.created_at).toLocaleString('id-ID')}</p>
                            </div>
                            <div className="space-y-1">
                                <span className="font-medium text-gray-800">Last Updated:</span>
                                <p className="text-gray-600">{new Date(brandPackage.updated_at).toLocaleString('id-ID')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Related Actions */}
                <Card className="border-dashed">
                    <CardHeader>
                        <CardTitle className="text-sm">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                        {hasAnyPermission(["brands packages create"]) && (
                            <Link href="/brand-packages/create">
                                <Button variant="outline" size="sm">
                                    + Create New Package
                                </Button>
                            </Link>
                        )}
                        <Link href="/brand-packages">
                            <Button variant="outline" size="sm">
                                View All Packages
                            </Button>
                        </Link>
                        {hasAnyPermission(["brands show"]) && (
                            <Link href={`/brands/${brandPackage.brand_id}`}>
                                <Button variant="outline" size="sm">
                                    View Associated Brand
                                </Button>
                            </Link>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
